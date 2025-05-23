import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ResourceCard from '@/components/resources/ResourceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Book, Beaker, AtomIcon } from 'lucide-react';
import { Resource } from '@shared/schema';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/providers/LanguageProvider';

const Resources: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const { data: resources, isLoading } = useQuery({
    queryKey: ['/api/resources'],
  });

  // Apply filters
  const filteredResources = React.useMemo(() => {
    if (!resources) return [];
    
    return resources.filter((resource: Resource) => {
      // Search query
      if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !resource.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Subject filter
      if (subjectFilter !== 'all' && resource.subject !== subjectFilter) {
        return false;
      }
      
      // Tab filter
      if (activeTab !== 'all') {
        // Check if the resource has tags that match the active tab
        // For simplicity, we'll check if any tag includes the tab name
        if (!resource.tags || !Array.isArray(resource.tags)) return false;
        
        const lowerTab = activeTab.toLowerCase();
        const hasMatchingTag = resource.tags.some(
          (tag: string) => tag.toLowerCase().includes(lowerTab)
        );
        
        if (!hasMatchingTag) return false;
      }
      
      return true;
    });
  }, [resources, searchQuery, subjectFilter, activeTab]);

  // Extract unique subject values
  const subjectOptions = React.useMemo(() => {
    if (!resources) return [];
    
    const subjects = new Set(resources.map((resource: Resource) => resource.subject));
    return Array.from(subjects);
  }, [resources]);

  return (
    <>
      <Helmet>
        <title>{t("Offline Learning Resources | ScienceBridge Bangladesh", "অফলাইন শিক্ষা সংস্থান | সাইয়েন্সব্রিজ বাংলাদেশ")}</title>
        <meta name="description" content={t("Download scientific resources for offline learning, including lab manuals, formula handbooks, and study guides.", "অফলাইন শিক্ষার জন্য বৈজ্ঞানিক সংস্থান ডাউনলোড করুন, যার মধ্যে রয়েছে ল্যাব ম্যানুয়াল, সূত্র হ্যান্ডবুক এবং অধ্যয়ন গাইড।")} />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{t("Offline Learning Resources", "অফলাইন শিক্ষা সংস্থান")}</h1>
          <p className="text-gray-600 mb-6">
            {t(
              "Access and download high-quality educational materials for offline study. These resources are designed for areas with limited internet connectivity and can be used for self-study or classroom teaching.",
              "অফলাইন অধ্যয়নের জন্য উচ্চ মানের শিক্ষামূলক উপকরণ অ্যাক্সেস এবং ডাউনলোড করুন। এই সংস্থানগুলি সীমিত ইন্টারনেট সংযোগ রয়েছে এমন এলাকার জন্য ডিজাইন করা হয়েছে এবং স্ব-অধ্যয়ন বা শ্রেণীকক্ষে শিক্ষার জন্য ব্যবহার করা যেতে পারে।"
            )}
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="md:w-1/2">
              <Input
                placeholder={t("Search resources...", "সংস্থান খুঁজুন...")}
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
                <SelectValue placeholder={t("Filter by subject", "বিষয় দিয়ে ফিল্টার করুন")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All Subjects", "সব বিষয়")}</SelectItem>
                {subjectOptions.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="all" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {t("All Resources", "সব সংস্থান")}
              </TabsTrigger>
              <TabsTrigger value="lab" className="flex items-center">
                <Beaker className="h-4 w-4 mr-2" />
                {t("Lab Manuals", "ল্যাব ম্যানুয়াল")}
              </TabsTrigger>
              <TabsTrigger value="formula" className="flex items-center">
                <AtomIcon className="h-4 w-4 mr-2" />
                {t("Formula Guides", "সূত্র গাইড")}
              </TabsTrigger>
              <TabsTrigger value="textbook" className="flex items-center">
                <Book className="h-4 w-4 mr-2" />
                {t("Textbooks", "পাঠ্যবই")}
              </TabsTrigger>
              <TabsTrigger value="worksheet" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {t("Worksheets", "ওয়ার্কশিট")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          {filteredResources.length} {t(
            filteredResources.length === 1 ? 'resource' : 'resources', 
            filteredResources.length === 1 ? 'সংস্থান' : 'সংস্থান'
          )} {t('found', 'পাওয়া গেছে')}
        </div>
        
        {isLoading ? (
          <div className="space-y-6">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <Skeleton className="h-48 md:h-full w-full" />
                  </div>
                  <div className="p-5 md:w-2/3">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-36" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="space-y-6">
            {filteredResources.map((resource: Resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <Download className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Resources Found</h3>
            <p className="text-gray-600 mb-4">
              No resources match your current filters. Try adjusting your search criteria.
            </p>
            <button 
              className="text-primary hover:underline"
              onClick={() => {
                setSearchQuery('');
                setSubjectFilter('all');
                setActiveTab('all');
              }}
            >
              Clear all filters
            </button>
          </div>
        )}
        
        <div className="mt-12 bg-primary/5 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Request Learning Resources</h2>
          <p className="text-gray-600 mb-6">
            Don't see what you're looking for? Request specific educational materials 
            and our team will work to make them available.
          </p>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Resource title or topic" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="biology">Biology</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="environmental_science">Environmental Science</SelectItem>
                <SelectItem value="astronomy">Astronomy</SelectItem>
              </SelectContent>
            </Select>
            <div className="md:col-span-2">
              <Input placeholder="Briefly describe what you're looking for..." />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button 
                type="button"
                className="bg-primary text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Resources;
