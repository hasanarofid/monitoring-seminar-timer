import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const seminarService = {
  getAll: () => api.get('/seminars'),
  getById: (id) => api.get(`/seminars/${id}`),
  getActive: () => api.get('/seminars/active'),
  create: (data) => api.post('/seminars', data),
  update: (id, data) => api.put(`/seminars/${id}`, data),
  delete: (id) => api.delete(`/seminars/${id}`),
};

export default api;

