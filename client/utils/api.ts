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
  admin?: {
    id: string;
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
  console.log('apiRequest called:', { url, method: options.method });
  
  try {
    // Don't set Content-Type for DELETE requests (no body)
    const headers: Record<string, string> = {};
    
    // Add Authorization header if provided
    if (options.headers) {
      const providedHeaders = options.headers as Record<string, string>;
      Object.keys(providedHeaders).forEach(key => {
        headers[key] = providedHeaders[key];
      });
    }
    
    if (options.method !== 'DELETE') {
      headers['Content-Type'] = 'application/json';
    }
    
    console.log('Making request with headers:', Object.keys(headers));
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    console.log('Response status:', response.status, response.statusText);

    // Handle non-JSON responses (e.g., network errors, CORS errors)
    let data;
    try {
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('Parsed JSON data:', data);
      } else {
        // Try to parse as JSON even if content-type doesn't say so
        const responseText = await response.text();
        console.log('Response text:', responseText);
        
        if (responseText) {
          try {
            data = JSON.parse(responseText);
            console.log('Parsed JSON data (fallback):', data);
          } catch {
            // Not JSON, treat as error
            throw new Error(
              `Server error: ${response.status} ${response.statusText}. ${responseText || 'Unable to connect to server. Please check if the server is running and accessible.'}`
            );
          }
        } else {
          // Empty response
          if (response.ok) {
            // Some endpoints might return empty 200 OK
            data = { success: true };
          } else {
            throw new Error(
              `Server error: ${response.status} ${response.statusText}. Empty response.`
            );
          }
        }
      }
    } catch (parseError) {
      // JSON parsing failed
      if (parseError instanceof Error && parseError.message.includes('Server error')) {
        throw parseError;
      }
      console.error('Parse error:', parseError);
      throw new Error(
        `Failed to parse server response. Status: ${response.status}. Please check if the server is running at ${API_BASE_URL}`
      );
    }

    console.log('Checking response:', { ok: response.ok, success: data?.success, status: response.status });
    
    if (!response.ok) {
      throw new Error(data?.message || `Request failed with status ${response.status}`);
    }
    
    // For DELETE requests, check if success field exists, but don't require it if response is 200 OK
    if (data && data.success === false) {
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

export async function loginAdmin(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export interface DashboardStats {
  success: boolean;
  stats: {
    products: number;
    salesmen: number;
    warehouseStaff: number;
    pendingOrders: number;
  };
}

export async function getDashboardStats(token: string): Promise<DashboardStats> {
  return apiRequest<DashboardStats>('/admin/dashboard/stats', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Helper function for FormData requests (multipart/form-data)
async function apiFormDataRequest<T>(
  endpoint: string,
  formData: FormData,
  token: string
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    console.log('Sending FormData request to:', url);
    console.log('FormData entries:', formData);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - let React Native set it with boundary
      },
      body: formData,
    });
    
    console.log('Response status:', response.status, response.statusText);

    let data;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(
          `Server error: ${response.status} ${response.statusText}. ${text || 'Unable to connect to server.'}`
        );
      }
    } catch (parseError) {
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
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Network error: Unable to connect to server at ${API_BASE_URL}. ` +
        `Please ensure the server is running on port 3000`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error(
      `An unexpected error occurred: ${String(error)}. ` +
      `Please check your network connection and server status.`
    );
  }
}

// Helper function for PATCH FormData requests
async function apiFormDataPatchRequest<T>(
  endpoint: string,
  formData: FormData,
  token: string
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    let data;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(
          `Server error: ${response.status} ${response.statusText}. ${text || 'Unable to connect to server.'}`
        );
      }
    } catch (parseError) {
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
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Network error: Unable to connect to server at ${API_BASE_URL}. ` +
        `Please ensure the server is running on port 3000`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error(
      `An unexpected error occurred: ${String(error)}. ` +
      `Please check your network connection and server status.`
    );
  }
}

