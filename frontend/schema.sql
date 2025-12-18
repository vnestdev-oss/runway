-- Runway VNEST Application Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Applications table (main table for storing all form submissions)
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Student Details
    full_name VARCHAR(255) NOT NULL,
    register_number VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    school_department VARCHAR(255) NOT NULL,
    year_of_study VARCHAR(50) NOT NULL,
    
    -- Startup/Idea Abstract
    startup_name VARCHAR(255) NOT NULL,
    problem_statement TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    target_users TEXT NOT NULL,
    innovation TEXT NOT NULL,
    ppt_link TEXT,
    ppt_file_url TEXT,  -- Stored file URL from Supabase Storage
    
    -- Faculty Mentor Details
    faculty_name VARCHAR(255) NOT NULL,
    faculty_department VARCHAR(255) NOT NULL,
    faculty_email VARCHAR(255) NOT NULL,
    faculty_contact VARCHAR(20) NOT NULL,
    faculty_employee_id VARCHAR(100) NOT NULL,
    
    -- Metadata
    consent BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(50) DEFAULT 'submitted',  -- submitted, under_review, approved, rejected
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT faculty_email_format CHECK (faculty_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Resources table (for storing resource requirements)
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    
    resource_name VARCHAR(255),
    description TEXT,
    cost DECIMAL(10, 2) DEFAULT 0.00,
    link TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT cost_non_negative CHECK (cost >= 0)
);

-- Indexes for better query performance
CREATE INDEX idx_applications_register_number ON applications(register_number);
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at DESC);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_resources_application_id ON resources(application_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on tables
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Policy: Allow insert for authenticated users (you can modify based on your auth setup)
CREATE POLICY "Allow public insert on applications" ON applications
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public insert on resources" ON resources
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow read for authenticated users or service role
CREATE POLICY "Allow read on applications" ON applications
    FOR SELECT
    USING (true);

CREATE POLICY "Allow read on resources" ON resources
    FOR SELECT
    USING (true);

-- Comments for documentation
COMMENT ON TABLE applications IS 'Stores all startup application submissions from students';
COMMENT ON TABLE resources IS 'Stores resource requirements for each application';
COMMENT ON COLUMN applications.status IS 'Application status: submitted, under_review, approved, rejected';
COMMENT ON COLUMN applications.ppt_file_url IS 'URL to the uploaded PPT file in Supabase Storage';
