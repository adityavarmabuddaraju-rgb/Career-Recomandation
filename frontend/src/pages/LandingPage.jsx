import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, BrainCircuit, Target, TrendingUp, Map, Award, CheckCircle2, Zap, Compass, Code, Briefcase, Rocket } from 'lucide-react';
import { Button } from '../components/ui/Button';

const CAREER_DOMAINS = [
  { emoji: '💻', name: 'Technology', desc: 'Software, Data, AI, Cyber, Cloud, DevOps' },
  { emoji: '🏥', name: 'Healthcare', desc: 'Nursing, Medicine, Clinical, Admin' },
  { emoji: '💰', name: 'Finance & Banking', desc: 'Investment, Financial Analysis, Accounting' },
  { emoji: '📊', name: 'Business & Analytics', desc: 'Business Analysis, Operations, Strategy' },
  { emoji: '🎨', name: 'Design & Creative', desc: 'UX/UI, Product Design, Graphic' },
  { emoji: '🎓', name: 'Education & EdTech', desc: 'Teaching, EdTech, Instructional Design' },
  { emoji: '🔬', name: 'Research & Science', desc: 'Data Science, R&D, Lab Research' },
  { emoji: '📣', name: 'Marketing & Media', desc: 'Digital Marketing, Content, Analytics' },
];

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 bg-slate-950/90 backdrop-blur-md z-50 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              Career<span className="text-indigo-400">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Header ── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> AI Career Roadmap & Personalized Skill Planner
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-5xl mx-auto leading-[1.1]">
          AI Career Roadmap
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          Discover the right career path and build the skills, time-aware projects, and interview preparation you need.
        </p>

        {/* ── TWO MAIN CHOICES ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16 text-left">
          {/* Choice 1: I HAVE SKILLS */}
          <div
            onClick={() => navigate('/career-discovery?mode=1')}
            className="group cursor-pointer p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900 shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-6 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors">
              <BrainCircuit className="w-24 h-24 -mr-6 -mt-6" />
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 block mb-1">Option 1</span>
              <h2 className="text-2xl font-extrabold text-white mb-3 flex items-center justify-between">
                I HAVE SKILLS
                <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1.5 transition-transform" />
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Enter the skills you currently know. AI will analyze them and recommend suitable career roles, missing prerequisites, next steps, and realistic projects.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-300 font-bold">
              <span>Enter your skills →</span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">No percentages</span>
            </div>
          </div>

          {/* Choice 2: I WANT A CAREER */}
          <div
            onClick={() => navigate('/career-discovery?mode=2')}
            className="group cursor-pointer p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-violet-500/60 hover:bg-slate-900 shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-6 text-violet-500/20 group-hover:text-violet-500/40 transition-colors">
              <Target className="w-24 h-24 -mr-6 -mt-6" />
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-violet-400 block mb-1">Option 2</span>
              <h2 className="text-2xl font-extrabold text-white mb-3 flex items-center justify-between">
                I WANT A CAREER
                <ArrowRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1.5 transition-transform" />
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Select your target career (Software Dev, AI/ML, Data Analyst, Cloud, etc.). Get a personalized roadmap from beginner stage, interview prep, and time-aware project plans.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-violet-300 font-bold">
              <span>Select target career →</span>
              <span className="px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">Beginner to Advanced</span>
            </div>
          </div>
        </div>

        {/* Guarantees */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-400 border-t border-slate-800/80 pt-10">
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero fake score percentages</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Time-aware project planning (1 week to 6 months)</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Complete interview preparation & resume bullets</span>
        </div>
      </section>

      {/* ── Domains Supported ── */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Supported Career Pathways</h2>
            <p className="text-sm text-slate-400">Tailored roadmaps with prerequisites enforced for every field.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CAREER_DOMAINS.map((domain) => (
              <div key={domain.name} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-colors">
                <div className="text-2xl mb-2">{domain.emoji}</div>
                <h3 className="font-bold text-white text-xs mb-0.5">{domain.name}</h3>
                <p className="text-[11px] text-slate-400">{domain.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-10 text-center text-xs text-slate-500">
        <p>© 2024 AI Career Roadmap. All rights reserved.</p>
      </footer>
    </div>
  );
};
