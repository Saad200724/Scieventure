import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import sciVentureLogo from '@assets/SciVenture.png';
import sciVentureLogoWhite from '@assets/SciVenture_white.png';
import heroImage from '@assets/Landing_HeroSection.jpg';
import LanguageToggle from '@/components/ui/language-toggle';
import { useLanguage } from '@/providers/LanguageProvider';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Landing: React.FC = () => {
  const { t } = useLanguage();

  React.useEffect(() => {
    document.title = t("SciVenture - Bridging Science Education", "সায়েন্স ভেঞ্চার - বিজ্ঞান শিক্ষার সেতুবন্ধন");
    
    // Add event listener for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href')?.slice(1);
        const targetElement = document.getElementById(targetId as string);
        
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [t]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      {/* Header for Landing - Premium Style */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={sciVentureLogo} 
              alt="SciVenture Logo" 
              className="h-8 w-auto sm:h-10" 
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="sm:hidden">
              <LanguageToggle className="p-0.5 scale-75" />
            </div>
            <div className="hidden sm:block">
              <LanguageToggle className="p-1" />
            </div>
            <Button asChild variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9">
              <Link href="/login">{t("Sign In", "সাইন ইন")}</Link>
            </Button>
            <Button asChild size="sm" className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9">
              <Link href="/register">{t("Sign Up", "নিবন্ধন করুন")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section - Premium Gradient */}
        <section className="relative py-12 md:py-24 lg:py-28 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950">
          {/* Decorative blurred elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute inset-0 bg-grid-white/5 opacity-20"></div>
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
                  {t("Transforming Science Education", "বিজ্ঞান শিক্ষা রূপান্তর")}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 md:mb-8 max-w-lg">
                  {t(
                    "Discover interactive learning modules, collaborate on projects, and get AI assistance on your educational journey.",
                    "ইন্টারঅ্যাকটিভ লার্নিং মডিউল আবিষ্কার করুন, প্রকল্পে সহযোগিতা করুন এবং আপনার শিক্ষা যাত্রায় AI সহায়তা পান।"
                  )}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-medium shadow-md">
                    <Link href="/login">{t("Get Started", "শুরু করুন")}</Link>
                  </Button>
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-medium shadow-md">
                    <Link href="#features">{t("Learn More", "আরও জানুন")}</Link>
                  </Button>
                </div>
              </div>
              <div className="lg:w-1/2 w-full max-w-xl mx-auto lg:max-w-none">
                <div className="relative bg-gray-900 p-1 rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src={heroImage} 
                    alt="SciVenture in a retro computer screen" 
                    className="rounded-lg w-full h-auto"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-lg sm:text-xl font-medium text-center">
                      Reimagining Science Learning for the Digital Age
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t("Key Features", "মূল বৈশিষ্ট্য")}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t(
                  "SciVenture provides a comprehensive platform to enhance science education through interactive technology, personalized learning experiences, and collaborative tools designed specifically for Bangladesh's educational context.",
                  "সায়েন্স ভেঞ্চার বাংলাদেশের শিক্ষা প্রেক্ষাপটের জন্য নির্দিষ্টভাবে ডিজাইন করা ইন্টারঅ্যাকটিভ প্রযুক্তি, ব্যক্তিগতকৃত শিক্ষা অভিজ্ঞতা, এবং সহযোগী টুল দিয়ে বিজ্ঞান শিক্ষা উন্নত করার জন্য একটি বিস্তৃত প্ল্যাটফর্ম প্রদান করে।"
                )}
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto mb-16">
              <div className="bg-gray-50 rounded-xl p-8 shadow-md border border-gray-100">
                <h3 className="text-2xl font-bold text-primary mb-4 text-center">
                  {t("What is SciVenture?", "সায়েন্স ভেঞ্চার কী?")}
                </h3>
                <p className="text-gray-700 mb-4">
                  {t(
                    "SciVenture is an educational platform designed to bridge the science education gap in Bangladesh through technology. Our mission is to make quality science education accessible to all students regardless of their location or resources.",
                    "সায়েন্স ভেঞ্চার একটি শিক্ষামূলক প্ল্যাটফর্ম যা প্রযুক্তির মাধ্যমে বাংলাদেশে বিজ্ঞান শিক্ষার ব্যবধান দূর করার জন্য ডিজাইন করা হয়েছে। আমাদের লক্ষ্য হল সকল শিক্ষার্থীদের অবস্থান বা সংস্থান নির্বিশেষে মানসম্পন্ন বিজ্ঞান শিক্ষা অ্যাক্সেসযোগ্য করা।"
                  )}
                </p>
                <p className="text-gray-700 mb-4">
                  {t(
                    "By combining interactive learning modules, AI-powered assistance, and collaborative tools, we create an engaging environment where students can explore scientific concepts, conduct virtual experiments, and develop critical thinking skills.",
                    "ইন্টারঅ্যাকটিভ লার্নিং মডিউল, এআই-চালিত সহায়তা এবং সহযোগী টুল একত্রিত করে, আমরা একটি আকর্ষণীয় পরিবেশ তৈরি করি যেখানে শিক্ষার্থীরা বৈজ্ঞানিক ধারণা অন্বেষণ করতে পারে, ভার্চুয়াল পরীক্ষা পরিচালনা করতে পারে এবং সমালোচনামূলক চিন্তার দক্ষতা বিকাশ করতে পারে।"
                  )}
                </p>
                <p className="text-gray-700">
                  {t(
                    "SciVenture is developed by educators and technologists who understand the unique challenges faced by students in Bangladesh, with content aligned to the national curriculum while incorporating global scientific advancements.",
                    "সায়েন্স ভেঞ্চার এমন শিক্ষাবিদ এবং প্রযুক্তিবিদদের দ্বারা বিকশিত যারা বাংলাদেশের শিক্ষার্থীদের সম্মুখীন হওয়া অনন্য চ্যালেঞ্জগুলি বোঝেন, বিশ্বব্যাপী বৈজ্ঞানিক অগ্রগতি অন্তর্ভুক্ত করার সময় জাতীয় পাঠ্যক্রমের সাথে সামঞ্জস্যপূর্ণ বিষয়বস্তু সহ।"
                  )}
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-6xl">
              {/* Feature 1 */}
              <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {t("Interactive Learning Modules", "ইন্টারঅ্যাকটিভ লার্নিং মডিউল")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t(
                    "Engage with comprehensive learning modules across various science subjects, designed for different educational levels.",
                    "বিভিন্ন শিক্ষা স্তরের জন্য ডিজাইন করা বিভিন্ন বিজ্ঞান বিষয়ে বিস্তৃত শিক্ষা মডিউলগুলির সাথে জড়িত হোন।"
                  )}
                </p>
                <ul className="text-gray-600 space-y-2 list-disc pl-5">
                  <li>{t("Biology, Chemistry, Physics and Environmental Science topics", "জীববিজ্ঞান, রসায়ন, পদার্থবিজ্ঞান এবং পরিবেশ বিজ্ঞান বিষয়গুলি")}</li>
                  <li>{t("Interactive diagrams and animations for complex concepts", "জটিল ধারণার জন্য ইন্টারঅ্যাকটিভ চিত্র এবং অ্যানিমেশন")}</li>
                  <li>{t("Progressive learning paths tailored to your academic level", "আপনার একাডেমিক স্তরের জন্য তৈরি করা প্রগতিশীল শিক্ষার পথ")}</li>
                </ul>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {t("Collaborative Projects", "সহযোগিতামূলক প্রকল্প")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t(
                    "Work together with peers on science projects, share findings, and learn through practical application and experimentation.",
                    "বিজ্ঞান প্রকল্পগুলিতে সহপাঠীদের সাথে একসাথে কাজ করুন, আবিষ্কারগুলি শেয়ার করুন এবং ব্যবহারিক প্রয়োগ এবং পরীক্ষা-নিরীক্ষার মাধ্যমে শিখুন।"
                  )}
                </p>
                <ul className="text-gray-600 space-y-2 list-disc pl-5">
                  <li>{t("Real-world project templates aligned with Bangladesh's ecosystem", "বাংলাদেশের ইকোসিস্টেমের সাথে সামঞ্জস্যপূর্ণ বাস্তব-জগতের প্রকল্প টেমপ্লেট")}</li>
                  <li>{t("Tools for data collection, analysis and visualization", "ডেটা সংগ্রহ, বিশ্লেষণ এবং ভিজ্যুয়ালাইজেশনের জন্য টুল")}</li>
                  <li>{t("Peer review and feedback system for continuous improvement", "ক্রমাগত উন্নতির জন্য পিয়ার রিভিউ এবং ফিডব্যাক সিস্টেম")}</li>
                </ul>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {t("AI Learning Assistant", "এআই লার্নিং সহকারী")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t(
                    "Get personalized help from our AI assistant that simplifies complex scientific concepts and provides adaptive learning support.",
                    "আমাদের এআই সহকারী থেকে ব্যক্তিগতকৃত সাহায্য পান যা জটিল বৈজ্ঞানিক ধারণাগুলিকে সরল করে এবং অভিযোজিত শিক্ষার সমর্থন প্রদান করে।"
                  )}
                </p>
                <ul className="text-gray-600 space-y-2 list-disc pl-5">
                  <li>{t("Meet Curio - your AI learning companion available 24/7", "কিউরিও-এর সাথে পরিচিত হোন - আপনার এআই লার্নিং সহচর যা 24/7 উপলব্ধ")}</li>
                  <li>{t("Text simplification and translation between English and Bengali", "ইংরেজি এবং বাংলার মধ্যে টেক্সট সরলীকরণ এবং অনুবাদ")}</li>
                  <li>{t("Deep research capabilities to expand on any science topic", "যেকোনো বিজ্ঞান বিষয়ে প্রসারিত করার জন্য গভীর গবেষণা সক্ষমতা")}</li>
                </ul>
              </div>
            </div>
            
            {/* Additional Features Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-10">
                {t("Additional Features", "অতিরিক্ত বৈশিষ্ট্য")}
              </h3>
              <div className="grid md:grid-cols-2 gap-8 mx-auto max-w-4xl">
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t("Progress Tracking", "অগ্রগতি ট্র্যাকিং")}
                  </h4>
                  <p className="text-gray-600">
                    {t(
                      "Track your learning journey with detailed progress metrics, achievement badges, and personalized recommendations for improvement.",
                      "বিস্তারিত অগ্রগতি মেট্রিক্স, অর্জন ব্যাজ এবং উন্নতির জন্য ব্যক্তিগতকৃত সুপারিশগুলির সাথে আপনার শিক্ষার যাত্রা ট্র্যাক করুন।"
                    )}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Research Paper Analysis
                  </h4>
                  <p className="text-gray-600">
                    Upload scientific papers and get AI-powered analysis that breaks down complex research into understandable summaries and key insights.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Offline Access
                  </h4>
                  <p className="text-gray-600">
                    Download learning materials for offline study, perfect for areas with limited internet connectivity across Bangladesh.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resource Library
                  </h4>
                  <p className="text-gray-600">
                    Access a growing collection of educational resources including textbooks, lab manuals, and scientific reference materials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Premium */}
        <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950">
          {/* Decorative blurred elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300/10 rounded-full blur-3xl"></div>
          </div>
          <div className="container px-4 mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{t("Ready to Begin Your Science Journey?", "আপনার বিজ্ঞান যাত্রা শুরু করতে প্রস্তুত?")}</h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              {t(
                "Join SciVenture today and discover a new way to learn and engage with science education",
                "আজই সায়েন্স ভেঞ্চারে যোগ দিন এবং বিজ্ঞান শিক্ষার সাথে শেখার এবং জড়িত হওয়ার একটি নতুন উপায় আবিষ্কার করুন"
              )}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90 font-semibold shadow-lg">
                <Link href="/login">{t("Sign In", "সাইন ইন")}</Link>
              </Button>
              <Button asChild size="lg" className="bg-white/20 text-white hover:bg-white/30 border border-white/40 font-semibold shadow-lg backdrop-blur-sm">
                <Link href="/register">{t("Create Account", "একটি অ্যাকাউন্ট তৈরি করুন")}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer for Landing - Premium */}
      <footer className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
        {/* Decorative background gradient */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative">
          {/* Main Footer Content */}
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <img 
                    src={sciVentureLogoWhite} 
                    alt="SciVenture Logo" 
                    className="h-12 w-auto hover:scale-105 transition-transform" 
                  />
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-xs">
                  {t(
                    "Bridging the science education gap through interactive learning, collaboration, and AI-powered assistance.",
                    "ইন্টারঅ্যাকটিভ শিক্ষা, সহযোগিতা এবং AI-চালিত সহায়তার মাধ্যমে বিজ্ঞান শিক্ষার ব্যবধান দূর করা।"
                  )}
                </p>
                <div className="flex gap-3">
                  <a href="#" className="h-10 w-10 rounded-full bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Facebook className="h-5 w-5 text-blue-400" />
                  </a>
                  <a href="#" className="h-10 w-10 rounded-full bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Twitter className="h-5 w-5 text-blue-400" />
                  </a>
                  <a href="#" className="h-10 w-10 rounded-full bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Instagram className="h-5 w-5 text-blue-400" />
                  </a>
                  <a href="#" className="h-10 w-10 rounded-full bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Linkedin className="h-5 w-5 text-blue-400" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6 pb-3 border-b border-white/10">{t("Quick Links", "দ্রুত লিংক")}</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#features" className="text-gray-300 hover:text-white text-sm transition-colors duration-200 cursor-pointer hover:translate-x-1 transform transition-transform">
                      {t("Features", "বৈশিষ্ট্য")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200 cursor-pointer hover:translate-x-1 transform transition-transform">
                      {t("About Us", "আমাদের সম্পর্কে")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200 cursor-pointer hover:translate-x-1 transform transition-transform">
                      {t("Contact", "যোগাযোগ")}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6 pb-3 border-b border-white/10">{t("Legal", "আইনি")}</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200 cursor-pointer hover:translate-x-1 transform transition-transform">
                      {t("Terms of Service", "সেবা শর্তাবলী")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200 cursor-pointer hover:translate-x-1 transform transition-transform">
                      {t("Privacy Policy", "গোপনীয়তা নীতি")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Divider */}
            <div className="border-t border-white/10 my-8"></div>

            {/* Footer Bottom */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} SciVenture. {t("All rights reserved.", "সর্বস্বত্ব সংরক্ষিত।")}</p>
              <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">{t("Privacy Policy", "গোপনীয়তা নীতি")}</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">{t("Terms of Service", "সেবা শর্তাবলী")}</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;