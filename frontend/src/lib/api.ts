// Purpose: Axios AxiosInstance Config, JWT Request Interceptor & Global Error Handling
// Path: frontend/src/lib/api.ts

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create central Axios client instance targeting the backend API base path
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15-second timeout for standard HTTP API requests
});

// Request Interceptor: Inject JWT Bearer Token into headers when present
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('garmint_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle API errors and token expiration
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Automatic session cleanup on 401 Unauthorized token invalidation
      if (error.response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('garmint_token');
        localStorage.removeItem('garmint_user');

        // Redirect to login page if user is currently on a protected route
        if (
          !window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register')
        ) {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;