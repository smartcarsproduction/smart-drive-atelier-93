import { useQuery } from '@tanstack/react-query';
import { serviceApi } from './api-client';
import type { Service } from './schema';

// Hook to fetch all services
export const useServices = () => {
  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => serviceApi.getAllServices(),
  });
};

// Hook to fetch services by category
export const useServicesByCategory = (category: string) => {
  return useQuery<Service[]>({
    queryKey: ['services', 'category', category],
    queryFn: () => serviceApi.getServicesByCategory(category),
    enabled: !!category,
  });
};

// Hook to fetch a single service by ID
export const useService = (id: string) => {
  return useQuery<Service>({
    queryKey: ['services', id],
    queryFn: () => serviceApi.getServiceById(id),
    enabled: !!id,
  });
};

// Helper function to format price for display
export const formatPrice = (price: string | null | undefined): string => {
  if (!price) return 'Contact for pricing';
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return 'Contact for pricing';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};

// Helper function to format duration for display
export const formatDuration = (minutes: number | null | undefined): string => {
  if (!minutes) return 'Duration varies';
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

// Helper function to get luxury level badge variant
export const getLuxuryLevelVariant = (level: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (level) {
    case 'elite':
      return 'default';
    case 'premium':
      return 'secondary';
    default:
      return 'outline';
  }
};

// Helper function to capitalize luxury level
export const capitalizeLuxuryLevel = (level: string): string => {
  return level.charAt(0).toUpperCase() + level.slice(1);
};