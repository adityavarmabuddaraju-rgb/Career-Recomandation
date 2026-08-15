import api from './api';

export const searchJobs = (query) => api.get('/jobs/search', { params: query });
export const saveJob = (jobData) => api.post('/jobs/save', jobData);
export const getSavedJobs = () => api.get('/jobs/saved');
export const deleteSavedJob = (id) => api.delete(`/jobs/saved/${id}`);
