import api from './api';

export const login = (email, password) => api.post('/auth/login', { email, password });
export const signup = (name, email, password) => api.post('/auth/signup', { name, email, password });
export const getMe = () => api.get('/auth/me');
export const refreshToken = () => api.post('/auth/refresh');
