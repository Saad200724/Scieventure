import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import ProgressSection from '@/components/dashboard/ProgressSection';
import AchievementsSection from '@/components/dashboard/AchievementsSection';
import UpcomingActivities from '@/components/dashboard/UpcomingActivities';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { supabase, getUser } from '@/lib/supabase';

const Dashboard: React.FC = () => {
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
  const { data: user, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  return (
    <>
      <Helmet>
        <title>Dashboard | ScienceBridge Bangladesh</title>
        <meta name="description" content="View your learning progress, achievements, and upcoming activities." />
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
                Welcome back, {supabaseUser?.user_metadata?.full_name || user?.firstName || 'Student'}!
              </h2>
              <div className="flex items-center">
                <div className="flex space-x-1 mr-3">
                  <Star className="h-5 w-5 text-accent" />
                  <span className="font-bold text-accent">{user?.points || 0}</span>
                </div>
                <div className="flex items-center bg-secondary text-white text-xs font-semibold px-2 py-1 rounded-full">
                  <span>Level</span>
                  <span className="ml-1 bg-white text-secondary rounded-full w-5 h-5 flex items-center justify-center">
                    {user?.level || 1}
                  </span>
                </div>
              </div>
            </div>
          )}

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
