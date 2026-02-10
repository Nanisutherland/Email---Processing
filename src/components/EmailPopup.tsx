import {
  X,
  Reply,
  ReplyAll,
  Forward,
  FileText,
  Image,
  File,
  Printer,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';
import type { Email, Attachment } from '../types';

interface EmailPopupProps {
  email: Email;
  onClose: () => void;
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
  if (fileType.includes('pdf')) return <FileText size={24} className="file-icon pdf" />;
  if (fileType.includes('image')) return <Image size={24} className="file-icon image" />;
  if (fileType.includes('word') || fileType.includes('document'))
    return <FileText size={24} className="file-icon doc" />;
  return <File size={24} className="file-icon" />;
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

function PopupAttachment({ attachment }: { attachment: Attachment }) {
  const handleClick = () => {
    if (attachment.public_url) {
      window.open(attachment.public_url, '_blank');
    }
  };

  const isPdf = attachment.file_type.includes('pdf');

  return (
    <div className={`popup-attachment ${isPdf ? 'pdf' : ''}`} onClick={handleClick}>
      <div className="popup-attachment-icon">
        {getFileIcon(attachment.file_type)}
      </div>
      <div className="popup-attachment-details">
        <span className="popup-attachment-name">{attachment.file_name}</span>
        <span className="popup-attachment-size">{formatFileSize(attachment.file_size)}</span>
      </div>
      <ChevronDown size={14} className="popup-attachment-chevron" />
    </div>
  );
}

export default function EmailPopup({ email, onClose, onReply }: EmailPopupProps) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-window" onClick={(e) => e.stopPropagation()}>
        {/* Title bar */}
        <div className="popup-titlebar">
          <span className="popup-title">{email.subject} - Message (HTML)</span>
          <div className="popup-titlebar-actions">
            <button className="popup-titlebar-btn" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Menu bar */}
        <div className="popup-menubar">
          <span className="popup-menu-item">File</span>
          <span className="popup-menu-item active">Message</span>
          <span className="popup-menu-item">Help</span>
        </div>

        {/* Toolbar */}
        <div className="popup-toolbar">
          <button className="popup-toolbar-btn" onClick={() => onReply(email)}>
            <Reply size={16} />
            <span>Reply</span>
          </button>
          <button className="popup-toolbar-btn">
            <ReplyAll size={16} />
            <span>Reply All</span>
          </button>
          <button className="popup-toolbar-btn">
            <Forward size={16} />
            <span>Forward</span>
          </button>
          <div className="popup-toolbar-divider" />
          <button className="popup-toolbar-btn">
            <Printer size={16} />
          </button>
          <button className="popup-toolbar-btn">
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Email content */}
        <div className="popup-content">
          <h1 className="popup-subject">{email.subject}</h1>

          <div className="popup-sender-section">
            <div className="popup-avatar">
              {getInitials(email.from_name)}
            </div>
            <div className="popup-sender-info">
              <div className="popup-sender-row">
                <span className="popup-sender-name">{email.from_name}</span>
                <span className="popup-sender-email">&lt;{email.from_email}&gt;</span>
              </div>
              <div className="popup-to-row">
                <span className="popup-label">To</span>
                <span className="popup-value">{email.to_name || email.to_email}</span>
              </div>
            </div>
            <div className="popup-datetime">
              {formatDateTime(email.received_at)}
            </div>
          </div>

          {/* Info bar */}
          <div className="popup-info-bar">
            <span>If there are problems with how this message is displayed, click here to view it in a web browser.</span>
          </div>

          {/* Attachments */}
          {email.has_attachments && email.attachments && email.attachments.length > 0 && (
            <div className="popup-attachments">
              {email.attachments.map((att) => (
                <PopupAttachment key={att.id} attachment={att} />
              ))}
            </div>
          )}

          {/* Body */}
          <div className="popup-body">
            {email.body.split('\n').map((line, i) => {
              // Bold key phrases
              const boldPatterns = [
                'Broker of Record (BOR) change request',
                'Broker of Record Letter',
                'XYZ Insurance Brokerage LLC',
                'Cancellation Request Form',
                'Collector Vehicle Insurance Application Form',
              ];
              let processed = line;
              let hasBold = false;

              for (const pattern of boldPatterns) {
                if (processed.includes(pattern)) {
                  hasBold = true;
                  processed = processed.replace(
                    pattern,
                    `<strong>${pattern}</strong>`
                  );
                }
              }

              if (hasBold) {
                return <p key={i} dangerouslySetInnerHTML={{ __html: processed }} />;
              }
              return <p key={i}>{line || '\u00A0'}</p>;
            })}
          </div>

          {/* Replies */}
          {email.replies && email.replies.length > 0 && (
            <div className="popup-replies">
              <div className="popup-replies-divider">
                <span>Responses</span>
              </div>
              {email.replies.map((reply) => (
                <div key={reply.id} className="popup-reply">
                  <div className="popup-reply-header">
                    <strong>From:</strong> {reply.from_name} &lt;{reply.from_email}&gt;
                  </div>
                  <div className="popup-reply-header">
                    <strong>To:</strong> {reply.to_name} &lt;{reply.to_email}&gt;
                  </div>
                  <div className="popup-reply-header">
                    <strong>Subject:</strong> {reply.subject}
                  </div>
                  <div className="popup-reply-header">
                    <strong>Date:</strong> {formatDateTime(reply.sent_at)}
                  </div>
                  <div className="popup-reply-body">
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
    </div>
  );
}
