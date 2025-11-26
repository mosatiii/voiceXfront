/**
 * Environment configuration
 * Centralizes access to environment variables with type safety
 */

// Railway production backend URL
const RAILWAY_API_URL = 'https://voicex-production.up.railway.app/api';
const RAILWAY_WS_URL = 'https://voicex-production.up.railway.app';

export const env = {
  // Use Railway backend by default, allow override via environment variables
  apiUrl: import.meta.env.VITE_API_URL || RAILWAY_API_URL,
  wsUrl: import.meta.env.VITE_WS_URL || RAILWAY_WS_URL,
} as const;

// Validate required environment variables
if (!env.apiUrl) {
  throw new Error('VITE_API_URL is required');
}

if (!env.wsUrl) {
  throw new Error('VITE_WS_URL is required');
}

