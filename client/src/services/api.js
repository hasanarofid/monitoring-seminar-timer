import axios from 'axios';

// Di production, gunakan relative path (domain yang sama)
// Di development, gunakan localhost
// Pastikan build menggunakan NODE_ENV=production untuk production build
const getApiUrl = () => {
  // Priority 1: Environment variable REACT_APP_API_URL
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Priority 2: Production mode menggunakan relative path
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  // Priority 3: Development mode menggunakan localhost
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

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

