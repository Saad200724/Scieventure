import React from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SUBJECT_TAGS } from '@/lib/constants';
import { Star, Eye } from 'lucide-react';
import { ModuleWithProgress } from '@/lib/types';

interface ModuleCardProps {
  module: ModuleWithProgress;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const {
    id,
    title,
    description,
    subject,
    thumbnail,
    rating,
    studentCount,
    progress = 0
  } = module;

  // Get subject-specific styling
  const subjectStyle = SUBJECT_TAGS[subject as keyof typeof SUBJECT_TAGS] || {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600'
  };

  // Format student count (e.g., 1200 -> 1.2k)
  const formatStudentCount = (count: number) => {
    return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count.toString();
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <img
        src={thumbnail}
        alt={title}
        className="h-48 w-full object-cover"
      />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs ${subjectStyle.bgColor} ${subjectStyle.textColor} px-2 py-1 rounded-full`}>
            {subject}
          </span>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-accent" />
            <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        
        <div className="mt-auto">
          <ProgressBar value={progress} />
        </div>
      </div>
      <div className="p-5 pt-0 flex justify-between border-t border-gray-100 mt-4">
        <span className="text-xs text-gray-500 flex items-center">
          <Eye className="h-4 w-4 mr-1" />
          <span>{formatStudentCount(studentCount)} students</span>
        </span>
        <Link href={`/modules/${id}`}>
          <button className="text-primary hover:text-primary-dark font-medium">
            {progress > 0 ? 'Continue' : 'Start'}
          </button>
        </Link>
      </div>
    </Card>
  );
};

export default ModuleCard;
