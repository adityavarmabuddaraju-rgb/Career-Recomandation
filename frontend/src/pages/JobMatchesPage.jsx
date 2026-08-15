import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Building, ExternalLink, Check, X, Search, BookmarkPlus, Loader2, DollarSign } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import CircularProgress from '../components/ui/CircularProgress';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import { searchJobs, saveJob } from '../services/jobService';
import { useToast } from '../context/ToastContext';

export default function JobMatchesPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [locationQuery, setLocationQuery] = useState('Remote');
  const [liveJobs, setLiveJobs] = useState([]);
  const [searchingJobs, setSearchingJobs] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const matches = [
    {
      title: "Full Stack Developer",
      match: 91,
      matched: ["JavaScript", "React", "Node.js", "MongoDB", "Express", "SQL", "Git"],
      missing: ["Docker", "AWS", "System Design", "TypeScript", "CI/CD"]
    },
    {
      title: "Backend Developer",
      match: 87,
      matched: ["Java", "Python", "SQL", "Node.js", "Express", "Spring Boot", "Git"],
      missing: ["Redis", "Docker", "Kubernetes", "System Design"]
    },
    {
      title: "Software Engineer",
      match: 84,
      matched: ["Java", "Python", "C++", "SQL", "Git", "Problem Solving"],
      missing: ["System Design", "Design Patterns", "CI/CD", "Cloud Services"]
    },
    {
      title: "AI/ML Engineer",
      match: 78,
      matched: ["Python", "Machine Learning", "NLP", "TensorFlow", "SQL"],
      missing: ["Deep Learning", "PyTorch", "MLOps", "Computer Vision"]
    },
    {
      title: "Data Analyst",
      match: 75,
      matched: ["Python", "SQL", "MySQL", "MongoDB", "Problem Solving"],
      missing: ["Tableau", "Power BI", "Statistical Analysis", "ETL"]
    },
    {
      title: "DevOps Engineer",
      match: 68,
      matched: ["Git", "Linux", "Docker", "Python", "SQL"],
      missing: ["Kubernetes", "Terraform", "CI/CD", "AWS (advanced)", "Monitoring"]
    }
  ];

  const getMatchColor = (score) => {
    if (score >= 85) return 'emerald';
    if (score >= 75) return 'amber';
    return 'red';
  };

  const handleApplyClick = (title) => {
    setSelectedRole(title);
    setIsModalOpen(true);
    fetchLiveJobs(title, locationQuery);
  };

  const fetchLiveJobs = async (roleName, loc) => {
    setSearchingJobs(true);
    try {
      const data = await searchJobs({ role: roleName, location: loc });
      setLiveJobs(data.jobs || []);
    } catch (err) {
      console.error("Job search failed", err);
      showToast("Could not load live jobs. Showing direct portal links.", "warning");
      setLiveJobs([]);
    } finally {
      setSearchingJobs(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLiveJobs(selectedRole, locationQuery);
  };

  const handleBookmarkJob = async (job) => {
    try {
      await saveJob({
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        applicationUrl: job.application_url,
        matchPercentage: 90,
        requiredSkills: [selectedRole]
      });
      showToast("Job bookmarked to Saved Jobs!", "success");
    } catch (err) {
      showToast("Failed to save job", "error");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Job Matches</h1>
          <p className="text-slate-500 mt-1">Based on your extracted resume skills, education and projects.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex justify-between items-start mb-6">
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="circular" width={64} height={64} />
              </div>
              <div className="space-y-4">
                <Skeleton variant="rectangular" height={60} />
                <Skeleton variant="rectangular" height={60} />
              </div>
            </Card>
          ))
        ) : (
          matches.map((job, idx) => (
            <Card key={idx} hover className="p-6 flex flex-col h-full border-slate-200 hover:border-indigo-200">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-slate-900 pr-4">{job.title}</h2>
                <div className="shrink-0 flex flex-col items-center">
                  <CircularProgress value={job.match} max={100} size={64} strokeWidth={6} color={getMatchColor(job.match)} />
                  <span className="text-xs font-semibold text-slate-500 mt-1">Match</span>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                    <Check size={16} className="text-emerald-500" /> Matched Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.matched.map(skill => (
                      <Badge key={skill} variant="success">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                    <X size={16} className="text-red-500" /> Missing Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.missing.map(skill => (
                      <Badge key={skill} variant="error">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-slate-100">
                <Button variant="secondary" onClick={() => navigate('/career-recommendations')} className="flex-1 min-w-[140px]">
                  View Career Path
                </Button>
                <Button onClick={() => handleApplyClick(job.title)} className="flex-1 min-w-[140px]" icon={ExternalLink}>
                  Apply for Jobs →
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Live Job Search Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Live Jobs — ${selectedRole}`} size="lg">
        <div className="space-y-6">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)} 
                placeholder="Job Role"
                icon={Search}
              />
            </div>
            <div className="flex gap-2">
              <Input 
                value={locationQuery} 
                onChange={(e) => setLocationQuery(e.target.value)} 
                placeholder="Location"
                icon={MapPin}
              />
              <Button type="submit" loading={searchingJobs}>Search</Button>
            </div>
          </form>

          {searchingJobs ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Fetching real live job opportunities...</p>
            </div>
          ) : liveJobs.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              {liveJobs.map((job, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-white flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{job.title}</h4>
                      {job.source === 'adzuna' && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full uppercase">Verified API</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700"><Building size={14} /> {job.company}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                      {job.salary_min && (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium"><DollarSign size={14} /> {job.salary_min.toLocaleString()}</span>
                      )}
                    </div>
                    {job.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 mt-2">{job.description.replace(/<[^>]*>?/gm, '')}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleBookmarkJob(job)} 
                      className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                      title="Bookmark Job"
                    >
                      <BookmarkPlus size={18} />
                    </button>
                    <a 
                      href={job.application_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center font-medium rounded-lg text-sm px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow transition-all"
                    >
                      Apply Now →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <p className="text-sm text-slate-500">Search directly on external career portals:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a 
                  href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(selectedRole)}&location=${encodeURIComponent(locationQuery)}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <span className="font-semibold text-slate-800">LinkedIn Jobs</span>
                  <ExternalLink size={18} className="text-indigo-500" />
                </a>
                <a 
                  href={`https://www.indeed.com/jobs?q=${encodeURIComponent(selectedRole)}&l=${encodeURIComponent(locationQuery)}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <span className="font-semibold text-slate-800">Indeed Search</span>
                  <ExternalLink size={18} className="text-indigo-500" />
                </a>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
