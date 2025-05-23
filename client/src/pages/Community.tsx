import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SimulationGames from '@/components/community/SimulationGames';
import QuantumCoinToss from '@/components/games/QuantumCoinToss';
import { useLanguage } from '@/providers/LanguageProvider';

const Community: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <Helmet>
        <title>{t("Community Hub | SciVenture", "কমিউনিটি হাব | সাইভেঞ্চার")}</title>
      </Helmet>
      
      <div className="container mx-auto py-6 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("Community Hub", "কমিউনিটি হাব")}</h1>
          <p className="text-gray-600">{t("Connect with fellow science enthusiasts, share your discoveries, and learn together.", "সহযোগী বিজ্ঞান উৎসাহীদের সাথে যোগ দিন, আপনার আবিষ্কার ভাগ করুন এবং একসাথে শিখুন।")}</p>
        </div>
        
        <Tabs defaultValue="games" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="discussions">{t("Discussions", "আলোচনা")}</TabsTrigger>
            <TabsTrigger value="games">{t("Simulation Games", "সিমুলেশন গেমস")}</TabsTrigger>
            <TabsTrigger value="events">{t("Upcoming Events", "আসন্ন ইভেন্ট")}</TabsTrigger>
            <TabsTrigger value="projects">{t("Collaborative Projects", "সহযোগিতামূলক প্রকল্প")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discussions">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t("Science Discussions", "বিজ্ঞান আলোচনা")}</h2>
                <p className="text-gray-600 mb-6">{t("Join conversations about various scientific topics with students and educators.", "ছাত্রছাত্রী এবং শিক্ষকদের সাথে বিভিন্ন বৈজ্ঞানিক বিষয়ে কথোপকথনে যোগ দিন।")}</p>
                <div className="text-center p-8 text-gray-500">
                  {t("Discussion forums will be available soon!", "আলোচনা ফোরাম শীঘ্রই উপলব্ধ হবে!")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="games" className="space-y-6">
            <h2 className="text-xl font-semibold">{t("Educational Simulation Games", "শিক্ষামূলক সিমুলেশন গেমস")}</h2>
            <p className="text-gray-600 mb-4">{t("Learn science concepts through fun, interactive simulation games.", "মজাদার, ইন্টারঅ্যাক্টিভ সিমুলেশন গেমের মাধ্যমে বিজ্ঞানের ধারণা শিখুন।")}</p>
            <SimulationGames />
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t("Upcoming Science Events", "আসন্ন বিজ্ঞান ইভেন্ট")}</h2>
                <p className="text-gray-600 mb-6">{t("Participate in virtual and in-person science events, workshops, and competitions.", "ভার্চুয়াল এবং ব্যক্তিগত বিজ্ঞান ইভেন্ট, ওয়ার্কশপ এবং প্রতিযোগিতায় অংশগ্রহণ করুন।")}</p>
                <div className="text-center p-8 text-gray-500">
                  {t("Event calendar will be available soon!", "ইভেন্ট ক্যালেন্ডার শীঘ্রই উপলব্ধ হবে!")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t("Collaborative Projects", "সহযোগিতামূলক প্রকল্প")}</h2>
                <p className="text-gray-600 mb-6">{t("Work together with other students on citizen science initiatives and research projects.", "নাগরিক বিজ্ঞান উদ্যোগ এবং গবেষণা প্রকল্পে অন্যান্য ছাত্রছাত্রীদের সাথে একসাথে কাজ করুন।")}</p>
                <div className="text-center p-8 text-gray-500">
                  {t("Collaborative projects will be available soon!", "সহযোগিতামূলক প্রকল্প শীঘ্রই উপলব্ধ হবে!")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Community;