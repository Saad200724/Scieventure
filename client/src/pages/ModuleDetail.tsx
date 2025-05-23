import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Download, Star, Users, FileText, PlayCircle, Check } from 'lucide-react';
import { SUBJECT_TAGS } from '@/lib/constants';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Helmet } from 'react-helmet';

const ModuleDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const moduleId = parseInt(params.id);
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const userId = 1; // This would normally come from authentication

  // Fetch module details
  const { data: module, isLoading: moduleLoading } = useQuery({
    queryKey: [`/api/modules/${moduleId}`],
  });

  // Fetch user progress
  const { data: progressItems, isLoading: progressLoading } = useQuery({
    queryKey: [`/api/users/${userId}/progress`],
    enabled: !!userId,
  });

  // Calculate user progress for this module
  const currentProgress = React.useMemo(() => {
    if (!progressItems) return 0;
    const moduleProgress = progressItems.find((p: any) => p.moduleId === moduleId);
    return moduleProgress ? moduleProgress.completionPercentage : 0;
  }, [progressItems, moduleId]);

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (completionPercentage: number) => {
      const response = await apiRequest('POST', '/api/progress', {
        userId,
        moduleId,
        completionPercentage,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/progress`] });
    },
  });

  // Handle continue/start learning
  const handleContinueLearning = () => {
    // In a real implementation, this would navigate to the learning content
    // For now, we'll just update progress by 10%
    const newProgress = Math.min(currentProgress + 10, 100);
    updateProgressMutation.mutate(newProgress);
  };

  if (isNaN(moduleId)) {
    navigate('/modules');
    return null;
  }

  const isLoading = moduleLoading || progressLoading;

  // Get subject tag styling if module is loaded
  const subjectStyle = module ? (
    SUBJECT_TAGS[module.subject as keyof typeof SUBJECT_TAGS] || {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
    }
  ) : { 
    bgColor: 'bg-gray-100', 
    textColor: 'text-gray-600' 
  };

  return (
    <>
      <Helmet>
        <title>{module ? `${module.title} | ScienceBridge Bangladesh` : 'Module Details | ScienceBridge Bangladesh'}</title>
        <meta name="description" content={module?.description || 'Interactive science learning module'} />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 pl-0"
          onClick={() => navigate('/modules')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to modules
        </Button>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : module ? (
          <>
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="md:w-1/2">
                <div className="mb-4 flex items-center">
                  <span className={`text-xs ${subjectStyle.bgColor} ${subjectStyle.textColor} px-2 py-1 rounded-full mr-3`}>
                    {module.subject}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-accent" />
                    <span className="ml-1 text-sm">{module.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-4">{module.title}</h1>
                <p className="text-gray-600 mb-6">{module.description}</p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-5 w-5 mr-1" />
                    <span>{module.studentCount?.toLocaleString() || 0} enrolled students</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-5 w-5 mr-1" />
                    <span>12 lessons</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <PlayCircle className="h-5 w-5 mr-1" />
                    <span>5 interactive exercises</span>
                  </div>
                </div>
                
                <ProgressBar value={currentProgress} className="mb-6" />
                
                <div className="flex flex-wrap gap-4">
                  <Button
                    className="bg-primary text-white"
                    onClick={handleContinueLearning}
                    disabled={updateProgressMutation.isPending}
                  >
                    {updateProgressMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : currentProgress > 0 ? (
                      <>Continue Learning</>
                    ) : (
                      <>Start Learning</>
                    )}
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Download for Offline
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="rounded-lg overflow-hidden h-64 bg-gray-200">
                  <img
                    src={module.thumbnail}
                    alt={module.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="exercises">Exercises</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">What you'll learn</h2>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-secondary mr-2 mt-0.5" />
                        <span>Understand fundamental principles of {module.subject.toLowerCase()}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-secondary mr-2 mt-0.5" />
                        <span>Apply theoretical knowledge to real-world scenarios</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-secondary mr-2 mt-0.5" />
                        <span>Develop critical thinking and analytical skills</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-secondary mr-2 mt-0.5" />
                        <span>Perform experiments with minimal equipment</span>
                      </li>
                    </ul>
                    
                    <h2 className="text-xl font-semibold mb-4">Prerequisites</h2>
                    <p className="text-gray-600 mb-6">
                      Basic understanding of science concepts taught in secondary school. 
                      No advanced knowledge required - we'll build from the fundamentals.
                    </p>
                    
                    <h2 className="text-xl font-semibold mb-4">About this module</h2>
                    <p className="text-gray-600">
                      This comprehensive module provides an in-depth look at {module.title.toLowerCase()}. 
                      The content is designed to be accessible for students with different learning styles 
                      and can be downloaded for offline access. Each section includes interactive exercises, 
                      quizzes, and real-world applications to reinforce learning.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="content" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Module Content</h2>
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">1. Introduction to {module.title}</h3>
                          <span className="text-xs bg-blue-100 text-primary px-2 py-1 rounded-full">15 min</span>
                        </div>
                        <p className="text-sm text-gray-600">Overview of key concepts and terminology</p>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">2. Core Principles</h3>
                          <span className="text-xs bg-blue-100 text-primary px-2 py-1 rounded-full">25 min</span>
                        </div>
                        <p className="text-sm text-gray-600">Understanding the fundamental principles and theories</p>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">3. Practical Applications</h3>
                          <span className="text-xs bg-blue-100 text-primary px-2 py-1 rounded-full">30 min</span>
                        </div>
                        <p className="text-sm text-gray-600">Applying concepts to real-world situations</p>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">4. Advanced Topics</h3>
                          <span className="text-xs bg-blue-100 text-primary px-2 py-1 rounded-full">20 min</span>
                        </div>
                        <p className="text-sm text-gray-600">Exploring complex ideas and current research</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="exercises" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Interactive Exercises</h2>
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Quiz: Basic Concepts</h3>
                          <span className="text-xs bg-green-100 text-secondary px-2 py-1 rounded-full">10 questions</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Test your understanding of the fundamental concepts</p>
                        <Button variant="outline" size="sm">Start Quiz</Button>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Interactive Experiment</h3>
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">Simulation</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Conduct a virtual experiment to observe reactions and outcomes</p>
                        <Button variant="outline" size="sm">Launch Experiment</Button>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Problem Set</h3>
                          <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">5 problems</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Solve practical problems applying the module concepts</p>
                        <Button variant="outline" size="sm">View Problems</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="resources" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
                    <div className="space-y-4">
                      <div className="border rounded-md p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Reference Guide</h3>
                          <p className="text-sm text-gray-600">Complete reference sheet for formulas and key concepts</p>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                      
                      <div className="border rounded-md p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Lab Worksheet</h3>
                          <p className="text-sm text-gray-600">Printable worksheet for hands-on experiments</p>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                      
                      <div className="border rounded-md p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Additional Reading</h3>
                          <p className="text-sm text-gray-600">Supplementary material for deeper understanding</p>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Module Not Found</h2>
            <p className="text-gray-600">The module you're looking for doesn't exist or has been removed.</p>
            <Button 
              className="mt-6 bg-primary text-white"
              onClick={() => navigate('/modules')}
            >
              Browse All Modules
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ModuleDetail;
