import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth.types";
import { authService } from "../api/authService";
import { useAlertStore } from "../../../shared/store/AlertStore";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(async () => {
    const showAlert = useAlertStore.getState().showAlert;
    try {
      await authService.logout();
      showAlert({ variant: "success", message: "You have been signed out." });
    } catch (error) {
      console.error("Server-side logout failed:", error);
      showAlert({ variant: "warning", message: "Signed out locally, but server session may still be active." });
    } finally {
      setUser(null);
    }
  }, []);

  const updateAvatar = useCallback(async (file: File) => {
    try {
      const updatedUser = await authService.updateAvatar(file);
      setUser((prev) => prev ? { ...prev, avatar: updatedUser.avatar || prev.avatar } : null);
    } catch (error) {
      console.error("Failed to update avatar in context:", error);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Listen for forced logout from the API interceptor (e.g. refresh token expired)
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      useAlertStore.getState().showAlert({
        variant: "warning",
        message: "Your session has expired. Please sign in again.",
      });
    };

    window.addEventListener("auth:logout", handleForceLogout);
    return () => window.removeEventListener("auth:logout", handleForceLogout);
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    logout,
    updateAvatar,
  }), [user, isLoading, logout, updateAvatar]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
