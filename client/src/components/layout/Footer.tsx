import React from 'react';
import { Link } from 'wouter';
import { NAV_ITEMS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import sciVentureLogo from '@assets/SciVenture.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 md:py-10">
      <div className="container mx-auto px-4">
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 xs:col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center mb-3 md:mb-4">
              <img 
                src={sciVentureLogo} 
                alt="SciVenture Logo" 
                className="h-12 w-auto sm:h-14" 
              />
            </div>
            <p className="text-gray-300 text-xs sm:text-sm mb-3 md:mb-4 max-w-xs">
              Bridging the science education gap between urban and rural students in Bangladesh through interactive learning, collaboration, and AI assistance.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <div className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors duration-200 cursor-pointer">
                      {item.label}
                    </div>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/ai-assistant">
                  <div className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors duration-200 cursor-pointer">
                    AI Assistant
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Subjects */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Subjects</h3>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-1 sm:gap-y-2">
              <li><div onClick={() => window.location.href='#'} className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors duration-200 cursor-pointer">Biology</div></li>
              <li><div onClick={() => window.location.href='#'} className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors duration-200 cursor-pointer">Chemistry</div></li>
              <li><div onClick={() => window.location.href='#'} className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors duration-200 cursor-pointer">Physics</div></li>
              <li><div onClick={() => window.location.href='#'} className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors duration-200 cursor-pointer">Mathematics</div></li>
              <li><div onClick={() => window.location.href='#'} className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors duration-200 cursor-pointer">Environment</div></li>
              <li><div onClick={() => window.location.href='#'} className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors duration-200 cursor-pointer">Astronomy</div></li>
            </ul>
          </div>
          
          {/* Contact Us */}
          <div className="col-span-1 xs:col-span-2 sm:col-span-2 md:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-xs sm:text-sm">Science Building, Dhaka University, Dhaka 1000, Bangladesh</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 text-xs sm:text-sm">contact@sciencebridge.bd</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 text-xs sm:text-sm">+880 2 123 4567</span>
              </li>
            </ul>
            
            {/* Newsletter Subscription */}
            <div className="mt-3 sm:mt-4">
              <h4 className="text-xs sm:text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
              <div className="flex w-full max-w-xs">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm bg-gray-700 border border-gray-600 rounded-l-md focus:outline-none focus:border-primary text-white w-full"
                />
                <Button className="bg-primary hover:bg-blue-700 text-white px-2 sm:px-4 rounded-r-md text-xs sm:text-sm transition whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6 flex flex-col xs:flex-row justify-between items-center">
          <p className="text-xs sm:text-sm text-gray-400 mb-3 xs:mb-0">&copy; 2025 SciVenture. All rights reserved.</p>
          <div className="flex flex-wrap justify-center xs:justify-end gap-4 text-xs sm:text-sm">
            <div onClick={() => window.location.href='#'} className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Privacy Policy</div>
            <div onClick={() => window.location.href='#'} className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Terms of Service</div>
            <div onClick={() => window.location.href='#'} className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">Cookie Policy</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
