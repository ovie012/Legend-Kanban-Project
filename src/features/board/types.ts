export type Role = 'admin' | 'editor' | 'viewer';
export type Priority = 'low' | 'medium' | 'high';

export interface CardData {
  id: string;
  title: string;
  description: string;
  columnId: string;
  order: number;
  version: number;
  assigneeId?: string;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface ColumnData {
  id: string;
  title: string;
  order: number;
}

export interface UserPresence {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}
