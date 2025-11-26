import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/LanguageProvider';
import { DEMO_CONTRIBUTORS } from '@/lib/demoData';
import { Search, TrendingUp } from 'lucide-react';

interface Contributor {
  id: number;
  name: string;
  role: string;
  points: number;
  initials: string;
}

const Contributors: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'points' | 'name'>('points');

  const filteredContributors = DEMO_CONTRIBUTORS.filter(contributor =>
    contributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contributor.role.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'points') {
      return b.points - a.points;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <Helmet>
        <title>{t("Top 100 Contributors | SciVenture", "শীর্ষ ১০০ অবদানকারী | সায়েন্স ভেঞ্চার")}</title>
        <meta name="description" content={t("View the top contributors to SciVenture platform", "সায়েন্স ভেঞ্চার প্ল্যাটফর্মের শীর্ষ অবদানকারীদের দেখুন")} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">{t("Top 100 Contributors", "শীর্ষ ১০০ অবদানকারী")}</h1>
            <p className="text-lg text-muted-foreground">
              {t("Celebrating the amazing educators, researchers, and students who are shaping science education", "অসাধারণ শিক্ষক, গবেষক এবং শিক্ষার্থীদের উদযাপন যারা বিজ্ঞান শিক্ষা গঠন করছেন")}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder={t("Search by name or role...", "নাম বা ভূমিকা দ্বারা অনুসন্ধান করুন...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={sortBy === 'points' ? 'default' : 'outline'}
                  onClick={() => setSortBy('points')}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  {t("By Points", "পয়েন্ট অনুযায়ী")}
                </Button>
                <Button
                  variant={sortBy === 'name' ? 'default' : 'outline'}
                  onClick={() => setSortBy('name')}
                >
                  {t("By Name", "নাম অনুযায়ী")}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("Showing", "দেখাচ্ছে")} {filteredContributors.length} {t("contributors", "অবদানকারী")}
            </p>
          </div>

          {/* Contributors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContributors.map((contributor, index) => (
              <Card key={contributor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {contributor.initials}
                        </div>
                        {index < 10 && (
                          <div className="absolute -top-2 -right-2 bg-amber-400 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg truncate">{contributor.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{contributor.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-muted-foreground">{t("Points", "পয়েন্ট")}</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-600">{contributor.points}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("contribution", "অবদান")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-blue-600 h-full transition-all"
                      style={{ width: `${(contributor.points / 1000) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredContributors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {t("No contributors found matching your search", "আপনার অনুসন্ধানের সাথে মেলে এমন কোন অবদানকারী পাওয়া যায়নি")}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Contributors;
