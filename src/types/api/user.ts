import { User, CurrentUser, SuccessResponse } from '../';

// Requests
export interface GetMeRequest {}

export interface LogoutDeviceRequest {
  tokenId: string;
}

export interface UploadAvatarRequest {
  file: File;
}

export interface UpdateProfileRequest {
  fullName?: string;
  username?: string;
  phoneNumber?: string;
}

export interface ChangePasswordRequest {
  newPassword: string;
  currentPassword?: string;
}

export interface LogoutAllDevicesRequest {}

export interface GetProfileByIdentifierRequest {
  identifier: string;
}

// Responses
export interface GetMeResponse extends SuccessResponse<CurrentUser> {}

export interface LogoutDeviceResponse extends SuccessResponse<null> {}

export interface UploadAvatarResponse extends SuccessResponse<null> {}

export interface UpdateProfileResponse extends SuccessResponse<null> {}

export interface ChangePasswordResponse extends SuccessResponse<null> {}

export interface LogoutAllDevicesResponse extends SuccessResponse<null> {}

export interface GetProfileByIdentifierResponse extends SuccessResponse<User> {}
