/**
 * Validation schemas and utility functions using Zod
 */

import { z } from 'zod';

// Phone number regex (US format)
const phoneRegex = /^\+?1?\d{10}$/;

// Email validation
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Phone number validation
export const phoneNumberSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(phoneRegex, 'Invalid phone number format (use 10 digits)');

// Area code validation
export const areaCodeSchema = z
  .string()
  .length(3, 'Area code must be exactly 3 digits')
  .regex(/^\d{3}$/, 'Area code must be numeric');

// Message body validation
export const messageBodySchema = z
  .string()
  .min(1, 'Message cannot be empty')
  .max(1600, 'Message is too long (max 1600 characters)');

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Register form schema
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Send message form schema
export const sendMessageSchema = z.object({
  phoneNumberId: z.string().min(1, 'Please select a phone number'),
  to: phoneNumberSchema,
  body: messageBodySchema,
});

// Search numbers form schema
export const searchNumbersSchema = z.object({
  areaCode: areaCodeSchema.optional(),
  limit: z.number().min(1).max(50).optional(),
});

// Start call form schema
export const startCallSchema = z.object({
  phoneNumberId: z.string().min(1, 'Please select a phone number'),
  to: phoneNumberSchema,
});

// Helper function to validate phone number
export const isValidPhoneNumber = (phone: string): boolean => {
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Helper function to sanitize phone number for API
export const sanitizePhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add +1 prefix if not present
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  return phone;
};

