import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Bookmark, Sparkles, Plus, Edit2, Trash2, CheckCircle2,
  BookOpen, Clock, Target, Layers, Code, HelpCircle, FileText, X, Loader2, AlertCircle, Calendar
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { profileService } from '../services/profileService';

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [savedSkills, setSavedSkills] = useState([]);
  const [savedCareers, setSavedCareers] = useState([]);

  // Edit / Add Skill State
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [editedSkillsList, setEditedSkillsList] = useState([]);

  // Selected Saved Career Roadmap Modal
  const [activeRoadmapModal, setActiveRoadmapModal] = useState(null);
  const [modalTab, setModalTab] = useState('overview');

  // Update Saved Career Modal State
  const [updateCareerModal, setUpdateCareerModal] = useState(null);
  const [updatingCareer, setUpdatingCareer] = useState(false);

  // Load profile data on mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [skillsRes, careersRes] = await Promise.all([
        profileService.getSavedSkills(),
        profileService.getSavedCareers(),
      ]);
      setSavedSkills(skillsRes.skills || []);
      setEditedSkillsList(skillsRes.skills || []);
      setSavedCareers(careersRes.careers || []);
    } catch (err) {
      console.warn("Notice loading profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Skill Handlers ──────────────────────────────────────────────────────────

  const handleAddSkill = async (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (savedSkills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      showToast('Skill already saved.', 'info');
      return;
    }

    try {
      const res = await profileService.addSavedSkills([trimmed]);
      setSavedSkills(res.skills);
      setEditedSkillsList(res.skills);
      setNewSkillInput('');
      showToast(`Saved "${trimmed}" to your profile!`, 'success');
    } catch (err) {
      showToast('Failed to save skill.', 'error');
    }
  };

  const handleDeleteSkill = async (skillToDelete) => {
    try {
      const res = await profileService.deleteSavedSkill(skillToDelete);
      setSavedSkills(res.skills);
      setEditedSkillsList(res.skills);
      showToast(`Removed "${skillToDelete}".`, 'info');
    } catch (err) {
      showToast('Failed to delete skill.', 'error');
    }
  };

  const handleSaveEditedSkills = async () => {
    try {
      const res = await profileService.updateSavedSkills(editedSkillsList);
      setSavedSkills(res.skills);
      setIsEditingSkills(false);
      showToast('Updated saved skills successfully!', 'success');
    } catch (err) {
      showToast('Failed to update skills list.', 'error');
    }
  };

  // ─── Career Handlers ─────────────────────────────────────────────────────────

  const handleDeleteCareer = async (careerId, careerName) => {
    try {
      await profileService.deleteSavedCareer(careerId);
      setSavedCareers(prev => prev.filter(c => c.id !== careerId));
      showToast(`Removed "${careerName}" from your saved goals.`, 'info');
    } catch (err) {
      showToast('Failed to remove career goal.', 'error');
    }
  };

  const handleUpdateCareerSubmit = async (e) => {
    e.preventDefault();
    if (!updateCareerModal) return;

    setUpdatingCareer(true);
    try {
      const res = await profileService.updateSavedCareer(updateCareerModal.id, {
        career_name: updateCareerModal.career_name,
        current_skills: typeof updateCareerModal.current_skills === 'string'
          ? updateCareerModal.current_skills.split(',').map(s => s.trim()).filter(Boolean)
          : updateCareerModal.current_skills,
        learning_time: updateCareerModal.learning_time,
        target_timeline: updateCareerModal.target_timeline,
        regenerate: true,
      });

      showToast('Career updated and new roadmap generated!', 'success');
      setUpdateCareerModal(null);
      fetchProfileData();
    } catch (err) {
      showToast('Failed to update career goal.', 'error');
    } finally {
      setUpdatingCareer(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Manage your account info, saved skills, and saved career roadmaps.
        </p>
      </div>

      {/* ─── SECTION 1: PROFILE INFO ─── */}
      <Card className="p-6 border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-white to-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{user?.name || 'User'}</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Mail size={13} className="text-slate-400" /> {user?.email || 'user@example.com'}
            </p>
            <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <CheckCircle2 size={11} /> Authenticated Account
            </span>
          </div>
        </div>

        <Button onClick={() => navigate('/career-discovery')} icon={Sparkles} size="sm">
          Explore AI Roadmaps
        </Button>
      </Card>

      {/* ─── SECTION 2: SAVED SKILLS ─── */}
      <Card className="p-6 border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={20} /> My Saved Skills
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Permanently saved skills attached to your account across sessions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isEditingSkills ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditingSkills(true)}
                icon={Edit2}
              >
                Edit Skills
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSaveEditedSkills}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* Add Skill Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkillInput}
            onChange={e => setNewSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(newSkillInput); } }}
            placeholder="Add a new skill (e.g. Python, SQL, Figma)..."
            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
          />
          <Button size="sm" onClick={() => handleAddSkill(newSkillInput)} icon={Plus}>
            Add Skill
          </Button>
        </div>

        {/* Saved Skills Chips */}
        {loading ? (
          <div className="flex flex-wrap gap-2">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-slate-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : savedSkills.length === 0 ? (
          /* EMPTY STATE FOR SKILLS */
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-sm font-semibold text-slate-600 mb-1">No skills saved yet.</p>
            <p className="text-xs text-slate-400 mb-4">Add the skills you know above to build your permanent skill profile.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {savedSkills.map(s => (
              <span
                key={s}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50/80 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-bold shadow-2xs group hover:bg-indigo-100 transition-colors"
              >
                <span>{s}</span>
                <button
                  onClick={() => handleDeleteSkill(s)}
                  className="text-indigo-400 hover:text-red-600 transition-colors"
                  title="Remove skill"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* ─── SECTION 3: SAVED CAREER GOALS ─── */}
      <Card className="p-6 border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="text-violet-600" size={20} /> My Career Goals
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Saved career targets with pre-generated roadmaps. Click "View Roadmap" to open instantly without regenerating.
            </p>
          </div>
          <Button onClick={() => navigate('/career-discovery?mode=2')} size="sm" icon={Plus}>
            Add Career Goal
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="h-28 bg-slate-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : savedCareers.length === 0 ? (
          /* EMPTY STATE FOR CAREERS */
          <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm font-semibold text-slate-700 mb-1">No career goals saved yet.</p>
            <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
              Explore careers in Career Discovery and click "Save Career" to store your personalized roadmap here.
            </p>
            <Button onClick={() => navigate('/career-discovery')} icon={Sparkles} size="sm">
              Explore Careers →
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedCareers.map(career => (
              <div
                key={career.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-violet-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-extrabold text-slate-900">{career.career_name}</h3>
                    <span className="px-2.5 py-0.5 bg-violet-50 text-violet-800 border border-violet-200 rounded-full text-[10px] font-extrabold shrink-0">
                      {career.target_timeline}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                    <p>
                      <span className="font-bold text-slate-800">Current Skills: </span>
                      {career.current_skills?.length > 0 ? career.current_skills.join(', ') : 'None listed'}
                    </p>
                    <p className="flex items-center gap-3">
                      <span>⏱️ <span className="font-bold text-slate-800">Learning Time:</span> {career.learning_time}</span>
                      <span>🎯 <span className="font-bold text-slate-800">Timeline:</span> {career.target_timeline}</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <Button
                    size="sm"
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold"
                    onClick={() => { setActiveRoadmapModal(career); setModalTab('overview'); }}
                    icon={BookOpen}
                  >
                    View Roadmap
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setUpdateCareerModal({
                      id: career.id,
                      career_name: career.career_name,
                      current_skills: career.current_skills?.join(', ') || '',
                      learning_time: career.learning_time,
                      target_timeline: career.target_timeline,
                    })}
                    icon={Edit2}
                  >
                    Update
                  </Button>
                  <button
                    onClick={() => handleDeleteCareer(career.id, career.career_name)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Remove Goal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ─── MODAL 1: VIEW SAVED ROADMAP ─── */}
      {activeRoadmapModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-400 block">Saved Career Roadmap</span>
                <h2 className="text-2xl font-extrabold text-white">{activeRoadmapModal.career_name}</h2>
              </div>
              <button
                onClick={() => setActiveRoadmapModal(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0 overflow-x-auto custom-scrollbar">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'roadmap', label: 'Roadmap Timeline', icon: Layers },
                { id: 'projects', label: 'Time-Aware Projects', icon: Code },
                { id: 'interview', label: 'Interview Prep', icon: HelpCircle },
                { id: 'resume', label: 'Resume Bullets', icon: FileText },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setModalTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition-all ${
                    modalTab === t.id
                      ? 'border-violet-600 text-violet-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <t.icon size={14} /> {t.label}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {(() => {
                const data = activeRoadmapModal.roadmap_data || {};

                if (modalTab === 'overview') {
                  const ov = data.career_overview;
                  return (
                    <div className="space-y-4 text-xs text-slate-700">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <span className="font-bold text-slate-900 block mb-1 text-sm">{ov?.title || activeRoadmapModal.career_name}</span>
                        <p className="text-slate-600">{ov?.role_description || 'Pre-generated career roadmap payload.'}</p>
                      </div>

                      {ov?.typical_responsibilities?.length > 0 && (
                        <div>
                          <span className="font-bold text-slate-800 block mb-1.5">Responsibilities:</span>
                          <ul className="list-disc list-inside space-y-1">
                            {ov.typical_responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                          </ul>
                        </div>
                      )}

                      <div className="p-3 bg-violet-50 rounded-xl border border-violet-200">
                        <span className="font-bold text-violet-900 block mb-1">Target Parameters:</span>
                        <p>Skills: {activeRoadmapModal.current_skills?.join(', ') || 'None'} | Time: {activeRoadmapModal.learning_time} | Timeline: {activeRoadmapModal.target_timeline}</p>
                      </div>
                    </div>
                  );
                }

                if (modalTab === 'roadmap') {
                  const rm = data.roadmap;
                  if (!rm) return <p className="text-xs text-slate-500">No roadmap stages available.</p>;

                  return (
                    <div className="space-y-4">
                      {['beginner_stage', 'intermediate_stage', 'advanced_stage'].map((stKey, i) => {
                        const st = rm[stKey];
                        if (!st) return null;
                        return (
                          <div key={stKey} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-2">
                            <span className="text-[10px] font-extrabold text-violet-600 uppercase">Stage {i+1}</span>
                            <h4 className="font-bold text-slate-900 text-sm">{st.title}</h4>
                            <p className="text-xs text-slate-500">{st.why_learn_this}</p>
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {st.topics?.map(t => (
                                <span key={t} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold">
                                  📌 {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                if (modalTab === 'projects') {
                  const pr = data.project_roadmap;
                  const projects = [pr?.beginner_project, pr?.intermediate_project, pr?.advanced_project].filter(Boolean);

                  return (
                    <div className="space-y-4">
                      {projects.map((p, i) => (
                        <div key={i} className="p-4 border border-slate-200 rounded-2xl space-y-2 text-xs">
                          <span className="text-[10px] font-extrabold text-violet-600 uppercase">{p.difficulty}</span>
                          <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                          <p className="text-slate-600">{p.relevance}</p>
                          {p.suggested_bullet_points?.map((bp, j) => (
                            <p key={j} className="p-2 bg-indigo-50 text-indigo-900 rounded font-mono text-[11px]">
                              "{bp}"
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                }

                if (modalTab === 'interview') {
                  const prep = data.interview_preparation;
                  if (!prep) return <p className="text-xs text-slate-500">No interview prep data.</p>;

                  return (
                    <div className="space-y-4 text-xs">
                      {prep.technical_topics && (
                        <div>
                          <span className="font-bold text-slate-800 block mb-1">Technical Topics:</span>
                          <ul className="list-disc list-inside space-y-1 text-slate-600">{prep.technical_topics.map((t, i) => <li key={i}>{t}</li>)}</ul>
                        </div>
                      )}
                      {prep.coding_topics && (
                        <div>
                          <span className="font-bold text-slate-800 block mb-1">Coding Topics:</span>
                          <ul className="list-disc list-inside space-y-1 text-slate-600">{prep.coding_topics.map((t, i) => <li key={i}>{t}</li>)}</ul>
                        </div>
                      )}
                    </div>
                  );
                }

                if (modalTab === 'resume') {
                  const pr = data.project_roadmap;
                  const projects = [pr?.beginner_project, pr?.intermediate_project, pr?.advanced_project].filter(Boolean);

                  return (
                    <div className="space-y-3 text-xs">
                      {projects.map((p, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl space-y-1">
                          <span className="font-bold text-slate-800">{p.name}</span>
                          {p.suggested_bullet_points?.map((bp, j) => (
                            <p key={j} className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px]">"{bp}"</p>
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                }

                return null;
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: UPDATE CAREER GOAL ─── */}
      {updateCareerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">Update Career Goal</h3>
              <button onClick={() => setUpdateCareerModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateCareerSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Career Goal Title</label>
                <input
                  type="text"
                  value={updateCareerModal.career_name}
                  onChange={e => setUpdateCareerModal({ ...updateCareerModal, career_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Skills (comma separated)</label>
                <input
                  type="text"
                  value={updateCareerModal.current_skills}
                  onChange={e => setUpdateCareerModal({ ...updateCareerModal, current_skills: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Learning Time</label>
                  <input
                    type="text"
                    value={updateCareerModal.learning_time}
                    onChange={e => setUpdateCareerModal({ ...updateCareerModal, learning_time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Timeline</label>
                  <input
                    type="text"
                    value={updateCareerModal.target_timeline}
                    onChange={e => setUpdateCareerModal({ ...updateCareerModal, target_timeline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <Button type="button" variant="secondary" fullWidth onClick={() => setUpdateCareerModal(null)}>
                  Cancel
                </Button>
                <Button type="submit" fullWidth loading={updatingCareer} className="bg-violet-600 hover:bg-violet-700 text-white font-bold">
                  Generate Updated Roadmap
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
