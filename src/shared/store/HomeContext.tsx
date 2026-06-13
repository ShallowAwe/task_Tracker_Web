import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback, useMemo } from 'react';
import type { HomeResponse } from '../types/home.types';
import { homeService } from '../api/homeService';
import { useAuth } from '../../features/auth/store/AuthContext';

interface HomeContextType {
  homeData: HomeResponse | null;
  isLoading: boolean;
  refreshHome: () => Promise<void>;
  selectProject: (projectKey: string) => Promise<void>;
  error: string | null;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchHomeData = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await homeService.getHome();
      setHomeData(data);
    } catch (err) {
      console.error('Failed to fetch home data:', err);
      setError('Failed to load application data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const selectProject = useCallback(async (projectKey: string) => {
    setIsLoading(true);
    try {
      await homeService.selectProject(projectKey);
      await fetchHomeData();
    } catch (err) {
      console.error('Failed to select project:', err);
      setError('Failed to select project. Please try again.');
      setIsLoading(false);
    }
  }, [fetchHomeData]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHomeData();
    } else {
      setHomeData(null);
    }
  }, [isAuthenticated, fetchHomeData]);

  const value = useMemo<HomeContextType>(() => ({
    homeData,
    isLoading,
    refreshHome: fetchHomeData,
    selectProject,
    error,
  }), [homeData, isLoading, fetchHomeData, selectProject, error]);

  return (
    <HomeContext.Provider value={value}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};
