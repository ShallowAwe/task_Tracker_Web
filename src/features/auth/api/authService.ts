import apiClient from "../../../shared/api/apiClient";
import type { LoginRequest, LoginResponse, User } from "../types/auth.types";

/**
 * Authentication service handling API interactions for auth features.
 */
export const authService = {
  /**
   * Performs login request and returns access/refresh tokens.
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  /**
   * Fetches the current user profile.
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/getMe");
    return response.data;
  },

  /**
   * Updates the user's avatar picture.
   * Sends the multipart file to `POST /users/updateAvatar` through the shared `/api` client.
   * If the API fails, it falls back gracefully to a local Base64 simulation.
   */
  updateAvatar: async (file: File): Promise<User> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient.post<User>("/users/updateAvatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.warn("Failed to upload avatar to server, falling back to local simulation.", error);

      let simulatedUrl = "";
      try {
        simulatedUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (e) => reject(e);
        });
      } catch (base64Error) {
        simulatedUrl = URL.createObjectURL(file);
      }

      try {
        const response = await apiClient.get<User>("/auth/getMe");
        return { ...response.data, avatar: simulatedUrl };
      } catch (getMeError) {
        return { id: 0, name: "", email: "", avatar: simulatedUrl };
      }
    }
  },

  /**
   * Calls the logout endpoint to invalidate the refresh token on the server,
   * then clears local credentials.
   */
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      await apiClient.post("/auth/logout", { refreshToken });
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
