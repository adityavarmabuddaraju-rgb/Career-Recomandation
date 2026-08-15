import api from './api';

export const skillsService = {
  getMySkills: () => api.get('/profile/my-skills'),
  addSkill: (data) => api.post('/profile/my-skills', data),
  updateSkill: (name, level) => api.put(`/profile/my-skills/${encodeURIComponent(name)}`, { level }),
  deleteSkill: (name) => api.delete(`/profile/my-skills/${encodeURIComponent(name)}`),
  getSavedCareers: () => api.get('/profile/saved-careers'),
  saveCareer: (data) => api.post('/profile/saved-careers', data),
  unsaveCareer: (slug) => api.delete(`/profile/saved-careers/${encodeURIComponent(slug)}`),
  getUserProfile: () => api.get('/profile/user-profile'),
  updateUserProfile: (data) => api.put('/profile/user-profile', data),
};
