'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type  { AuthState } from '../types';
import { apiService } from '../services/api';

interface AuthContextType extends AuthState {
  signup: (email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  const refreshUser = async () => {
    try {
      if (!apiService.isAuthenticated()) {
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      const { user } = await apiService.getCurrentUser();
      setState(prev => ({
        ...prev,
        user,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Error refreshing user:', error);
      // Clear invalid tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setState(prev => ({
        ...prev,
        user: null,
        session: null,
        loading: false,
        error: null,
      }));
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiService.signup(email, password);
      
      // Check if we got a session (immediate login) or need email confirmation
      if (response.session && response.user) {
        // Immediate login - no email confirmation required
        setState(prev => ({
          ...prev,
          user: response.user,
          session: response.session,
          loading: false,
          error: null,
        }));
      } else if (response.requiresEmailConfirmation) {
        // User created but needs email confirmation
        setState(prev => ({
          ...prev,
          user: null,
          session: null,
          loading: false,
          error: null, // Don't treat this as an error
        }));
        // Don't throw an error, just return with a message
        return;
      } else {
        // Something went wrong
        setState(prev => ({
          ...prev,
          user: null,
          session: null,
          loading: false,
          error: 'Signup failed. Please try again.',
        }));
        throw new Error('Signup failed. Please try again.');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      }));
      throw error;
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { user, session } = await apiService.signin(email, password);
      setState(prev => ({
        ...prev,
        user,
        session,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Signin failed',
      }));
      throw error;
    }
  };

  const signout = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      await apiService.signout();
      setState(prev => ({
        ...prev,
        user: null,
        session: null,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Signout error:', error);
      // Clear state even if API call fails
      setState(prev => ({
        ...prev,
        user: null,
        session: null,
        loading: false,
        error: null,
      }));
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    refreshUser();
  }, []);

  const value: AuthContextType = {
    ...state,
    signup,
    signin,
    signout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 