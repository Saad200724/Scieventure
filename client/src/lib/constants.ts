// Color constants
export const COLORS = {
  primary: '#2563EB',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#F3F4F6',
  textDark: '#1F2937',
};

// Subject tags and their colors
export const SUBJECT_TAGS = {
  'Biology': {
    bgColor: 'bg-green-100',
    textColor: 'text-secondary',
  },
  'Chemistry': {
    bgColor: 'bg-blue-100',
    textColor: 'text-primary',
  },
  'Physics': {
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
  },
  'Mathematics': {
    bgColor: 'bg-red-100',
    textColor: 'text-red-600',
  },
  'Environmental Science': {
    bgColor: 'bg-green-100',
    textColor: 'text-secondary',
  },
  'Astronomy': {
    bgColor: 'bg-blue-100',
    textColor: 'text-primary',
  },
};

// Achievement type icons
export const ACHIEVEMENT_ICONS = {
  quiz: 'check-circle',
  streak: 'zap',
  completion: 'award',
  collaboration: 'users',
  milestone: 'star',
};

// Nav menu items with translation keys
export const NAV_ITEMS = [
  { labelEn: 'Home', labelBn: 'হোম', path: '/' },
  { labelEn: 'Modules', labelBn: 'মডিউল', path: '/modules' },
  { labelEn: 'Projects', labelBn: 'প্রকল্প', path: '/projects' },
  { labelEn: 'Community', labelBn: 'কমিউনিটি', path: '/community' },
  { labelEn: 'Resources', labelBn: 'সংস্থান', path: '/resources' },
];

// Language options
export const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'বাংলা', value: 'bn' },
];

// Routes for authenticated and unauthenticated users
export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  modules: '/modules',
  moduleDetail: '/modules/:id',
  projects: '/projects',
  projectDetail: '/projects/:id',
  resources: '/resources',
  aiAssistant: '/ai-assistant',
  community: '/community',
  profile: '/profile',
  login: '/login',
  register: '/register',
};

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  { level: 1, label: 'Beginner' },
  { level: 2, label: 'Intermediate' },
  { level: 3, label: 'Advanced' },
  { level: 4, label: 'Expert' },
];

// Default avatar placeholder
export const DEFAULT_AVATAR = 'https://avatar.vercel.sh/sciencebridge?size=32';
