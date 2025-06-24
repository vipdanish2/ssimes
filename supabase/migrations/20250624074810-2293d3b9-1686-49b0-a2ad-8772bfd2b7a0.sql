
-- Create a simple table to store team information with member names
-- This replaces the non-existent team_names table
CREATE TABLE IF NOT EXISTS team_names (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  team_name text NOT NULL,
  member1_name text NOT NULL,
  member2_name text,
  member3_name text,
  member4_name text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on the new table
ALTER TABLE team_names ENABLE ROW LEVEL SECURITY;

-- Create policies for the team_names table
CREATE POLICY "Users can view their own team names"
ON team_names FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own team names"
ON team_names FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own team names"
ON team_names FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own team names"
ON team_names FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
