/**
 * Utility functions for formatting data
 */

/**
 * Format phone number to (XXX) XXX-XXXX format
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Handle different lengths
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    // US number with country code
    const areaCode = cleaned.slice(1, 4);
    const prefix = cleaned.slice(4, 7);
    const lineNumber = cleaned.slice(7);
    return `(${areaCode}) ${prefix}-${lineNumber}`;
  } else if (cleaned.length === 10) {
    // US number without country code
    const areaCode = cleaned.slice(0, 3);
    const prefix = cleaned.slice(3, 6);
    const lineNumber = cleaned.slice(6);
    return `(${areaCode}) ${prefix}-${lineNumber}`;
  }

  // Return original if format doesn't match
  return phone;
};

/**
 * Format date to "MMM DD, YYYY" format
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  
  if (isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format date to "MMM DD, YYYY HH:MM AM/PM" format
 */
export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  
  if (isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format date to relative time (e.g., "2 hours ago", "just now")
 */
export const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
  } else {
    return formatDate(dateStr);
  }
};

/**
 * Format call duration in seconds to "MM:SS" or "HH:MM:SS" format
 */
export const formatCallDuration = (seconds: number): string => {
  if (seconds < 0) {
    return '00:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

/**
 * Format currency (USD)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

