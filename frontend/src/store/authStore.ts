// Purpose: Zustand Global Authentication & User Session Management Store
// Path: frontend/src/store/authStore.ts

import { create } from 'zustand';
import api from '@/lib/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'CONTRACTOR' | 'SUPER_ADMIN' | 'WORKER';
  tenantId?: string;
  phone?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Store Actions
  setAuth: (user: UserProfile, token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Set user session state and persist credentials to LocalStorage
  setAuth: (user: UserProfile, token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('garment_token', token);
      localStorage.setItem('garment_user', JSON.stringify(user));
    }
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  // Clear user state and wipe session tokens from LocalStorage
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('garment_token');
      localStorage.removeItem('garment_user');
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  // Hydrate session state from LocalStorage on app boot
  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      try {
        const storedToken = localStorage.getItem('garment_token');
        const storedUser = localStorage.getItem('garment_user');

        if (storedToken && storedUser) {
          const parsedUser: UserProfile = JSON.parse(storedUser);
          set({
            user: parsedUser,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      } catch (err) {
        console.error('Failed to parse saved auth credentials:', err);
        localStorage.removeItem('garment_token');
        localStorage.removeItem('garment_user');
      }
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  clearError: () => set({ error: null }),
}));