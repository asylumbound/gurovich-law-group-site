-- Migration: Add intake_notes table for internal attorney notes
-- Run this in Supabase SQL Editor

-- Create intake_notes table
CREATE TABLE IF NOT EXISTS intake_notes (
  id SERIAL PRIMARY KEY,
  intake_id INTEGER NOT NULL REFERENCES intakes(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by_id INTEGER,
  created_by_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_intake_notes_intake_id ON intake_notes(intake_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_intake_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS intake_notes_updated_at ON intake_notes;
CREATE TRIGGER intake_notes_updated_at
  BEFORE UPDATE ON intake_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_intake_notes_updated_at();
