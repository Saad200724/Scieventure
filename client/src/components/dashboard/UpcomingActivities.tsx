import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UpcomingActivity } from '@/lib/types';
import { formatDate } from '@/lib/utils/dataUtils';

interface UpcomingActivitiesProps {
  activities?: UpcomingActivity[];
}

const UpcomingActivities: React.FC<UpcomingActivitiesProps> = ({ activities }) => {
  // Demo data if no activities are provided
  const demoActivities: UpcomingActivity[] = [
    {
      id: 1,
      title: "Physics Lab Session",
      type: "lab",
      date: new Date("2023-06-24"),
      startTime: "2:00 PM",
      endTime: "4:00 PM"
    },
    {
      id: 2,
      title: "Biology Quiz",
      type: "quiz",
      date: new Date("2023-06-27"),
      startTime: "10:00 AM",
      endTime: "11:00 AM"
    }
  ];

  const displayActivities = activities || demoActivities;

  // Get background color based on activity type
  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'lab':
        return 'bg-primary';
      case 'quiz':
        return 'bg-accent';
      case 'lecture':
        return 'bg-secondary';
      case 'project':
        return 'bg-purple-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Upcoming Activities</h3>
          <a href="#" className="text-primary text-sm">View Calendar</a>
        </div>
        
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex gap-3 p-3 rounded-lg border border-gray-200">
              <div className={`flex flex-col items-center justify-center ${getActivityBgColor(activity.type)} text-white text-center px-2 py-1 rounded`}>
                <span className="text-sm font-semibold">{formatDate(activity.date).split(' ')[0]}</span>
                <span className="text-xs">{formatDate(activity.date).split(' ')[1]}</span>
              </div>
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.startTime} - {activity.endTime}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingActivities;
