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
  const response = await apiClient.post<any>('/messages/send', data);
  
  // Transform backend response to match frontend types
  const message = response.data.message || response.data;
  return {
    message: {
      ...message,
      from: message.fromNumber || message.from,
      to: message.toNumber || message.to,
    }
  };
};

/**
 * Get message history with pagination and filters
 */
export const getMessages = async (
  params: GetMessagesParams
): Promise<GetMessagesResponse> => {
  const response = await apiClient.get<any>('/messages', {
    params,
  });
  
  // Transform backend response to match frontend types
  // Backend returns fromNumber/toNumber, we need from/to
  const transformedMessages = (response.data.messages || []).map((msg: any) => ({
    ...msg,
    from: msg.fromNumber || msg.from,
    to: msg.toNumber || msg.to,
  }));

  return {
    ...response.data,
    messages: transformedMessages,
  };
};

/**
 * Get a single message by ID
 */
export const getMessage = async (id: string): Promise<{ message: Message }> => {
  const response = await apiClient.get<any>(`/messages/${id}`);
  
  // Transform backend response to match frontend types
  const message = response.data.message || response.data;
  return {
    message: {
      ...message,
      from: message.fromNumber || message.from,
      to: message.toNumber || message.to,
    }
  };
};

