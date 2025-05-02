CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a row-level security policy
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to access their own notes
CREATE POLICY "Users can manage their own notes" 
ON notes 
FOR ALL 
USING (auth.uid() = user_id);

-- Policy to allow public read access to public notes
CREATE POLICY "Public notes are viewable by everyone"
ON notes
FOR SELECT
USING (is_public = TRUE);