
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePricing, PricingPlan } from "@/context/PricingContext";
import { useAuth } from "@/context/AuthContext";

// Load Razorpay script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { toast } = useToast();
  const { createSubscription, updateSubscription, fetchUserSubscription } = usePricing();
  const { user, profile } = useAuth();

  useEffect(() => {
    const loadScript = async () => {
      const result = await loadRazorpayScript();
      setIsScriptLoaded(result);
      if (!result) {
        toast({
          title: "Razorpay failed to load",
          description: "Please refresh the page and try again",
          variant: "destructive",
        });
      }
    };

    loadScript();
  }, [toast]);

  const initiatePayment = useCallback(
    async (
      plan: PricingPlan,
      billingCycle: "monthly" | "annually",
      onSuccess?: () => void,
      onError?: (error: any) => void
    ) => {
      if (!isScriptLoaded) {
        toast({
          title: "Payment gateway not loaded",
          description: "Please refresh the page and try again",
          variant: "destructive",
        });
        return;
      }

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please login to subscribe to a plan",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsLoading(true);

        // Create a pending subscription record
        const subscription = await createSubscription(plan.id, billingCycle);
        if (!subscription) {
          throw new Error("Failed to create subscription record");
        }

        // Calculate amount based on billing cycle
        const amount =
          billingCycle === "monthly"
            ? plan.price_monthly * 100 // Convert to paise
            : plan.price_annually * 100; // Annual price in paise

        // Configure Razorpay options
        const options: RazorpayOptions = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use live mode key from environment variable
          amount: amount,
          currency: plan.currency,
          name: "Automake",
          description: `Subscription: ${plan.name} (${billingCycle})`,
          handler: async function (response) {
            try {
              // Verify payment signature for live mode
              const verifyPayment = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature
                })
              });

              const verificationResult = await verifyPayment.json();
              
              if (!verificationResult.success) {
                throw new Error('Payment signature verification failed');
              }

              // Update subscription with verified payment info
              await updateSubscription(subscription.id, {
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                payment_status: 'completed',
                is_active: true,
                signature: response.razorpay_signature
              });
              
              // Refresh subscription data
              await fetchUserSubscription();

              // Payment successful
              toast({
                title: "Payment successful",
                description: `You have successfully subscribed to the ${plan.name}`,
              });

              if (onSuccess) onSuccess();
            } catch (error: any) {
              console.error("Payment verification failed:", error);
              toast({
                title: "Payment verification failed",
                description: error.message || "There was an error verifying your payment",
                variant: "destructive",
              });

              if (onError) onError(error);
            }
          },
          prefill: {
            name: profile?.full_name || user.user_metadata?.full_name || "",
            email: user.email || "",
          },
          theme: {
            color: "#10b981", // Green color
          },
        };

        // Initialize Razorpay
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error: any) {
        console.error("Payment initialization error:", error);
        toast({
          title: "Payment initialization failed",
          description: error.message || "There was an error initializing payment",
          variant: "destructive",
        });

        if (onError) onError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isScriptLoaded, user, profile, createSubscription, updateSubscription, fetchUserSubscription, toast]
  );

  return { initiatePayment, isLoading };
};
