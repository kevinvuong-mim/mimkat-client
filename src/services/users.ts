import {
  CurrentUser,
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
} from '@/types';
import { apiClient } from '@/lib/api-client';
import { handleApiError } from '@/lib/error-handler';

const getMe = async (_data?: GetMeRequest): Promise<CurrentUser> => {
  try {
    const enpoint = '/users/me';

    const response: GetMeResponse = await apiClient.get(enpoint);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const uploadAvatar = async (data: UploadAvatarRequest) => {
  try {
    const enpoint = '/users/me/avatar';

    const formData = new FormData();
    formData.append('file', data.file);

    const response: UploadAvatarResponse = await apiClient.put(enpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const logoutDevice = async (data: LogoutDeviceRequest) => {
  try {
    const enpoint = `/users/sessions/${data.tokenId}`;

    const response: LogoutDeviceResponse = await apiClient.delete(enpoint);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const updateProfile = async (data: UpdateProfileRequest) => {
  try {
    const enpoint = '/users/me';

    const response: UpdateProfileResponse = await apiClient.put(enpoint, data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const changePassword = async (data: ChangePasswordRequest) => {
  try {
    const enpoint = '/users/password';

    const response: ChangePasswordResponse = await apiClient.put(enpoint, data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const logoutAllDevices = async (_data?: LogoutAllDevicesRequest) => {
  try {
    const enpoint = '/users/sessions';

    const response: LogoutAllDevicesResponse = await apiClient.delete(enpoint);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const getProfileByIdentifier = async (data: GetProfileByIdentifierRequest) => {
  try {
    const enpoint = `/users/${data.identifier}`;

    const response: GetProfileByIdentifierResponse = await apiClient.get(enpoint);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export {
  getMe,
  logoutDevice,
  uploadAvatar,
  updateProfile,
  changePassword,
  logoutAllDevices,
  getProfileByIdentifier,
};
