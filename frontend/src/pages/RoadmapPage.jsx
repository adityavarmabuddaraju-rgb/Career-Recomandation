import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, ExternalLink, Globe, Layers, Sparkles, Search, Briefcase } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { useAnalysis } from '../context/AnalysisContext';

const DOMAIN_ROADMAPS = {
  Healthcare: {
    weeks: [
      { week: '1–2', title: 'Clinical Knowledge & Patient Safety', hours: '15 hrs', difficulty: 'Intermediate', useCase: 'Build deep clinical competency in patient assessment, medication safety, and evidence-based practice.', jobImpact: 'Required for Registered Nurse, Clinical Coordinator, and Patient Care Manager roles.', skills: ['Patient Assessment', 'Clinical Documentation', 'Medication Safety'], resources: [{ name: 'ACLS Certification Course', platform: 'American Heart Association', link: 'https://www.heart.org/en/cpr-and-ecc/acls' }, { name: 'Clinical Nursing Skills', platform: 'Coursera', link: 'https://www.coursera.org/browse/health' }] },
      { week: '3–4', title: 'Healthcare Systems & Administration', hours: '12 hrs', difficulty: 'Beginner', useCase: 'Understand healthcare operations, insurance systems, and quality improvement frameworks.', jobImpact: 'Opens paths to Healthcare Administrator, Practice Manager, and Quality Coordinator roles.', skills: ['Healthcare Operations', 'Quality Improvement', 'EHR Systems'], resources: [{ name: 'Healthcare Administration Overview', platform: 'edX', link: 'https://www.edx.org/learn/healthcare' }] },
    ],
    courses: [
      { id: 1, title: 'ACLS Certification Prep', domain: 'Healthcare', platform: 'American Heart Association', link: 'https://www.heart.org/en/cpr-and-ecc/acls', duration: '20 hrs', useCase: 'Prepares you for emergency cardiac situations — required for critical care and ER nurses.', jobImpact: 'Unlocks ICU, ER, and Critical Care positions with 20-30% higher base pay.', targetRoles: ['ICU Nurse', 'Emergency Nurse', 'Critical Care Specialist'] },
      { id: 2, title: 'Healthcare Management Professional Certificate', domain: 'Healthcare Management', platform: 'Coursera (Johns Hopkins)', link: 'https://www.coursera.org/learn/the-business-of-health-care', duration: '30 hrs', useCase: 'Learn financial management, HR, and strategic operations in a healthcare setting.', jobImpact: 'Qualifies you for Department Manager, Clinical Director, and Administrator roles.', targetRoles: ['Healthcare Administrator', 'Department Manager'] },
    ],
  },
  Finance: {
    weeks: [
      { week: '1–2', title: 'Financial Analysis & Modelling', hours: '20 hrs', difficulty: 'Intermediate', useCase: 'Master Excel-based financial modelling, ratio analysis, and discounted cash flow valuation.', jobImpact: 'Core requirement for Financial Analyst, Investment Banking, and FP&A roles.', skills: ['Financial Modelling', 'Excel', 'DCF Valuation'], resources: [{ name: 'Financial Modelling & Valuation Analyst (FMVA)', platform: 'CFI', link: 'https://corporatefinanceinstitute.com/resources/financial-modeling/' }] },
    ],
    courses: [
      { id: 1, title: 'CFA Level 1 Preparation', domain: 'Finance', platform: 'CFA Institute', link: 'https://www.cfainstitute.org/en/programs/cfa', duration: '300 hrs', useCase: 'World-class investment analysis certification covering ethics, equity, and fixed income.', jobImpact: 'Most valued credential in Investment Banking, Asset Management, and Portfolio Management.', targetRoles: ['Investment Analyst', 'Portfolio Manager', 'Research Analyst'] },
    ],
  },
  Technology: {
    weeks: [
      { week: '1–2', title: 'System Design & Architecture', hours: '20 hrs', difficulty: 'Advanced', useCase: 'Learn scalable backend architecture, database design, and microservices patterns used in production systems.', jobImpact: 'Required for Senior Software Engineer and Architect interviews at top tech companies.', skills: ['System Design', 'Microservices', 'Database Sharding'], resources: [{ name: 'System Design Primer', platform: 'GitHub', link: 'https://github.com/donnemartin/system-design-primer' }, { name: 'Educative System Design', platform: 'Educative.io', link: 'https://www.educative.io/courses/grokking-the-system-design-interview' }] },
    ],
    courses: [
      { id: 1, title: 'AWS Cloud Practitioner Certification', domain: 'Cloud & DevOps', platform: 'AWS Skill Builder', link: 'https://explore.skillbuilder.aws/', duration: '25 hrs', useCase: 'Learn to architect and deploy cloud applications on Amazon Web Services.', jobImpact: 'Unlocks Cloud Engineer, DevOps, and Full Stack roles with avg. 30% salary premium.', targetRoles: ['Cloud Engineer', 'DevOps Engineer', 'Full Stack Developer'] },
    ],
  },
  Design: {
    weeks: [
      { week: '1–2', title: 'UX Research & User Psychology', hours: '15 hrs', difficulty: 'Beginner', useCase: 'Understand user mental models, conduct usability testing, and build wireframes with Figma.', jobImpact: 'Foundation for UX Designer, Product Designer, and Design Researcher careers.', skills: ['Figma', 'User Research', 'Wireframing'], resources: [{ name: 'Google UX Design Certificate', platform: 'Coursera', link: 'https://www.coursera.org/professional-certificates/google-ux-design' }] },
    ],
    courses: [
      { id: 1, title: 'Google UX Design Professional Certificate', domain: 'Design', platform: 'Coursera / Google', link: 'https://www.coursera.org/professional-certificates/google-ux-design', duration: '180 hrs', useCase: 'Complete UX design training covering research, wireframing, prototyping, and usability testing.', jobImpact: 'Direct entry to UX Designer, Product Designer, and UX Researcher roles globally.', targetRoles: ['UX Designer', 'Product Designer', 'Design Researcher'] },
    ],
  },
};

