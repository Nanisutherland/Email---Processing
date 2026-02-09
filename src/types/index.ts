export interface Email {
  id: string;
  from_name: string;
  from_email: string;
  to_name: string | null;
  to_email: string | null;
  cc: string | null;
  subject: string;
  body: string;
  received_at: string;
  is_read: boolean;
  is_flagged: boolean;
  folder: string;
  has_attachments: boolean;
  created_at: string;
  attachments?: Attachment[];
  replies?: EmailReply[];
}

export interface Attachment {
  id: string;
  email_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string | null;
  public_url: string | null;
  created_at: string;
}

export interface EmailReply {
  id: string;
  email_id: string;
  from_name: string;
  from_email: string;
  to_name: string | null;
  to_email: string | null;
  subject: string;
  body: string;
  sent_at: string;
  created_at: string;
}

export interface FolderItem {
  name: string;
  icon: string;
  count?: number;
  key: string;
}
