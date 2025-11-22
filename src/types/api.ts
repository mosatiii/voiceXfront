/**
 * API request and response types for VoiceX
 * These types match the backend API contract
 */

import type { User, PhoneNumber, AvailablePhoneNumber, Message, Call, Subscription, UsageRecord, PaymentMethod, Invoice } from './models';

// Generic API Error Response
export interface ApiError {
  error: {
    code: string;
    message: string;
    field?: string;
  };
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

// Auth Endpoints
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// Phone Numbers Endpoints
export interface SearchNumbersParams {
  areaCode?: string;
  contains?: string;
  limit?: number;
}

export interface SearchNumbersResponse {
  numbers: AvailablePhoneNumber[];
}

export interface RentNumberRequest {
  phoneNumber: string;
}

export interface RentNumberResponse {
  phoneNumber: PhoneNumber;
}

export interface GetMyNumbersResponse {
  phoneNumbers: PhoneNumber[];
}

// Messages Endpoints
export interface SendMessageRequest {
  phoneNumberId: string;
  to: string;
  body: string;
}

export interface SendMessageResponse {
  message: Message;
}

export interface GetMessagesParams extends PaginationParams {
  phoneNumberId?: string;
  direction?: 'inbound' | 'outbound';
}

export interface GetMessagesResponse {
  messages: Message[];
  pagination: PaginationMeta;
}

// Calls Endpoints
export interface GetTwilioTokenResponse {
  token: string;
  identity: string;
}

export interface StartCallRequest {
  phoneNumberId: string;
  to: string;
}

export interface StartCallResponse {
  call: Call;
}

export interface GetCallsParams extends PaginationParams {
  phoneNumberId?: string;
  direction?: 'inbound' | 'outbound';
  status?: Call['status'];
}

export interface GetCallsResponse {
  calls: Call[];
  pagination: PaginationMeta;
}

// Billing Endpoints
export interface CreateSubscriptionRequest {
  planId: string;
  paymentMethodId?: string;
}

export interface CreateSubscriptionResponse {
  subscription: Subscription;
}

export interface GetUsageParams {
  startDate?: string;
  endDate?: string;
}

export interface GetUsageResponse {
  usage: UsageRecord[];
  summary: {
    totalMessages: number;
    totalCalls: number;
    totalCallMinutes: number;
    totalCost: number;
  };
}

export interface GetPaymentMethodsResponse {
  paymentMethods: PaymentMethod[];
}

export interface AddPaymentMethodRequest {
  paymentMethodId: string;
}

export interface AddPaymentMethodResponse {
  paymentMethod: PaymentMethod;
}

export interface GetBillingHistoryParams extends PaginationParams {
  startDate?: string;
  endDate?: string;
}

export interface GetBillingHistoryResponse {
  invoices: Invoice[];
  pagination: PaginationMeta;
}

