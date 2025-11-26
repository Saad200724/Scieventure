import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ProjectCard from './ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';
import { formatProjectWithParticipants } from '@/lib/utils/dataUtils';
import { useLanguage } from '@/providers/LanguageProvider';
import { DEMO_PROJECTS } from '@/lib/demoData';

interface CollaborativeProjectsProps {
  limit?: number;
}

const CollaborativeProjects: React.FC<CollaborativeProjectsProps> = ({ limit = 3 }) => {
  const { t } = useLanguage();
  const { data: apiProjects, isLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  // Use demo data as fallback
  const projects = apiProjects && apiProjects.length > 0 ? apiProjects : DEMO_PROJECTS;

  const formattedProjects = React.useMemo(() => {
    if (!projects) return [];
    
    return projects.slice(0, limit).map((project: any) => {
      // If project already has participants array, use it directly
      if (project.participants && Array.isArray(project.participants)) {
        return project;
      }
      
      // Otherwise, use dummy data
      const dummyParticipants = [
        { firstName: 'Rahman', lastName: 'Siddiqui', username: 'rsiddiqui' },
        { firstName: 'Maliha', lastName: 'Hasan', username: 'mhasan' },
        { firstName: 'Farhan', lastName: 'Ahmed', username: 'fahmed' }
      ];
      
      return formatProjectWithParticipants(project, dummyParticipants);
    });
  }, [projects, limit]);

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("Collaborative Projects", "সহযোগিতামূলক প্রকল্প")}</h2>
        <Link href="/projects" className="text-primary hover:underline flex items-center">
          <span>{t("View all projects", "সমস্ত প্রকল্প দেখুন")}</span>
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
