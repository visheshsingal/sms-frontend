import axios from 'axios';

const API = axios.create({
  // Default to backend port 5001 (server uses PORT=5001 by default)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

