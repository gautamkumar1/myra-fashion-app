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

    // Handle non-JSON responses (e.g., network errors, CORS errors)
    let data;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If response is not JSON, it's likely a network/server error
        const text = await response.text();
        throw new Error(
          `Server error: ${response.status} ${response.statusText}. ${text || 'Unable to connect to server. Please check if the server is running and accessible.'}`
        );
      }
    } catch (parseError) {
      // JSON parsing failed
      if (parseError instanceof Error && parseError.message.includes('Server error')) {
        throw parseError;
      }
      throw new Error(
        `Failed to parse server response. Status: ${response.status}. Please check if the server is running at ${API_BASE_URL}`
      );
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data as T;
  } catch (error) {
    // Handle network errors (connection refused, timeout, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Network error: Unable to connect to server at ${API_BASE_URL}. ` +
        `Please ensure:\n` +
        `1. The server is running on port 3000\n` +
        `2. Your device and computer are on the same network\n` +
        `3. The IP address is correct (currently using: ${API_BASE_URL})`
      );
    }
    
    // Handle CORS errors
    if (error instanceof Error && error.message.includes('CORS')) {
      throw new Error(
        `CORS error: The server is blocking requests from this origin. ` +
        `Please check server CORS configuration.`
      );
    }
    
    // Re-throw known errors
    if (error instanceof Error) {
      throw error;
    }
    
    // Fallback for unknown errors
    throw new Error(
      `An unexpected error occurred: ${String(error)}. ` +
      `Please check your network connection and server status.`
    );
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
