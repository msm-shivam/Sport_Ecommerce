import apiClient, { ApiResponse } from '@/services/api.client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export const authApi = {
  login: (body: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', body),

  forgotPassword: (body: ForgotPasswordRequest) =>
    apiClient.post<ApiResponse<null>>('/auth/forgot-password', body),

  resetPassword: (body: ResetPasswordRequest) =>
    apiClient.post<ApiResponse<null>>('/auth/reset-password', body),

  me: () =>
    apiClient.get<ApiResponse<LoginResponse['user']>>('/auth/me'),
};
