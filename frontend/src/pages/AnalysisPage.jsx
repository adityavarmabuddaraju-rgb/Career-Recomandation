import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, BookOpen, Lightbulb, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { useAnalysis } from '../context/AnalysisContext';

const READINESS_CONFIG = {
  'Nearly Job Ready': {
    icon: '🟢',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  'Building the Required Skills': {
    icon: '🟡',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  'Early Preparation Stage': {
    icon: '🔵',
    bg: 'bg-sky-50',
    border: 'border-sky-300',
    text: 'text-sky-800',
    badge: 'bg-sky-100 text-sky-800 border-sky-300',
  },
};

const DOMAIN_EMOJIS = {
  'Technology': '💻', 'Healthcare': '🏥', 'Finance & Banking': '💰',
  'Business & Management': '📊', 'Design & Creative': '🎨', 'Education & Teaching': '🎓',
  'Research & Science': '🔬', 'Marketing & Media': '📣', 'Legal & Compliance': '⚖️',
  'Engineering': '⚙️', 'General': '🌐',
};

export default function AnalysisPage() {
  const navigate = useNavigate();
  const { analysis } = useAnalysis();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const careerDomain = analysis?.career_domain || 'General';
  const domainEmoji = DOMAIN_EMOJIS[careerDomain] || '🌐';
  const educationBackground = analysis?.education_background || 'Not specified';
  const experienceLevel = analysis?.experience_level || 'Entry Level';
  const summary = analysis?.ai_summary || 'Upload your resume to receive a personalized AI career analysis.';

  // Determine overall readiness qualitatively from AI data
  const determineReadiness = () => {
    const fits = analysis?.career_fits || [];
    const strongCount = fits.filter(f => f.fit_category === 'Strong Fit').length;
    const goodCount = fits.filter(f => f.fit_category === 'Good Fit — Some Skills Needed').length;

    if (strongCount >= 2) return 'Nearly Job Ready';
    if (strongCount >= 1 || goodCount >= 2) return 'Building the Required Skills';
    if (fits.length > 0) return 'Early Preparation Stage';
    return 'Building the Required Skills';
  };

  const readiness = determineReadiness();
  const readinessCfg = READINESS_CONFIG[readiness];

  const improvements = analysis?.resume_improvements?.length > 0
    ? analysis.resume_improvements
    : [
        'Add a professional summary tailored to your target career path',
        'Quantify your achievements with measurable impact',
        'Include relevant certifications and training programs',
        'Use strong domain-specific action verbs throughout',
      ];

  const insights = analysis?.ai_insights || [];

  const careerFits = analysis?.career_fits || [];
  const skillGaps = analysis?.skill_gaps || [];

  // Group detected skills by category
  const rawSkills = analysis?.skills || [];
  const skillsByCategory = rawSkills.reduce((acc, skill) => {
    const name = typeof skill === 'string' ? skill : skill.name;
    const cat = typeof skill === 'object' ? (skill.category || 'General') : 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(name);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Career Profile Analysis</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Comprehensive career readiness review — no numerical scores, just clear guidance.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/skills')}>View Skills →</Button>
          <Button onClick={() => navigate('/career-recommendations')}>Career Pathways →</Button>
        </div>
      </div>

      {/* Domain detection banner */}
      {careerDomain !== 'General' && (
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl">
          <div className="text-4xl">{domainEmoji}</div>
          <div>
            <p className="font-bold text-indigo-900 text-base">Detected Career Domain: {careerDomain}</p>
            <p className="text-indigo-700 text-sm">
              Education: {educationBackground} · Experience: {experienceLevel}
            </p>
          </div>
        </div>
      )}

      {/* Overall Readiness — qualitative */}
      <div className={`p-6 rounded-2xl border-2 ${readinessCfg.border} ${readinessCfg.bg} flex flex-col md:flex-row items-center gap-6`}>
        <div className="text-center md:text-left">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Overall Career Readiness</p>
          <div className={`text-3xl font-extrabold ${readinessCfg.text} mb-2`}>
            {readinessCfg.icon} {readiness}
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            {readiness === 'Nearly Job Ready' && 'You have most of the key skills for your target careers. Focus on closing the remaining minor gaps.'}
            {readiness === 'Building the Required Skills' && 'You have a solid foundation. Targeted skill development will significantly improve your opportunities.'}
            {readiness === 'Early Preparation Stage' && 'You are building toward your career goals. A structured learning plan will accelerate your progress.'}
          </p>
        </div>

        {/* Readiness scale */}
        <div className="flex items-center gap-3 md:ml-auto">
          {['Early Preparation Stage', 'Building the Required Skills', 'Nearly Job Ready'].map((stage, i) => {
            const stageConfigs = { 'Early Preparation Stage': { icon: '🔵', color: 'bg-sky-400' }, 'Building the Required Skills': { icon: '🟡', color: 'bg-amber-400' }, 'Nearly Job Ready': { icon: '🟢', color: 'bg-emerald-400' } };
            const sc = stageConfigs[stage];
            const isActive = stage === readiness;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-4 ${isActive ? 'border-slate-900 scale-110 shadow-lg' : 'border-transparent'}`}
                  style={{ background: isActive ? '#fff' : '#f1f5f9' }}>
                  {sc.icon}
                </div>
                <span className="text-[9px] font-bold text-slate-500 text-center max-w-[60px] leading-tight">{stage}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Career Fits overview */}
      {careerFits.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={20} /> Career Fit Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {careerFits.slice(0, 3).map((fit, idx) => {
              const fitMap = {
                'Strong Fit': { icon: '🟢', bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' },
                'Good Fit — Some Skills Needed': { icon: '🟡', bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' },
                'Possible Career — Needs Preparation': { icon: '🔵', bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-800' },
              };
              const cfg = fitMap[fit.fit_category] || fitMap['Possible Career — Needs Preparation'];
              return (
                <div key={idx} className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg}`}>
                  <p className="text-xs text-slate-500 mb-1">{fit.domain}</p>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">{fit.career}</h3>
                  <span className={`text-xs font-extrabold ${cfg.text}`}>{fit.fit_icon || cfg.icon} {fit.fit_category}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <Button onClick={() => navigate('/career-recommendations')} variant="secondary" size="sm">
              View All Career Pathways →
            </Button>
          </div>
        </Card>
      )}

      {/* Skills by category */}
      {Object.keys(skillsByCategory).length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={20} /> Detected Skills & Competencies
          </h2>
          {loading ? (
            <div className="flex flex-wrap gap-2">{Array(6).fill(0).map((_, i) => <Skeleton key={i} variant="rectangular" width={100} height={30} className="rounded-xl" />)}</div>
          ) : (
            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([cat, skills]) => (
                <div key={cat}>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{cat}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                        <CheckCircle2 size={12} className="text-emerald-500" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Skill gaps */}
      {skillGaps.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} /> Growth Areas to Address
          </h2>
          <div className="flex flex-wrap gap-2">
            {skillGaps.map((gap, idx) => {
              const gapObj = typeof gap === 'string' ? { skill: gap, status: 'missing' } : gap;
              const isMissing = gapObj.status === 'missing';
              return (
                <span key={idx} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  isMissing ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {isMissing ? '❌' : '▲'} {gapObj.skill}
                </span>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Summary */}
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-500" />
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Lightbulb className="text-indigo-500" size={22} /> AI Career Summary
          </h2>
          {loading ? (
            <div className="space-y-2">
              <Skeleton variant="text" width="100%" /><Skeleton variant="text" width="100%" /><Skeleton variant="text" width="80%" />
            </div>
          ) : (
            <>
              <p className="text-slate-600 leading-relaxed text-sm">{summary}</p>
              {insights.length > 0 && (
                <div className="mt-4 space-y-2">
                  {insights.slice(0, 2).map((insight, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                      <BookOpen size={13} className="text-indigo-600 shrink-0 mt-0.5" />
                      <span className="text-indigo-800">{insight}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Card>

        {/* Improvements */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={22} /> Resume Improvements
          </h2>
          {loading ? (
            <div className="space-y-3"><Skeleton variant="text" width="90%" /><Skeleton variant="text" width="85%" /><Skeleton variant="text" width="95%" /></div>
          ) : (
            <ul className="space-y-3">
              {improvements.map((tip, idx) => (
                <li key={idx} className="flex gap-3 items-start text-sm text-slate-700">
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
