import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();
const baseURL = configuredBaseUrl || (import.meta.env.DEV ? 'http://localhost:8000' : '');

const api = axios.create({
  baseURL,
});

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

export const getApiConfigurationError = () => {
  if (!configuredBaseUrl && !import.meta.env.DEV) {
    return 'Backend URL is not configured. Set VITE_API_URL in Vercel to your Render backend URL.';
  }
  return '';
};

export default api;
