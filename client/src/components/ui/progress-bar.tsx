import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
}

export function ProgressBar({ 
  value, 
  className, 
  barClassName,
  showLabel = true 
}: ProgressBarProps) {
  // Ensure value is between 0 and 100
  const safeValue = Math.min(Math.max(0, value), 100);
  
  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{safeValue}%</span>
        </div>
      )}
      <div className={cn("progress-bar", className)}>
        <div 
          className={cn("progress-value", barClassName)} 
          style={{ width: `${safeValue}%` }}
        ></div>
      </div>
    </div>
  );
}
