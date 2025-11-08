
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_annually: number;
  currency: string;
  currency_symbol: string;
  features: string[];
  is_popular: boolean;
  cta_text: string;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  start_date: string;
  end_date: string | null;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_id: string | null;
  is_active: boolean;
  billing_cycle: 'monthly' | 'annually';
  created_at: string;
  updated_at: string;
  plan?: PricingPlan;
}

interface PricingContextType {
  plans: PricingPlan[];
  userSubscription: UserSubscription | null;
  isLoading: boolean;
  fetchPlans: () => Promise<void>;
  fetchUserSubscription: () => Promise<void>;
  updatePlan: (id: string, plan: Partial<PricingPlan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  createPlan: (plan: Omit<PricingPlan, "id" | "created_at" | "updated_at">) => Promise<void>;
  createSubscription: (planId: string, billingCycle: 'monthly' | 'annually', paymentId?: string) => Promise<UserSubscription | null>;
  updateSubscription: (subscriptionId: string, data: Partial<UserSubscription>) => Promise<void>;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchPlans();
    if (user) {
      fetchUserSubscription();
    } else {
      setUserSubscription(null);
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('price_monthly', { ascending: true });

      if (error) {
        console.error('Error fetching pricing plans:', error);
        toast({
          title: 'Error fetching pricing plans',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setPlans(data as PricingPlan[]);
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          plan:pricing_plans(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) {
        console.error('Error fetching user subscription:', error);
      } else {
        setUserSubscription(data as UserSubscription | null);
      }
    } catch (error: any) {
      console.error('Unexpected error fetching subscription:', error);
    }
  };

  const updatePlan = async (id: string, plan: Partial<PricingPlan>) => {
    if (!isAdmin) {
      toast({
        title: 'Permission denied',
        description: 'Only administrators can update pricing plans',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('pricing_plans')
        .update({
          ...plan,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating pricing plan:', error);
        toast({
          title: 'Error updating pricing plan',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Plan updated',
        description: 'The pricing plan has been updated successfully.',
      });
      
      fetchPlans();
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while updating the pricing plan',
        variant: 'destructive',
      });
    }
  };

  const deletePlan = async (id: string) => {
    if (!isAdmin) {
      toast({
        title: 'Permission denied',
        description: 'Only administrators can delete pricing plans',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('pricing_plans')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting pricing plan:', error);
        toast({
          title: 'Error deleting pricing plan',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Plan deleted',
        description: 'The pricing plan has been deleted successfully.',
      });
      
      setPlans(plans.filter(plan => plan.id !== id));
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while deleting the pricing plan',
        variant: 'destructive',
      });
    }
  };

  const createPlan = async (plan: Omit<PricingPlan, "id" | "created_at" | "updated_at">) => {
    if (!isAdmin) {
      toast({
        title: 'Permission denied',
        description: 'Only administrators can create pricing plans',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .insert([plan])
        .select()
        .single();

      if (error) {
        console.error('Error creating pricing plan:', error);
        toast({
          title: 'Error creating pricing plan',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Plan created',
        description: 'The pricing plan has been created successfully.',
      });
      
      fetchPlans();
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while creating the pricing plan',
        variant: 'destructive',
      });
    }
  };

  const createSubscription = async (
    planId: string, 
    billingCycle: 'monthly' | 'annually',
    paymentId?: string
  ): Promise<UserSubscription | null> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to subscribe to a plan',
        variant: 'destructive',
      });
      return null;
    }

    // Check if user already has an active subscription
    if (userSubscription && userSubscription.is_active) {
      toast({
        title: 'Subscription exists',
        description: 'You already have an active subscription. Please manage it from your profile.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert([
          {
            user_id: user.id,
            plan_id: planId,
            billing_cycle: billingCycle,
            payment_status: paymentId ? 'completed' : 'pending',
            payment_id: paymentId || null,
            is_active: !!paymentId,
            start_date: new Date().toISOString(),
            end_date: billingCycle === 'monthly' 
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
              : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating subscription:', error);
        toast({
          title: 'Error creating subscription',
          description: error.message,
          variant: 'destructive',
        });
        return null;
      }

      toast({
        title: 'Subscription created',
        description: paymentId ? 'Your subscription is now active.' : 'Your subscription has been created.',
      });
      
      await fetchUserSubscription();
      return data as UserSubscription;
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while creating the subscription',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateSubscription = async (subscriptionId: string, data: Partial<UserSubscription>) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to update a subscription',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriptionId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating subscription:', error);
        toast({
          title: 'Error updating subscription',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Subscription updated',
        description: 'Your subscription has been updated successfully.',
      });
      
      fetchUserSubscription();
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while updating your subscription',
        variant: 'destructive',
      });
    }
  };

  return (
    <PricingContext.Provider
      value={{
        plans,
        userSubscription,
        isLoading,
        fetchPlans,
        fetchUserSubscription,
        updatePlan,
        deletePlan,
        createPlan,
        createSubscription,
        updateSubscription
      }}
    >
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error("usePricing must be used within a PricingProvider");
  }
  return context;
}
