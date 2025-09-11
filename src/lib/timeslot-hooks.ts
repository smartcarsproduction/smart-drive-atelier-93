import { useQuery, useMutation } from '@tanstack/react-query';
import { timeSlotsApi } from './api-client';
import { queryClient } from './react-query';
import type { TimeSlot } from './schema';

// Hook to fetch available time slots for a specific date
export const useAvailableTimeSlots = (date: Date | null) => {
  const dateString = date ? date.toISOString().split('T')[0] : null;
  
  return useQuery<TimeSlot[]>({
    queryKey: ['timeSlots', 'available', dateString],
    queryFn: () => timeSlotsApi.getAvailableSlots(dateString!),
    enabled: !!dateString,
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Refresh every 30 seconds to show real-time availability
  });
};

// Hook to fetch time slots in a date range (for admin use)
export const useTimeSlotsInRange = (startDate: Date, endDate: Date) => {
  const startDateString = startDate.toISOString().split('T')[0];
  const endDateString = endDate.toISOString().split('T')[0];
  
  return useQuery<TimeSlot[]>({
    queryKey: ['timeSlots', 'range', startDateString, endDateString],
    queryFn: () => timeSlotsApi.getSlotsInRange(startDateString, endDateString),
    enabled: !!startDate && !!endDate,
  });
};

// Hook to book a time slot
export const useBookTimeSlot = () => {
  return useMutation({
    mutationFn: ({ timeSlotId, bookingId }: { timeSlotId: string; bookingId: string }) =>
      timeSlotsApi.bookSlot(timeSlotId, bookingId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch available slots queries
      queryClient.invalidateQueries({ queryKey: ['timeSlots', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['timeSlots', 'range'] });
      
      // Also invalidate bookings since they're connected
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

// Hook to create a time slot (admin only)
export const useCreateTimeSlot = () => {
  return useMutation({
    mutationFn: (slotData: {
      date: string;
      startTime: string;
      endTime: string;
      maxCapacity?: number;
    }) => timeSlotsApi.createTimeSlot(slotData),
    onSuccess: () => {
      // Invalidate all time slot queries
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
    },
  });
};

// Hook to generate multiple time slots (admin only)
export const useGenerateTimeSlots = () => {
  return useMutation({
    mutationFn: (generationData: {
      startDate: string;
      endDate: string;
      startTime: string;
      endTime: string;
      slotDuration: number;
      maxCapacity?: number;
    }) => timeSlotsApi.generateSlots(generationData),
    onSuccess: () => {
      // Invalidate all time slot queries
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
    },
  });
};

// Helper function to format time slot display
export const formatTimeSlot = (timeSlot: TimeSlot): string => {
  return `${timeSlot.startTime} - ${timeSlot.endTime}`;
};

// Helper function to check if a date has available slots
export const useDateHasAvailableSlots = () => {
  return (date: Date, availableSlots: TimeSlot[] = []): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return availableSlots.some(slot => {
      const slotDate = new Date(slot.date).toISOString().split('T')[0];
      return slotDate === dateString && slot.isAvailable;
    });
  };
};

// Helper function to group slots by date
export const groupSlotsByDate = (slots: TimeSlot[]): Record<string, TimeSlot[]> => {
  return slots.reduce((acc, slot) => {
    const dateKey = new Date(slot.date).toISOString().split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);
};

// Helper function to convert time string to minutes for sorting
export const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to sort slots by time
export const sortSlotsByTime = (slots: TimeSlot[]): TimeSlot[] => {
  return [...slots].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
};