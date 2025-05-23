import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProjectCard from '@/components/projects/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { formatProjectWithParticipants } from '@/lib/utils/dataUtils';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/providers/LanguageProvider';

const Projects: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [participationFilter, setParticipationFilter] = useState('all');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  // Mock participant data (in a real app, this would be fetched from the API)
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

  // Format projects with participants data
  const formattedProjects = React.useMemo(() => {
    if (!projects) return [];
    
    return projects.map((project: any, index: number) => {
      // Assign different participants to each project
      const startIndex = (index * 3) % dummyParticipants.length;
      const endIndex = Math.min(startIndex + (3 + index), dummyParticipants.length);
      const projectParticipants = dummyParticipants.slice(startIndex, endIndex);
      
      return formatProjectWithParticipants(project, projectParticipants);
    });
  }, [projects]);

  // Apply filters
  const filteredProjects = React.useMemo(() => {
    if (!formattedProjects) return [];
    
    return formattedProjects.filter((project) => {
      // Search query
      if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !project.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Subject filter
      if (subjectFilter !== 'all' && project.subject !== subjectFilter) {
        return false;
      }
      
      // Difficulty filter
      if (difficultyFilter !== 'all' && project.difficulty !== parseInt(difficultyFilter)) {
        return false;
      }
      
      // Participation filter
      if (participationFilter !== 'all' && project.participationType !== participationFilter) {
        return false;
      }
      
      return true;
    });
  }, [formattedProjects, searchQuery, subjectFilter, difficultyFilter, participationFilter]);

  // Extract unique subject values
  const subjectOptions = React.useMemo(() => {
    if (!formattedProjects) return [];
    
    const subjects = new Set(formattedProjects.map(project => project.subject));
    return Array.from(subjects);
  }, [formattedProjects]);

  // Extract unique participation types
  const participationOptions = React.useMemo(() => {
    if (!formattedProjects) return [];
    
    const types = new Set(formattedProjects.map(project => project.participationType));
    return Array.from(types);
  }, [formattedProjects]);

  return (
    <>
      <Helmet>
        <title>{t("Collaborative Projects | ScienceBridge Bangladesh", "সহযোগিতামূলক প্রকল্প | সাইয়েন্সব্রিজ বাংলাদেশ")}</title>
        <meta name="description" content={t("Participate in collaborative science projects across Bangladesh. Join environmental monitoring, renewable energy, and astronomy projects.", "বাংলাদেশ জুড়ে সহযোগিতামূলক বিজ্ঞান প্রকল্পে অংশগ্রহণ করুন। পরিবেশ পর্যবেক্ষণ, নবায়নযোগ্য শক্তি এবং জ্যোতির্বিদ্যা প্রকল্পে যোগ দিন।")} />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{t("Collaborative Projects", "সহযোগিতামূলক প্রকল্প")}</h1>
          <p className="text-gray-600 mb-6">
            {t(
              "Join ongoing science projects across Bangladesh. Collaborate with other students and researchers to contribute to real scientific research and community initiatives.",
              "বাংলাদেশ জুড়ে চলমান বিজ্ঞান প্রকল্পে যোগ দিন। প্রকৃত বৈজ্ঞানিক গবেষণা এবং কমিউনিটি উদ্যোগে অবদান রাখতে অন্যান্য ছাত্রছাত্রী ও গবেষকদের সাথে সহযোগিতা করুন।"
            )}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="col-span-1 md:col-span-2">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select
              value={subjectFilter}
              onValueChange={setSubjectFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjectOptions.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={participationFilter}
              onValueChange={setParticipationFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Participation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {participationOptions.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
            </div>
            
            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Difficulty level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulty Levels</SelectItem>
                <SelectItem value="1">Beginner (Level 1)</SelectItem>
                <SelectItem value="2">Intermediate (Level 2)</SelectItem>
                <SelectItem value="3">Advanced (Level 3)</SelectItem>
                <SelectItem value="4">Expert (Level 4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
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
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <h3 className="text-xl font-medium mb-2">No Projects Found</h3>
            <p className="text-gray-600 mb-4">
              No projects match your current filters. Try adjusting your search criteria.
            </p>
            <button 
              className="text-primary hover:underline"
              onClick={() => {
                setSearchQuery('');
                setSubjectFilter('all');
                setDifficultyFilter('all');
                setParticipationFilter('all');
              }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;