const DEFAULT_ROADMAP = {
  weeks: [
    { week: '1–2', title: 'Domain Expertise & Certification', hours: '15 hrs', difficulty: 'Intermediate', useCase: 'Deepen your domain knowledge and obtain a recognized certification in your field.', jobImpact: 'Industry certifications increase hiring probability by 40% and salary expectation by 20%.', skills: ['Domain Knowledge', 'Industry Standards', 'Professional Practice'], resources: [{ name: 'Coursera Professional Certificates', platform: 'Coursera', link: 'https://www.coursera.org' }, { name: 'LinkedIn Learning', platform: 'LinkedIn', link: 'https://www.linkedin.com/learning' }] },
    { week: '3–4', title: 'Communication & Leadership Skills', hours: '10 hrs', difficulty: 'Beginner', useCase: 'Strengthen professional communication, presentation skills, and team leadership abilities.', jobImpact: 'Soft skills are cited in 85% of hiring decisions as a key differentiating factor.', skills: ['Professional Communication', 'Leadership', 'Presentation'], resources: [{ name: 'Communication & Leadership', platform: 'Coursera', link: 'https://www.coursera.org/learn/wharton-communication-foundations' }] },
  ],
  courses: [
    { id: 1, title: 'Professional Communication & Leadership', domain: 'Soft Skills', platform: 'Coursera', link: 'https://www.coursera.org', duration: '15 hrs', useCase: 'Develop workplace communication, conflict resolution, and leadership fundamentals for any career domain.', jobImpact: 'Applicable to every career — consistently cited as a top factor in promotions and hiring decisions.', targetRoles: ['Team Lead', 'Manager', 'Senior Professional'] },
    { id: 2, title: 'Project Management Fundamentals (PMF)', domain: 'Business & Management', platform: 'Google / Coursera', link: 'https://www.coursera.org/professional-certificates/google-project-management', duration: '180 hrs', useCase: 'Learn to lead projects, manage timelines, coordinate teams, and deliver results in any domain.', jobImpact: 'PMP/PMF certification valued across all industries — from healthcare to tech to construction.', targetRoles: ['Project Manager', 'Program Coordinator', 'Operations Manager'] },
  ],
};

