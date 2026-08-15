import api from './api';

export const analyzeResume = (resumeId) => api.post(`/analysis/analyze/${resumeId}`);
export const getLatestAnalysis = () => api.get('/analysis/latest');
export const getAnalysis = (id) => api.get(`/analysis/${id}`);
export const getAnalyses = () => api.get('/analysis/list');
