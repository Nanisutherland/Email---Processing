import { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import EmailList from './EmailList';
import EmailPreview from './EmailPreview';
import EmailPopup from './EmailPopup';
import ReplyModal from './ReplyModal';
import { useEmails } from '../hooks/useEmails';
import type { Email } from '../types';
import { LogOut, Settings, Bell, HelpCircle } from 'lucide-react';

interface MainLayoutProps {
  onLogout: () => void;
}

export default function MainLayout({ onLogout }: MainLayoutProps) {
  const {
    emails,
    loading,
    error,
    sendReceive,
    markAsRead,
    toggleFlag,
    addReply,
  } = useEmails();

  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [popupEmail, setPopupEmail] = useState<Email | null>(null);
  const [replyEmail, setReplyEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectEmail = useCallback(
    async (email: Email) => {
      setSelectedEmail(email);
      if (!email.is_read) {
        await markAsRead(email.id);
      }
    },
    [markAsRead]
  );

  const handleOpenPopup = useCallback((email: Email) => {
    setPopupEmail(email);
  }, []);

  const handleClosePopup = useCallback(() => {
    setPopupEmail(null);
  }, []);

  const handleReply = useCallback((email: Email) => {
    setReplyEmail(email);
  }, []);

  const handleCloseReply = useCallback(() => {
    setReplyEmail(null);
  }, []);

  const handleSendReply = useCallback(
    async (emailId: string, body: string, subject: string) => {
      await addReply(emailId, body, subject);
    },
    [addReply]
  );

  const filteredEmails = emails.filter((email) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      email.subject.toLowerCase().includes(q) ||
      email.from_name.toLowerCase().includes(q) ||
      email.from_email.toLowerCase().includes(q) ||
      email.body.toLowerCase().includes(q)
    );
  });

  const unreadCount = emails.filter((e) => !e.is_read).length;

  // Keep selectedEmail in sync with emails state
  const currentSelected = selectedEmail
    ? emails.find((e) => e.id === selectedEmail.id) || selectedEmail
    : null;

  const currentPopup = popupEmail
    ? emails.find((e) => e.id === popupEmail.id) || popupEmail
    : null;

  return (
    <div className="main-layout">
      {/* Top header bar */}
      <div className="app-header">
        <div className="header-left">
          <div className="outlook-logo">
            <svg viewBox="0 0 48 48" width="24" height="24">
              <rect x="2" y="6" width="44" height="36" rx="3" fill="#fff" />
              <path d="M24 14L6 24l18 10 18-10L24 14z" fill="#fff" opacity="0.3" />
            </svg>
          </div>
          <span className="app-title">Outlook</span>
          <span className="app-subtitle">- Email Processing</span>
        </div>
        <div className="header-center">
          <div className="header-tab active">Mail</div>
          <div className="header-tab">Calendar</div>
          <div className="header-tab">Contacts</div>
        </div>
        <div className="header-right">
          <button className="header-icon-btn" title="Notifications">
            <Bell size={18} />
          </button>
          <button className="header-icon-btn" title="Settings">
            <Settings size={18} />
          </button>
          <button className="header-icon-btn" title="Help">
            <HelpCircle size={18} />
          </button>
          <button className="header-icon-btn logout" onClick={onLogout} title="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar
        onSendReceive={sendReceive}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Error banner */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {/* Main content area */}
      <div className="content-area">
        <Sidebar
          activeFolder={activeFolder}
          onFolderChange={setActiveFolder}
          emailCount={unreadCount}
        />
        <EmailList
          emails={filteredEmails}
          selectedId={currentSelected?.id || null}
          onSelect={handleSelectEmail}
          onToggleFlag={toggleFlag}
        />
        <EmailPreview
          email={currentSelected}
          onOpenPopup={handleOpenPopup}
          onReply={handleReply}
        />
      </div>

      {/* Status bar */}
      <div className="status-bar">
        <div className="status-left">
          <span>Items: {emails.length}</span>
          <span className="status-separator">|</span>
          <span>Unread: {unreadCount}</span>
        </div>
        <div className="status-right">
          <span>All folders are up to date.</span>
          <span className="status-separator">|</span>
          <span>Connected to Supabase</span>
        </div>
      </div>

      {/* Popup */}
      {currentPopup && (
        <EmailPopup
          email={currentPopup}
          onClose={handleClosePopup}
          onReply={handleReply}
        />
      )}

      {/* Reply Modal */}
      {replyEmail && (
        <ReplyModal
          email={replyEmail}
          onClose={handleCloseReply}
          onSend={handleSendReply}
        />
      )}
    </div>
  );
}
