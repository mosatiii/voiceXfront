/**
 * Billing and Subscriptions API service functions
 */

import { apiClient } from './client';
import type {
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  GetUsageParams,
  GetUsageResponse,
  GetPaymentMethodsResponse,
  AddPaymentMethodRequest,
  AddPaymentMethodResponse,
  GetBillingHistoryParams,
  GetBillingHistoryResponse,
} from '@/types/api';
import type { Subscription, PaymentMethod } from '@/types/models';

/**
 * Create a subscription
 */
export const createSubscription = async (
  data: CreateSubscriptionRequest
): Promise<CreateSubscriptionResponse> => {
  const response = await apiClient.post<CreateSubscriptionResponse>(
    '/billing/subscribe',
    data
  );
  return response.data;
};

/**
 * Get current subscription
 */
export const getCurrentSubscription = async (): Promise<{
  subscription: Subscription;
}> => {
  const response = await apiClient.get<{ subscription: Subscription }>(
    '/billing/subscription'
  );
  return response.data;
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (): Promise<void> => {
  await apiClient.delete('/billing/subscription');
};

/**
 * Get usage records and summary
 */
export const getUsage = async (params: GetUsageParams): Promise<GetUsageResponse> => {
  const response = await apiClient.get<GetUsageResponse>('/billing/usage', {
    params,
  });
  return response.data;
};

/**
 * Get payment methods
 */
export const getPaymentMethods = async (): Promise<GetPaymentMethodsResponse> => {
  const response = await apiClient.get<GetPaymentMethodsResponse>(
    '/billing/payment-methods'
  );
  return response.data;
};

/**
 * Add a payment method
 */
export const addPaymentMethod = async (
  data: AddPaymentMethodRequest
): Promise<AddPaymentMethodResponse> => {
  const response = await apiClient.post<AddPaymentMethodResponse>(
    '/billing/payment-methods',
    data
  );
  return response.data;
};

/**
 * Delete a payment method
 */
export const deletePaymentMethod = async (id: string): Promise<void> => {
  await apiClient.delete(`/billing/payment-methods/${id}`);
};

/**
 * Set default payment method
 */
export const setDefaultPaymentMethod = async (id: string): Promise<{ paymentMethod: PaymentMethod }> => {
  const response = await apiClient.put<{ paymentMethod: PaymentMethod }>(
    `/billing/payment-methods/${id}/default`
  );
  return response.data;
};

/**
 * Get billing history (invoices)
 */
export const getBillingHistory = async (
  params: GetBillingHistoryParams
): Promise<GetBillingHistoryResponse> => {
  const response = await apiClient.get<GetBillingHistoryResponse>(
    '/billing/history',
    {
      params,
    }
  );
  return response.data;
};

