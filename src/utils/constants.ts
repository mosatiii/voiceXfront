/**
 * Application constants
 */

// Message status colors
export const MESSAGE_STATUS_COLORS = {
  queued: 'bg-gray-500',
  sending: 'bg-blue-500',
  sent: 'bg-green-500',
  delivered: 'bg-green-600',
  failed: 'bg-red-500',
  received: 'bg-blue-600',
} as const;

// Call status colors
export const CALL_STATUS_COLORS = {
  initiated: 'bg-blue-500',
  ringing: 'bg-purple-500',
  'in-progress': 'bg-green-500',
  completed: 'bg-gray-500',
  busy: 'bg-yellow-500',
  failed: 'bg-red-500',
  'no-answer': 'bg-orange-500',
  canceled: 'bg-gray-400',
} as const;

// Subscription status colors
export const SUBSCRIPTION_STATUS_COLORS = {
  active: 'bg-green-500',
  canceled: 'bg-red-500',
  past_due: 'bg-orange-500',
  trialing: 'bg-blue-500',
} as const;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

// SMS character limits
export const SMS_SINGLE_MESSAGE_LIMIT = 160;
export const SMS_MULTI_MESSAGE_LIMIT = 1600;

// Animation durations (milliseconds)
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

// Toast auto-dismiss duration (milliseconds)
export const TOAST_DURATION = 5000;

// Debounce delay for search (milliseconds)
export const SEARCH_DEBOUNCE_DELAY = 300;

