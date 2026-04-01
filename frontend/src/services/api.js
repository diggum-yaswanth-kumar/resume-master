import axios from 'axios';

const api = axios.create({
  // Use the live production Render backend
  baseURL: import.meta.env.VITE_API_URL || 'https://resume-master-r25o.onrender.com',
});

// Request Interceptor: add the JWT token to headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
