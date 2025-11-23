import React, { useState } from 'react';
import { Link } from 'wouter';
import { NAV_ITEMS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import sciVentureLogo from '@assets/SciVenture.png';
import { useToast } from '@/hooks/use-toast';

const Footer: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Please enter your email",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail('');
      toast({
        title: "Subscribed successfully",
        description: "Check your email for confirmation",
      });
    }, 1000);
  };

  const SocialLink = ({ icon: Icon, href }: { icon: React.ReactNode; href: string }) => (
    <a 
      href={href} 
      className="h-10 w-10 rounded-full bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
    >
      {Icon}
    </a>
  );

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Decorative background gradient */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Top Newsletter Section */}
        <div className="border-b border-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Stay Updated</h2>
              <p className="text-gray-300 text-sm md:text-base mb-6">
                Get the latest science learning resources, updates, and exclusive content delivered to your inbox.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex gap-2 backdrop-blur-sm">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-blue-400/50 transition-all"
                />
                <Button 
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
                >
                  {isSubscribing ? 'Subscribing...' : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <img 
                  src={sciVentureLogo} 
                  alt="SciVenture Logo" 
                  className="h-14 w-auto hover:scale-105 transition-transform" 
                />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-xs">
                Bridging the science education gap between urban and rural students through interactive learning, collaboration, and AI-powered assistance.
              </p>
              <div className="flex gap-3">
                <SocialLink icon={<Facebook className="h-5 w-5 text-blue-400" />} href="#" />
                <SocialLink icon={<Twitter className="h-5 w-5 text-blue-400" />} href="#" />
                <SocialLink icon={<Instagram className="h-5 w-5 text-blue-400" />} href="#" />
                <SocialLink icon={<Linkedin className="h-5 w-5 text-blue-400" />} href="#" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6 pb-3 border-b border-white/10">Quick Links</h3>
              <ul className="space-y-3">
                {NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path}>
                      <div className="text-gray-300 hover:text-white text-sm transition-colors duration-200 cursor-pointer hover:translate-x-1 transform transition-transform">
                        {item.label}
                      </div>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/ai-assistant">
                    <div className="text-gray-300 hover:text-white text-sm transition-colors duration-200 cursor-pointer hover:translate-x-1 transform transition-transform">
                      AI Assistant
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Subjects */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6 pb-3 border-b border-white/10">Subjects</h3>
              <ul className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Biology', href: '#' },
                  { label: 'Chemistry', href: '#' },
                  { label: 'Physics', href: '#' },
                  { label: 'Mathematics', href: '#' },
                  { label: 'Environment', href: '#' },
                  { label: 'Astronomy', href: '#' }
                ].map((subject) => (
                  <div 
                    key={subject.label}
                    onClick={() => window.location.href = subject.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200 cursor-pointer hover:translate-x-1 transform transition-transform"
                  >
                    {subject.label}
                  </div>
                ))}
              </ul>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6 pb-3 border-b border-white/10">Contact</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">Science Building, Dhaka University, Bangladesh</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm hover:text-white transition-colors cursor-pointer">contact@sciencebridge.bd</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm hover:text-white transition-colors cursor-pointer">+880 2 123 4567</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Divider */}
          <div className="border-t border-white/10 my-8"></div>

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">&copy; 2025 SciVenture. All rights reserved.</p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <div onClick={() => window.location.href='#'} className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Privacy Policy</div>
              <div onClick={() => window.location.href='#'} className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Terms of Service</div>
              <div onClick={() => window.location.href='#'} className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Cookie Policy</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
