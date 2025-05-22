import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Achievement } from '@shared/schema';
import { CheckCircle, Zap } from 'lucide-react';

interface AchievementsSectionProps {
  userId: number;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ userId }) => {
  const { data: achievements, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}/achievements`],
    staleTime: 60000, // 1 minute
  });

  // Helper function to render the appropriate icon
  const renderIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return <CheckCircle className="h-6 w-6 text-primary" />;
      case 'streak':
        return <Zap className="h-6 w-6 text-secondary" />;
      default:
        return <CheckCircle className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Recent Achievements</h3>
          <a href="#" className="text-primary text-sm">View All</a>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        ) : achievements && achievements.length > 0 ? (
          <div className="space-y-4">
            {achievements.map((achievement: Achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-background">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {renderIcon(achievement.type)}
                </div>
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                <div className="ml-auto text-accent font-semibold">
                  +{achievement.points}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No achievements yet. Complete modules and quizzes to earn achievements!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsSection;
