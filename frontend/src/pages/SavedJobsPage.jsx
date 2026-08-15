import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Trash2, MapPin, Building, BookmarkMinus, Bookmark, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

export default function SavedJobsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([
    {
      id: 1,
      title: "Senior Full Stack Developer",
      company: "TechNova Solutions",
      location: "Remote, US",
      match: 91,
      savedDate: "2023-10-15",
      skills: ["React", "Node.js", "MongoDB", "AWS"]
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "DataFlow Systems",
      location: "New York, NY",
      match: 87,
      savedDate: "2023-10-14",
      skills: ["Java", "Spring Boot", "PostgreSQL", "Docker"]
    },
    {
      id: 3,
      title: "Software Engineer, Machine Learning",
      company: "AI Horizons",
      location: "San Francisco, CA (Hybrid)",
      match: 78,
      savedDate: "2023-10-10",
      skills: ["Python", "TensorFlow", "FastAPI", "SQL"]
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this saved job?")) {
      setSavedJobs(savedJobs.filter(job => job.id !== id));
    }
  };

  const getMatchColorClass = (match) => {
    if (match >= 85) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (match >= 75) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Bookmark className="text-indigo-500" size={28} /> Saved Jobs
          </h1>
          <p className="text-slate-500 mt-1">You have {savedJobs.length} jobs saved for later.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Sort by:</label>
          <select className="bg-white border border-slate-200 rounded-lg text-sm p-2 focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>Recently Saved</option>
            <option>Match % (High to Low)</option>
          </select>
        </div>
      </div>

      {!loading && savedJobs.length === 0 ? (
        <div className="text-center py-20 px-4">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookmarkMinus size={40} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No saved jobs yet</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Browse your job matches and save the ones you're interested in applying to later.
          </p>
          <Button onClick={() => navigate('/jobs')} size="lg">
            Browse Job Matches
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-3">
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="40%" height={20} />
                    <div className="flex gap-2 pt-2">
                      <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
                      <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
                    </div>
                  </div>
                  <div className="w-full md:w-32">
                    <Skeleton variant="rectangular" width="100%" height={40} />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            savedJobs.map((job) => (
              <Card key={job.id} className="p-6 border-slate-200 hover:border-indigo-300 transition-colors group">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h2>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getMatchColorClass(job.match)}`}>
                        {job.match}% Match
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Building size={16} className="text-slate-400" /> {job.company}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-slate-400" /> {job.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar size={16} className="text-slate-400" /> Saved on {job.savedDate}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.skills.map(skill => (
                        <span key={skill} className="bg-slate-50 border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-end gap-3 shrink-0">
                    <Button icon={<ExternalLink size={16} />} className="flex-1 md:flex-none justify-center">
                      Apply Now
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-slate-500 hover:text-red-600 hover:bg-red-50 flex-1 md:flex-none justify-center border border-transparent hover:border-red-100"
                      onClick={() => handleRemove(job.id)}
                      icon={<Trash2 size={16} />}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
