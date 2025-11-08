-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can read all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON public.reviews;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new policies using the is_admin function
CREATE POLICY "Admin can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can read contacts"
ON public.contacts
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can read all reviews"
ON public.reviews
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update reviews"
ON public.reviews
FOR UPDATE
USING (public.is_admin(auth.uid()));