import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, serviceApi, bookingApi, vehicleApi, notificationApi, serviceHistoryApi } from './api-client';

// Query key factory for admin features
export const adminKeys = {
  all: ['admin'] as const,
  customers: () => [...adminKeys.all, 'customers'] as const,
  bookings: () => [...adminKeys.all, 'bookings'] as const,
  services: () => [...adminKeys.all, 'services'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  analytics: () => [...adminKeys.all, 'analytics'] as const,
};

// Hook to fetch all customers for admin
export const useAdminCustomers = () => {
  return useQuery({
    queryKey: adminKeys.customers(),
    queryFn: userApi.getCustomers,
    select: (data) => 
      data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || 'Not provided',
        joinDate: new Date(user.createdAt).toLocaleDateString(),
        bookings: 0, // This would need a separate query or join
        status: user.role === 'admin' ? 'Admin' : 'Customer'
      }))
  });
};

// Hook to fetch all bookings for admin
export const useAdminBookings = () => {
  return useQuery({
    queryKey: adminKeys.bookings(),
    queryFn: bookingApi.getAllBookings,
    select: (data) => 
      data.map((booking: any) => ({
        id: booking.id,
        customer: 'Customer', // Would need to join with user data
        service: 'Service', // Would need to join with service data
        date: new Date(booking.scheduledDate).toLocaleDateString(),
        time: new Date(booking.scheduledDate).toLocaleTimeString(),
        vehicle: 'Vehicle', // Would need to join with vehicle data
        status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
      }))
  });
};

// Hook to fetch all services for admin
export const useAdminServices = () => {
  return useQuery({
    queryKey: adminKeys.services(),
    queryFn: serviceApi.getAllServices,
    select: (data) => 
      data.map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: `$${service.price}`,
        duration: `${service.estimatedDuration} min`,
        status: service.isActive ? 'Active' : 'Inactive'
      }))
  });
};

// Hook to fetch dashboard stats
export const useAdminStats = () => {
  const { data: customers = [] } = useAdminCustomers();
  const { data: bookings = [] } = useAdminBookings();
  const { data: services = [] } = useAdminServices();

  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: async () => {
      // Calculate stats from fetched data
      const totalCustomers = customers.length;
      const totalBookings = bookings.length;
      const totalServices = services.length;
      const activeServices = services.filter(s => s.status === 'Active').length;

      return [
        {
          label: 'Total Customers',
          value: totalCustomers.toString(),
          icon: 'Users',
          change: '+12% from last month'
        },
        {
          label: 'Total Bookings',
          value: totalBookings.toString(),
          icon: 'Calendar',
          change: '+8% from last month'
        },
        {
          label: 'Active Services',
          value: activeServices.toString(),
          icon: 'Car',
          change: '+3% from last month'
        },
        {
          label: 'Revenue',
          value: '$0', // Would need revenue calculation
          icon: 'DollarSign',
          change: '+15% from last month'
        }
      ];
    },
    enabled: customers.length > 0 || bookings.length > 0 || services.length > 0
  });
};

// Hook to fetch recent bookings for dashboard
export const useRecentBookings = (limit: number = 5) => {
  return useQuery({
    queryKey: [...adminKeys.bookings(), 'recent', limit],
    queryFn: bookingApi.getAllBookings,
    select: (data) => 
      data
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit)
        .map((booking: any) => ({
          id: booking.id,
          customer: 'Customer', // Would need join
          service: 'Service', // Would need join
          date: new Date(booking.scheduledDate).toLocaleDateString(),
          status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
        }))
  });
};

// Mutation hooks for admin actions
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: serviceApi.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.services() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      serviceApi.updateService(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.services() });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      bookingApi.updateBookingStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.bookings() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.customers() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      userApi.updateUser(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.customers() });
    },
  });
};