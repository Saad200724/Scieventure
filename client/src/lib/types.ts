import { type User, type Module, type Progress, type Achievement, type Project, type Resource, type ChatMessage } from '@shared/schema';

export interface UserWithInitials extends Omit<User, 'password'> {
  initials: string;
}

export interface ModuleWithProgress extends Module {
  progress?: number;
}

export interface ProjectParticipant {
  id: number;
  name: string;
  initials: string;
  avatarUrl?: string;
}

export interface ProjectWithParticipants extends Project {
  participants?: ProjectParticipant[];
}

export interface CommunityDiscussion {
  id: number;
  authorId: number;
  authorName: string;
  authorInitials: string;
  timestamp: Date;
  subject: string;
  title: string;
  content: string;
  replyCount: number;
  viewCount: number;
}

export interface CommunityEvent {
  id: number;
  title: string;
  date: Date;
  location: string;
  startTime: string;
  endTime: string;
}

export interface CommunityContributor {
  id: number;
  name: string;
  role: string;
  initials: string;
  points: number;
}

export interface UpcomingActivity {
  id: number;
  title: string;
  type: 'lab' | 'quiz' | 'lecture' | 'project';
  date: Date;
  startTime: string;
  endTime: string;
}

export interface ChatConversation {
  messages: ChatMessage[];
  isLoading: boolean;
}

export interface TagWithColor {
  name: string;
  bgColor: string;
  textColor: string;
}
