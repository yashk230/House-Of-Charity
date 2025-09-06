import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../api/database';
import { Donor, NGO } from '../types';

// User type for authentication
type AuthUser = {
  id: string;
  email: string;
  user_type: string;
  name?: string;
  phone?: string;
  city?: string;
  state?: string;
  description?: string;
};

interface AuthContextType {
  currentUser: AuthUser | null;
  userProfile: Donor | NGO | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<Donor | NGO>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Donor | NGO>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<Donor | NGO | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const response = await apiService.verifyToken();
          setCurrentUser(response.user);
          setUserProfile(response.user as Donor | NGO);
        } catch (error) {
          console.error('Token verification failed:', error);
          apiService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiService.login(email, password);
      setCurrentUser(response.user);
      setUserProfile(response.user as Donor | NGO);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: Partial<Donor | NGO>) => {
    try {
      setLoading(true);
      const response = await apiService.register(email, password, userData);
      setCurrentUser(response.user);
      setUserProfile(response.user as Donor | NGO);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      apiService.logout();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (data: Partial<Donor | NGO>) => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    try {
      const response = await apiService.updateUser(currentUser.id, data);
      setUserProfile(response.user);
      setCurrentUser({ ...currentUser, ...response.user });
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 