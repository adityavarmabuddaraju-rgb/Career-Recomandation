import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Search, Plus, Sparkles, X, BrainCircuit } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { profileService } from '../services/profileService';
import { useToast } from '../context/ToastContext';

export default function SkillsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userSkills, setUserSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await profileService.getSavedSkills();
      setUserSkills(res.skills || []);
    } catch (err) {
      console.warn("Notice loading skills:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (userSkills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      showToast('Skill already in your list.', 'info');
      return;
    }

    setAdding(true);
    try {
      const res = await profileService.addSavedSkills([trimmed]);
      setUserSkills(res.skills);
      setNewSkill('');
      showToast(`Added "${trimmed}" to Your Skills!`, 'success');
    } catch (err) {
      showToast('Failed to add skill.', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSkill = async (skillToDelete) => {
    try {
      const res = await profileService.deleteSavedSkill(skillToDelete);
      setUserSkills(res.skills);
      showToast(`Removed "${skillToDelete}".`, 'info');
    } catch (err) {
      showToast('Failed to delete skill.', 'error');
    }
  };

  const filteredSkills = userSkills.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Skills</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Displays only the skills you have entered or saved to your profile.
          </p>
        </div>
        <Button onClick={() => navigate('/career-discovery')} icon={Sparkles}>
          Discover Careers by Skills →
        </Button>
      </div>

      {/* Add Skill Form */}
      <Card className="p-6 border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BrainCircuit className="text-indigo-600" size={18} /> Add a New Skill
        </h2>
        <form onSubmit={handleAddSkill} className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            placeholder="Type any skill (e.g. Figma, Python, SQL, Photoshop, Teaching, Accounting)..."
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
          />
          <Button type="submit" loading={adding} icon={Plus} size="sm">
            Add Skill
          </Button>
        </form>
      </Card>

      {/* Search Filter */}
      {userSkills.length > 0 && (
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search your skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-400"
          />
        </div>
      )}

      {/* Skills Display / Empty State */}
      <Card className="p-6 border-slate-200 shadow-sm">
        {loading ? (
          <div className="flex flex-wrap gap-2">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} variant="rectangular" width={110} height={36} className="rounded-xl" />
            ))}
          </div>
        ) : userSkills.length === 0 ? (
          /* EMPTY STATE */
          <div className="p-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-300 space-y-3">
            <div className="text-4xl">💡</div>
            <h3 className="text-lg font-bold text-slate-900">No skills added yet.</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Add your current skills above or use Career Discovery to analyze your skills across any domain.
            </p>
            <div className="pt-2">
              <Button onClick={() => navigate('/career-discovery')} icon={Sparkles} size="sm">
                Add Skills in Discovery →
              </Button>
            </div>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No skills match "{search}".
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {filteredSkills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50/80 border border-indigo-200 text-indigo-950 rounded-xl text-xs font-bold shadow-2xs hover:bg-indigo-100 transition-colors"
              >
                <CheckCircle2 size={14} className="text-indigo-600 shrink-0" />
                <span>{skill}</span>
                <button
                  onClick={() => handleDeleteSkill(skill)}
                  className="text-indigo-400 hover:text-red-600 transition-colors ml-1"
                  title="Remove skill"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
