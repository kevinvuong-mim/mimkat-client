import { apiClient } from '@/lib/api-client';
import { handleApiError } from '@/lib/error-handler';
import { GetSessionsRequest, GetSessionsResponse } from '@/types';

const getSessions = async (_data?: GetSessionsRequest) => {
  try {
    const enpoint = '/users/sessions';

    const response: GetSessionsResponse = await apiClient.get(enpoint);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export { getSessions };
