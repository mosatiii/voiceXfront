/**
 * Phone Numbers API service functions
 */

import { apiClient } from './client';
import type {
  SearchNumbersParams,
  SearchNumbersResponse,
  RentNumberRequest,
  RentNumberResponse,
  GetMyNumbersResponse,
} from '@/types/api';

/**
 * Search for available phone numbers
 */
export const searchAvailableNumbers = async (
  params: SearchNumbersParams
): Promise<SearchNumbersResponse> => {
  const response = await apiClient.get<SearchNumbersResponse>('/numbers/available', {
    params,
  });
  return response.data;
};

/**
 * Rent a phone number
 */
export const rentPhoneNumber = async (
  data: RentNumberRequest
): Promise<RentNumberResponse> => {
  const response = await apiClient.post<RentNumberResponse>('/numbers/rent', data);
  return response.data;
};

/**
 * Get user's phone numbers
 */
export const getMyNumbers = async (): Promise<GetMyNumbersResponse> => {
  const response = await apiClient.get<GetMyNumbersResponse>('/numbers/mine');
  return response.data;
};

/**
 * Release a phone number
 */
export const releasePhoneNumber = async (id: string): Promise<void> => {
  await apiClient.delete(`/numbers/${id}`);
};

