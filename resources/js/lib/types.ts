export interface TimelineItem {
  id: string
  title: string
  content: string
  date: string
  timestamp: number
  category: string | { id: number; name: string }
  tags: string[] | { id: number; name: string }[]
  user: TimelineUser
  family?: { id: string; name: string; child_name?: string }
  author?: string
  attachments?: Attachment[]
  isCollapsed?: boolean
  comments?: { id: string; content: string; user: TimelineUser; created_at?: string; replies?: { id: string; content: string; user: TimelineUser; created_at?: string; parent_comment_id?: string }[]; parent_comment_id?: string }[]
}

export interface User {
  id: string
  name: string
  role: "far" | "mor" | "myndighed" | "andet" | "father" | "mother" | "consultant" | "admin" | "super-admin" | string
}

export interface TimelineUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Attachment {
  id: string
  original_name: string
  filename: string
  path: string
  url: string
  mime_type: string
  size: number
  uploaded_at: string
}
