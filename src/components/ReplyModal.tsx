import { useState } from 'react';
import { X, Send, Paperclip } from 'lucide-react';
import type { Email } from '../types';

interface ReplyModalProps {
  email: Email;
  onClose: () => void;
  onSend: (emailId: string, body: string, subject: string) => Promise<void>;
}

export default function ReplyModal({ email, onClose, onSend }: ReplyModalProps) {
  const defaultBody = `Dear ${email.from_name},

Thank you for your email regarding "${email.subject}".

We have received your request and the attached documentation. Our team is currently reviewing the details and will process your request accordingly.

We will provide you with a detailed response including the extracted information and next steps within the next business day.

Should you have any questions in the meantime, please do not hesitate to reach out.

Best Regards,
Wonderland Team
Email Processing Division
Emailprocessing@wonderlandglobal.com`;

  const [body, setBody] = useState(defaultBody);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      await onSend(email.id, body, email.subject);
      onClose();
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="reply-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reply-modal-header">
          <h3>RE: {email.subject}</h3>
          <button className="reply-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="reply-modal-fields">
          <div className="reply-field">
            <label>From:</label>
            <span>Emailprocessing@wonderlandglobal.com</span>
          </div>
          <div className="reply-field">
            <label>To:</label>
            <span>{email.from_name} &lt;{email.from_email}&gt;</span>
          </div>
          <div className="reply-field">
            <label>Subject:</label>
            <span>RE: {email.subject}</span>
          </div>
        </div>

        <div className="reply-modal-body">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your reply..."
          />
        </div>

        <div className="reply-modal-footer">
          <button className="reply-send-btn" onClick={handleSend} disabled={sending}>
            <Send size={16} />
            <span>{sending ? 'Sending...' : 'Send Reply'}</span>
          </button>
          <button className="reply-attach-btn">
            <Paperclip size={16} />
            <span>Attach</span>
          </button>
          <button className="reply-cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
