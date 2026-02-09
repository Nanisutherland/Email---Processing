import {
  RefreshCw,
  Mail,
  Trash2,
  Archive,
  AlertCircle,
  FolderOpen,
  Tag,
  Search,
  MoreHorizontal,
} from 'lucide-react';

interface ToolbarProps {
  onSendReceive: () => void;
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Toolbar({ onSendReceive, loading, searchQuery, onSearchChange }: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button className="toolbar-btn primary" onClick={onSendReceive} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Send / Receive</span>
        </button>
        <div className="toolbar-divider" />
        <button className="toolbar-btn">
          <Mail size={16} />
          <span>New Email</span>
        </button>
        <div className="toolbar-divider" />
        <button className="toolbar-btn">
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
        <button className="toolbar-btn">
          <Archive size={16} />
          <span>Archive</span>
        </button>
        <button className="toolbar-btn">
          <AlertCircle size={16} />
          <span>Junk</span>
        </button>
        <div className="toolbar-divider" />
        <button className="toolbar-btn">
          <FolderOpen size={16} />
          <span>Move</span>
        </button>
        <button className="toolbar-btn">
          <Tag size={16} />
          <span>Categorize</span>
        </button>
        <button className="toolbar-btn icon-only">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <div className="toolbar-right">
        <div className="search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
