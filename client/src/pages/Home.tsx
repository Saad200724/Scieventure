import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedModules from '@/components/modules/FeaturedModules';
import CollaborativeProjects from '@/components/projects/CollaborativeProjects';
import AIAssistantSection from '@/components/ai/AIAssistantSection';
import FeaturedResources from '@/components/resources/FeaturedResources';
import CommunitySection from '@/components/community/CommunitySection';
import { Helmet } from 'react-helmet';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>SciVenture - Interactive Science Education</title>
        <meta name="description" content="SciVenture bridges the science education gap between urban and rural students through interactive learning modules, collaborative features, and AI assistance." />
        <meta property="og:title" content="SciVenture" />
        <meta property="og:description" content="Bridging the science education gap through interactive learning, collaboration, and AI assistance." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="max-w-screen-2xl mx-auto">
        <HeroSection />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
          <FeaturedModules userId={1} limit={4} />
          <CollaborativeProjects limit={3} />
          <AIAssistantSection />
          <FeaturedResources limit={2} />
          <CommunitySection />
        </div>
      </div>
    </>
  );
};

export default Home;
