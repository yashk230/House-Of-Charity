// import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
// import { supabase } from '../supabase/config';
import { Donor, NGO } from '../types';

// Temporary types until Supabase is installed
type SupabaseUser = {
  id: string;
  email: string;
};

interface AuthContextType {
  currentUser: SupabaseUser | null;
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
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<Donor | NGO | null>(null);
  const [loading, setLoading] = useState(false); // Set to false for now

  // Temporary mock implementation until Supabase is properly set up
  const login = async (email: string, password: string) => {
    // Mock login - will be replaced with Supabase
    console.log('Mock login:', email, password);
    throw new Error('Supabase not configured yet');
  };

  const register = async (email: string, password: string, userData: Partial<Donor | NGO>) => {
    // Mock register - will be replaced with Supabase
    console.log('Mock register:', email, password, userData);
    throw new Error('Supabase not configured yet');
  };

  const logout = async () => {
    // Mock logout - will be replaced with Supabase
    console.log('Mock logout');
    setCurrentUser(null);
    setUserProfile(null);
  };

  const updateProfile = async (data: Partial<Donor | NGO>) => {
    // Mock update - will be replaced with Supabase
    console.log('Mock update profile:', data);
    throw new Error('Supabase not configured yet');
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