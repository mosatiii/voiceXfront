/**
 * Authentication hooks using React Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as authApi from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { getErrorMessage } from '@/api/client';
import type { LoginRequest, RegisterRequest } from '@/types/api';

/**
 * Login mutation hook
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      // Store user and tokens
      setUser(response.user);
      setTokens(response.accessToken, response.refreshToken);

      // Show success message
      toast.success('Welcome back!');

      // Navigate to dashboard
      navigate('/');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message || 'Failed to login. Please try again.');
    },
  });
};

/**
 * Register mutation hook
 */
export const useRegister = () => {
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      // Store user and tokens
      setUser(response.user);
      setTokens(response.accessToken, response.refreshToken);

      // Show success message
      toast.success('Account created successfully!');

      // Navigate to dashboard
      navigate('/');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message || 'Failed to register. Please try again.');
    },
  });
};

/**
 * Logout mutation hook
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();

      // Clear auth store (this will also redirect to login)
      logout();

      toast.success('Logged out successfully');
    },
    onError: (error) => {
      // Even if API call fails, clear local auth
      queryClient.clear();
      logout();

      const message = getErrorMessage(error);
      console.error('Logout error:', message);
    },
  });
};

