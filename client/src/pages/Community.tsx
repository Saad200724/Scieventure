import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SimulationGames from '@/components/community/SimulationGames';
import QuantumCoinToss from '@/components/games/QuantumCoinToss';

const Community: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Community Hub | SciVenture</title>
      </Helmet>
      
      <div className="container mx-auto py-6 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Hub</h1>
          <p className="text-gray-600">Connect with fellow science enthusiasts, share your discoveries, and learn together.</p>
        </div>
        
        <Tabs defaultValue="games" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="games">Simulation Games</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="projects">Collaborative Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discussions">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Science Discussions</h2>
                <p className="text-gray-600 mb-6">Join conversations about various scientific topics with students and educators.</p>
                <div className="text-center p-8 text-gray-500">
                  Discussion forums will be available soon!
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="games" className="space-y-6">
            <h2 className="text-xl font-semibold">Educational Simulation Games</h2>
            <p className="text-gray-600 mb-4">Learn science concepts through fun, interactive simulation games.</p>
            <SimulationGames />
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upcoming Science Events</h2>
                <p className="text-gray-600 mb-6">Participate in virtual and in-person science events, workshops, and competitions.</p>
                <div className="text-center p-8 text-gray-500">
                  Event calendar will be available soon!
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Collaborative Projects</h2>
                <p className="text-gray-600 mb-6">Work together with other students on citizen science initiatives and research projects.</p>
                <div className="text-center p-8 text-gray-500">
                  Collaborative projects will be available soon!
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