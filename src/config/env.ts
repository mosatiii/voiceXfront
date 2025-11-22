/**
 * Environment configuration
 * Centralizes access to environment variables with type safety
 */

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  wsUrl: import.meta.env.VITE_WS_URL || 'http://localhost:3000',
} as const;

// Validate required environment variables
if (!env.apiUrl) {
  throw new Error('VITE_API_URL is required');
}

if (!env.wsUrl) {
  throw new Error('VITE_WS_URL is required');
}

