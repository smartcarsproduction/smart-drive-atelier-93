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

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
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
  googleLogin: (googleData: any) => apiRequest<any>('/api/users/google-auth', {
    method: 'POST',
    body: JSON.stringify(googleData),
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

export { ApiError };