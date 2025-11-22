/**
 * Zustand store for authentication state
 * Manages user, tokens, and auth-related actions with localStorage persistence
 */

import { create } from 'zustand';
import type { User } from '@/types/models';

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  initializeAuth: () => void;
  setLoading: (isLoading: boolean) => void;
}

/**
 * Auth store with persistence to localStorage
 */
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  // Set both tokens (used during login/register)
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  // Set user data
  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    
    set({
      user,
      isAuthenticated: true,
    });
  },

  // Update access token (used during token refresh)
  setAccessToken: (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    
    set({
      accessToken,
      isAuthenticated: true,
    });
  },

  // Logout - clear all auth data
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });

    // Redirect to login
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  },

  // Initialize auth from localStorage (called on app mount)
  initializeAuth: () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userStr = localStorage.getItem('user');

      if (accessToken && refreshToken && userStr) {
        const user = JSON.parse(userStr) as User;
        
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Set loading state
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));

