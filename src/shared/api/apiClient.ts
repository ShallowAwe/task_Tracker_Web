import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Endpoints that should NOT trigger a token refresh on 401
const AUTH_NO_REFRESH = ['/auth/login', '/auth/logout', '/auth/refresh'];

// Track in-flight refresh to avoid duplicate refresh calls
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  // Use raw axios (not apiClient) to avoid interceptor loops
  const response = await axios.post<{ accessToken: string; refreshToken: string }>(
    '/auth/refresh',
    { refreshToken }
  );

  const { accessToken, refreshToken: newRefreshToken } = response.data;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', newRefreshToken);
  return accessToken;
}

function forceLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  // Dispatch a custom event so AuthContext can react without a hard reload
  window.dispatchEvent(new Event('auth:logout'));
}

// Request interceptor to attach authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const url = originalRequest.url ?? '';

    // Only skip refresh for login/logout/refresh endpoints themselves
    const isAuthExcluded = AUTH_NO_REFRESH.some((path) => url.includes(path));

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthExcluded
    ) {
      originalRequest._retry = true;

      try {
        // Deduplicate concurrent refresh attempts
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const newToken = await refreshPromise;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch {
        forceLogout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
