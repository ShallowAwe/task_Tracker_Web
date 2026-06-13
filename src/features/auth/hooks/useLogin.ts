import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../api/authService";
import type { LoginRequest, LoginResponse } from "../types/auth.types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useAlertStore } from "../../../shared/store/AlertStore";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((s) => s.showAlert);

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: async (data: LoginResponse) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      try {
        const userData = await authService.getMe();
        setUser(userData);
        queryClient.invalidateQueries({ queryKey: ["user"] });

        showAlert({
          variant: "success",
          title: "Welcome back!",
          message: `Signed in as ${userData.name || userData.email}`,
        });

        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to fetch user after login:", error);
        showAlert({
          variant: "warning",
          title: "Signed in",
          message: "Logged in but failed to load your profile. Retrying...",
        });
        navigate("/dashboard");
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please check your credentials.";

      showAlert({
        variant: "error",
        title: "Sign in failed",
        message,
      });
    },
  });
};
