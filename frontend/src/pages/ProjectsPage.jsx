import React, { useState, useEffect } from 'react';
import { Star, Clock, Code, ExternalLink, Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const projects = [
    {
      title: "AI Resume Analyzer",
      difficulty: "Advanced",
      hours: "40hrs",
      resumeValue: 5,
      description: "Build a full-stack application that parses resumes using NLP, evaluates them against job descriptions, and provides actionable feedback.",
      skills: ["Python", "FastAPI", "LLM APIs", "MongoDB", "React", "Tailwind"],
      highlight: true
    },
    {
      title: "E-Commerce Platform",
      difficulty: "Advanced",
      hours: "50hrs",
      resumeValue: 5,
      description: "A comprehensive microservices-based e-commerce platform with inventory management, payment processing, and user authentication.",
      skills: ["React", "Node.js", "MongoDB", "Stripe", "Docker", "Redis"],
      highlight: false
    },
    {
      title: "ML Model Deployment Pipeline",
      difficulty: "Advanced",
      hours: "35hrs",
      resumeValue: 4,
      description: "Create an automated CI/CD pipeline to train, evaluate, and deploy machine learning models to cloud infrastructure.",
      skills: ["Python", "Docker", "AWS", "FastAPI", "GitHub Actions"],
      highlight: true
    },
    {
      title: "Real-Time Chat App",
      difficulty: "Intermediate",
      hours: "30hrs",
      resumeValue: 4,
      description: "A scalable real-time messaging application with private rooms, media sharing, and read receipts.",
      skills: ["Node.js", "Socket.io", "React", "PostgreSQL"],
      highlight: false
    },
    {
      title: "Task Management System",
      difficulty: "Intermediate",
      hours: "25hrs",
      resumeValue: 3,
      description: "A Kanban-style project management tool with drag-and-drop functionality and role-based access control.",
      skills: ["React", "Express", "MongoDB", "JWT"],
      highlight: false
    },
    {
      title: "Portfolio Website with CMS",
      difficulty: "Beginner",
      hours: "15hrs",
      resumeValue: 3,
      description: "A fast, SEO-optimized personal portfolio with a headless CMS for easy content updates.",
      skills: ["React", "Next.js", "Tailwind CSS", "Sanity"],
      highlight: false
    }
  ];

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} size={14} className={i < rating ? "text-amber-500 fill-amber-500" : "text-slate-300"} />
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Recommended Projects</h1>
          <p className="text-slate-500 mt-1">Build these projects to fill your skill gaps and strengthen your resume.</p>
        </div>
        <Button variant="secondary" icon={<Filter size={16} />}>Filter Projects</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="p-6 flex flex-col h-full">
              <Skeleton variant="text" width="80%" height={28} className="mb-2" />
              <div className="flex gap-2 mb-4">
                <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
                <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
              </div>
              <Skeleton variant="rectangular" width="100%" height={60} className="mb-4" />
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                <Skeleton variant="rectangular" width={80} height={20} />
                <Skeleton variant="rectangular" width={100} height={36} className="rounded-lg" />
              </div>
            </Card>
          ))
        ) : (
          projects.map((project, idx) => (
            <Card key={idx} hover className={`p-6 flex flex-col h-full ${project.highlight ? 'border-indigo-300 shadow-md shadow-indigo-100/50' : 'border-slate-200'}`}>
              {project.highlight && (
                <div className="mb-4">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-200">
                    Highest Impact for You
                  </span>
                </div>
              )}
              
              <h2 className="text-xl font-bold text-slate-900 mb-3">{project.title}</h2>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant={project.difficulty === 'Beginner' ? 'success' : project.difficulty === 'Intermediate' ? 'warning' : 'error'}>
                  {project.difficulty}
                </Badge>
                <div className="flex items-center text-sm text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                  <Clock size={14} className="mr-1" /> {project.hours}
                </div>
                <div className="flex items-center bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                  <span className="text-xs font-medium text-amber-700 mr-1.5">Resume Value</span>
                  <div className="flex">{renderStars(project.resumeValue)}</div>
                </div>
              </div>

              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {project.description}
              </p>

              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Code size={14} /> Skills You'll Gain
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.skills.map(skill => (
                    <span key={skill} className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2 py-1 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-5 border-t border-slate-100">
                <Button fullWidth variant={project.highlight ? 'primary' : 'secondary'} className="group">
                  View Project Details 
                  <ExternalLink size={16} className="ml-2 text-current opacity-70 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
