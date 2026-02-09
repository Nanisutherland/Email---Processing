-- ============================================
-- Email Processing - Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- EMAILS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS emails (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_name TEXT NOT NULL,
  from_email TEXT NOT NULL,
  to_name TEXT,
  to_email TEXT,
  cc TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  folder TEXT DEFAULT 'inbox',
  has_attachments BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ATTACHMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS attachments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  storage_path TEXT,
  public_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EMAIL REPLIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_replies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
  from_name TEXT NOT NULL,
  from_email TEXT NOT NULL,
  to_name TEXT,
  to_email TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_emails_folder ON emails(folder);
CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_attachments_email_id ON attachments(email_id);
CREATE INDEX IF NOT EXISTS idx_email_replies_email_id ON email_replies(email_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_replies ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated and anon users (demo app)
CREATE POLICY "Allow all on emails" ON emails FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on attachments" ON attachments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on email_replies" ON email_replies FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('email-attachments', 'email-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to the storage bucket
CREATE POLICY "Allow public read on email-attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'email-attachments');

CREATE POLICY "Allow public insert on email-attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'email-attachments');

CREATE POLICY "Allow public update on email-attachments"
ON storage.objects FOR UPDATE
USING (bucket_id = 'email-attachments');

CREATE POLICY "Allow public delete on email-attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'email-attachments');
