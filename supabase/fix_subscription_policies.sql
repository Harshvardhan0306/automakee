-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Only admins can delete subscriptions" ON public.user_subscriptions;

-- Create new policies using the is_admin function
CREATE POLICY "Users can view their own subscriptions"
  ON public.user_subscriptions
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Users can update their own subscriptions"
  ON public.user_subscriptions
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Only admins can delete subscriptions"
  ON public.user_subscriptions
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Update pricing plan policies to use the is_admin function
DROP POLICY IF EXISTS "Only admins can insert pricing plans" ON public.pricing_plans;
DROP POLICY IF EXISTS "Only admins can update pricing plans" ON public.pricing_plans;
DROP POLICY IF EXISTS "Only admins can delete pricing plans" ON public.pricing_plans;

CREATE POLICY "Only admins can insert pricing plans"
  ON public.pricing_plans
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update pricing plans"
  ON public.pricing_plans
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete pricing plans"
  ON public.pricing_plans
  FOR DELETE
  USING (public.is_admin(auth.uid()));