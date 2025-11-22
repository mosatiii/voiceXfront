/**
 * Voice Calls API service functions
 */

import { apiClient } from './client';
import type {
  GetTwilioTokenResponse,
  StartCallRequest,
  StartCallResponse,
  GetCallsParams,
  GetCallsResponse,
} from '@/types/api';
import type { Call } from '@/types/models';

/**
 * Get Twilio access token for WebRTC
 */
export const getTwilioToken = async (): Promise<GetTwilioTokenResponse> => {
  const response = await apiClient.post<GetTwilioTokenResponse>('/calls/token');
  return response.data;
};

/**
 * Initiate an outbound call
 */
export const startCall = async (data: StartCallRequest): Promise<StartCallResponse> => {
  const response = await apiClient.post<StartCallResponse>('/calls/start', data);
  return response.data;
};

/**
 * Get call history with pagination and filters
 */
export const getCalls = async (params: GetCallsParams): Promise<GetCallsResponse> => {
  const response = await apiClient.get<GetCallsResponse>('/calls', {
    params,
  });
  return response.data;
};

/**
 * Get a single call by ID
 */
export const getCall = async (id: string): Promise<{ call: Call }> => {
  const response = await apiClient.get<{ call: Call }>(`/calls/${id}`);
  return response.data;
};

