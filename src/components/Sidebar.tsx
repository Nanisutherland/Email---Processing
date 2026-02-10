import {
  Inbox,
  Send,
  FileText,
  Trash2,
  Star,
  Archive,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  User,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeFolder: string;
  onFolderChange: (folder: string) => void;
  emailCount: number;
}

export default function Sidebar({ activeFolder, onFolderChange, emailCount }: SidebarProps) {
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [foldersOpen, setFoldersOpen] = useState(true);

  const favorites = [
    { key: 'inbox', label: 'Inbox', icon: Inbox, count: emailCount },
    { key: 'sent', label: 'Sent Items', icon: Send, count: 0 },
    { key: 'drafts', label: 'Drafts', icon: FileText, count: 0 },
    { key: 'deleted', label: 'Deleted Items', icon: Trash2, count: 0 },
  ];

  const folders = [
    { key: 'inbox', label: 'Inbox', icon: Inbox, count: emailCount },
    { key: 'drafts', label: 'Drafts', icon: FileText, count: 0 },
    { key: 'sent', label: 'Sent Items', icon: Send, count: 0 },
    { key: 'deleted', label: 'Deleted Items', icon: Trash2, count: 0 },
    { key: 'archive', label: 'Archive', icon: Archive, count: 0 },
    { key: 'junk', label: 'Junk Email', icon: AlertCircle, count: 0 },
    { key: 'starred', label: 'Flagged', icon: Star, count: 0 },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-account">
        <div className="account-avatar">
          <User size={20} />
        </div>
        <div className="account-info">
          <span className="account-name">NareshKumar.S2@sutherlan...</span>
          <span className="account-email">admin@emailprocessing.com</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div
          className="section-header"
          onClick={() => setFavoritesOpen(!favoritesOpen)}
        >
          {favoritesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span>Favorites</span>
        </div>
        {favoritesOpen && (
          <ul className="folder-list">
            {favorites.map((folder) => (
              <li
                key={`fav-${folder.key}`}
                className={`folder-item ${activeFolder === folder.key ? 'active' : ''}`}
                onClick={() => onFolderChange(folder.key)}
              >
                <folder.icon size={16} />
                <span className="folder-name">{folder.label}</span>
                {folder.count > 0 && (
                  <span className="folder-count">{folder.count}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sidebar-section">
        <div
          className="section-header"
          onClick={() => setFoldersOpen(!foldersOpen)}
        >
          {foldersOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span>NareshKumar.S2@sutherlan...</span>
        </div>
        {foldersOpen && (
          <ul className="folder-list">
            {folders.map((folder) => (
              <li
                key={`folder-${folder.key}`}
                className={`folder-item ${activeFolder === folder.key ? 'active' : ''}`}
                onClick={() => onFolderChange(folder.key)}
              >
                <folder.icon size={16} />
                <span className="folder-name">{folder.label}</span>
                {folder.count > 0 && (
                  <span className="folder-count">{folder.count}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
