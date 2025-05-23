import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/LanguageProvider';
import sciVentureLogo from '@assets/SciVenture.png';
import heroImage from '@assets/HeroSection.jpg';

interface HeroSectionProps {
  title?: string;
  description?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Bridging the Science Education Gap in Bangladesh",
  description = "Access interactive learning, collaborate on projects, and get AI assistance for your science education journey."
}) => {
  const { t } = useLanguage();

  return (
    <section className="relative rounded-xl overflow-hidden mb-12 bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text Content - Left side on desktop, top on mobile */}
          <div className="order-2 lg:order-1 flex flex-col">
            <div className="max-w-lg mx-auto lg:mx-0">
              <div className="mb-2 hidden md:block">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {t("Innovation in Education", "শিক্ষায় উদ্ভাবন")}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                <span className="text-primary">STEM</span> <span className="italic font-serif">{t("Education", "শিক্ষা")}</span> <br className="hidden md:block" />
                {t("Reimagined", "পুনঃকল্পিত")}
              </h1>
              <p className="text-gray-700 text-md sm:text-lg mb-6 max-w-md">
                {t(description, "ইন্টারঅ্যাকটিভ শিক্ষা অ্যাক্সেস করুন, প্রকল্পগুলিতে সহযোগিতা করুন এবং আপনার বিজ্ঞান শিক্ষা যাত্রার জন্য AI সহায়তা পান।")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary text-white font-medium hover:bg-primary/90 shadow-md">
                  <Link href="/modules">{t("Explore Modules", "মডিউল অন্বেষণ করুন")}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 font-medium">
                  <Link href="/community">{t("Join Community", "কমিউনিটিতে যোগ দিন")}</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Image - Right side on desktop, bottom on mobile */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-xl overflow-hidden shadow-xl mx-auto max-w-md lg:max-w-none">
              <img 
                src={heroImage}
                alt="STEM Education workspace with laptop and books" 
                className="w-full h-auto"
              />
              <div className="absolute top-0 left-0 transform translate-x-6 translate-y-6">
                <span className="font-serif italic text-xl md:text-2xl text-gray-800 whitespace-nowrap">
                  STEM <span className="font-bold">Education</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
