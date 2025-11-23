import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { NAV_ITEMS, LANGUAGE_OPTIONS } from '@/lib/constants';
import { useTheme } from '@/providers/ThemeProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { BadgeIcon } from '@/components/ui/badge-icon';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/ui/language-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Menu, Bell, Sun, Moon, X, LogOut, LayoutDashboard, Wifi } from 'lucide-react';
import sciVentureLogo from '@assets/SciVenture.png';
import { supabase, getUser } from '@/lib/supabase';

const Header: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
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
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('supabase_session');
    setLocation('/');
    setProfileMenuOpen(false);
  };
  
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
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex justify-between items-center relative">
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
        
        {/* Navigation Links - Desktop only */}
        <div className="hidden md:flex md:items-center md:flex-1 md:justify-center">
          <nav className="md:flex md:items-center md:space-x-1 lg:space-x-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.path} className="nav-item">
                <Link href={item.path}>
                  <div className={`block py-2 px-2 md:py-1 md:px-2 text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-primary font-medium text-sm md:text-base text-center md:text-left transition-colors duration-200 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    location === item.path ? 'text-primary dark:text-primary bg-gray-100 dark:bg-gray-700' : ''
                  }`}>
                    {t(item.labelEn, item.labelBn)}
                  </div>
                </Link>
              </div>
            ))}
          </nav>
        </div>
        
        {/* User Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Theme Toggle - Desktop only, shown on pages that support theme switching */}
          {location !== '/' && location !== '/login' && location !== '/register' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-1 hidden sm:inline-flex"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4 sm:h-5 sm:w-5" /> : <Sun className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          )}
          
          {/* User Avatar - Desktop with Profile Dropdown */}
          <DropdownMenu open={profileMenuOpen} onOpenChange={setProfileMenuOpen}>
            <DropdownMenuTrigger asChild className="hidden sm:block">
              <button 
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs sm:text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                data-testid="button-profile"
              >
                {supabaseUser?.user_metadata?.full_name ? 
                  supabaseUser.user_metadata.full_name.charAt(0).toUpperCase() : 
                  'S'}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { setLocation('/dashboard'); setProfileMenuOpen(false); }} data-testid="button-profile-dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setLocation('/offline-content'); setProfileMenuOpen(false); }} data-testid="button-profile-offline">
                <Wifi className="mr-2 h-4 w-4" />
                <span>Offline Content</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Layout: Language, Profile, Menu (rightmost) */}
          {/* Language Toggle - Mobile visible */}
          <div className="md:hidden">
            <LanguageToggle className="p-1" />
          </div>
          
          {/* User Avatar - Mobile with Profile Dropdown */}
          <DropdownMenu open={profileMenuOpen} onOpenChange={setProfileMenuOpen}>
            <DropdownMenuTrigger asChild className="md:hidden">
              <button 
                className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                data-testid="button-profile-mobile"
              >
                {supabaseUser?.user_metadata?.full_name ? 
                  supabaseUser.user_metadata.full_name.charAt(0).toUpperCase() : 
                  'S'}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { setLocation('/dashboard'); setProfileMenuOpen(false); }} data-testid="button-profile-dashboard-mobile">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setLocation('/offline-content'); setProfileMenuOpen(false); }} data-testid="button-profile-offline-mobile">
                <Wifi className="mr-2 h-4 w-4" />
                <span>Offline Content</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} data-testid="button-logout-mobile">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button - Rightmost */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden menu-button p-1"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            ) : (
              <Menu className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            )}
          </Button>

          {/* Language Toggle - Desktop visible */}
          <div className="hidden md:inline-flex">
            <LanguageToggle className="p-1" />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu md:hidden bg-white dark:bg-gray-800 shadow-md border-t border-gray-200 dark:border-gray-700">
          <nav className="flex flex-col space-y-1 p-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.path} className="nav-item">
                <Link href={item.path}>
                  <div className={`block py-2 px-2 text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-primary font-medium text-sm transition-colors duration-200 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    location === item.path ? 'text-primary dark:text-primary bg-gray-100 dark:bg-gray-700' : ''
                  }`}>
                    {t(item.labelEn, item.labelBn)}
                  </div>
                </Link>
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
