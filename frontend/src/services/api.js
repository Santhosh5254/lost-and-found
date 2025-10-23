import axios from 'axios';

// Use Vite environment variable for backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);
console.log('Environment variables:', import.meta.env);

const api = axios.create({
  baseURL: API_BASE_URL, // Backend URL from env
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log('API Request - User info from localStorage:', userInfo);
    if (userInfo && userInfo.token) {
      config.headers['Authorization'] = `Bearer ${userInfo.token}`;
      console.log('API Request - Authorization header set:', config.headers['Authorization']);
    } else {
      console.log('API Request - No user info or token found');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Utility function to get the correct image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  console.log('Original image path:', imagePath);
  // The imagePath from the database already has a leading slash (e.g., /uploads/image.jpg)
  // We just need to append it to the base URL without /api
  const baseUrl = API_BASE_URL.replace('/api', '');
  const fullUrl = `${baseUrl}${imagePath}`;
  console.log('Generated image URL:', fullUrl);
  return fullUrl;
};

export default api;
