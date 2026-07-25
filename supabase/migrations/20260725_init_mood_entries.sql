-- Create table for mood entries
CREATE TABLE mood_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  mood text NOT NULL,
  trigger_text text,
  ai_response text,
  helpful boolean,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Create policy so users can only access their own entries
CREATE POLICY "Users can only access own entries"
  ON mood_entries 
  FOR ALL
  USING (auth.uid() = user_id);
