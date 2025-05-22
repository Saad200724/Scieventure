import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ProjectCard from './ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';
import { formatProjectWithParticipants } from '@/lib/utils/dataUtils';

interface CollaborativeProjectsProps {
  limit?: number;
}

const CollaborativeProjects: React.FC<CollaborativeProjectsProps> = ({ limit = 3 }) => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  const formattedProjects = React.useMemo(() => {
    if (!projects) return [];
    
    // In a real implementation, we would fetch actual participants
    // For now, we'll use dummy data
    const dummyParticipants = [
      { id: 1, firstName: 'Rahman', lastName: 'Siddiqui', username: 'rsiddiqui' },
      { id: 2, firstName: 'Maliha', lastName: 'Hasan', username: 'mhasan' },
      { id: 3, firstName: 'Farhan', lastName: 'Ahmed', username: 'fahmed' },
      { id: 4, firstName: 'Kabir', lastName: 'Ahmed', username: 'kahmed' },
      { id: 5, firstName: 'Sabrina', lastName: 'Rahman', username: 'srahman' },
      { id: 6, firstName: 'Leena', lastName: 'Nur', username: 'lnur' },
      { id: 7, firstName: 'Nadia', lastName: 'Jahan', username: 'njahan' },
      { id: 8, firstName: 'Abdul', lastName: 'Basit', username: 'abasit' },
      { id: 9, firstName: 'Rashid', lastName: 'Khan', username: 'rkhan' }
    ];
    
    return projects.slice(0, limit).map((project: any, index: number) => {
      // Assign different participants to each project
      const startIndex = (index * 3) % dummyParticipants.length;
      const endIndex = Math.min(startIndex + (3 + index), dummyParticipants.length);
      const projectParticipants = dummyParticipants.slice(startIndex, endIndex);
      
      return formatProjectWithParticipants(project, projectParticipants);
    });
  }, [projects, limit]);

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Collaborative Projects</h2>
        <Link href="/projects" className="text-primary hover:underline flex items-center">
          <span>View all projects</span>
          <ChevronRight className="h-5 w-5 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(limit).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex items-center space-x-1 mb-4">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="bg-background p-4 flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))
        ) : (
          formattedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </section>
  );
};

export default CollaborativeProjects;
