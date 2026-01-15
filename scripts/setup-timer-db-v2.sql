-- Drop existing table if it exists (this will reset any stored data)
DROP TABLE IF EXISTS timer_session;

-- Create timer_session table with TEXT id column
CREATE TABLE timer_session (
  id TEXT PRIMARY KEY,
  end_time BIGINT NOT NULL,
  is_paused BOOLEAN DEFAULT false,
  paused_remaining BIGINT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_timer_session_updated_at ON timer_session(updated_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE timer_session ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access (no auth required)
CREATE POLICY "Allow all access to timer_session" ON timer_session
  FOR ALL USING (true);
