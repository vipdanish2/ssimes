
-- First, let's fix the infinite recursion issue by dropping and recreating the teams table policies
DROP POLICY IF EXISTS "Users can view teams they are members of" ON teams;
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Users can update their own teams" ON teams;

-- Enable RLS on teams table
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Create simple policies without recursion
CREATE POLICY "Allow authenticated users to view teams"
ON teams FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to create teams"
ON teams FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);

-- Fix team_members policies
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
DROP POLICY IF EXISTS "Users can manage team members" ON team_members;

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view team members"
ON team_members FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow team leaders to manage members"
ON team_members FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM team_members tm 
    WHERE tm.team_id = team_members.team_id 
    AND tm.user_id = auth.uid() 
    AND tm.role = 'leader'
  )
);

-- Create a simple team_member_names table for text-based member management
CREATE TABLE IF NOT EXISTS team_member_names (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  member_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE team_member_names ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view member names"
ON team_member_names FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow team leaders to manage member names"
ON team_member_names FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM team_members tm 
    WHERE tm.team_id = team_member_names.team_id 
    AND tm.user_id = auth.uid() 
    AND tm.role = 'leader'
  )
);

-- Create resources table for admin-managed resources
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text,
  resource_type text NOT NULL DEFAULT 'document',
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users to view active resources"
ON resources FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Allow admins to manage resources"
ON resources FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);
