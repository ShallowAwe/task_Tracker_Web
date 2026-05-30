/**
 * Request payload for the login endpoint.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Response payload from the login endpoint.
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * User profile information.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Generic error response structure (standard Spring Boot / common API pattern).
 */
export interface ApiError {
  message: string;
  timestamp: string;
  status: number;
}
