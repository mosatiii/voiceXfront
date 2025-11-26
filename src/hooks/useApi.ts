/**
 * Shared API query hooks for data fetching
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as numbersApi from '@/api/numbers';
import * as messagesApi from '@/api/messages';
import * as callsApi from '@/api/calls';
import * as billingApi from '@/api/billing';
import { getErrorMessage } from '@/api/client';
import type {
  SearchNumbersParams,
  GetMessagesParams,
  GetCallsParams,
  GetUsageParams,
  GetBillingHistoryParams,
} from '@/types/api';

// ============================================================================
// Phone Numbers
// ============================================================================

export const useMyNumbers = () => {
  return useQuery({
    queryKey: ['my-numbers'],
    queryFn: numbersApi.getMyNumbers,
  });
};

export const useSearchNumbers = () => {
  return useMutation({
    mutationFn: (params: SearchNumbersParams) => numbersApi.searchAvailableNumbers(params),
  });
};

export const useRentNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: numbersApi.rentPhoneNumber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-numbers'] });
      toast.success('Phone number rented successfully!');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message || 'Failed to rent phone number');
    },
  });
};

export const useReleaseNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => numbersApi.releasePhoneNumber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-numbers'] });
      toast.success('Phone number released successfully');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message || 'Failed to release phone number');
    },
  });
};

// ============================================================================
// Messages
// ============================================================================

export const useMessages = (params: GetMessagesParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: () => messagesApi.getMessages(params),
    enabled: options?.enabled ?? true, // Allow disabling the query
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message sent!');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message || 'Failed to send message');
    },
  });
};

// ============================================================================
// Calls
// ============================================================================

export const useCalls = (params: GetCallsParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['calls', params],
    queryFn: () => callsApi.getCalls(params),
    enabled: options?.enabled ?? true, // Allow disabling the query
    refetchOnWindowFocus: true, // Refetch when user returns to the tab
    refetchOnMount: true, // Refetch when component mounts
  });
};

// ============================================================================
// Billing
// ============================================================================

export const useSubscription = () => {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: billingApi.getCurrentSubscription,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: billingApi.createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast.success('Subscription created successfully!');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message || 'Failed to create subscription');
    },
  });
};

export const useUsage = (params: GetUsageParams) => {
  return useQuery({
    queryKey: ['usage', params],
    queryFn: () => billingApi.getUsage(params),
  });
};

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: billingApi.getPaymentMethods,
  });
};

export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: billingApi.addPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast.success('Payment method added successfully');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message || 'Failed to add payment method');
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => billingApi.deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast.success('Payment method removed');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message || 'Failed to remove payment method');
    },
  });
};

export const useBillingHistory = (params: GetBillingHistoryParams) => {
  return useQuery({
    queryKey: ['billing-history', params],
    queryFn: () => billingApi.getBillingHistory(params),
  });
};

// ============================================================================
// Infinite Query example (for pagination with "Load More")
// ============================================================================

export const useInfiniteMessages = (phoneNumberId?: string) => {
  return useInfiniteQuery({
    queryKey: ['messages-infinite', phoneNumberId],
    queryFn: ({ pageParam = 1 }) =>
      messagesApi.getMessages({ phoneNumberId, page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.messages.length === 20;
      return hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

