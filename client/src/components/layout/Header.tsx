import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { NAV_ITEMS, LANGUAGE_OPTIONS } from '@/lib/constants';
import { useTheme } from '@/providers/ThemeProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { BadgeIcon } from '@/components/ui/badge-icon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Menu, Bell, Sun, Moon, X } from 'lucide-react';
import sciVentureLogo from '@assets/SciVenture.png';
import { supabase, getUser } from '@/lib/supabase';

const Header: React.FC = () => {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  
  // Get the user info from Supabase
  useEffect(() => {
    // First try to get from localStorage for faster loading
    const storedSession = localStorage.getItem('supabase_session');
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        if (sessionData && sessionData.user) {
          setSupabaseUser(sessionData.user);
        }
      } catch (e) {
        console.error('Error parsing stored session:', e);
      }
    }
    
    // Then fetch the current user
    async function fetchUser() {
      const user = await getUser();
      if (user) {
        setSupabaseUser(user);
      }
    }
    
    fetchUser();
  }, []);
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex flex-wrap justify-between items-center relative">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img 
                src={sciVentureLogo} 
                alt="SciVenture Logo" 
                className="h-8 w-auto sm:h-10 md:h-12" 
              />
            </div>
          </Link>
        </div>
        
        {/* Mobile Menu Button - Only visible on mobile */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden menu-button ml-1"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-gray-800 dark:text-gray-200" />
          ) : (
            <Menu className="h-5 w-5 text-gray-800 dark:text-gray-200" />
          )}
        </Button>
        
        {/* Navigation Links */}
        <div 
          className={`mobile-menu w-full md:w-auto ${
            mobileMenuOpen 
              ? 'flex flex-col absolute top-14 left-0 right-0 bg-white dark:bg-gray-800 shadow-md p-4 z-50 space-y-3 border-t border-gray-200 dark:border-gray-700' 
              : 'hidden'
          } md:flex md:items-center md:static md:p-0 md:shadow-none md:space-y-0 md:border-none`}
        >
          <nav className="md:flex md:items-center md:space-x-1 lg:space-x-4 w-full md:w-auto">
            {NAV_ITEMS.map((item) => (
              <div key={item.path} className="nav-item">
                <Link href={item.path}>
                  <div className={`block py-2 px-2 md:py-1 md:px-2 text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-primary font-medium text-sm md:text-base text-center md:text-left transition-colors duration-200 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    location === item.path ? 'text-primary dark:text-primary bg-gray-100 dark:bg-gray-700' : ''
                  }`}>
                    {item.label}
                  </div>
                </Link>
              </div>
            ))}
          </nav>
        </div>
        
        {/* User Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Theme Toggle - Only shown on pages that support theme switching */}
          {location !== '/' && location !== '/login' && location !== '/register' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-1"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4 sm:h-5 sm:w-5" /> : <Sun className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          )}
          
          {/* Language Dropdown - Simplified */}
          <Button variant="ghost" size="sm" className="p-1">
            <span className="text-xs sm:text-sm font-medium">EN</span>
          </Button>
          
          {/* User Avatar */}
          <Link href="/dashboard">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs sm:text-sm font-semibold cursor-pointer">
              {supabaseUser?.user_metadata?.full_name ? 
                supabaseUser.user_metadata.full_name.charAt(0).toUpperCase() : 
                'S'}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
