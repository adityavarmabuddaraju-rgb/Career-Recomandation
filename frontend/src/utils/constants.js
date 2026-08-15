import { 
  LayoutDashboard, 
  BrainCircuit, 
  Compass,
  GitCompare,
  Bookmark,
  User, 
  Settings,
  Sparkles,
  Target,
  BookOpen,
} from 'lucide-react';

export const APP_NAME = 'CareerAI';

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Career Assessment', path: '/career-assessment', icon: Sparkles },
  { label: 'Career Explorer', path: '/career-explorer', icon: Compass },
  { label: 'Compare Careers', path: '/compare-careers', icon: GitCompare },
  { label: 'My Skills', path: '/my-skills', icon: BrainCircuit },
  { label: 'My Careers', path: '/my-careers', icon: Bookmark },
  { label: 'Profile', path: '/profile', icon: User },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const FEATURE_CARDS = [
  { icon: BrainCircuit, title: 'What am I eligible for?', description: 'Enter your current skills. AI recommends careers across all domains — Technology, Design, Finance, Healthcare, and more.' },
  { icon: Target, title: 'I want this career', description: 'Select your target career. Get a personalized roadmap from beginner stage, interview prep, and time-aware project plans.' },
  { icon: Compass, title: 'Explore 120+ Careers', description: 'Browse careers across 10 domains. Filter by category, education, experience, and work type.' },
  { icon: BookOpen, title: 'Detailed Career Profiles', description: 'Every career has full skill breakdowns, tools, responsibilities, and a learning roadmap.' },
];

export const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
