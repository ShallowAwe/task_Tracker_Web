import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../api/authService";
import type { LoginRequest, LoginResponse } from "../types/auth.types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

/**
 * Custom hook for handling login mutation.
 * Manages loading states, success logic (token storage), and fetching user profile.
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: async (data: LoginResponse) => {
      // 1. Store tokens in localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      
      try {
        // 2. Fetch the user profile immediately
        const userData = await authService.getMe();
        
        // 3. Update global AuthContext
        setUser(userData);
        
        // 4. Invalidate any existing auth-related queries
        queryClient.invalidateQueries({ queryKey: ["user"] });

        // 5. Redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to fetch user after login:", error);
        // Even if profiling fails, we have the tokens, 
        // but we might want to handle this case (e.g., logout or manual retry)
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
    },
  });
};
