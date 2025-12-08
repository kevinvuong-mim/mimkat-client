import { apiClient } from '@/lib/api-client';
import { handleApiError } from '@/lib/error-handler';
import { User, Session, PaginatedResponse, UpdateProfileData, ChangePasswordData } from '@/types';

const getMe = async () => {
  try {
    const response = await apiClient.get('/users/me');

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const getSessions = async (): Promise<PaginatedResponse<Session>> => {
  try {
    const response = await apiClient.get('/users/sessions');

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const uploadAvatar = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.put('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const logoutDevice = async (tokenId: string) => {
  try {
    const response = await apiClient.delete(`/users/sessions/${tokenId}`);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const updateProfile = async (data: UpdateProfileData) => {
  try {
    const response = await apiClient.put('/users/me', data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const changePassword = async (data: ChangePasswordData) => {
  try {
    const response = await apiClient.put('/users/password', data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const logoutAllDevices = async () => {
  try {
    const response = await apiClient.delete('/users/sessions');

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const getProfileByIdentifier = async (identifier: string): Promise<User> => {
  try {
    const response = await apiClient.get(`/users/${identifier}`);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export {
  getMe,
  getSessions,
  uploadAvatar,
  logoutDevice,
  updateProfile,
  changePassword,
  logoutAllDevices,
  getProfileByIdentifier,
};
