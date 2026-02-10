import { useState, useCallback } from 'react';
import { supabase, N8N_WEBHOOK_URL } from '../lib/supabase';
import type { Email, EmailReply } from '../types';
import { SEED_EMAILS, REPLY_TEMPLATE } from '../data/seedEmails';

export function useEmails() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const fetchEmails = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('emails')
        .select('*')
        .eq('folder', 'inbox')
        .order('received_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        // Fetch attachments and replies for each email
        const emailsWithDetails = await Promise.all(
          data.map(async (email: Email) => {
            const [attachRes, replyRes] = await Promise.all([
              supabase.from('attachments').select('*').eq('email_id', email.id),
              supabase.from('email_replies').select('*').eq('email_id', email.id).order('sent_at', { ascending: true }),
            ]);
            return {
              ...email,
              attachments: attachRes.data || [],
              replies: replyRes.data || [],
            };
          })
        );
        setEmails(emailsWithDetails);
        return emailsWithDetails;
      }
      return data || [];
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch emails';
      setError(message);
      console.error('Fetch emails error:', err);
      return [];
    }
  }, []);

  const seedAndFetchEmails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if emails already exist
      const { data: existing } = await supabase
        .from('emails')
        .select('id')
        .limit(1);

      if (existing && existing.length > 0) {
        // Emails exist, just fetch them
        await fetchEmails();
        setInitialized(true);
        setLoading(false);
        return;
      }

      // Seed the emails
      const now = new Date();
      for (let i = 0; i < SEED_EMAILS.length; i++) {
        const seedEmail = SEED_EMAILS[i];
        const receivedAt = new Date(now.getTime() - i * 60000); // 1 min apart

        const { data: emailData, error: insertError } = await supabase
          .from('emails')
          .insert({
            from_name: seedEmail.from_name,
            from_email: seedEmail.from_email,
            to_name: seedEmail.to_name,
            to_email: seedEmail.to_email,
            cc: seedEmail.cc,
            subject: seedEmail.subject,
            body: seedEmail.body,
            received_at: receivedAt.toISOString(),
            is_read: seedEmail.is_read,
            is_flagged: seedEmail.is_flagged,
            folder: seedEmail.folder,
            has_attachments: seedEmail.has_attachments,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Upload attachments
        if (emailData && seedEmail.attachments) {
          for (const att of seedEmail.attachments) {
            let publicUrl = null;
            let storagePath = null;

            try {
              // Try to fetch the file from public folder and upload to Supabase Storage
              const response = await fetch(`/${att.local_path}`);
              if (response.ok) {
                const blob = await response.blob();
                storagePath = `${emailData.id}/${att.file_name}`;

                const { error: uploadError } = await supabase.storage
                  .from('email-attachments')
                  .upload(storagePath, blob, {
                    contentType: att.file_type,
                    upsert: true,
                  });

                if (!uploadError) {
                  const { data: urlData } = supabase.storage
                    .from('email-attachments')
                    .getPublicUrl(storagePath);
                  publicUrl = urlData.publicUrl;
                }
              }
            } catch {
              console.warn(`Could not upload ${att.file_name} to storage, using local reference`);
              publicUrl = `/${att.local_path}`;
            }

            await supabase.from('attachments').insert({
              email_id: emailData.id,
              file_name: att.file_name,
              file_type: att.file_type,
              file_size: att.file_size,
              storage_path: storagePath,
              public_url: publicUrl || `/${att.local_path}`,
            });
          }
        }
      }

      await fetchEmails();
      setInitialized(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to seed emails';
      setError(message);
      console.error('Seed emails error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchEmails]);

  const triggerWebhook = useCallback(async (emailsToSend: Email[]) => {
    try {
      const payload = emailsToSend.map((email) => ({
        id: email.id,
        from_name: email.from_name,
        from_email: email.from_email,
        to_email: email.to_email,
        subject: email.subject,
        body: email.body,
        received_at: email.received_at,
        attachments: email.attachments?.map((a) => ({
          file_name: a.file_name,
          file_type: a.file_type,
          file_size: a.file_size,
          public_url: a.public_url,
        })),
      }));

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: payload }),
      });

      if (response.ok) {
        console.log('Webhook triggered successfully');
        return true;
      }
      console.warn('Webhook returned non-OK status:', response.status);
      return false;
    } catch (err) {
      console.warn('Webhook trigger failed (n8n may not be running):', err);
      return false;
    }
  }, []);

  const sendReceive = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!initialized) {
        await seedAndFetchEmails();
      } else {
        await fetchEmails();
      }

      // Trigger webhook with current emails
      if (emails.length > 0) {
        await triggerWebhook(emails);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Send/Receive failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [initialized, emails, seedAndFetchEmails, fetchEmails, triggerWebhook]);

  const markAsRead = useCallback(async (emailId: string) => {
    await supabase.from('emails').update({ is_read: true }).eq('id', emailId);
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, is_read: true } : e))
    );
  }, []);

  const toggleFlag = useCallback(async (emailId: string) => {
    const email = emails.find((e) => e.id === emailId);
    if (!email) return;
    const newFlagged = !email.is_flagged;
    await supabase.from('emails').update({ is_flagged: newFlagged }).eq('id', emailId);
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, is_flagged: newFlagged } : e))
    );
  }, [emails]);

  const addReply = useCallback(async (emailId: string, replyBody: string, subject: string) => {
    const { data, error: replyError } = await supabase
      .from('email_replies')
      .insert({
        email_id: emailId,
        from_name: REPLY_TEMPLATE.from_name,
        from_email: REPLY_TEMPLATE.from_email,
        to_name: REPLY_TEMPLATE.to_name,
        to_email: REPLY_TEMPLATE.to_email,
        subject: `RE: ${subject}`,
        body: replyBody,
      })
      .select()
      .single();

    if (replyError) throw replyError;

    if (data) {
      setEmails((prev) =>
        prev.map((e) =>
          e.id === emailId
            ? { ...e, replies: [...(e.replies || []), data as EmailReply] }
            : e
        )
      );
    }
    return data;
  }, []);

  return {
    emails,
    loading,
    error,
    initialized,
    sendReceive,
    fetchEmails,
    markAsRead,
    toggleFlag,
    addReply,
    seedAndFetchEmails,
    triggerWebhook,
  };
}
