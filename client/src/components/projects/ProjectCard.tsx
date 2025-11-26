import React from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { ProjectWithParticipants } from '@/lib/types';
import { SUBJECT_TAGS } from '@/lib/constants';
import { getTimeRemaining } from '@/lib/utils/dataUtils';

interface ProjectCardProps {
  project: ProjectWithParticipants;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const {
    id,
    title,
    description,
    subject,
    participationType,
    endDate,
    location,
    difficulty,
    participants = []
  } = project;

  // Get subject-specific styling
  const subjectStyle = SUBJECT_TAGS[subject as keyof typeof SUBJECT_TAGS] || {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600'
  };

  // Get participation type styling
  const participationStyle = participationType === 'Open Participation'
    ? { bgColor: 'bg-blue-100', textColor: 'text-primary' }
    : { bgColor: 'bg-amber-100', textColor: 'text-amber-600' };

  // Button style based on participation type
  const buttonStyle = participationType === 'Open Participation'
    ? 'bg-primary text-white hover:bg-primary-dark'
    : 'bg-gray-200 text-gray-500';

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <span className={`text-xs ${subjectStyle.bgColor} ${subjectStyle.textColor} px-2 py-1 rounded-full`}>
            {subject}
          </span>
          <span className={`text-xs ${participationStyle.bgColor} ${participationStyle.textColor} px-2 py-1 rounded-full`}>
            {participationType}
          </span>
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        
        <div className="flex items-center space-x-1 mb-4">
          {participants.slice(0, 3).map((participant, index) => (
            <div key={index} className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
              {participant.initials}
            </div>
          ))}
          {participants.length > 3 && (
            <div className="h-6 w-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs">
              +{participants.length - 3}
            </div>
          )}
        </div>

        <div className="flex space-x-4 text-sm">
          <span className="flex items-center text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{endDate ? getTimeRemaining(endDate) : 'Ongoing'}</span>
          </span>
          <span className="flex items-center text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{location}</span>
          </span>
        </div>
      </div>
      <div className="bg-background p-4 flex justify-between items-center">
        <div className="flex items-center text-sm">
          <span className="font-medium mr-2">Difficulty:</span>
          <div className="flex">
            {Array(4).fill(0).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full mr-0.5 ${i < difficulty ? 'bg-secondary' : 'bg-gray-300'}`}
              ></div>
            ))}
          </div>
        </div>
        <Link href={`/projects/${id}`}>
          <Button
            className={buttonStyle}
            size="sm"
            disabled={participationType !== 'Open Participation'}
            data-testid={`button-join-project-${id}`}
          >
            {participationType === 'Open Participation' ? 'Join Project' : 'Request Invite'}
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ProjectCard;
