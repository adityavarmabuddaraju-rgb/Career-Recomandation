import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles, Target, BrainCircuit, ChevronRight, ArrowRight, X, Plus,
  CheckCircle2, AlertCircle, BookOpen, Clock, Code, Award, Layers,
  HelpCircle, FileText, Check, Zap, Loader2, Calendar, Compass, Bookmark, Save,
  GraduationCap, Briefcase, Heart, Globe
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { skillsService } from '../services/skillsService';
import DetailedRoadmapPlanner from '../components/roadmap/DetailedRoadmapPlanner';

// ─── Qualitative Fit Labels ───────────────────────────────────────────────────

const FIT_CATEGORIES = {
  'Strong foundation': {
    icon: '🟢', label: 'Strong foundation',
    bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  'Good starting point': {
    icon: '🟡', label: 'Good starting point',
    bg: 'bg-amber-50 text-amber-900 border-amber-200',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  'Needs preparation': {
    icon: '🟧', label: 'Needs preparation',
    bg: 'bg-orange-50 text-orange-900 border-orange-200',
    badge: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  'Skills to learn': {
    icon: '🔵', label: 'Skills to learn',
    bg: 'bg-sky-50 text-sky-900 border-sky-200',
    badge: 'bg-sky-100 text-sky-800 border-sky-300',
  },
};

const TIMEFRAME_OPTIONS = ['1 month', '2 months', '3 months', '6 months'];
const EXPERIENCE_OPTIONS = [
  'Beginner (Starting from scratch)',
  'Intermediate (Know basics & syntax)',
  'Advanced (Hands-on experience)',
];

// ─── Skill Tag Input ──────────────────────────────────────────────────────────

function SkillTagInput({ skills, setSkills, placeholder = 'e.g. Python, SQL, React...' }) {
  const [input, setInput] = useState('');

  const addSkill = (val) => {
    const trimmed = val.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(input);
      setInput('');
    }
  };

  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s));

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
        <button
          type="button"
          onClick={() => { addSkill(input); setInput(''); }}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-1 shrink-0"
        >
          <Plus size={16} /> Add
        </button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map(s => (
            <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-semibold">
              {s}
              <button type="button" onClick={() => removeSkill(s)} className="text-indigo-400 hover:text-red-500 transition-colors">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CareerDiscoveryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState(searchParams.get('mode') === '2' ? 2 : 1);

  useEffect(() => {
    const q = searchParams.get('mode');
    if (q === '2') setMode(2);
    else if (q === '1') setMode(1);
  }, [searchParams]);

  // ── Mode 1 State ──
  const [mode1Skills, setMode1Skills] = useState([]);
  const [mode1Education, setMode1Education] = useState('');
  const [mode1Experience, setMode1Experience] = useState('');
  const [mode1Interests, setMode1Interests] = useState('');
  const [mode1Loading, setMode1Loading] = useState(false);
  const [mode1Result, setMode1Result] = useState(null);
  const [mode1Error, setMode1Error] = useState('');
  const [mode1SelectedCareerIdx, setMode1SelectedCareerIdx] = useState(0);
  const [savingSkills, setSavingSkills] = useState(false);

  // ── Mode 2 State ──
  const [targetCareer, setTargetCareer] = useState('');
  const [customCareer, setCustomCareer] = useState('');
  const [mode2Skills, setMode2Skills] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState('Beginner (Starting from scratch)');
  const [hoursPerDay, setHoursPerDay] = useState('2');
  const [timeframe, setTimeframe] = useState('2 months');
  const [mode2Loading, setMode2Loading] = useState(false);
  const [mode2Result, setMode2Result] = useState(null);
  const [mode2Error, setMode2Error] = useState('');
  const [savingCareer, setSavingCareer] = useState(false);
  const [careerList, setCareerList] = useState([]);
  const [careerSearch, setCareerSearch] = useState('');

  const [activeTab, setActiveTab] = useState('overview');

  // Load career list for mode 2
  useEffect(() => {
    fetch('/api/career/database')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const list = Array.isArray(data) ? data : (data.careers || []);
        setCareerList(list.map(c => c.name));
      })
      .catch(() => setCareerList([
        'Software Engineer', 'Data Scientist', 'Product Manager', 'UI/UX Designer',
        'Financial Analyst', 'Digital Marketing Specialist', 'Teacher', 'Civil Engineer',
        'Cybersecurity Analyst', 'Business Analyst', 'Content Creator', 'Mechanical Engineer',
        'AI/ML Engineer', 'Full Stack Developer', 'DevOps Engineer', 'Graphic Designer',
      ]));
  }, []);

  // Load saved skills from profile
  useEffect(() => {
    if (user) {
      fetch('/api/profile/my-skills', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(r => r.ok ? r.json() : { skills: [] })
        .then(data => {
          const skills = (data.skills || []).map(s => typeof s === 'string' ? s : s.name);
          if (skills.length > 0 && mode1Skills.length === 0) setMode1Skills(skills);
        })
        .catch(() => {});
    }
  }, [user]);

  const filteredCareers = careerSearch
    ? careerList.filter(c => c.toLowerCase().includes(careerSearch.toLowerCase()))
    : careerList;

  // ── Save Skills ──
  const handleSaveSkills = async () => {
    if (!user) { showToast('Please sign in to save skills.', 'info'); navigate('/login'); return; }
    if (mode1Skills.length === 0) { showToast('Add at least one skill first.', 'error'); return; }
    setSavingSkills(true);
    try {
      await skillsService.addSkill({ name: mode1Skills.join(','), skills: mode1Skills });
      showToast(`Saved ${mode1Skills.length} skills to profile!`, 'success');
    } catch { showToast('Failed to save skills.', 'error'); }
    finally { setSavingSkills(false); }
  };

  // ── Save Career ──
  const handleSaveCareer = async () => {
    if (!user) { showToast('Please sign in to save careers.', 'info'); navigate('/login'); return; }
    const careerName = customCareer.trim() || targetCareer;
    setSavingCareer(true);
    try {
      await skillsService.saveCareer({
        career_name: careerName,
        career_slug: careerName.toLowerCase().replace(/\s+/g, '-'),
      });
      showToast(`Saved "${careerName}" career!`, 'success');
    } catch { showToast('Failed to save career goal.', 'error'); }
    finally { setSavingCareer(false); }
  };

  // ── Mode 1 Submit ──
  const handleMode1Analyze = async () => {
    if (mode1Skills.length === 0) { setMode1Error('Add at least one skill to get started.'); return; }
    setMode1Error(''); setMode1Loading(true); setMode1Result(null);
    try {
      const resp = await fetch('/api/career/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: mode1Skills,
          education: mode1Education || undefined,
          experience: mode1Experience || undefined,
          interests: mode1Interests ? mode1Interests.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        }),
      });
      if (resp.ok) {
        setMode1Result(await resp.json());
        setMode1SelectedCareerIdx(0);
        setActiveTab('overview');
      } else {
        setMode1Error('Failed to analyze skills. Please try again.');
      }
    } catch { setMode1Error('Network error. Please try again.'); }
    finally { setMode1Loading(false); }
  };

  // ── Mode 2 Submit ──
  const handleMode2Submit = async () => {
    const finalCareer = customCareer.trim() || targetCareer;
    if (!finalCareer) { setMode2Error('Please select or enter your target career.'); return; }
    setMode2Error(''); setMode2Loading(true); setMode2Result(null);
    try {
      const resp = await fetch('/api/career/target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career: finalCareer,
          skills: mode2Skills,
          experience_level: experienceLevel,
          hours_per_day: hoursPerDay,
          timeframe,
        }),
      });
      if (resp.ok) {
        setMode2Result(await resp.json());
        setActiveTab('overview');
      } else {
        setMode2Error('Failed to generate roadmap. Please try again.');
      }
    } catch { setMode2Error('Network error. Please try again.'); }
    finally { setMode2Loading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      {/* ── Header ── */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> AI Career Assessment
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Career Assessment</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
          Discover career fits from your current skills, or get a personalized roadmap for your target career.
        </p>
      </div>

      {/* ── Mode Selection ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        <button
          onClick={() => { setMode(1); setMode1Result(null); setMode2Result(null); }}
          className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-4 ${
            mode === 1 ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className={`p-3 rounded-xl shrink-0 ${mode === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">Option 1</span>
            <h3 className="text-base font-bold text-slate-900">What am I eligible for?</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Enter your skills. AI recommends careers & skill gaps.</p>
          </div>
        </button>

        <button
          onClick={() => { setMode(2); setMode1Result(null); setMode2Result(null); }}
          className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-4 ${
            mode === 2 ? 'border-violet-600 bg-violet-50/50 shadow-md ring-2 ring-violet-500/20' : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className={`p-3 rounded-xl shrink-0 ${mode === 2 ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-violet-600 uppercase tracking-wider block">Option 2</span>
            <h3 className="text-base font-bold text-slate-900">I want this career</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Choose your goal. Get a step-by-step roadmap & projects.</p>
          </div>
        </button>
      </div>

      {/* ── FORM ── */}
      {!mode1Result && !mode2Result && (
        <Card className="p-6 sm:p-8 max-w-3xl mx-auto border-slate-200 shadow-sm">
          {mode === 1 ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <BrainCircuit className="text-indigo-600" size={20} /> What skills do you currently have?
                </h2>
                <p className="text-xs text-slate-500 mb-4">Add any technical, design, business, or professional skills you know.</p>
                <SkillTagInput skills={mode1Skills} setSkills={setMode1Skills} />
              </div>

              {/* Popular skills */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Quick add popular skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Python', 'SQL', 'JavaScript', 'Excel', 'Figma', 'Java', 'React', 'Git', 'HTML/CSS', 'C++', 'Data Analysis', 'Power BI', 'Marketing', 'Finance', 'Communication'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { if (!mode1Skills.includes(s)) setMode1Skills([...mode1Skills, s]); }}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-700 font-medium hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional context */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <GraduationCap size={13} /> Education (optional)
                  </label>
                  <input
                    type="text"
                    value={mode1Education}
                    onChange={e => setMode1Education(e.target.value)}
                    placeholder="e.g. Computer Science, Commerce, Arts"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Briefcase size={13} /> Experience (optional)
                  </label>
                  <select
                    value={mode1Experience}
                    onChange={e => setMode1Experience(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="">Select experience level</option>
                    <option value="Student">Student / Fresher</option>
                    <option value="0-1 years">0–1 years experience</option>
                    <option value="1-3 years">1–3 years experience</option>
                    <option value="3-5 years">3–5 years experience</option>
                    <option value="5+ years">5+ years experience</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Heart size={13} /> Interests (optional)
                </label>
                <input
                  type="text"
                  value={mode1Interests}
                  onChange={e => setMode1Interests(e.target.value)}
                  placeholder="e.g. Finance, Technology, Healthcare, Education (comma-separated)"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-400"
                />
              </div>

              {mode1Error && (
                <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                  <AlertCircle size={14} /> {mode1Error}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={handleMode1Analyze}
                  disabled={mode1Loading || mode1Skills.length === 0}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 text-sm"
                >
                  {mode1Loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Analyzing your skills...
                    </span>
                  ) : 'Discover My Career Fits →'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveSkills}
                  disabled={savingSkills || mode1Skills.length === 0}
                  icon={Save}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border-slate-300 py-3 text-sm shrink-0"
                >
                  {savingSkills ? 'Saving...' : 'Save Skills'}
                </Button>
              </div>
            </div>
          ) : (
            /* ── OPTION 2 FORM ── */
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Target className="text-violet-600" size={20} /> Which career are you targeting?
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Choose from our database or type any career — the AI will work with it.
                </p>

                {/* Search & select career */}
                <div className="space-y-3">
                  <input
                    type="text"
                    value={careerSearch}
                    onChange={e => setCareerSearch(e.target.value)}
                    placeholder="Search careers (e.g. Data Scientist, Civil Engineer, UI/UX Designer)..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-violet-400"
                  />

                  {careerSearch && filteredCareers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {filteredCareers.slice(0, 12).map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setTargetCareer(c); setCustomCareer(''); setCareerSearch(''); }}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                            targetCareer === c && !customCareer
                              ? 'border-violet-600 bg-violet-600 text-white'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}

                  {!careerSearch && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {careerList.slice(0, 12).map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setTargetCareer(c); setCustomCareer(''); }}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                            targetCareer === c && !customCareer
                              ? 'border-violet-600 bg-violet-50 text-violet-900'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Or enter any specific career:</label>
                    <input
                      type="text"
                      value={customCareer}
                      onChange={e => setCustomCareer(e.target.value)}
                      placeholder="e.g. Quantum Computing Researcher, Game Narrative Designer..."
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>

              {/* Current skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Skills <span className="text-slate-400 font-normal">(optional — AI won't repeat what you know)</span>
                </label>
                <SkillTagInput skills={mode2Skills} setSkills={setMode2Skills} placeholder="e.g. Python, Git, Excel..." />
              </div>

              {/* Experience & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Starting Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={e => setExperienceLevel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-violet-500"
                  >
                    {EXPERIENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Hours Per Day for Learning</label>
                  <select
                    value={hoursPerDay}
                    onChange={e => setHoursPerDay(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-violet-500"
                  >
                    {['1', '2', '3', '4+'].map(opt => <option key={opt} value={opt}>{opt} hour{opt !== '1' ? 's' : ''}/day</option>)}
                  </select>
                </div>
              </div>

              {/* Target timeline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Timeline</label>
                <div className="grid grid-cols-4 gap-2">
                  {TIMEFRAME_OPTIONS.map(tf => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setTimeframe(tf)}
                      className={`py-2 px-3 rounded-xl border text-xs font-extrabold text-center transition-all ${
                        timeframe === tf
                          ? 'border-violet-600 bg-violet-600 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {mode2Error && (
                <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                  <AlertCircle size={14} /> {mode2Error}
                </p>
              )}

              <Button
                onClick={handleMode2Submit}
                disabled={mode2Loading}
                fullWidth
                size="lg"
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 text-sm"
              >
                {mode2Loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Generating Personalized Roadmap...
                  </span>
                ) : `Generate Roadmap for ${customCareer || targetCareer || '...'} →`}
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* ── RESULTS ── */}
      {(mode1Result || mode2Result) && (
        <div className="space-y-6">
          {/* Result Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-400">
                {mode === 1 ? 'Career Recommendations Based on Your Skills' : 'Personalized Learning Roadmap'}
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                {mode === 1
                  ? `Careers That Match Your Skills`
                  : `Roadmap: ${mode2Result?.career_overview?.title || customCareer || targetCareer}`}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {mode === 1 ? (
                <Button onClick={handleSaveSkills} disabled={savingSkills} icon={Save} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
                  {savingSkills ? 'Saving...' : 'Save Skills'}
                </Button>
              ) : (
                <Button onClick={handleSaveCareer} disabled={savingCareer} icon={Bookmark} size="sm" className="bg-violet-600 hover:bg-violet-500 text-white font-bold">
                  {savingCareer ? 'Saving...' : 'Save Career Goal'}
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={() => { setMode1Result(null); setMode2Result(null); }} className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold">
                ← Change Input
              </Button>
            </div>
          </div>

          {/* Mode 1 Career Selector */}
          {mode === 1 && mode1Result?.career_fits?.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs font-bold text-slate-500 shrink-0">Select Role:</span>
              {mode1Result.career_fits.map((fit, idx) => {
                const cfg = FIT_CATEGORIES[fit.fit_category] || FIT_CATEGORIES['Skills to learn'];
                return (
                  <button
                    key={idx}
                    onClick={() => setMode1SelectedCareerIdx(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all border shrink-0 ${
                      mode1SelectedCareerIdx === idx
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <span>{fit.fit_icon || cfg.icon}</span>
                    <span>{fit.career}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'skills', label: 'Skills & Gaps', icon: BrainCircuit },
              { id: 'roadmap', label: mode === 1 ? 'Roadmap' : 'Detailed Planner', icon: Layers },
              ...(mode === 1 ? [
                { id: 'projects', label: 'Projects', icon: Code },
                { id: 'interview', label: 'Interview Prep', icon: HelpCircle },
                { id: 'resume', label: 'Resume Bullets', icon: FileText },
              ] : [
                { id: 'interview', label: 'Interview Prep', icon: HelpCircle },
              ]),
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <tab.icon size={15} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {mode === 1 ? (() => {
                  const currentFit = mode1Result?.career_fits?.[mode1SelectedCareerIdx] || mode1Result?.career_fits?.[0];
                  if (!currentFit) return null;
                  const cfg = FIT_CATEGORIES[currentFit.fit_category] || FIT_CATEGORIES['Skills to learn'];
                  return (
                    <Card className="p-6 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{currentFit.domain}</span>
                          <h3 className="text-2xl font-extrabold text-slate-900">{currentFit.career}</h3>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-extrabold ${cfg.badge}`}>
                          {currentFit.fit_icon || cfg.icon} {cfg.label}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Why this career suits you:</h4>
                        <ul className="space-y-2">
                          {currentFit.why_suitable?.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {currentFit.recommended_tools?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Recommended Tools & Tech:</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentFit.recommended_tools.map(tool => (
                              <span key={tool} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800">🛠️ {tool}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })() : (() => {
                  const overview = mode2Result?.career_overview;
                  const starting = mode2Result?.starting_point;
                  if (!overview) return null;
                  return (
                    <div className="space-y-6">
                      <Card className="p-6 space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div>
                            <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">{overview.domain}</span>
                            <h3 className="text-2xl font-extrabold text-slate-900">{overview.title}</h3>
                          </div>
                          <span className="px-3 py-1 bg-violet-50 text-violet-800 border border-violet-200 rounded-full text-xs font-bold">Role Overview</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{overview.role_description}</p>
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Typical Responsibilities:</h4>
                          <ul className="space-y-2">
                            {overview.typical_responsibilities?.map((resp, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                <CheckCircle2 size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                            <span className="font-bold text-slate-700 block mb-1">💼 Where this role is used:</span>
                            <p className="text-slate-600">{overview.where_used}</p>
                          </div>
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                            <span className="font-bold text-slate-700 block mb-1">🛠️ Core Stack:</span>
                            <p className="text-slate-600">{overview.important_technologies?.join(', ')}</p>
                          </div>
                        </div>
                      </Card>
                      {starting && (
                        <Card className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3">
                          <h4 className="font-bold text-indigo-300 text-sm flex items-center gap-2">
                            <Compass size={18} className="text-amber-400" /> Starting Point & Prerequisites
                          </h4>
                          <p className="text-xs text-slate-200 leading-relaxed">{starting.analysis_summary}</p>
                          <div className="flex flex-wrap gap-4 text-xs pt-2">
                            <div>
                              <span className="text-slate-400 block">Starting Level:</span>
                              <span className="font-bold text-white">{starting.current_level}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Skills Already Known:</span>
                              <span className="font-bold text-emerald-400">{starting.skills_already_known?.join(', ') || 'None'}</span>
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* SKILLS TAB */}
            {activeTab === 'skills' && (
              <Card className="p-6 space-y-6">
                {mode === 1 ? (() => {
                  const currentFit = mode1Result?.career_fits?.[mode1SelectedCareerIdx] || mode1Result?.career_fits?.[0];
                  if (!currentFit) return null;
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                          <h4 className="font-bold text-emerald-900 text-sm mb-3 flex items-center gap-1.5">
                            <CheckCircle2 size={16} className="text-emerald-600" /> Skills You Have:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {currentFit.skills_you_have?.map(s => (
                              <span key={s} className="px-3 py-1 bg-white border border-emerald-300 text-emerald-900 font-bold text-xs rounded-xl shadow-sm">✓ {s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl">
                          <h4 className="font-bold text-amber-900 text-sm mb-3 flex items-center gap-1.5">
                            <AlertCircle size={16} className="text-amber-600" /> Skills to Learn:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {currentFit.missing_skills?.map(s => (
                              <span key={s} className="px-3 py-1 bg-white border border-amber-300 text-amber-900 font-bold text-xs rounded-xl shadow-sm">+ {s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-3">📍 Recommended Learning Sequence:</h4>
                        <ol className="space-y-2">
                          {currentFit.what_to_learn_next?.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800">
                              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0">{idx + 1}</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  );
                })() : (() => {
                  const starting = mode2Result?.starting_point;
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                        <h4 className="font-bold text-emerald-900 text-sm mb-3">✓ Skills You Already Have:</h4>
                        <div className="flex flex-wrap gap-2">
                          {starting?.skills_already_known?.map(s => (
                            <span key={s} className="px-3 py-1 bg-white border border-emerald-300 text-emerald-900 font-bold text-xs rounded-xl shadow-sm">✓ {s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl">
                        <h4 className="font-bold text-indigo-900 text-sm mb-3">🔹 Prerequisites Needed:</h4>
                        <div className="flex flex-wrap gap-2">
                          {starting?.prerequisite_knowledge?.map(s => (
                            <span key={s} className="px-3 py-1 bg-white border border-indigo-300 text-indigo-900 font-bold text-xs rounded-xl shadow-sm">🔹 {s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </Card>
            )}

            {/* ROADMAP TAB */}
            {activeTab === 'roadmap' && (
              mode === 2 ? (
                <DetailedRoadmapPlanner data={mode2Result} />
              ) : (
                <Card className="p-6 space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="text-indigo-600" size={20} /> Skill Progression Stages
                  </h3>
                  {(() => {
                    const stages = mode1Result?.career_fits?.[mode1SelectedCareerIdx]?.roadmap_stages;
                    if (!stages) return <p className="text-xs text-slate-500">No roadmap stages available.</p>;
                    const stageKeys = [
                      { key: 'beginner', title: 'Beginner Stage', desc: 'Core fundamentals & prerequisite tools' },
                      { key: 'intermediate', title: 'Intermediate Stage', desc: 'Primary frameworks & data tools' },
                      { key: 'advanced', title: 'Advanced Stage', desc: 'Architecture, testing & performance' },
                    ];
                    return (
                      <div className="space-y-6">
                        {stageKeys.map((st, i) => {
                          const stageData = stages[st.key];
                          if (!stageData) return null;
                          return (
                            <div key={st.key} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">Stage {i + 1}</span>
                              <h4 className="text-base font-bold text-slate-900">{st.title}</h4>
                              <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
                              <div className="flex flex-wrap gap-2 pt-2">
                                {(Array.isArray(stageData) ? stageData : []).map(topic => (
                                  <span key={topic} className="px-3 py-1 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold">📌 {topic}</span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </Card>
              )
            )}

            {/* PROJECTS TAB (Mode 1 only) */}
            {activeTab === 'projects' && mode === 1 && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <Code className="text-indigo-600" size={20} /> Recommended Projects
                  </h3>
                  {(() => {
                    const projects = mode1Result?.career_fits?.[mode1SelectedCareerIdx]?.projects;
                    if (!projects?.length) return <p className="text-xs text-slate-500">No project recommendations.</p>;
                    return (
                      <div className="space-y-6">
                        {projects.map((proj, idx) => (
                          <div key={idx} className="p-6 border-2 border-slate-200 rounded-2xl bg-white space-y-4 hover:border-indigo-300 transition-colors">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{proj.difficulty || 'Project'}</span>
                                <h4 className="text-xl font-extrabold text-slate-900 mt-1">{proj.name || proj.title}</h4>
                              </div>
                              <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">⏱️ {proj.estimated_time || '1-2 weeks'}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{proj.relevance || proj.description}</p>
                            {proj.technologies?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {proj.technologies.map(t => (
                                  <span key={t} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold">{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </Card>
              </div>
            )}

            {/* INTERVIEW TAB */}
            {activeTab === 'interview' && (
              <Card className="p-6 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="text-indigo-600" size={20} /> Interview Preparation
                </h3>
                {(() => {
                  const prep = mode === 1
                    ? { technical_topics: mode1Result?.career_fits?.[mode1SelectedCareerIdx]?.interview_topics }
                    : mode2Result?.interview_preparation;
                  if (!prep) return <p className="text-xs text-slate-500">No interview prep data available.</p>;
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {prep.technical_topics?.length > 0 && (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-700">🧠 Technical Topics</h4>
                          <ul className="space-y-1.5">
                            {prep.technical_topics.map((t, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                <span className="text-indigo-500">▪</span> {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {prep.hr_prep?.length > 0 && (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-700">🗣️ HR & Behavioral Prep</h4>
                          <ul className="space-y-1.5">
                            {prep.hr_prep.map((t, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                <span className="text-emerald-500">▪</span> {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </Card>
            )}

            {/* RESUME TAB (Mode 1 only) */}
            {activeTab === 'resume' && mode === 1 && (
              <Card className="p-6 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="text-indigo-600" size={20} /> Resume Bullet Points
                </h3>
                <p className="text-xs text-slate-500">Ready-to-use bullet points for your resume. Based on real project features — no fake achievements.</p>
                <div className="space-y-4">
                  {(() => {
                    const projects = mode1Result?.career_fits?.[mode1SelectedCareerIdx]?.projects;
                    if (!projects?.length) return <p className="text-xs text-slate-500">No project resume bullets.</p>;
                    return projects.map((p, i) => (
                      <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <span className="font-bold text-xs text-indigo-700 block">{p.name || p.title}</span>
                        {p.suggested_bullet_points?.map((bp, j) => (
                          <div key={j} className="p-3 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-800">"{bp}"</div>
                        ))}
                      </div>
                    ));
                  })()}
                </div>
              </Card>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
