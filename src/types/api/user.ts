import { User, CurrentUser, SuccessResponse } from '../';

// Requests
interface GetMeRequest {}

interface LogoutDeviceRequest {
  tokenId: string;
}

interface UploadAvatarRequest {
  file: File;
}

interface UpdateProfileRequest {
  fullName?: string;
  username?: string;
  phoneNumber?: string;
}

interface ChangePasswordRequest {
  newPassword: string;
  currentPassword?: string;
}

interface LogoutAllDevicesRequest {}

interface GetProfileByIdentifierRequest {
  identifier: string;
}

// Responses
interface GetMeResponse extends SuccessResponse<CurrentUser> {}

interface LogoutDeviceResponse extends SuccessResponse<null> {}

interface UploadAvatarResponse extends SuccessResponse<null> {}

interface UpdateProfileResponse extends SuccessResponse<null> {}

interface ChangePasswordResponse extends SuccessResponse<null> {}

interface LogoutAllDevicesResponse extends SuccessResponse<null> {}

interface GetProfileByIdentifierResponse extends SuccessResponse<User> {}

export type {
  // Requests
  GetMeRequest,
  LogoutDeviceRequest,
  UploadAvatarRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  LogoutAllDevicesRequest,
  GetProfileByIdentifierRequest,

  // Responses
  GetMeResponse,
  LogoutDeviceResponse,
  UploadAvatarResponse,
  UpdateProfileResponse,
  ChangePasswordResponse,
  LogoutAllDevicesResponse,
  GetProfileByIdentifierResponse,
};
