/**
 * Core data models for the VoiceX application
 * These types represent the main entities in our system
 */

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PhoneNumber {
  id: string;
  phoneNumber: string;
  friendlyName: string;
  locality?: string;
  region?: string;
  status: 'active' | 'released';
  capabilities?: {
    voice: boolean;
    sms: boolean;
  };
  rentedAt: string;
  releasedAt?: string;
  userId: string;
  // Usage statistics (may be null if not populated by backend)
  messageCount?: number;
  callCount?: number;
}

export interface AvailablePhoneNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string;
  region: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
  };
}

export interface Message {
  id: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  body: string;
  status: 'queued' | 'sending' | 'sent' | 'delivered' | 'failed' | 'received';
  errorMessage?: string;
  createdAt: string;
  phoneNumberId: string;
  userId: string;
}

export interface Call {
  id: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  status: 'initiated' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'failed' | 'no-answer' | 'canceled';
  duration?: number;
  errorMessage?: string;
  createdAt: string;
  endedAt?: string;
  phoneNumberId: string;
  userId: string;
}

export interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  userId: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    phoneNumbers?: number;
    messages?: number;
    callMinutes?: number;
  };
}

export interface UsageRecord {
  id: string;
  type: 'message' | 'call' | 'phone_number';
  quantity: number;
  cost: number;
  description: string;
  createdAt: string;
  userId: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  userId: string;
}

export interface Invoice {
  id: string;
  amount: number;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  currency: string;
  invoiceUrl?: string;
  paidAt?: string;
  createdAt: string;
  userId: string;
}

