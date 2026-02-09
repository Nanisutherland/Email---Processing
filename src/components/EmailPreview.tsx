import {
  Reply,
  ReplyAll,
  Forward,
  MoreHorizontal,
  Paperclip,
  FileText,
  Image,
  File,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import type { Email, Attachment } from '../types';

interface EmailPreviewProps {
  email: Email | null;
  onOpenPopup: (email: Email) => void;
  onReply: (email: Email) => void;
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }) + ' ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getFileIcon(fileType: string) {
  if (fileType.includes('pdf')) return <FileText size={20} className="file-icon pdf" />;
  if (fileType.includes('image')) return <Image size={20} className="file-icon image" />;
  if (fileType.includes('word') || fileType.includes('document'))
    return <FileText size={20} className="file-icon doc" />;
  return <File size={20} className="file-icon" />;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function AttachmentCard({ attachment }: { attachment: Attachment }) {
  const handleClick = () => {
    if (attachment.public_url) {
      window.open(attachment.public_url, '_blank');
    }
  };

  return (
    <div className="attachment-card" onClick={handleClick}>
      <div className="attachment-icon">{getFileIcon(attachment.file_type)}</div>
      <div className="attachment-info">
        <span className="attachment-name">{attachment.file_name}</span>
        <span className="attachment-size">{formatFileSize(attachment.file_size)}</span>
      </div>
      <ExternalLink size={14} className="attachment-download" />
    </div>
  );
}

export default function EmailPreview({ email, onOpenPopup, onReply }: EmailPreviewProps) {
  if (!email) {
    return (
      <div className="email-preview empty">
        <div className="empty-state">
          <svg viewBox="0 0 120 100" width="120" height="100" className="empty-icon">
            <rect x="10" y="20" width="100" height="70" rx="5" fill="none" stroke="#ccc" strokeWidth="2" />
            <path d="M10 25l50 35 50-35" fill="none" stroke="#ccc" strokeWidth="2" />
          </svg>
          <p>Select an email to read</p>
        </div>
      </div>
    );
  }

  return (
    <div className="email-preview">
      <div className="preview-header">
        <div className="preview-actions">
          <button className="preview-action-btn" onClick={() => onReply(email)}>
            <Reply size={16} />
            <span>Reply</span>
          </button>
          <button className="preview-action-btn">
            <ReplyAll size={16} />
            <span>Reply All</span>
          </button>
          <button className="preview-action-btn">
            <Forward size={16} />
            <span>Forward</span>
          </button>
          <button className="preview-action-btn icon-only">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="preview-content" onClick={() => onOpenPopup(email)}>
        <h2 className="preview-subject">{email.subject}</h2>

        <div className="preview-sender-info">
          <div className="preview-avatar">
            {getInitials(email.from_name)}
          </div>
          <div className="preview-sender-details">
            <div className="preview-sender-row">
              <span className="preview-sender-name">{email.from_name}</span>
              <span className="preview-sender-email">&lt;{email.from_email}&gt;</span>
            </div>
            <div className="preview-to-row">
              <span className="preview-to-label">To</span>
              <span className="preview-to-value">{email.to_name || email.to_email}</span>
            </div>
          </div>
          <div className="preview-date">
            <Calendar size={14} />
            <span>{formatDateTime(email.received_at)}</span>
          </div>
        </div>

        {email.has_attachments && email.attachments && email.attachments.length > 0 && (
          <div className="preview-attachments">
            <div className="attachments-header">
              <Paperclip size={14} />
              <span>{email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}</span>
            </div>
            <div className="attachments-grid">
              {email.attachments.map((att) => (
                <AttachmentCard key={att.id} attachment={att} />
              ))}
            </div>
          </div>
        )}

        <div className="preview-body">
          {email.body.split('\n').map((line, i) => (
            <p key={i}>{line || '\u00A0'}</p>
          ))}
        </div>

        {email.replies && email.replies.length > 0 && (
          <div className="preview-replies">
            <div className="replies-divider">
              <span>Replies</span>
            </div>
            {email.replies.map((reply) => (
              <div key={reply.id} className="reply-item">
                <div className="reply-header">
                  <span className="reply-from">{reply.from_name} &lt;{reply.from_email}&gt;</span>
                  <span className="reply-date">{formatDateTime(reply.sent_at)}</span>
                </div>
                <div className="reply-subject">RE: {email.subject}</div>
                <div className="reply-body">
                  {reply.body.split('\n').map((line, i) => (
                    <p key={i}>{line || '\u00A0'}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
