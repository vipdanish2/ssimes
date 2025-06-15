
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Students can create teams" ON public.teams;
DROP POLICY IF EXISTS "Team creators and mentors can update teams" ON public.teams;
DROP POLICY IF EXISTS "Everyone can view teams" ON public.teams;
DROP POLICY IF EXISTS "Everyone can view team members" ON public.team_members;
DROP POLICY IF EXISTS "Students can join teams" ON public.team_members;
DROP POLICY IF EXISTS "Team members can leave teams" ON public.team_members;
DROP POLICY IF EXISTS "Everyone can view submissions" ON public.submissions;
DROP POLICY IF EXISTS "Team members can create submissions" ON public.submissions;
DROP POLICY IF EXISTS "Submission creators can update submissions" ON public.submissions;
DROP POLICY IF EXISTS "Everyone can view timeline events" ON public.timeline_events;
DROP POLICY IF EXISTS "Admins can manage timeline events" ON public.timeline_events;

-- Create user profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'mentor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Enable RLS on teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Create policies for teams
CREATE POLICY "Everyone can view teams" 
  ON public.teams FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Students can create teams" 
  ON public.teams FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'student'
    )
  );

CREATE POLICY "Team creators and mentors can update teams" 
  ON public.teams FOR UPDATE 
  TO authenticated
  USING (
    creator_id = auth.uid() OR 
    mentor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enable RLS on team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for team_members
CREATE POLICY "Everyone can view team members" 
  ON public.team_members FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Students can join teams" 
  ON public.team_members FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Team members can leave teams" 
  ON public.team_members FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable RLS on submissions
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for submissions
CREATE POLICY "Everyone can view submissions" 
  ON public.submissions FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Team members can create submissions" 
  ON public.submissions FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_id = submissions.team_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Submission creators can update submissions" 
  ON public.submissions FOR UPDATE 
  TO authenticated
  USING (auth.uid() = submitted_by);

-- Enable RLS on timeline_events
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- Create policies for timeline_events
CREATE POLICY "Everyone can view timeline events" 
  ON public.timeline_events FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage timeline events" 
  ON public.timeline_events FOR ALL 
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

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
