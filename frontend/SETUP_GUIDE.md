# Supabase Integration Setup Guide

## 📋 Prerequisites

- Node.js and npm installed
- A Supabase account (free tier available at https://supabase.com)
- Gmail account (or other SMTP email service)

## 🚀 Step-by-Step Setup

### 1. Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - Project name: `runway-vnest` (or your preferred name)
   - Database password: (save this securely)
   - Region: Choose closest to your location
4. Wait for the project to be provisioned (~2 minutes)

### 2. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `schema.sql` and paste it into the editor
4. Click "Run" to execute the schema
5. Verify tables are created by going to **Table Editor**

### 3. Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Enter bucket name: `application-files`
4. Set as **Public bucket** (so uploaded files can be accessed)
5. Click "Create bucket"

### 4. Get Supabase Credentials

1. In Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - keep this secret!)

### 5. Configure Email (Gmail)

#### For Gmail:

1. Enable 2-Step Verification on your Google Account:

   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. Create an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other" (enter "Runway VNEST")
   - Click "Generate"
   - Copy the 16-character password (you won't see it again!)

#### For Other SMTP Services:

- **Outlook/Hotmail**: Use `smtp.office365.com:587`
- **Yahoo**: Use `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Get details from your email provider

### 6. Create Environment File

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your credentials:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   EMAIL_FROM=your_email@gmail.com
   EMAIL_TO=recipient@example.com  # Where applications will be sent

   # Storage Configuration
   SUPABASE_STORAGE_BUCKET=application-files
   ```

### 7. Test the Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Submit a test application through your form

3. Verify:
   - Check Supabase **Table Editor** > `applications` table for the new entry
   - Check Supabase **Storage** > `application-files` for uploaded file
   - Check your email inbox for the notification

## 🔍 Troubleshooting

### Database Errors

- **"relation does not exist"**: Run the schema.sql file again
- **"permission denied"**: Check RLS policies in Supabase dashboard

### Storage Errors

- **"Bucket not found"**: Create the bucket in Supabase Storage
- **"Upload failed"**: Make sure bucket is public or update policies

### Email Errors

- **"Invalid login"**: Double-check App Password (not your regular password)
- **"Connection timeout"**: Check firewall/antivirus blocking port 587
- **"Authentication failed"**: Make sure 2-Step Verification is enabled

### Environment Variable Errors

- **"Missing Supabase environment variables"**: Check `.env.local` file exists
- Restart dev server after changing `.env.local`

## 📊 Database Structure

### Tables Created:

#### `applications` table

Stores main application data with student details, startup information, and faculty mentor details.

#### `resources` table

Stores resource requirements linked to each application via `application_id`.

### Key Features:

- ✅ UUID primary keys
- ✅ Foreign key relationships with CASCADE delete
- ✅ Automatic timestamps
- ✅ Row Level Security (RLS) enabled
- ✅ Email validation constraints
- ✅ Indexed for performance

## 🔐 Security Notes

1. **Never commit `.env.local`** - it's in `.gitignore`
2. **Service Role Key** is powerful - only use server-side
3. **RLS Policies** are set to public for submissions - adjust for production
4. **Email credentials** should use App Passwords, not main passwords

## 📧 Email Template

The email notification includes:

- Student details
- Startup/idea information
- Faculty mentor details
- Resource requirements in a table
- Submission timestamp

## 🎯 Next Steps

1. Customize email template in `lib/email.ts`
2. Add status updates (approved/rejected) functionality
3. Create admin dashboard to view applications
4. Add email confirmation to applicants
5. Implement file size limits and validation
6. Add rate limiting for submissions

## 📝 Additional Configuration

### Storage Bucket Policies (Optional)

If you need more control over who can upload:

```sql
-- Allow authenticated uploads only
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'application-files');

-- Allow public reads
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'application-files');
```

## 🆘 Support

If you encounter issues:

1. Check Supabase logs: Dashboard > Logs
2. Check browser console for errors
3. Check server terminal for API errors
4. Verify environment variables are loaded correctly

---

✅ Setup Complete! Your application now stores data in Supabase and sends email notifications.
