import { API_BASE_URL } from '@/constants/api';

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  warehouse?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'An error occurred');
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

export async function loginSalesman(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/salesman/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function loginWarehouse(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/warehouse/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutSalesman(): Promise<{ success: true; message: string }> {
  return apiRequest<{ success: true; message: string }>('/salesman/logout', {
    method: 'POST',
  });
}

export async function logoutWarehouse(): Promise<{ success: true; message: string }> {
  return apiRequest<{ success: true; message: string }>('/warehouse/logout', {
    method: 'POST',
  });
}
