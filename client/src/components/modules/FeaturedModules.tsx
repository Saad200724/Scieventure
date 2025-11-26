import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ModuleCard from './ModuleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';
import { formatModuleWithProgress } from '@/lib/utils/dataUtils';
import { useLanguage } from '@/providers/LanguageProvider';
import { DEMO_MODULES } from '@/lib/demoData';

interface FeaturedModulesProps {
  userId?: number;
  limit?: number;
}

const FeaturedModules: React.FC<FeaturedModulesProps> = ({ userId, limit = 4 }) => {
  const { t } = useLanguage();
  
  // Fetch modules
  const { data: apiModules, isLoading: modulesLoading } = useQuery({
    queryKey: ['/api/modules'],
  });

  // Use demo data as fallback
  const modules = apiModules && apiModules.length > 0 ? apiModules : DEMO_MODULES;

  // Fetch user progress if userId is provided
  const { data: progressItems, isLoading: progressLoading } = useQuery({
    queryKey: userId ? [`/api/users/${userId}/progress`] : [],
    enabled: !!userId,
  });

  const isLoading = modulesLoading || (userId && progressLoading);

  // Prepare modules with progress data
  const modulesWithProgress = React.useMemo(() => {
    if (!modules) return [];

    return modules.slice(0, limit).map((module: any) => {
      if (!userId || !progressItems) {
        return formatModuleWithProgress(module, 0);
      }

      const progressItem = progressItems.find((p: any) => p.moduleId === module.id);
      return formatModuleWithProgress(
        module,
        progressItem ? progressItem.completionPercentage : 0
      );
    });
  }, [modules, progressItems, userId, limit]);

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("Featured Learning Modules", "বৈশিষ্ট্যপূর্ণ শিক্ষা মডিউল")}</h2>
        <Link href="/modules" className="text-primary hover:underline flex items-center">
          <span>{t("Browse all modules", "সব মডিউল ব্রাউজ করুন")}</span>
          <ChevronRight className="h-5 w-5 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(limit).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <Skeleton className="h-48 w-full" />
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          ))
        ) : (
          modulesWithProgress.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedModules;
