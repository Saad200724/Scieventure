import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ResourceCard from './ResourceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';

interface FeaturedResourcesProps {
  limit?: number;
}

const FeaturedResources: React.FC<FeaturedResourcesProps> = ({ limit = 2 }) => {
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['/api/resources'],
  }) as { data: any[], isLoading: boolean };

  return (
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold">Offline Learning Resources</h2>
        <Link href="/resources" className="text-primary hover:underline flex items-center">
          <span>Browse all resources</span>
          <ChevronRight className="h-5 w-5 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          Array(limit).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden h-full">
              <div className="sm:flex h-full">
                <div className="sm:w-1/3">
                  <Skeleton className="h-48 sm:h-full w-full" />
                </div>
                <div className="p-4 sm:p-5 sm:w-2/3 flex flex-col">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-3 mt-auto">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-36" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : resources && resources.length > 0 ? (
          resources.slice(0, limit).map((resource: any) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full py-8">No resources available.</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedResources;
