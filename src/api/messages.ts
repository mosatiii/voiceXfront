/**
 * Messages (SMS) API service functions
 */

import { apiClient } from './client';
import type {
  SendMessageRequest,
  SendMessageResponse,
  GetMessagesParams,
  GetMessagesResponse,
} from '@/types/api';
import type { Message } from '@/types/models';

/**
 * Send an SMS message
 */
export const sendMessage = async (
  data: SendMessageRequest
): Promise<SendMessageResponse> => {
  const response = await apiClient.post<SendMessageResponse>('/messages/send', data);
  return response.data;
};

/**
 * Get message history with pagination and filters
 */
export const getMessages = async (
  params: GetMessagesParams
): Promise<GetMessagesResponse> => {
  const response = await apiClient.get<GetMessagesResponse>('/messages', {
    params,
  });
  return response.data;
};

/**
 * Get a single message by ID
 */
export const getMessage = async (id: string): Promise<{ message: Message }> => {
  const response = await apiClient.get<{ message: Message }>(`/messages/${id}`);
  return response.data;
};

