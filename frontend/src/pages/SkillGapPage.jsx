import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

export default function SkillGapPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const chartData = [
    { name: 'JavaScript', you: 85, required: 90 },
    { name: 'React', you: 82, required: 85 },
    { name: 'Node.js', you: 78, required: 80 },
    { name: 'Docker', you: 60, required: 85 },
    { name: 'AWS', you: 50, required: 80 },
    { name: 'TypeScript', you: 20, required: 75 }
  ];

  const have = ["Java", "Python", "JavaScript", "React", "Node.js", "SQL", "Git", "MySQL"];
  const improve = [
    { skill: "Docker", role: "Full Stack / DevOps" },
    { skill: "AWS", role: "Full Stack / Cloud" },
    { skill: "TensorFlow", role: "AI/ML Engineer" }
  ];
  const missing = [
    { skill: "TypeScript", role: "Full Stack / Frontend" },
    { skill: "System Design", role: "Senior Roles" },
    { skill: "Kubernetes", role: "DevOps / Backend" },
    { skill: "CI/CD", role: "All Engineering Roles" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Skill Gap Analysis</h1>
        <p className="text-slate-500 mt-1">Compare your current skills against industry requirements for your target roles.</p>
      </div>

      {/* Visual Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">You vs. Target Role (Full Stack Developer)</h2>
        <div className="h-[350px] w-full">
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height="100%" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="you" name="Your Level" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="required" name="Required Level" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Gap Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Have */}
        <Card className="p-6 border-emerald-100 bg-gradient-to-b from-white to-emerald-50/30">
          <h3 className="text-lg font-semibold text-emerald-900 flex items-center gap-2 mb-6">
            <CheckCircle2 className="text-emerald-500" /> Skills You Have
          </h3>
          {loading ? (
            <div className="flex flex-wrap gap-2">
              {Array(6).fill(0).map((_, i) => <Skeleton key={i} variant="rectangular" width={80} height={28} className="rounded-full" />)}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {have.map(skill => (
                <Badge key={skill} variant="success" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </Card>

        {/* Improve */}
        <Card className="p-6 border-amber-100 bg-gradient-to-b from-white to-amber-50/30">
          <h3 className="text-lg font-semibold text-amber-900 flex items-center gap-2 mb-6">
            <AlertTriangle className="text-amber-500" /> Skills to Improve
          </h3>
          {loading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => <Skeleton key={i} variant="rectangular" height={40} className="rounded-lg" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {improve.map(item => (
                <div key={item.skill} className="p-3 bg-white border border-amber-200 rounded-lg shadow-sm flex justify-between items-center">
                  <span className="font-semibold text-slate-800">{item.skill}</span>
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">{item.role}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Missing */}
        <Card className="p-6 border-rose-100 bg-gradient-to-b from-white to-rose-50/30">
          <h3 className="text-lg font-semibold text-rose-900 flex items-center gap-2 mb-6">
            <XCircle className="text-rose-500" /> Skills You're Missing
          </h3>
          {loading ? (
            <div className="space-y-3">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} variant="rectangular" height={40} className="rounded-lg" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {missing.map(item => (
                <div key={item.skill} className="p-3 bg-white border border-rose-200 rounded-lg shadow-sm flex justify-between items-center">
                  <span className="font-semibold text-slate-800">{item.skill}</span>
                  <span className="text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded">{item.role}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button size="lg" onClick={() => navigate('/roadmap')} icon={<ArrowRight size={20} />}>
          Start Learning Roadmap
        </Button>
      </div>
    </div>
  );
}
