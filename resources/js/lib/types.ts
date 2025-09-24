import type { EventData, UserData, CommentData, FamilyData, CategoryData, TagData } from '../../../types/generated';

export type Event = EventData;
export type User = UserData;
export type Comment = CommentData;

// Legacy types for backward compatibility
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
