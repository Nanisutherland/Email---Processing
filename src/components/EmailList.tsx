import { Paperclip, Star, Flag } from 'lucide-react';
import type { Email } from '../types';

interface EmailListProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (email: Email) => void;
  onToggleFlag: (emailId: string) => void;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    '#0078D4', '#C239B3', '#E74856', '#00CC6A',
    '#F7630C', '#8764B8', '#00B7C3', '#CA5010',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export default function EmailList({ emails, selectedId, onSelect, onToggleFlag }: EmailListProps) {
  if (emails.length === 0) {
    return (
      <div className="email-list">
        <div className="email-list-header">
          <h3>Inbox</h3>
          <div className="email-list-sort">
            <span>By Date</span>
          </div>
        </div>
        <div className="email-list-empty">
          <p>No emails yet</p>
          <p className="subtle">Click <strong>Send / Receive</strong> to load emails</p>
        </div>
      </div>
    );
  }

  return (
    <div className="email-list">
      <div className="email-list-header">
        <h3>Inbox</h3>
        <div className="email-list-sort">
          <span>By Date</span>
        </div>
      </div>
      <div className="email-list-items">
        {emails.map((email) => (
          <div
            key={email.id}
            className={`email-item ${selectedId === email.id ? 'selected' : ''} ${!email.is_read ? 'unread' : ''}`}
            onClick={() => onSelect(email)}
          >
            <div className="email-item-left">
              <div
                className="email-avatar"
                style={{ backgroundColor: getAvatarColor(email.from_name) }}
              >
                {getInitials(email.from_name)}
              </div>
              <div className={`email-unread-dot ${!email.is_read ? 'visible' : ''}`} />
            </div>
            <div className="email-item-content">
              <div className="email-item-row1">
                <span className={`email-sender ${!email.is_read ? 'bold' : ''}`}>
                  {email.from_name}
                </span>
                <span className="email-time">{formatTime(email.received_at)}</span>
              </div>
              <div className="email-item-row2">
                <span className={`email-subject-preview ${!email.is_read ? 'bold' : ''}`}>
                  {truncateText(email.subject, 50)}
                </span>
              </div>
              <div className="email-item-row3">
                <span className="email-body-preview">
                  {truncateText(email.body.replace(/\n/g, ' '), 80)}
                </span>
                <div className="email-item-icons">
                  {email.has_attachments && <Paperclip size={13} className="attachment-icon" />}
                  <button
                    className={`flag-btn ${email.is_flagged ? 'flagged' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFlag(email.id);
                    }}
                  >
                    {email.is_flagged ? <Star size={13} fill="currentColor" /> : <Flag size={13} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
