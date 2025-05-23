import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/providers/LanguageProvider';
import ModuleCard from '@/components/modules/ModuleCard';
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
import { BookOpen, Beaker, Calculator, Atom, TreePine, Star } from 'lucide-react';

const Modules: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const { data: modules, isLoading } = useQuery({
    queryKey: ['/api/modules'],
  });

  // Apply filters
  const filteredModules = React.useMemo(() => {
    if (!modules) return [];
    
    return modules.filter((module: any) => {
      // Search query
      if (searchQuery && !module.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !module.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Subject filter
      if (subjectFilter !== 'all' && module.subject !== subjectFilter) {
        return false;
      }
      
      // Difficulty filter
      if (difficultyFilter !== 'all' && module.difficulty !== parseInt(difficultyFilter)) {
        return false;
      }
      
      return true;
    });
  }, [modules, searchQuery, subjectFilter, difficultyFilter]);

  // Extract unique subject values
  const subjectOptions = React.useMemo(() => {
    if (!modules) return [];
    
    const subjects = new Set(modules.map((module: any) => module.subject));
    return Array.from(subjects);
  }, [modules]);

  return (
    <>
      <Helmet>
        <title>{t("Learning Modules | SciVenture", "শিক্ষা মডিউল | সাইভেঞ্চার")}</title>
        <meta name="description" content={t("Explore interactive science learning modules covering biology, chemistry, physics, and more.", "জীববিজ্ঞান, রসায়ন, পদার্থবিজ্ঞান এবং আরও অনেক বিষয়ে ইন্টারঅ্যাকটিভ বিজ্ঞান শিক্ষা মডিউল অন্বেষণ করুন।")} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{t("Learning Modules", "শিক্ষা মডিউল")}</h1>
          <p className="text-gray-600 mb-6">
            {t(
              "Discover interactive science modules designed to make learning engaging and accessible. Each module includes hands-on activities, visual demonstrations, and real-world applications.",
              "শিক্ষাকে আকর্ষণীয় এবং সহজলভ্য করার জন্য ডিজাইন করা ইন্টারঅ্যাকটিভ বিজ্ঞান মডিউল আবিষ্কার করুন। প্রতিটি মডিউলে হ্যান্ডস-অন কার্যক্রম, ভিজ্যুয়াল প্রদর্শনী এবং বাস্তব-বিশ্বের প্রয়োগ রয়েছে।"
            )}
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="md:w-1/2">
              <Input
                placeholder={t("Search modules...", "মডিউল খুঁজুন...")}
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
            
            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("Difficulty level", "কঠিনতার স্তর")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All Levels", "সব স্তর")}</SelectItem>
                <SelectItem value="1">{t("Beginner", "শুরুর পর্যায়")}</SelectItem>
                <SelectItem value="2">{t("Intermediate", "মাঝারি")}</SelectItem>
                <SelectItem value="3">{t("Advanced", "উন্নত")}</SelectItem>
                <SelectItem value="4">{t("Expert", "বিশেষজ্ঞ")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="all" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                {t("All", "সব")}
              </TabsTrigger>
              <TabsTrigger value="biology" className="flex items-center">
                <TreePine className="h-4 w-4 mr-2" />
                {t("Biology", "জীববিজ্ঞান")}
              </TabsTrigger>
              <TabsTrigger value="chemistry" className="flex items-center">
                <Beaker className="h-4 w-4 mr-2" />
                {t("Chemistry", "রসায়ন")}
              </TabsTrigger>
              <TabsTrigger value="physics" className="flex items-center">
                <Atom className="h-4 w-4 mr-2" />
                {t("Physics", "পদার্থবিজ্ঞান")}
              </TabsTrigger>
              <TabsTrigger value="mathematics" className="flex items-center">
                <Calculator className="h-4 w-4 mr-2" />
                {t("Math", "গণিত")}
              </TabsTrigger>
              <TabsTrigger value="featured" className="flex items-center">
                <Star className="h-4 w-4 mr-2" />
                {t("Featured", "বৈশিষ্ট্যযুক্ত")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          {filteredModules.length} {t(
            filteredModules.length === 1 ? 'module' : 'modules', 
            filteredModules.length === 1 ? 'মডিউল' : 'মডিউল'
          )} {t('found', 'পাওয়া গেছে')}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredModules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module: any) => (
              <ModuleCard key={module.id} module={module} userId={1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">{t("No Modules Found", "কোনো মডিউল পাওয়া যায়নি")}</h3>
            <p className="text-gray-600 mb-4">
              {t("No modules match your current filters. Try adjusting your search criteria.", "আপনার বর্তমান ফিল্টারের সাথে কোনো মডিউল মিলেছে না। আপনার অনুসন্ধানের মানদণ্ড সামঞ্জস্য করার চেষ্টা করুন।")}
            </p>
            <button 
              className="text-primary hover:underline"
              onClick={() => {
                setSearchQuery('');
                setSubjectFilter('all');
                setDifficultyFilter('all');
              }}
            >
              {t("Clear all filters", "সব ফিল্টার সাফ করুন")}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Modules;