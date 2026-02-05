-- Create a public view for profiles that excludes sensitive data (phone)
CREATE VIEW public.profiles_public
WITH (security_invoker=on) AS
SELECT 
  id,
  user_id,
  full_name,
  avatar_url,
  is_host,
  green_score,
  created_at
FROM public.profiles;

-- Drop the overly permissive SELECT policy on profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create new policy: users can only SELECT their own profile from base table
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Grant SELECT on the public view to authenticated and anon users
GRANT SELECT ON public.profiles_public TO authenticated;
GRANT SELECT ON public.profiles_public TO anon;