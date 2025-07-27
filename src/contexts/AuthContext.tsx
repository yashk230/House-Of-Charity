import {
    createUserWithEmailAndPassword,
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { Donor, NGO } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
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
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<Donor | NGO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as Donor | NGO);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, userData: Partial<Donor | NGO>) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      const newUser = {
        id: user.uid,
        email: user.email!,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...userData,
      };

      await setDoc(doc(db, 'users', user.uid), newUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (data: Partial<Donor | NGO>) => {
    if (!currentUser) throw new Error('No user logged in');
    
    try {
      const updatedProfile = {
        ...userProfile,
        ...data,
        updatedAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', currentUser.uid), updatedProfile);
      setUserProfile(updatedProfile as Donor | NGO);
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