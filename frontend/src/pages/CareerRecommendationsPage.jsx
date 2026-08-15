import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lightbulb, Filter, BookOpen, ExternalLink, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { useAnalysis } from '../context/AnalysisContext';

const ALL_DOMAINS = ['All', 'Technology', 'Healthcare', 'Finance', 'Business', 'Design', 'Education', 'Research', 'Marketing', 'Legal', 'Engineering'];

const FIT_CONFIG = {
  'Strong Fit': {
    icon: '🟢',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    highlight: 'border-l-emerald-500',
    label: 'Strong Fit',
  },
  'Good Fit — Some Skills Needed': {
    icon: '🟡',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    highlight: 'border-l-amber-500',
    label: 'Good Fit — Some Skills Needed',
  },
  'Possible Career — Needs Preparation': {
    icon: '🔵',
    bg: 'bg-sky-50',
    border: 'border-sky-300',
    badge: 'bg-sky-100 text-sky-800 border-sky-300',
    highlight: 'border-l-sky-500',
    label: 'Possible Career — Needs Preparation',
  },
};

const DOMAIN_EMOJIS = {
  Technology: '💻', Healthcare: '🏥', Finance: '💰', 'Finance & Banking': '💰',
  Business: '📊', 'Business & Management': '📊', Design: '🎨', 'Design & Creative': '🎨',
  Education: '🎓', 'Education & Teaching': '🎓', Research: '🔬', 'Research & Science': '🔬',
  Marketing: '📣', 'Marketing & Media': '📣', Legal: '⚖️', 'Legal & Compliance': '⚖️',
  Engineering: '⚙️', General: '🌐',
};

// Fallback qualitative careers if no analysis
const FALLBACK_CAREERS = [
  {
    career: 'Backend Developer', domain: 'Technology',
    fit_category: 'Strong Fit', fit_icon: '🟢',
    why_suitable: ['Programming foundation aligns with server-side development', 'Database knowledge is essential for backend work'],
    skills_you_have: ['Programming', 'Databases', 'REST APIs'],
    skills_to_improve: ['Docker', 'Redis', 'System Design'],
    next_steps: ['Build a REST API project', 'Learn containerisation with Docker', 'Contribute to an open source project'],
  },
  {
    career: 'Data Analyst', domain: 'Technology',
    fit_category: 'Good Fit — Some Skills Needed', fit_icon: '🟡',
    why_suitable: ['Analytical thinking transfers directly to data work', 'Database experience is valuable for querying data'],
    skills_you_have: ['SQL', 'Analytical Thinking', 'Excel'],
    skills_to_improve: ['Python', 'Tableau', 'Statistics', 'Power BI'],
    next_steps: ['Complete a data analysis certificate', 'Build a Tableau dashboard', 'Learn Python Pandas'],
  },
  {
    career: 'Business Analyst', domain: 'Business',
    fit_category: 'Good Fit — Some Skills Needed', fit_icon: '🟡',
    why_suitable: ['Problem-solving and communication skills are core to this role', 'Technical background helps bridge business and IT teams'],
    skills_you_have: ['Communication', 'Problem Solving', 'Documentation'],
    skills_to_improve: ['Requirements Gathering', 'Process Mapping', 'JIRA', 'Stakeholder Management'],
    next_steps: ['Get CBAP or PMI-PBA certification', 'Practice process flow diagrams', 'Shadow a BA in a project'],
  },
];

