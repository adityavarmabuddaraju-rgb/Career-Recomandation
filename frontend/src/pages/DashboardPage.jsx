import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles, Target, BrainCircuit, Compass, BookOpen,
  Bookmark, ChevronRight, TrendingUp, Star, Plus, Loader2, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { skillsService } from '../services/skillsService';
import { careerService } from '../services/careerService';

const QUICK_ACTIONS = [
  {
    id: 'discover',
    icon: BrainCircuit,
    title: 'What am I eligible for?',
    subtitle: 'Enter your current skills. AI recommends suitable careers across all domains.',
    cta: 'Explore My Career Fits',
    href: '/career-assessment?mode=1',
    gradient: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    id: 'target',
    icon: Target,
    title: 'I want this career',
    subtitle: 'Choose your target career and get a personalized step-by-step learning roadmap.',
    cta: 'Build My Roadmap',
    href: '/career-assessment?mode=2',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    iconColor: 'text-violet-600',
  },
];

function SkeletonCard() {
  return (
    <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [mySkills, setMySkills] = useState([]);
  const [savedCareers, setSavedCareers] = useState([]);
  const [featuredCareers, setFeaturedCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, careersRes, featuredRes] = await Promise.allSettled([
          skillsService.getMySkills(),
          skillsService.getSavedCareers(),
          careerService.getDatabase(),
        ]);

        if (skillsRes.status === 'fulfilled') setMySkills(skillsRes.value?.skills || []);
        if (careersRes.status === 'fulfilled') setSavedCareers(careersRes.value?.careers || []);
        if (featuredRes.status === 'fulfilled') {
          const all = Array.isArray(featuredRes.value) ? featuredRes.value : (featuredRes.value?.careers || []);
          setFeaturedCareers(all.slice(0, 6));
        }
      } catch (e) {
        // non-critical
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const CATEGORY_COLORS = {
    'Technology & Software': 'bg-blue-100 text-blue-700',
    'Design & Creative': 'bg-pink-100 text-pink-700',
    'Business & Management': 'bg-amber-100 text-amber-700',
    'Marketing & Media': 'bg-orange-100 text-orange-700',
    'Finance & Accounting': 'bg-emerald-100 text-emerald-700',
    'Healthcare & Life Sciences': 'bg-red-100 text-red-700',
    'Education & Research': 'bg-purple-100 text-purple-700',
    'Engineering': 'bg-cyan-100 text-cyan-700',
    'Government & Public Sector': 'bg-teal-100 text-teal-700',
    'Law & Professional Services': 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>AI Career Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">What would you like to do today?</p>
        </div>
        <Link
          to="/career-explorer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:border-indigo-300 hover:text-indigo-700 transition-colors shadow-sm"
        >
          <Compass className="w-4 h-4" /> Explore Careers
        </Link>
      </div>

      {/* ── Quick Action Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => navigate(action.href)}
              className={`${action.bg} border ${action.border} rounded-2xl p-6 text-left hover:shadow-md transition-all duration-200 group`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${action.gradient} shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{action.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{action.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 mt-1 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className={`mt-4 inline-flex items-center gap-1.5 text-xs font-semibold ${action.iconColor}`}>
                {action.cta} <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Body Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Skills */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-500" /> My Skills
            </h2>
            <Link to="/my-skills" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
              Manage →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2"><SkeletonCard /><SkeletonCard /></div>
          ) : mySkills.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-slate-500 mb-3">No skills added yet.</p>
              <Link
                to="/my-skills"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Your First Skill
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {mySkills.slice(0, 12).map((skill) => (
                <span
                  key={typeof skill === 'string' ? skill : skill.name}
                  className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-xs font-medium"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                  {skill.level && (
                    <span className="ml-1 text-indigo-400 font-normal">· {skill.level}</span>
                  )}
                </span>
              ))}
              {mySkills.length > 12 && (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs">
                  +{mySkills.length - 12} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Saved Careers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-violet-500" /> Saved Careers
            </h2>
            <Link to="/my-careers" className="text-xs font-medium text-violet-600 hover:text-violet-700">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2"><SkeletonCard /><SkeletonCard /></div>
          ) : savedCareers.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-slate-500 mb-3">No saved careers yet.</p>
              <Link
                to="/career-explorer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-2 rounded-lg hover:bg-violet-100 transition-colors"
              >
                <Compass className="w-3.5 h-3.5" /> Browse Careers
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {savedCareers.slice(0, 5).map((career, i) => (
                <Link
                  key={i}
                  to={`/career/${career.slug || career.career_slug}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-violet-50 border border-transparent hover:border-violet-200 transition-all group"
                >
                  <span className="text-sm font-medium text-slate-700 group-hover:text-violet-700">
                    {career.career_name || career.name}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-400" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Career Explorer', href: '/career-explorer', desc: 'Browse 120+ careers', icon: Compass },
              { label: 'Compare Careers', href: '/compare-careers', desc: 'Side-by-side comparison', icon: Star },
              { label: 'My Skills', href: '/my-skills', desc: 'Manage your skills', icon: BrainCircuit },
              { label: 'Career Assessment', href: '/career-assessment', desc: 'Get AI recommendations', icon: Target },
              { label: 'Profile', href: '/profile', desc: 'Update your information', icon: BookOpen },
            ].map(({ label, href, desc, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 leading-none">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured Careers ── */}
      {featuredCareers.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Explore Careers</h2>
            <Link to="/career-explorer" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
              View all 120+ →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredCareers.map((career, i) => (
              <Link
                key={i}
                to={`/career/${career.slug}`}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug">
                    {career.name}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
                    CATEGORY_COLORS[career.category] || 'bg-slate-100 text-slate-600'
                  }`}>
                    {career.category?.split(' ')[0]}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{career.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {career.required_skills?.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">{s}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
