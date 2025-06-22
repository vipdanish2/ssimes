
-- First, let's ensure we have proper user role constraints
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'admin', 'mentor'));

-- Create a function to automatically assign admin/mentor roles from database
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this email should be an admin or mentor based on predefined list
  -- You can modify this query to check against an admin_emails table if preferred
  DECLARE
    user_role TEXT := 'student'; -- default role
  BEGIN
    -- For now, we'll use email patterns to determine admin/mentor roles
    -- You can modify this logic as needed
    IF NEW.email LIKE '%admin%' OR NEW.email = 'admin@ssiems.edu' THEN
      user_role := 'admin';
    ELSIF NEW.email LIKE '%mentor%' OR NEW.email = 'mentor@ssiems.edu' THEN
      user_role := 'mentor';
    END IF;

    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
      user_role
    );
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a table for predefined admin and mentor emails (optional but recommended)
CREATE TABLE IF NOT EXISTS public.authorized_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'mentor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on authorized_users
ALTER TABLE public.authorized_users ENABLE ROW LEVEL SECURITY;

-- Only admins can manage authorized users
CREATE POLICY "Admins can manage authorized users" 
  ON public.authorized_users FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Update the handle_new_user function to use the authorized_users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT := 'student'; -- default role
  authorized_role TEXT;
BEGIN
  -- Check if this email is in the authorized_users table
  SELECT role INTO authorized_role 
  FROM public.authorized_users 
  WHERE email = NEW.email;
  
  IF authorized_role IS NOT NULL THEN
    user_role := authorized_role;
  END IF;

  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some default admin and mentor emails for testing
INSERT INTO public.authorized_users (email, role) VALUES 
  ('admin@test.com', 'admin'),
  ('mentor@test.com', 'mentor'),
  ('admin@ssiems.edu', 'admin'),
  ('mentor@ssiems.edu', 'mentor')
ON CONFLICT (email) DO NOTHING;