export interface Product {
  _id: string;
  brand: string;
  company: string;
  modelNumber: string;
  productName: string;
  description: string;
  photos: Array<{ url: string }>;
  category?: string;
  attributes: {
    color?: string;
    size?: string;
    others?: Record<string, any>;
  };
  status: 'active' | 'inactive';
  price?: number;
  stock?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

export interface GetProductsResponse {
  success: boolean;
  message: string;
  products: Product[];
  count: number;
}

export interface CreateProductData {
  brand: string;
  company?: string;
  modelNumber: string;
  productName: string;
  price: number;
  stock: number;
  description?: string;
  category?: string;
  color?: string;
  size?: string;
  others?: Record<string, any>;
  status?: 'active' | 'inactive';
  photo?: { uri: string; type: string; name: string; base64?: string };
}

export async function createProduct(
  data: CreateProductData,
  token: string
): Promise<CreateProductResponse> {
  const formData = new FormData();
  
  formData.append('brand', data.brand);
  if (data.company) formData.append('company', data.company);
  formData.append('modelNumber', data.modelNumber);
  formData.append('productName', data.productName);
  formData.append('price', data.price.toString());
  formData.append('stock', data.stock.toString());
  
  if (data.description) formData.append('description', data.description);
  if (data.category) formData.append('category', data.category);
  if (data.color) formData.append('color', data.color);
  if (data.size) formData.append('size', data.size);
  if (data.status) formData.append('status', data.status);
  if (data.others) formData.append('others', JSON.stringify(data.others));
  
  // Append photo if provided
  if (data.photo) {
    console.log('Appending photo to FormData:', {
      uri: data.photo.uri,
      type: data.photo.type,
      name: data.photo.name,
      hasBase64: !!data.photo.base64,
    });
    
    // Try FormData approach first (for React Native)
    // If base64 is available, we'll send it as a fallback field
    const photoData: any = {
      uri: data.photo.uri,
      type: data.photo.type || 'image/jpeg',
      name: data.photo.name || 'photo.jpg',
    };
    
    formData.append('photo', photoData);
    
    // Also send base64 as a fallback if available
    if (data.photo.base64) {
      formData.append('photoBase64', data.photo.base64);
      formData.append('photoMimeType', data.photo.type || 'image/jpeg');
    }
    
    console.log('Photo appended to FormData');
  } else {
    console.log('No photo to append');
  }
  
  return apiFormDataRequest<CreateProductResponse>('/admin/products', formData, token);
}

export async function editProduct(
  productId: string,
  data: Partial<CreateProductData>,
  token: string
): Promise<CreateProductResponse> {
  const formData = new FormData();
  
  if (data.brand !== undefined) formData.append('brand', data.brand);
  if (data.company !== undefined) formData.append('company', data.company);
  if (data.modelNumber !== undefined) formData.append('modelNumber', data.modelNumber);
  if (data.productName !== undefined) formData.append('productName', data.productName);
  if (data.price !== undefined) formData.append('price', data.price.toString());
  if (data.stock !== undefined) formData.append('stock', data.stock.toString());
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.category !== undefined) formData.append('category', data.category);
  if (data.color !== undefined) formData.append('color', data.color);
  if (data.size !== undefined) formData.append('size', data.size);
  if (data.status !== undefined) formData.append('status', data.status);
  if (data.others !== undefined) formData.append('others', JSON.stringify(data.others));
  
  // Append photo if provided
  if (data.photo) {
    console.log('Appending photo to FormData for edit:', {
      uri: data.photo.uri,
      type: data.photo.type,
      name: data.photo.name,
      hasBase64: !!data.photo.base64,
    });
    
    // Try FormData approach first (for React Native)
    const photoData: any = {
      uri: data.photo.uri,
      type: data.photo.type || 'image/jpeg',
      name: data.photo.name || 'photo.jpg',
    };
    
    formData.append('photo', photoData);
    
    // Also send base64 as a fallback if available
    if (data.photo.base64) {
      formData.append('photoBase64', data.photo.base64);
      formData.append('photoMimeType', data.photo.type || 'image/jpeg');
    }
    
    console.log('Photo appended to FormData for edit');
  } else {
    console.log('No photo to append for edit');
  }
  
  return apiFormDataPatchRequest<CreateProductResponse>(`/admin/products/${productId}`, formData, token);
}

export async function getProducts(
  token: string,
  filters?: {
    company?: string;
    status?: string;
    category?: string;
  }
): Promise<GetProductsResponse> {
  const queryParams = new URLSearchParams();
  if (filters?.company) queryParams.append('company', filters.company);
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.category) queryParams.append('category', filters.category);
  
  const queryString = queryParams.toString();
  const endpoint = `/admin/products${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<GetProductsResponse>(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}

export async function deleteProduct(
  productId: string,
  token: string
): Promise<DeleteProductResponse> {
  console.log('deleteProduct API called:', { productId, endpoint: `/admin/products/${productId}` });
  try {
    const result = await apiRequest<DeleteProductResponse>(`/admin/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('deleteProduct API success:', result);
    return result;
  } catch (error) {
    console.error('deleteProduct API error:', error);
    throw error;
  }
}
