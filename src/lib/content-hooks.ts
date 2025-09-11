import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi } from './api-client';

// Query key factory for consistent key management
export const contentKeys = {
  all: ['content'] as const,
  category: (category: string) => [...contentKeys.all, 'category', category] as const,
  key: (key: string) => [...contentKeys.all, 'key', key] as const,
};

// Hook to fetch all content (for admin)
export const useAllContent = () => {
  return useQuery({
    queryKey: contentKeys.all,
    queryFn: contentApi.getAllContent,
  });
};

// Hook to fetch public content (for public pages)
export const usePublicContent = () => {
  return useQuery({
    queryKey: [...contentKeys.all, 'public'],
    queryFn: contentApi.getPublicContent,
  });
};

// Hook to fetch content by category
export const useContentByCategory = (category: string) => {
  return useQuery({
    queryKey: contentKeys.category(category),
    queryFn: () => contentApi.getContentByCategory(category),
  });
};

// Hook to fetch content by key
export const useContentByKey = (key: string) => {
  return useQuery({
    queryKey: contentKeys.key(key),
    queryFn: () => contentApi.getContentByKey(key),
    select: (data) => data?.value || '',
  });
};

// Hook to update content
export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value, updatedBy }: { key: string; value: string; updatedBy?: string }) =>
      contentApi.updateContent(key, value, updatedBy),
    onSuccess: (_, { key }) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
      queryClient.invalidateQueries({ queryKey: contentKeys.key(key) });
    },
  });
};

// Hook to create content
export const useCreateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contentApi.createContent,
    onSuccess: () => {
      // Invalidate all content queries
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
    },
  });
};

// Website content structure for backward compatibility
interface WebsiteContent {
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    heroButton: string;
    aboutTitle: string;
  };
  about: {
    title: string;
    subtitle: string;
  };
  contact: {
    title: string;
    subtitle: string;
  };
  services: {
    title: string;
    subtitle: string;
  };
}

// Default content fallback
const defaultContent: WebsiteContent = {
  homepage: {
    heroTitle: "Luxury Automotive Excellence",
    heroSubtitle: "Experience premium car services with AI-driven precision and concierge-level care.",
    heroButton: "Book Service",
    aboutTitle: "Redefined",
  },
  about: {
    title: "About Smart Cars",
    subtitle: "Innovation meets luxury in automotive care",
  },
  contact: {
    title: "Get in Touch",
    subtitle: "We're here to help with your luxury automotive needs",
  },
  services: {
    title: "Our Services",
    subtitle: "Premium automotive solutions tailored for luxury vehicles",
  },
};

// Backward compatibility hook for existing components
export const useWebsiteContent = () => {
  const { data: allContent = [], isLoading, error } = usePublicContent();
  const updateContentMutation = useUpdateContent();

  // Convert backend content array to structured object
  const content: WebsiteContent = React.useMemo(() => {
    const contentMap = new Map(allContent.map(item => [item.key, item.value]));
    
    return {
      homepage: {
        heroTitle: contentMap.get('homepage_hero_title') || defaultContent.homepage.heroTitle,
        heroSubtitle: contentMap.get('homepage_hero_subtitle') || defaultContent.homepage.heroSubtitle,
        heroButton: contentMap.get('homepage_hero_button') || defaultContent.homepage.heroButton,
        aboutTitle: contentMap.get('homepage_about_title') || defaultContent.homepage.aboutTitle,
      },
      about: {
        title: contentMap.get('about_title') || defaultContent.about.title,
        subtitle: contentMap.get('about_subtitle') || defaultContent.about.subtitle,
      },
      contact: {
        title: contentMap.get('contact_title') || defaultContent.contact.title,
        subtitle: contentMap.get('contact_subtitle') || defaultContent.contact.subtitle,
      },
      services: {
        title: contentMap.get('services_title') || defaultContent.services.title,
        subtitle: contentMap.get('services_subtitle') || defaultContent.services.subtitle,
      },
    };
  }, [allContent]);

  const updateContent = (updates: Partial<WebsiteContent>) => {
    // Convert structured updates to key-value pairs and update via API
    Object.entries(updates).forEach(([section, values]) => {
      Object.entries(values).forEach(([key, value]) => {
        const contentKey = `${section}_${key}`;
        updateContentMutation.mutate({ key: contentKey, value: String(value) });
      });
    });
  };

  const updateSection = <K extends keyof WebsiteContent>(
    section: K,
    updates: Partial<WebsiteContent[K]>
  ) => {
    Object.entries(updates).forEach(([key, value]) => {
      const contentKey = `${section}_${key}`;
      updateContentMutation.mutate({ key: contentKey, value: String(value) });
    });
  };

  const resetToDefault = () => {
    // Reset all content to default values
    Object.entries(defaultContent).forEach(([section, values]) => {
      Object.entries(values).forEach(([key, value]) => {
        const contentKey = `${section}_${key}`;
        updateContentMutation.mutate({ key: contentKey, value: String(value) });
      });
    });
  };

  return {
    content,
    isLoading,
    error,
    updateContent,
    updateSection,
    resetToDefault,
  };
};

