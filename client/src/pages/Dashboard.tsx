import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import ProgressSection from '@/components/dashboard/ProgressSection';
import AchievementsSection from '@/components/dashboard/AchievementsSection';
import UpcomingActivities from '@/components/dashboard/UpcomingActivities';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Download, WifiOff } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { supabase, getUser } from '@/lib/supabase';
import { useLanguage } from '@/providers/LanguageProvider';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  // Default to userId 1 if not logged in with Supabase yet
  const userId = 1;

  // Get Supabase user on component mount
  useEffect(() => {
    async function fetchSupabaseUser() {
      const user = await getUser();
      if (user) {
        setSupabaseUser(user);
        console.log('Supabase user:', user);
      }
    }
    
    fetchSupabaseUser();
    
    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user);
        }
      }
    );
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Fetch user data from API
  const { data: user, isLoading } = useQuery<any>({
    queryKey: [`/api/users/${userId}`],
  });

  return (
    <>
      <Helmet>
        <title>{t("Dashboard | ScienceBridge Bangladesh", "ড্যাশবোর্ড | সাইয়েন্সব্রিজ বাংলাদেশ")}</title>
        <meta name="description" content={t("View your learning progress, achievements, and upcoming activities.", "আপনার শিক্ষার অগ্রগতি, অর্জন এবং আসন্ন কার্যক্রম দেখুন।")} />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          {isLoading ? (
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-8 w-32" />
            </div>
          ) : (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {t("Welcome back,", "স্বাগতম,")} {supabaseUser?.user_metadata?.full_name || user?.firstName || t('Student', 'ছাত্র')}!
              </h2>
              <div className="flex items-center">
                <div className="flex space-x-1 mr-3">
                  <Star className="h-5 w-5 text-accent" />
                  <span className="font-bold text-accent">{user?.points || 0}</span>
                </div>
                <div className="flex items-center bg-secondary text-white text-xs font-semibold px-2 py-1 rounded-full">
                  <span>{t("Level", "লেভেল")}</span>
                  <span className="ml-1 bg-white text-secondary rounded-full w-5 h-5 flex items-center justify-center">
                    {user?.level || 1}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Offline content section */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t("Offline Learning", "অফলাইন শিক্ষা")}
              </h3>
              <p className="text-muted-foreground text-sm mb-3 md:mb-0">
                {t(
                  "Download resources to learn even when internet is not available",
                  "ইন্টারনেট না থাকলেও শিখতে রিসোর্স ডাউনলোড করুন"
                )}
              </p>
            </div>
            <Link href="/offline-content">
              <Button variant="secondary" className="gap-2">
                <WifiOff className="h-4 w-4" />
                {t("Manage Offline Content", "অফলাইন কন্টেন্ট ম্যানেজ করুন")}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ProgressSection userId={userId} />
            <AchievementsSection userId={userId} />
            <UpcomingActivities />
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
