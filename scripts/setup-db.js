/**
 * Database Setup Script
 *
 * This script initializes the Supabase database with the required schema
 * and seeds the initial email data with attachments.
 *
 * Prerequisites:
 *   1. Run the SQL from supabase/schema.sql in the Supabase SQL Editor first
 *   2. Then run: node scripts/setup-db.js
 *
 * Or just use the app - it will auto-seed on first Send/Receive click.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load from environment variables or .env file
// Set SUPABASE_URL and SUPABASE_SERVICE_KEY before running
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables:');
  console.error('  SUPABASE_URL (or VITE_SUPABASE_URL)');
  console.error('  SUPABASE_SERVICE_KEY');
  console.error('\nUsage:');
  console.error('  SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_KEY=your_key node scripts/setup-db.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const EMAILS = [
  {
    from_name: 'P Rahimunnisa',
    from_email: 'P.Rahimunnisa@sutherlandglobal.com',
    to_name: 'Underwriting Team',
    to_email: 'underwriting@wonderlandglobal.com',
    subject: 'Broker of Record Appointment – ABC Auto Insurance',
    body: `Dear Underwriting Team,

I hope this email finds you well. Please accept this message as formal notification of a Broker of Record (BOR) change request for the policyholder listed below.

We have attached the completed and signed Broker of Record Letter appointing XYZ Insurance Brokerage LLC as the new broker of record, effective on the date noted in the attachment.

Kindly acknowledge receipt of this request and confirm the effective date of the broker change. Please let us know if any additional documentation is required to process this update.

Thank you for your cooperation.

Sincerely,
Rahimunnisa Pathan
Senior Account Executive
XYZ Insurance Brokerage LLC
Phone: (212) 555-7821
Email: rahimunnisa.pathan@xyzinsurance.com`,
    has_attachments: true,
    attachments: [
      { file_name: 'Broker of Record Letter.pdf', file_type: 'application/pdf', local: 'Broker of Record Letter.pdf' },
    ],
  },
  {
    from_name: 'P Rahimunnisa',
    from_email: 'P.Rahimunnisa@sutherlandglobal.com',
    to_name: 'Policy Services Team',
    to_email: 'policyservices@wonderlandglobal.com',
    subject: 'Request for Cancellation of Auto Insurance Policy – Policy #AUTO-TX-4589231',
    body: `Dear Policy Services Team,

I hope this message finds you well. I am writing to formally request the cancellation of the below-referenced vehicle insurance policy.

Please find the completed and signed Cancellation Request Form (PDF) along with supporting documents (JPG images) attached for your review and processing.

Kindly confirm receipt of this request and advise the effective date of cancellation, along with any applicable refund details, if available. Should you require any additional information or documentation, please let us know.

Thank you for your assistance.

Sincerely,
Rahimunnisa Pathan
Senior Account Executive
XYZ Insurance Brokerage LLC
Phone: (212) 555-7821
Email: rahimunnisa.pathan@xyzinsurance.com`,
    has_attachments: true,
    attachments: [
      { file_name: 'Policyholder Information.pdf', file_type: 'application/pdf', local: 'Policyholder Information.pdf' },
      { file_name: 'Proof of Vehicle Sale.heic', file_type: 'image/heic', local: 'Proof of Vehicle Sale.heic' },
    ],
  },
  {
    from_name: 'P Rahimunnisa',
    from_email: 'P.Rahimunnisa@sutherlandglobal.com',
    to_name: 'Collector Vehicle Insurance Team',
    to_email: 'collectorvehicle@wonderlandglobal.com',
    subject: 'Request for Collector Vehicle Insurance Quote – 1967 Ford Mustang',
    body: `Dear Collector Vehicle Insurance Team,

I hope you are doing well. I am writing to request a collector vehicle insurance quote for my classic vehicle. Please find the completed Collector Vehicle Insurance Application Form attached for your review.

Kindly let me know if any additional information or documentation is required to proceed with the quote.

Thank you for your time and assistance. I look forward to your response.

Sincerely,
Rahimunnisa Pathan
Senior Account Executive
XYZ Insurance Brokerage LLC
Phone: (212) 555-7821
Email: rahimunnisa.pathan@xyzinsurance.com`,
    has_attachments: true,
    attachments: [
      { file_name: 'Collector_Vehicle_Insurance_Application.pdf', file_type: 'application/pdf', local: 'Collector_Vehicle_Insurance_Application.pdf' },
      { file_name: 'Collector Vehicle Insurance Application Form.docx', file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', local: 'Collector Vehicle Insurance Application Form.docx' },
    ],
  },
];

async function setup() {
  console.log('Starting database setup...\n');

  // Check if emails already exist
  const { data: existing } = await supabase.from('emails').select('id').limit(1);
  if (existing && existing.length > 0) {
    console.log('Emails already exist in the database. Skipping seed.');
    console.log('To re-seed, delete all rows from the emails table first.');
    return;
  }

  const now = new Date();

  for (let i = 0; i < EMAILS.length; i++) {
    const email = EMAILS[i];
    const receivedAt = new Date(now.getTime() - i * 60000);

    console.log(`Inserting email: ${email.subject.substring(0, 50)}...`);

    const { data: emailData, error: emailError } = await supabase
      .from('emails')
      .insert({
        from_name: email.from_name,
        from_email: email.from_email,
        to_name: email.to_name,
        to_email: email.to_email,
        subject: email.subject,
        body: email.body,
        received_at: receivedAt.toISOString(),
        is_read: false,
        is_flagged: false,
        folder: 'inbox',
        has_attachments: email.has_attachments,
      })
      .select()
      .single();

    if (emailError) {
      console.error('  Error inserting email:', emailError.message);
      continue;
    }

    console.log(`  Email inserted with ID: ${emailData.id}`);

    // Upload attachments
    for (const att of email.attachments) {
      const filePath = resolve(__dirname, '..', 'docs', att.local);

      try {
        const fileBuffer = readFileSync(filePath);
        const storagePath = `${emailData.id}/${att.file_name}`;

        console.log(`  Uploading attachment: ${att.file_name}`);

        const { error: uploadError } = await supabase.storage
          .from('email-attachments')
          .upload(storagePath, fileBuffer, {
            contentType: att.file_type,
            upsert: true,
          });

        if (uploadError) {
          console.error(`    Upload error: ${uploadError.message}`);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('email-attachments')
          .getPublicUrl(storagePath);

        await supabase.from('attachments').insert({
          email_id: emailData.id,
          file_name: att.file_name,
          file_type: att.file_type,
          file_size: fileBuffer.length,
          storage_path: storagePath,
          public_url: urlData.publicUrl,
        });

        console.log(`    Uploaded successfully: ${urlData.publicUrl}`);
      } catch (err) {
        console.error(`    Error processing ${att.file_name}:`, err.message);
      }
    }
  }

  console.log('\nSetup complete!');
}

setup().catch(console.error);
