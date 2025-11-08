
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Link, useNavigate } from "react-router-dom";
import { usePricing, PricingPlan } from "@/context/PricingContext";
import { useAuth } from "@/context/AuthContext";
import { useRazorpay } from "@/services/razorpay";
import { useToast } from "@/hooks/use-toast";

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  const { plans, isLoading, userSubscription, fetchUserSubscription } = usePricing();
  const { user } = useAuth();
  const { initiatePayment } = useRazorpay();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Refresh subscription data when component mounts
  useEffect(() => {
    if (user) {
      fetchUserSubscription();
    }
  }, [user]);

  const toggleBilling = () => {
    setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleGetStarted = (plan: PricingPlan) => {
    // Check if user already has an active subscription
    if (userSubscription && userSubscription.is_active) {
      toast({
        title: "You already have an active subscription",
        description: "Please manage your subscription from your profile page",
      });
      navigate('/profile');
      return;
    }

    if (!user) {
      // If user is not logged in, redirect to auth page
      toast({
        title: "Authentication required",
        description: "Please login or register to subscribe to a plan",
      });
      navigate('/auth', { state: { returnUrl: '/pricing' } });
      return;
    }
    
    // If user is logged in, initiate payment
    initiatePayment(
      plan,
      billingCycle,
      () => {
        toast({
          title: "Payment successful",
          description: `You have successfully subscribed to the ${plan.name}`,
        });
        navigate('/profile');
      },
      (error) => {
        toast({
          title: "Payment failed",
          description: error.message || "There was an error processing your payment",
          variant: "destructive",
        });
      }
    );
  };

  if (isLoading) {
    return (
      <section className="py-20 md:py-32" id="pricing">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Loading pricing plans...
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 xl:gap-10">
            {[1, 2, 3].map(i => (
              <Card key={i} className="border border-border/60 animate-pulse">
                <CardHeader className="h-40 bg-muted"></CardHeader>
                <CardContent className="h-60 bg-muted/50 mt-4"></CardContent>
                <CardFooter className="h-20 bg-muted/30 mt-4"></CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32" id="pricing">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 scroll-reveal">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose the perfect plan for your business needs. No hidden fees.
          </p>
          
          {userSubscription && userSubscription.is_active && (
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
              You have an active subscription to the {userSubscription.plan?.name} plan. 
              <Link to="/profile" className="underline ml-1">View details</Link>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center mb-8 scroll-reveal">
          <div className="flex items-center space-x-2">
            <span 
              className={`text-sm transition-colors ${
                billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Monthly
            </span>
            <Switch 
              checked={billingCycle === "annually"} 
              onCheckedChange={toggleBilling} 
              aria-label="Toggle billing cycle"
            />
            <span 
              className={`text-sm transition-colors ${
                billingCycle === "annually" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Annually <span className="text-green-500 font-medium">Save 10%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 xl:gap-10">
          {plans.map((plan, i) => (
            <div key={plan.id} className="flex scroll-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <Card 
                className={`flex flex-col justify-between w-full relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  plan.is_popular 
                    ? "border-primary/50 dark:border-primary/50" 
                    : "border-border/60"
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute top-0 right-0">
                    <div className="text-xs font-medium bg-primary text-primary-foreground py-1 px-3 rounded-bl-lg">
                      Popular
                    </div>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {plan.currency_symbol}
                      {billingCycle === "monthly" 
                        ? formatPrice(plan.price_monthly).replace("₹", "") 
                        : formatPrice(plan.price_annually).replace("₹", "")}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                    {billingCycle === "annually" && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {plan.currency_symbol}{formatPrice(plan.price_annually / 12).replace("₹", "")} per month
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full rounded-lg ${
                      plan.is_popular 
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                        : ""
                    }`}
                    variant={plan.is_popular ? "default" : "outline"}
                    onClick={() => handleGetStarted(plan)}
                    disabled={userSubscription?.is_active && userSubscription?.plan_id === plan.id}
                  >
                    {userSubscription?.is_active && userSubscription?.plan_id === plan.id 
                      ? "Current Plan" 
                      : plan.cta_text}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center max-w-3xl mx-auto bg-secondary/40 dark:bg-secondary/10 rounded-2xl p-8 shadow-sm scroll-reveal">
          <h3 className="text-xl font-semibold mb-4">Need a custom solution?</h3>
          <p className="text-muted-foreground mb-6">
            We offer tailored plans for larger organizations with specific requirements.
            Contact our sales team to discuss your needs.
          </p>
          <Button asChild variant="outline" className="rounded-lg">
            <Link to="/contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
