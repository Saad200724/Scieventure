import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeIconProps {
  children: React.ReactNode;
  className?: string;
}

export function BadgeIcon({ children, className }: BadgeIconProps) {
  return (
    <div className={cn("badge-icon", className)}>
      {children}
    </div>
  );
}
