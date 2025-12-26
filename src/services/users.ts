import {
  GetMeRequest,
  GetMeResponse,
  LogoutDeviceRequest,
  UploadAvatarRequest,
  LogoutDeviceResponse,
  UploadAvatarResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UpdateProfileResponse,
  ChangePasswordResponse,
  LogoutAllDevicesRequest,
  LogoutAllDevicesResponse,
  GetProfileByIdentifierRequest,
  GetProfileByIdentifierResponse,
  CurrentUser,
} from '@/types';
import { apiClient } from '@/lib/api-client';
import { handleApiError } from '@/lib/error-handler';

const getMe = async (_data?: GetMeRequest): Promise<CurrentUser> => {
  try {
    const response: GetMeResponse = await apiClient.get('/users/me');

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const uploadAvatar = async (data: UploadAvatarRequest) => {
  try {
    const formData = new FormData();
    formData.append('file', data.file);

    const response: UploadAvatarResponse = await apiClient.put('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const logoutDevice = async (data: LogoutDeviceRequest) => {
  try {
    const response: LogoutDeviceResponse = await apiClient.delete(
      `/users/sessions/${data.tokenId}`,
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const updateProfile = async (data: UpdateProfileRequest) => {
  try {
    const response: UpdateProfileResponse = await apiClient.put('/users/me', data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const changePassword = async (data: ChangePasswordRequest) => {
  try {
    const response: ChangePasswordResponse = await apiClient.put('/users/password', data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const logoutAllDevices = async (_data?: LogoutAllDevicesRequest) => {
  try {
    const response: LogoutAllDevicesResponse = await apiClient.delete('/users/sessions');

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const getProfileByIdentifier = async (data: GetProfileByIdentifierRequest) => {
  try {
    const response: GetProfileByIdentifierResponse = await apiClient.get(
      `/users/${data.identifier}`,
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export {
  getMe,
  uploadAvatar,
  logoutDevice,
  updateProfile,
  changePassword,
  logoutAllDevices,
  getProfileByIdentifier,
};
