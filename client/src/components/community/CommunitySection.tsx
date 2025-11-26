import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, MessageSquare, Eye, Calendar, MapPin, Clock } from 'lucide-react';
import { SUBJECT_TAGS } from '@/lib/constants';
import { formatDate } from '@/lib/utils/dataUtils';
import SimulationGames from './SimulationGames';
import { DEMO_DISCUSSIONS, DEMO_EVENTS, DEMO_CONTRIBUTORS } from '@/lib/demoData';

const CommunitySection: React.FC = () => {
  // Format discussions for display
  const discussions = DEMO_DISCUSSIONS.map(discussion => ({
    id: discussion.id,
    authorName: discussion.author,
    authorInitials: discussion.author.split(' ').map(n => n[0]).join(''),
    timestamp: new Date(discussion.timestamp),
    subject: discussion.subject || 'General',
    title: discussion.title,
    content: '',
    replyCount: discussion.replies,
    viewCount: discussion.views
  }));

  // Format events for display
  const events = DEMO_EVENTS.map(event => ({
    id: event.id,
    title: event.title,
    location: event.location,
    date: event.date,
    time: event.time
  }));

  // Use contributors from demo data
  const contributors = DEMO_CONTRIBUTORS.map(contributor => ({
    id: contributor.id,
    name: contributor.name,
    role: contributor.role,
    initials: contributor.initials,
    points: contributor.points
  }));

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Community Activity</h2>
        <Link href="/community" className="text-primary hover:underline flex items-center">
          <span>View community hub</span>
          <ChevronRight className="h-5 w-5 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Recent Discussions - Full width on mobile, 1/4 on large screens */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-4 sm:p-6 h-full">
              <h3 className="font-semibold text-lg mb-4">Recent Discussions</h3>
              <div className="space-y-4">
                {discussions.map((discussion) => {
                  const subjectStyle = SUBJECT_TAGS[discussion.subject as keyof typeof SUBJECT_TAGS] || {
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-600'
                  };

                  return (
                    <div key={discussion.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs flex-shrink-0">
                            {discussion.authorInitials}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{discussion.authorName}</p>
                            <p className="text-xs text-gray-500">
                              {discussion.timestamp.toLocaleDateString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs ${subjectStyle.bgColor} ${subjectStyle.textColor} px-2 py-1 rounded-full`}>
                          {discussion.subject}
                        </span>
                      </div>
                      <h4 className="font-medium mb-1">{discussion.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{discussion.content}</p>
                      <div className="flex flex-wrap justify-between text-xs gap-2">
                        <div className="flex flex-wrap space-x-3">
                          <span className="flex items-center text-gray-500">
                            <MessageSquare className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>{discussion.replyCount} replies</span>
                          </span>
                          <span className="flex items-center text-gray-500">
                            <Eye className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>{discussion.viewCount} views</span>
                          </span>
                        </div>
                        <a href="#" className="text-primary hover:underline">Join discussion</a>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-center">
                <a href="#" className="text-primary hover:underline text-sm">View all discussions</a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events - Full width on mobile, 1/4 on large screens */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-4 sm:p-6 h-full">
              <h3 className="font-semibold text-lg mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center bg-primary/10 text-primary text-center p-2 rounded flex-shrink-0">
                        <span className="text-sm font-semibold">{formatDate(event.date).split(' ')[0]}</span>
                        <span className="text-xs">{formatDate(event.date).split(' ')[1]}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-sm truncate">{event.title}</h4>
                        <p className="text-xs text-gray-600 mb-1 truncate">{event.location}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a href="#" className="text-primary hover:underline text-sm">View all events</a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Contributors - Full width on mobile, 1/4 on large screens */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-4 sm:p-6 h-full">
              <h3 className="font-semibold text-lg mb-4">Top Contributors</h3>
              <div className="space-y-3">
                {contributors.map((contributor) => (
                  <div key={contributor.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-primary flex items-center justify-center text-xs flex-shrink-0">
                        {contributor.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{contributor.name}</p>
                        <p className="text-xs text-gray-500 truncate">{contributor.role}</p>
                      </div>
                    </div>
                    <div className="bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ml-2">
                      {contributor.points} pts
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a href="#" className="text-primary hover:underline text-sm">View leaderboard</a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simulation Games - Full width on mobile, 1/4 on large screens */}
        <div className="lg:col-span-1">
          <SimulationGames />
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
