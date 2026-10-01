import axios from 'axios';
const API_URL = 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
export default api;
