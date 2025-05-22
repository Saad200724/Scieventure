import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import sciVentureLogo from '@assets/SciVenture.png';
import heroImage from '@assets/Landing_HeroSection.jpg';

const Landing: React.FC = () => {
  React.useEffect(() => {
    document.title = "SciVenture - Bridging Science Education";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header for Landing */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={sciVentureLogo} 
              alt="SciVenture Logo" 
              className="h-12 w-auto" 
            />
          </div>
          <div>
            <Button asChild variant="outline" className="mr-2">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-b from-primary/90 to-primary">
          <div className="absolute inset-0 bg-grid-white/20 opacity-20"></div>
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
                  Transforming Science Education
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 md:mb-8 max-w-lg">
                  Discover interactive learning modules, collaborate on projects, and get AI assistance on your educational journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-medium shadow-md">
                    <Link href="/login">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-medium shadow-md">
                    <Link href="#features">Learn More</Link>
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                SciVenture provides a comprehensive platform to enhance science education through technology
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-6xl">
              {/* Feature 1 */}
              <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Learning Modules</h3>
                <p className="text-gray-600">
                  Engage with comprehensive learning modules across various science subjects, designed for different educational levels.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborative Projects</h3>
                <p className="text-gray-600">
                  Work together with peers on science projects, share findings, and learn through practical application and experimentation.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Learning Assistant</h3>
                <p className="text-gray-600">
                  Get personalized help from our AI assistant that simplifies complex scientific concepts and provides adaptive learning support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Begin Your Science Journey?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join SciVenture today and discover a new way to learn and engage with science education
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-medium shadow-md">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-medium shadow-md">
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer for Landing */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About SciVenture</h3>
              <p className="text-gray-400">
                Bridging the science education gap through interactive learning, collaboration, and AI assistance.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} SciVenture. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;