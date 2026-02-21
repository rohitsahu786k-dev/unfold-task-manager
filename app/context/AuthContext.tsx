'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/app/types';
import { MOCK_USERS } from '@/app/types/mockData';

interface AuthContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  allUsers: User[];
  isGoogleAuthenticated: boolean;
  googleAuthUrl: string | null;
  initiateGoogleAuth: () => Promise<void>;
  googleLoginUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Start with super admin
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [googleAuthUrl, setGoogleAuthUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have a Google access token
    const checkGoogleAuth = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('google_authenticated') === 'true') {
          setIsGoogleAuthenticated(true);
          // Clean up the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    checkGoogleAuth();
  }, []);

  const initiateGoogleAuth = async () => {
    try {
      const response = await fetch('/api/auth/google/login');
      const { authUrl } = await response.json();
      setGoogleAuthUrl(authUrl);
      if (authUrl) {
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error('Failed to get Google auth URL:', error);
    }
  };

  const switchUser = (userId: string) => {
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL || '')}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile')}`;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUser,
        allUsers: MOCK_USERS,
        isGoogleAuthenticated,
        googleAuthUrl,
        initiateGoogleAuth,
        googleLoginUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
