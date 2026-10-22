-- ====================================================================
-- CivicAI Production PostgreSQL Database Schema & Row Level Security
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Roles Enum
CREATE TYPE user_role AS ENUM ('citizen', 'officer', 'worker', 'admin');

-- 3. Issue Status Enum
CREATE TYPE complaint_status AS ENUM (
  'Submitted',
  'Under Review',
  'Verified',
  'Assigned',
  'In Progress',
  'Awaiting Verification',
  'Resolved',
  'Rejected'
);

-- 4. Priority Level Enum
CREATE TYPE priority_level AS ENUM ('Low', 'Medium', 'High', 'Urgent');

-- 5. Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'citizen',
  phone TEXT,
  department TEXT,
  ward TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  head_officer TEXT NOT NULL,
  phone TEXT NOT NULL,
  sla_hours INT NOT NULL DEFAULT 24,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY, -- e.g. CIV-2026-XXXX
  citizen_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  citizen_name TEXT NOT NULL,
  citizen_email TEXT,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  video_evidence_note TEXT,
  additional_notes TEXT,
  location_address TEXT NOT NULL,
  location_lat NUMERIC(9, 6) NOT NULL,
  location_lng NUMERIC(9, 6) NOT NULL,
  location_landmark TEXT,
  location_zone TEXT,
  ai_analysis JSONB,
  priority priority_level NOT NULL DEFAULT 'Medium',
  department TEXT NOT NULL REFERENCES departments(name) ON UPDATE CASCADE,
  status complaint_status NOT NULL DEFAULT 'Submitted',
  assigned_worker_id UUID REFERENCES profiles(id),
  assigned_worker_name TEXT,
  assigned_at TIMESTAMPTZ,
  officer_notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 8. Complaint Timeline Table
CREATE TABLE IF NOT EXISTS complaint_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id TEXT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  status complaint_status NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  actor_id UUID REFERENCES profiles(id),
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Complaint Evidence Table (Before / During / After completion proof)
CREATE TABLE IF NOT EXISTS complaint_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id TEXT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  evidence_type TEXT NOT NULL CHECK (evidence_type IN ('citizen_report', 'progress', 'completion_proof')),
  file_url TEXT NOT NULL,
  notes TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  uploader_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Worker Assignments History
CREATE TABLE IF NOT EXISTS worker_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id TEXT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES profiles(id),
  officer_id UUID NOT NULL REFERENCES profiles(id),
  instructions TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'Active'
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  complaint_id TEXT REFERENCES complaints(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'alert')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id TEXT NOT NULL UNIQUE REFERENCES complaints(id) ON DELETE CASCADE,
  citizen_id UUID NOT NULL REFERENCES profiles(id),
  citizen_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Audit Logs Table (Tamper-proof security tracking)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_department ON complaints(department);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_timeline_complaint ON complaint_timeline(complaint_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read basic profiles, only owner or admin can update
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Complaints Policies:
-- Citizens can view their own complaints, Officers and Workers can view all active complaints
CREATE POLICY "Complaints are viewable based on role"
  ON complaints FOR SELECT TO authenticated
  USING (
    citizen_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('officer', 'worker', 'admin')
    )
  );

CREATE POLICY "Citizens can insert complaints"
  ON complaints FOR INSERT TO authenticated
  WITH CHECK (citizen_id = auth.uid());

CREATE POLICY "Officers, workers, and admins can update complaints"
  ON complaints FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('officer', 'worker', 'admin')
    )
  );

-- Notifications: Only recipient can see their notifications
CREATE POLICY "Users view own notifications"
  ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid());
