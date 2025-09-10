// API Client for Smart Cars Elite Backend

// Environment-aware API URL configuration
const getApiBaseUrl = () => {
  // If VITE_API_URL is explicitly set, use it (allows custom deployments)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Handle server-side rendering or non-browser environments
  if (typeof window === 'undefined') {
    return import.meta.env.DEV ? 'http://localhost:3001' : '';
  }

  // Browser environment: use environment-aware URL
  if (import.meta.env.DEV) {
    // Development: use port 3001 for backend
    return `${window.location.protocol}//${window.location.hostname}:3001`;
  } else {
    // Production: use same-origin (no explicit port)
    return window.location.origin;
  }
};

const API_BASE_URL = getApiBaseUrl();

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Token management utilities
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_DATA_KEY = 'user_data';

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static getUserData(): any | null {
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static setTokens(accessToken: string, refreshToken: string, userData: any): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
  }

  static isTokenExpired(token: string): boolean {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get access token and add to headers if available
  const accessToken = TokenManager.getAccessToken();
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized - attempt token refresh
    if (response.status === 401 && accessToken && !endpoint.includes('/refresh-token')) {
      const refreshToken = TokenManager.getRefreshToken();
      
      if (refreshToken && !TokenManager.isTokenExpired(refreshToken)) {
        try {
          // Attempt to refresh the token
          const refreshResponse = await fetch(`${API_BASE_URL}/api/users/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const authData = await refreshResponse.json();
            TokenManager.setTokens(authData.accessToken, authData.refreshToken, authData.user);
            
            // Retry the original request with new token
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${authData.accessToken}`,
            };
            
            const retryResponse = await fetch(url, config);
            if (retryResponse.ok) {
              return retryResponse.status === 204 ? (null as T) : await retryResponse.json();
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      
      // If refresh failed or no refresh token, clear tokens and trigger logout
      TokenManager.clearTokens();
      window.dispatchEvent(new CustomEvent('auth:logout'));
      throw new ApiError('Session expired. Please log in again.', 401);
    }
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorData = null;
      
      try {
        errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use status text
      }
      
      throw new ApiError(errorMessage, response.status, errorData);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
}

// User API functions  
export const userApi = {
  // Authentication endpoints
  register: (userData: { email: string; name: string; phone?: string; password: string }) => 
    apiRequest<{
      user: any;
      accessToken: string;
      refreshToken: string;
      expiresIn: string;
    }>('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  login: (credentials: { email: string; password: string }) =>
    apiRequest<{
      user: any;
      accessToken: string;
      refreshToken: string;
      expiresIn: string;
    }>('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  googleLogin: (googleData: { email: string; name: string; picture?: string }) => 
    apiRequest<{
      user: any;
      accessToken: string;
      refreshToken: string;
      expiresIn: string;
    }>('/api/users/google-auth', {
      method: 'POST',
      body: JSON.stringify(googleData),
    }),

  refreshToken: (refreshToken: string) =>
    apiRequest<{
      user: any;
      accessToken: string;
      refreshToken: string;
      expiresIn: string;
    }>('/api/users/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  // Profile endpoints
  getCurrentUser: () => apiRequest<any>('/api/users/me'),
  
  changePassword: (passwords: { oldPassword: string; newPassword: string }) =>
    apiRequest<{ message: string }>('/api/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    }),

  // Admin endpoints
  getCustomers: () => apiRequest<any[]>('/api/users/customers'),
  getUserById: (id: string) => apiRequest<any>(`/api/users/${id}`),
  getUserByEmail: (email: string) => apiRequest<any>(`/api/users/email/${email}`),
  createUser: (userData: any) => apiRequest<any>('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  updateUser: (id: string, updates: any) => apiRequest<any>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
};

// Vehicle API functions
export const vehicleApi = {
  getVehiclesByUser: (userId: string) => apiRequest<any[]>(`/api/vehicles/user/${userId}`),
  getVehicleById: (id: string) => apiRequest<any>(`/api/vehicles/${id}`),
  createVehicle: (vehicleData: any) => apiRequest<any>('/api/vehicles', {
    method: 'POST',
    body: JSON.stringify(vehicleData),
  }),
  updateVehicle: (id: string, updates: any) => apiRequest<any>(`/api/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
  deleteVehicle: (id: string) => apiRequest<void>(`/api/vehicles/${id}`, {
    method: 'DELETE',
  }),
};

// Service API functions
export const serviceApi = {
  getAllServices: () => apiRequest<any[]>('/api/services'),
  getServicesByCategory: (category: string) => apiRequest<any[]>(`/api/services/category/${category}`),
  getServiceById: (id: string) => apiRequest<any>(`/api/services/${id}`),
  createService: (serviceData: any) => apiRequest<any>('/api/services', {
    method: 'POST',
    body: JSON.stringify(serviceData),
  }),
  updateService: (id: string, updates: any) => apiRequest<any>(`/api/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
};

// Booking API functions
export const bookingApi = {
  getAllBookings: () => apiRequest<any[]>('/api/bookings'),
  getBookingsByStatus: (status: string) => apiRequest<any[]>(`/api/bookings/status/${status}`),
  getBookingsByUser: (userId: string) => apiRequest<any[]>(`/api/bookings/user/${userId}`),
  getBookingById: (id: string) => apiRequest<any>(`/api/bookings/${id}`),
  createBooking: (bookingData: any) => apiRequest<any>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  updateBookingStatus: (id: string, status: string, notes?: string) => apiRequest<any>(`/api/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, technicianNotes: notes }),
  }),
};

// Content API functions
export const contentApi = {
  getAllContent: () => apiRequest<any[]>('/api/content'),
  getContentByCategory: (category: string) => apiRequest<any[]>(`/api/content/category/${category}`),
  getContentByKey: (key: string) => apiRequest<{ key: string; value: string }>(`/api/content/key/${key}`),
  updateContent: (key: string, value: string, updatedBy?: string) => apiRequest<any>(`/api/content/key/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value, updatedBy }),
  }),
  createContent: (contentData: any) => apiRequest<any>('/api/content', {
    method: 'POST',
    body: JSON.stringify(contentData),
  }),
};

// Notification API functions
export const notificationApi = {
  getNotificationsByUser: (userId: string) => apiRequest<any[]>(`/api/notifications/user/${userId}`),
  getUnreadCount: (userId: string) => apiRequest<{ count: number }>(`/api/notifications/user/${userId}/unread-count`),
  createNotification: (notificationData: any) => apiRequest<any>('/api/notifications', {
    method: 'POST',
    body: JSON.stringify(notificationData),
  }),
  markAsRead: (id: string) => apiRequest<void>(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  }),
};

// Service History API functions
export const serviceHistoryApi = {
  getHistoryByUser: (userId: string) => apiRequest<any[]>(`/api/service-history/user/${userId}`),
  getHistoryByVehicle: (vehicleId: string) => apiRequest<any[]>(`/api/service-history/vehicle/${vehicleId}`),
  createServiceHistory: (historyData: any) => apiRequest<any>('/api/service-history', {
    method: 'POST',
    body: JSON.stringify(historyData),
  }),
};

// Export TokenManager for use in auth context
export { ApiError, TokenManager };