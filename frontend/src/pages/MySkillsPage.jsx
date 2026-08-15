import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Award, Zap, Briefcase, ChevronRight } from 'lucide-react';
import { skillsService } from '../services/skillsService';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';

export default function MySkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Beginner');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await skillsService.getMySkills();
      // axios interceptor already unwraps response.data
      setSkills(res?.skills || []);
    } catch (err) {
      if(showToast) showToast('Failed to load skills.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      setIsSubmitting(true);
      await skillsService.addSkill({
        name: newSkillName.trim(),
        level: newSkillLevel,
        category: newSkillCategory.trim() || undefined
      });
      if(showToast) showToast('Skill added successfully!', 'success');
      setNewSkillName('');
      setNewSkillCategory('');
      fetchSkills();
    } catch (err) {
      if(showToast) showToast('Failed to add skill.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (name) => {
    try {
      await skillsService.deleteSkill(name);
      setSkills(skills.filter(s => s.name !== name));
      if(showToast) showToast('Skill removed.', 'success');
    } catch (err) {
      if(showToast) showToast('Failed to remove skill.', 'error');
    }
  };

  const handleUpdateLevel = async (name, newLevel) => {
    try {
      await skillsService.updateSkill(name, newLevel);
      setSkills(skills.map(s => s.name === name ? { ...s, level: newLevel } : s));
      if(showToast) showToast(`Skill updated to ${newLevel}.`, 'success');
    } catch (err) {
      if(showToast) showToast('Failed to update skill.', 'error');
    }
  };

  const groupedSkills = {
    Beginner: skills.filter(s => s.level === 'Beginner'),
    Intermediate: skills.filter(s => s.level === 'Intermediate'),
    Advanced: skills.filter(s => s.level === 'Advanced'),
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Intermediate': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Advanced': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
              <Zap className="w-8 h-8 mr-3 text-indigo-600" /> My Skills
            </h1>
            <p className="mt-2 text-gray-600">Track and manage your professional skill set.</p>
          </div>
        </div>

        {/* Add Skill Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-indigo-500" /> Add New Skill
          </h2>
          <form onSubmit={handleAddSkill} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
              <input
                type="text"
                required
                placeholder="e.g. React, Project Management"
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Technical"
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
              />
            </div>
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                  <button
                    key={level}
                    type="button"
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      newSkillLevel === level 
                      ? 'bg-white text-indigo-700 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setNewSkillLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || !newSkillName.trim()}
              className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              Add
            </Button>
          </form>
        </div>

        {/* Skills List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : skills.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-200">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h3>
            <p className="text-gray-500">Add your first skill above to start building your profile.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {['Advanced', 'Intermediate', 'Beginner'].map(level => {
              const levelSkills = groupedSkills[level];
              if (levelSkills.length === 0) return null;
              
              return (
                <div key={level}>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                    {level} <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{levelSkills.length}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {levelSkills.map(skill => (
                      <div key={skill.name} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col group relative">
                        <button 
                          onClick={() => handleDeleteSkill(skill.name)}
                          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove Skill"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        <h4 className="font-bold text-gray-900 pr-6 break-words">{skill.name}</h4>
                        {skill.category && (
                          <span className="text-xs text-gray-500 mt-1">{skill.category}</span>
                        )}
                        
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getLevelColor(skill.level)}`}>
                            {skill.level}
                          </span>
                          
                          <select 
                            className="text-xs text-gray-500 border-none bg-transparent focus:ring-0 cursor-pointer"
                            value={skill.level}
                            onChange={(e) => handleUpdateLevel(skill.name, e.target.value)}
                          >
                            <option value="Beginner">Set Beginner</option>
                            <option value="Intermediate">Set Intermediate</option>
                            <option value="Advanced">Set Advanced</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Button 
            onClick={() => navigate('/career-assessment')}
            className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center shadow-lg"
          >
            <Briefcase className="w-5 h-5 mr-3" />
            Use My Skills for Career Discovery <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

      </div>
    </div>
  );
}
