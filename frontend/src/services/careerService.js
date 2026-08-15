import api from './api';

export const careerService = {
  getDatabase: () => api.get('/career/database'),
  getCategories: () => api.get('/career/categories'),
  getCareerDetail: (slug) => api.get(`/career/${slug}`),
  compareCareers: (slugs) => api.post('/career/compare', { career_slugs: slugs }),
  discoverCareers: (data) => api.post('/career/discover', data),
  targetCareer: (data) => api.post('/career/target', data),
};
