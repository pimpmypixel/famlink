export interface TimelineItem {
  id: string
  title: string
  content: string
  date: string
  timestamp: number
  category: string
  tags: string[]
  user: TimelineUser
  author?: string
  attachments?: Attachment[]
  isCollapsed?: boolean
  comments?: { id: string; content: string; user: TimelineUser; created_at?: string }[]
}

export interface User {
  id: string
  name: string
  role: "far" | "mor" | "myndighed" | "andet" | "father" | "mother" | "consultant"
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