export default function CareerRecommendationsPage() {
  const navigate = useNavigate();
  const { analysis } = useAnalysis();
  const [loading, setLoading] = useState(true);
  const [activeDomain, setActiveDomain] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const detectedDomain = analysis?.career_domain || 'General';

  // Use AI career_fits if available, else fallback
  const allCareers = analysis?.career_fits?.length > 0
    ? analysis.career_fits
    : FALLBACK_CAREERS;

  const getDomainKey = (d) => {
    const map = { 'Finance & Banking': 'Finance', 'Business & Management': 'Business', 'Design & Creative': 'Design', 'Education & Teaching': 'Education', 'Research & Science': 'Research', 'Marketing & Media': 'Marketing', 'Legal & Compliance': 'Legal' };
    return map[d] || d;
  };

  const filtered = activeDomain === 'All'
    ? allCareers
    : allCareers.filter(c => getDomainKey(c.domain) === activeDomain || c.domain === activeDomain);

  const aiInsights = analysis?.ai_insights || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="text-indigo-600" size={28} /> Career Pathways
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            AI-recommended careers based on your {detectedDomain !== 'General' ? <strong>{detectedDomain}</strong> : 'profile'} background and skills.
          </p>
        </div>
        <Button onClick={() => navigate('/career-discovery')} variant="secondary">
          Try Career Discovery →
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
        <span className="text-slate-500">Fit Categories:</span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800">🟢 Strong Fit</span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800">🟡 Good Fit — Some Skills Needed</span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-300 text-sky-800">🔵 Possible Career — Needs Preparation</span>
      </div>

      {/* Domain filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter size={16} className="text-slate-400 shrink-0" />
        {ALL_DOMAINS.map(domain => (
          <button
            key={domain}
            onClick={() => setActiveDomain(domain)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${activeDomain === domain ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {DOMAIN_EMOJIS[domain] ? `${DOMAIN_EMOJIS[domain]} ` : ''}{domain}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Career cards */}
        <div className="lg:col-span-2 space-y-5">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton variant="text" width="50%" height={28} className="mb-3" />
                <Skeleton variant="text" width="100%" className="mb-2" />
                <Skeleton variant="text" width="80%" />
              </Card>
            ))
          ) : filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-slate-500">No career paths found for "{activeDomain}". Try "All" to see all recommendations.</p>
            </Card>
          ) : (
            filtered.map((rec, idx) => {
              const cfg = FIT_CONFIG[rec.fit_category] || FIT_CONFIG['Possible Career — Needs Preparation'];
              const emoji = DOMAIN_EMOJIS[rec.domain] || '🌐';
              const isExpanded = expandedId === idx;
              const isFirst = idx === 0 && activeDomain === 'All';

              return (
                <Card
                  key={idx}
                  className={`p-0 overflow-hidden border-2 transition-all duration-300 ${cfg.border} ${isFirst ? 'shadow-lg' : ''}`}
                >
                  {/* Fit color bar */}
                  <div className={`h-1 w-full ${cfg.badge.split(' ')[0].replace('bg-', 'bg-').replace('100', '400')}`} />

                  <div className={`p-6 ${cfg.bg}`}>
                    {/* Header row */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-xl">{emoji}</span>
                          <h2 className="text-xl font-bold text-slate-900">{rec.career}</h2>
                          {isFirst && (
                            <span className="text-[10px] font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-2 py-0.5 rounded-full">⭐ Top Match</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{rec.domain}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-extrabold ${cfg.badge}`}>
                        {rec.fit_icon || cfg.icon} {cfg.label}
                      </span>
                    </div>

                    {/* Why suitable */}
                    {rec.why_suitable?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-bold text-slate-700 mb-1.5">Why this fits you:</p>
                        <ul className="space-y-1">
                          {rec.why_suitable.map((reason, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                              <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" /> {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Skills grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {rec.skills_you_have?.length > 0 && (
                        <div className="bg-white/60 rounded-xl p-3 border border-emerald-200">
                          <p className="text-[11px] font-extrabold text-emerald-700 mb-2">✅ You already have:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {rec.skills_you_have.map(s => (
                              <span key={s} className="px-2 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-lg text-[11px] font-semibold">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {rec.skills_to_improve?.length > 0 && (
                        <div className="bg-white/60 rounded-xl p-3 border border-amber-200">
                          <p className="text-[11px] font-extrabold text-amber-700 mb-2">⚠️ Skills to develop:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {rec.skills_to_improve.map(s => (
                              <span key={s} className="px-2 py-0.5 bg-amber-100 border border-amber-200 text-amber-900 rounded-lg text-[11px] font-semibold">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expandable next steps */}
                    {isExpanded && rec.next_steps?.length > 0 && (
                      <div className="bg-white/70 rounded-xl p-4 border border-slate-200 mb-4">
                        <p className="text-xs font-extrabold text-indigo-700 mb-2">📍 Next Steps:</p>
                        <ol className="space-y-1.5">
                          {rec.next_steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                              <span className="font-extrabold text-indigo-500 shrink-0">{i + 1}.</span> {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2 border-t border-white/40 flex-wrap">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : idx)}
                        className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
                      >
                        <BookOpen size={13} />
                        {isExpanded ? 'Hide steps ↑' : 'View next steps ↓'}
                      </button>
                      <Button onClick={() => navigate('/roadmap')} size="sm" variant={isFirst ? 'primary' : 'secondary'}>
                        Build Roadmap <ArrowRight size={13} />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* AI Insights */}
          <Card className="p-6 bg-gradient-to-br from-indigo-900 to-violet-950 text-white">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-indigo-200">
              <Lightbulb className="text-amber-400" size={20} /> AI Career Intelligence
            </h3>
            <div className="space-y-3">
              {loading ? <Skeleton variant="rectangular" height={80} /> : (
                aiInsights.length > 0
                  ? aiInsights.slice(0, 3).map((insight, i) => (
                    <p key={i} className="text-xs text-slate-200 leading-relaxed p-3 bg-white/10 border border-white/10 rounded-xl">{insight}</p>
                  ))
                  : [
                      'Qualitative career guidance helps you understand your real strengths — not an arbitrary number.',
                      'Strong Fit careers often require just one or two additional skills or certifications.',
                      'A career shift from Possible to Strong Fit typically takes 3–6 months of focused learning.',
                    ].map((t, i) => <p key={i} className="text-xs text-slate-200 leading-relaxed p-3 bg-white/10 border border-white/10 rounded-xl">{t}</p>)
              )}
            </div>
          </Card>

          {/* CTA — Career Discovery */}
          <Card className="p-5 border-2 border-indigo-200 bg-indigo-50">
            <p className="font-bold text-indigo-900 text-sm mb-2">Explore by your skills</p>
            <p className="text-xs text-indigo-700 mb-3">Enter your skills directly and see which careers you qualify for — no resume needed.</p>
            <Button onClick={() => navigate('/career-discovery')} fullWidth size="sm">
              Launch Career Discovery →
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
