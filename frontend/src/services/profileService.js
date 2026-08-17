import api from './api';

export const profileService = {
  // Get User Profile
  getProfile: () => api.get('/profile/me'),

  // Saved Skills
  getSavedSkills: () => api.get('/profile/skills'),

  addSavedSkills: (skills) => api.post('/profile/skills', { skills }),

  updateSavedSkills: (skills) => api.put('/profile/skills', { skills }),

  deleteSavedSkill: (skillName) => api.delete(`/profile/skills/${encodeURIComponent(skillName)}`),

  // Saved Careers
  getSavedCareers: () => api.get('/profile/careers'),

  saveCareerGoal: (careerData) => api.post('/profile/careers', {
    career_name: careerData.career_name,
    current_skills: careerData.current_skills || [],
    experience_level: careerData.experience_level || 'Beginner',
    learning_time: careerData.learning_time || '10 hrs/week',
    target_timeline: careerData.target_timeline || '2 months',
    roadmap_data: careerData.roadmap_data || {},
  }),

  getSavedCareerById: (careerId) => api.get(`/profile/careers/${careerId}`),

  updateSavedCareer: (careerId, updateData) => api.put(`/profile/careers/${careerId}`, updateData),

  deleteSavedCareer: (careerId) => api.delete(`/profile/careers/${careerId}`),
};
