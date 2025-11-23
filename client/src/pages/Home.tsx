import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedModules from '@/components/modules/FeaturedModules';
import CollaborativeProjects from '@/components/projects/CollaborativeProjects';
import FeaturedResources from '@/components/resources/FeaturedResources';
import CommunitySection from '@/components/community/CommunitySection';
import { useLanguage } from '@/providers/LanguageProvider';
import { Helmet } from 'react-helmet';

const Home: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <Helmet>
        <title>{t("SciVenture - Interactive Science Education", "সায়েন্স ভেঞ্চার - ইন্টারঅ্যাকটিভ বিজ্ঞান শিক্ষা")}</title>
        <meta name="description" content={t("SciVenture bridges the science education gap between urban and rural students through interactive learning modules, collaborative features, and AI assistance.", "সায়েন্স ভেঞ্চার ইন্টারঅ্যাকটিভ লার্নিং মডিউল, সহযোগিতামূলক বৈশিষ্ট্য এবং AI সহায়তার মাধ্যমে শহুরে এবং গ্রামীণ শিক্ষার্থীদের মধ্যে বিজ্ঞান শিক্ষার ব্যবধান দূর করে।")} />
        <meta property="og:title" content="SciVenture" />
        <meta property="og:description" content={t("Bridging the science education gap through interactive learning, collaboration, and AI assistance.", "ইন্টারঅ্যাকটিভ শিক্ষা, সহযোগিতা এবং AI সহায়তার মাধ্যমে বিজ্ঞান শিক্ষার ব্যবধান দূর করা।")} />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="max-w-screen-2xl mx-auto">
        <HeroSection />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
          <FeaturedModules userId={1} limit={4} />
          <CollaborativeProjects limit={3} />
          <FeaturedResources limit={2} />
          <CommunitySection />
        </div>
      </div>
    </>
  );
};

export default Home;
