/**
 * Application entry point
 * Sets up React Query, auth initialization, and renders the app
 */

import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import './index.css';
import App from './App.tsx';

// Create React Query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed queries once
      staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
    mutations: {
      retry: 0, // Don't retry failed mutations
    },
  },
});

// Wrapper component to initialize auth
function AppWithProviders() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppWithProviders />
    </QueryClientProvider>
  </StrictMode>
);
