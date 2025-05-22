import { type User, type Module, type Achievement, type Project } from '@shared/schema';
import { UserWithInitials, ModuleWithProgress, ProjectWithParticipants } from '../types';
import { SUBJECT_TAGS, DIFFICULTY_LEVELS } from '../constants';

// Get user initials from first and last name
export function getUserInitials(user: Partial<User>): string {
  if (!user.firstName && !user.lastName) {
    return user.username?.substring(0, 2).toUpperCase() || 'U';
  }
  
  const firstInitial = user.firstName?.charAt(0) || '';
  const lastInitial = user.lastName?.charAt(0) || '';
  
  return (firstInitial + lastInitial).toUpperCase();
}

// Format user with additional fields
export function formatUser(user: Omit<User, 'password'>): UserWithInitials {
  return {
    ...user,
    initials: getUserInitials(user),
  };
}

// Format module with progress data
export function formatModuleWithProgress(
  module: Module,
  progressPercentage?: number
): ModuleWithProgress {
  return {
    ...module,
    progress: progressPercentage || 0,
  };
}

// Format project with participant data
export function formatProjectWithParticipants(
  project: Project,
  participants?: { id: number; firstName?: string; lastName?: string; username: string }[]
): ProjectWithParticipants {
  return {
    ...project,
    participants: participants?.map(p => ({
      id: p.id,
      name: [p.firstName, p.lastName].filter(Boolean).join(' ') || p.username,
      initials: getUserInitials(p),
    })) || [],
  };
}

// Format points with K suffix for thousands
export function formatPoints(points: number): string {
  return points >= 1000 ? `${(points / 1000).toFixed(1)}K` : points.toString();
}

// Format date to locale string
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
}

// Get subject tag styling
export function getSubjectTagStyle(subject: string): { bgColor: string; textColor: string } {
  return (
    SUBJECT_TAGS[subject as keyof typeof SUBJECT_TAGS] || {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
    }
  );
}

// Get difficulty level display
export function getDifficultyDisplay(level: number): string {
  const diffLevel = DIFFICULTY_LEVELS.find(d => d.level === level);
  return diffLevel ? diffLevel.label : 'Unknown';
}

// Calculate time remaining for a project
export function getTimeRemaining(endDate?: Date): string {
  if (!endDate) return 'Ongoing';
  
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Completed';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  
  return `${diffDays} days left`;
}

// Format file size
export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Calculate level from points
export function calculateLevel(points: number): number {
  return Math.floor(points / 100) + 1;
}

// Generate placeholder image URL
export function getPlaceholderImage(seed: string, width = 400, height = 300): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}
