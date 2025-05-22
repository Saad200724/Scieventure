import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Progress } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';

interface ProgressSectionProps {
  userId: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ userId }) => {
  const { data: progressItems, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}/progress`],
    staleTime: 60000, // 1 minute
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Your Progress</h3>
          <a href="#" className="text-primary text-sm">View All</a>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-10"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : progressItems && progressItems.length > 0 ? (
          <div className="space-y-4">
            {progressItems.map((progress: Progress) => (
              <div key={progress.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    {progress.moduleId === 1 && "Biology: Cellular Systems"}
                    {progress.moduleId === 2 && "Chemistry: Elements & Compounds"}
                    {progress.moduleId === 3 && "Physics: Motion & Forces"}
                    {progress.moduleId === 4 && "Mathematics: Algebra Fundamentals"}
                  </p>
                  <span className="text-sm">{progress.completionPercentage}%</span>
                </div>
                <ProgressBar value={progress.completionPercentage} showLabel={false} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No progress data available. Start exploring modules to track your progress!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressSection;