export default function RoadmapPage() {
  const { analysis } = useAnalysis();
  const [loading, setLoading] = useState(true);
  const [completedWeeks, setCompletedWeeks] = useState([0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const careerDomain = analysis?.career_domain || 'General';

  // Pick domain-specific or default roadmap
  const getBaseDomain = (domain) => {
    if (domain.includes('Health')) return 'Healthcare';
    if (domain.includes('Finance') || domain.includes('Banking')) return 'Finance';
    if (domain.includes('Tech') || domain.includes('Software') || domain.includes('Data')) return 'Technology';
    if (domain.includes('Design') || domain.includes('Creative')) return 'Design';
    return null;
  };

  const baseDomain = getBaseDomain(careerDomain);
  const roadmapData = analysis?.roadmap?.length > 0
    ? null  // use AI roadmap directly
    : (DOMAIN_ROADMAPS[baseDomain] || DEFAULT_ROADMAP);

  // Convert AI roadmap format to display format
  const weeklyModules = analysis?.roadmap?.length > 0
    ? analysis.roadmap.map((r, i) => ({
        week: `Week ${r.week}`,
        title: r.topic,
        hours: `${r.estimated_hours} hrs`,
        difficulty: r.difficulty,
        useCase: `Develop ${r.skills_gained?.join(', ')} skills for your ${careerDomain} career path.`,
        jobImpact: `Directly applicable to ${analysis?.recommended_roles?.[0]?.title || careerDomain} career advancement.`,
        skills: r.skills_gained || [],
        resources: (r.resources || []).map(res => ({ name: res, platform: r.platform || 'Online', link: '#' })),
      }))
    : roadmapData.weeks;

  const courseCatalog = roadmapData?.courses || [];

  const domains = ['All', ...new Set(courseCatalog.map(c => c.domain))];

  const filteredCourses = courseCatalog.filter(c => {
    const matchesDomain = selectedDomain === 'All' || c.domain === selectedDomain;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.targetRoles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Career Growth Roadmap</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Your step-by-step learning plan tailored to your {careerDomain !== 'General' ? <strong>{careerDomain}</strong> : 'career profile'}.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold">
          <CheckCircle size={18} className="text-indigo-600" />
          {completedWeeks.length} / {weeklyModules.length} Modules Completed
        </div>
      </div>

      {/* Weekly Modules Timeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Layers className="text-indigo-600" size={22} /> Your Personalized Weekly Schedule
        </h2>

        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="pl-8"><Skeleton variant="rectangular" height={130} className="rounded-2xl" /></div>
            ))
          ) : (
            weeklyModules.map((node, idx) => {
              const isCompleted = completedWeeks.includes(idx);
              const isCurrent = idx === completedWeeks.length;

              return (
                <div key={idx} className={`pl-8 relative transition-opacity duration-300 ${!isCompleted && !isCurrent && idx > completedWeeks.length ? 'opacity-60' : ''}`}>
                  <button
                    onClick={() => {
                      if (completedWeeks.includes(idx)) setCompletedWeeks(completedWeeks.filter(i => i !== idx));
                      else setCompletedWeeks([...completedWeeks, idx]);
                    }}
                    className={`absolute w-8 h-8 rounded-full -left-[17px] top-0 border-4 border-white flex items-center justify-center font-bold text-xs transition-all ${isCompleted ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-500'}`}
                  >
                    {isCompleted ? <CheckCircle size={16} /> : idx + 1}
                  </button>

                  <Card className={`p-6 ${isCompleted ? 'bg-emerald-50/30 border-emerald-200' : isCurrent ? 'border-indigo-300 shadow-md' : 'border-slate-200'}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{node.week || `Week ${idx + 1}`}</span>
                        <h3 className={`text-lg font-bold mt-0.5 ${isCompleted ? 'text-emerald-900 line-through decoration-emerald-300/50' : 'text-slate-900'}`}>{node.title}</h3>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Badge variant={node.difficulty === 'Beginner' ? 'success' : 'warning'}>{node.difficulty}</Badge>
                        <Badge variant="default" className="bg-slate-100 text-slate-700">{node.hours}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl mb-4 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">💡 What you will learn:</span>
                        <p className="text-slate-600 leading-relaxed">{node.useCase}</p>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-700 block mb-1">🎯 Career Impact:</span>
                        <p className="text-slate-600 leading-relaxed">{node.jobImpact}</p>
                      </div>
                    </div>

                    {node.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {node.skills.map(s => <Badge key={s} variant="info" size="sm">{s}</Badge>)}
                      </div>
                    )}

                    {node.resources?.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-slate-600 block mb-2">📍 Where to learn:</span>
                        <div className="flex flex-wrap gap-2">
                          {node.resources.map((res, rIdx) => (
                            <a key={rIdx} href={res.link} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                            >
                              <Globe size={13} className="text-indigo-600" /> {res.name} ({res.platform}) <ExternalLink size={11} className="text-slate-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {isCurrent && (
                      <div className="mt-5 pt-4 border-t border-indigo-100">
                        <Button fullWidth onClick={() => setCompletedWeeks([...completedWeeks, idx])}>
                          Mark as Completed ✓
                        </Button>
                      </div>
                    )}
                  </Card>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Course Catalog */}
      {courseCatalog.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={22} /> Recommended Courses for Your Domain
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white border border-slate-200 p-3 rounded-2xl">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {domains.map(d => (
                <button key={d} onClick={() => setSelectedDomain(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${selectedDomain === d ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >{d}</button>
              ))}
            </div>
            <div className="relative w-full sm:w-56 shrink-0">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search courses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCourses.map(course => (
              <Card key={course.id} hover className="p-5 flex flex-col justify-between border-slate-200 hover:border-indigo-200">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{course.domain}</span>
                      <h3 className="font-bold text-slate-900 text-sm mt-0.5">{course.title}</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200 shrink-0">{course.platform}</Badge>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Globe size={13} className="text-indigo-600" />
                    <span>Platform: {course.platform} · {course.duration}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl text-xs">
                    <span className="font-bold text-slate-800 block mb-1">💡 Use of This Course:</span>
                    <p className="text-slate-600 leading-relaxed">{course.useCase}</p>
                  </div>

                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs">
                    <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                      <Briefcase size={13} /> Career & Job Impact:
                    </span>
                    <p className="text-emerald-900 leading-relaxed">{course.jobImpact}</p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-500 block mb-1.5">Target Roles:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.targetRoles.map(role => (
                        <span key={role} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium border border-slate-200">{role}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <a href={course.link} target="_blank" rel="noreferrer"
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 font-bold rounded-xl text-xs px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow transition-all"
                >
                  Start Course on {course.platform} <ExternalLink size={14} />
                </a>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
