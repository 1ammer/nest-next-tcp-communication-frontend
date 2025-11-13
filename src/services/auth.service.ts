import apiClient from '@/lib/api';
import { getToken } from '@/lib/auth';
import type {
  ApiResponse,
  RegisterUserDto,
  User,
  LoginDto,
  LoginResponse,
} from '@/types';

const register = async (
  payload: RegisterUserDto,
): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.post<ApiResponse<User>>(
      '/auth/register',
      payload,
    );
    return response.data;
  } catch (error: any) {
    console.error('Error during registration:', error);
    // Preserve the original error message from the API
    if (error?.response?.data?.message) {
      throw error;
    }
    // Network errors (backend not running, CORS, etc.)
    if (error?.code === 'ECONNREFUSED' || error?.message?.includes('Network Error')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    throw new Error(error?.response?.data?.message || 'Registration failed. Please try again later.');
  }
};

const login = async (
  payload: LoginDto,
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      payload,
    );
    return response.data;
  } catch (error: any) {
    console.error('Error during login:', error);
    // Preserve the original error message from the API
    if (error?.response?.data?.message) {
      throw error;
    }
    // Network errors (backend not running, CORS, etc.)
    if (error?.code === 'ECONNREFUSED' || error?.message?.includes('Network Error')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    throw new Error(error?.response?.data?.message || 'Login failed. Please check your credentials and try again.');
  }
};

const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const token = getToken();
    const response = await apiClient.get<ApiResponse<User[]>>('/auth/users', {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    // Preserve the original error message from the API
    if (error?.response?.data?.message) {
      throw error;
    }
    // Network errors (backend not running, CORS, etc.)
    if (error?.code === 'ECONNREFUSED' || error?.message?.includes('Network Error')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    throw new Error(error?.response?.data?.message || 'Failed to fetch users. Please try again later.');
  }
};

export const authService = {
  register,
  login,
  getAllUsers,
};
