import axios from 'axios';

/**
 * Shared Axios instance for all API calls.
 * Configured with base URL, timeout, and common headers.
 */
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific status codes
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Token might be expired or invalid
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Optional: Redirect to login or broadcast logout event
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
