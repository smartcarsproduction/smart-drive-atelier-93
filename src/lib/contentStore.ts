// Content Management Store
interface WebsiteContent {
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    heroButton: string;
    servicesTitle: string;
    aboutTitle: string;
    aboutDescription: string;
  };
  services: {
    title: string;
    subtitle: string;
    services: Array<{
      id: string;
      name: string;
      description: string;
      price: string;
      duration: string;
      image: string;
    }>;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    features: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  contact: {
    title: string;
    subtitle: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  footer: {
    companyName: string;
    description: string;
    phone: string;
    email: string;
    address: string;
  };
}

// Default content - now empty to remove hardcoded values
const defaultContent: WebsiteContent = {
  homepage: {
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    heroButton: "",
    servicesTitle: "",
    aboutTitle: "",
    aboutDescription: ""
  },
  services: {
    title: "",
    subtitle: "",
    services: []
  },
  about: {
    title: "",
    subtitle: "",
    description: "",
    features: []
  },
  contact: {
    title: "",
    subtitle: "",
    phone: "",
    email: "",
    address: "",
    hours: ""
  },
  footer: {
    companyName: "",
    description: "",
    phone: "",
    email: "",
    address: ""
  }
};

// Content store implementation
class ContentStore {
  private content: WebsiteContent;
  private listeners: Array<() => void> = [];

  constructor() {
    // Load from localStorage or use default
    const stored = localStorage.getItem('websiteContent');
    this.content = stored ? JSON.parse(stored) : defaultContent;
  }

  // Get content
  getContent(): WebsiteContent {
    return { ...this.content };
  }

  // Update content
  updateContent(updates: Partial<WebsiteContent>): void {
    this.content = { ...this.content, ...updates };
    localStorage.setItem('websiteContent', JSON.stringify(this.content));
    this.notifyListeners();
  }

  // Update specific section
  updateSection<K extends keyof WebsiteContent>(
    section: K,
    updates: Partial<WebsiteContent[K]>
  ): void {
    this.content[section] = { ...this.content[section], ...updates };
    localStorage.setItem('websiteContent', JSON.stringify(this.content));
    this.notifyListeners();
  }

  // Subscribe to changes
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  // Reset to default
  resetToDefault(): void {
    this.content = { ...defaultContent };
    localStorage.setItem('websiteContent', JSON.stringify(this.content));
    this.notifyListeners();
  }
}

// Global content store instance
export const contentStore = new ContentStore();

// React hook for using content
import { useState, useEffect } from 'react';

export const useWebsiteContent = () => {
  const [content, setContent] = useState(contentStore.getContent());

  useEffect(() => {
    const unsubscribe = contentStore.subscribe(() => {
      setContent(contentStore.getContent());
    });

    return unsubscribe;
  }, []);

  return {
    content,
    updateContent: (updates: Partial<WebsiteContent>) => contentStore.updateContent(updates),
    updateSection: <K extends keyof WebsiteContent>(section: K, updates: Partial<WebsiteContent[K]>) => 
      contentStore.updateSection(section, updates),
    resetToDefault: () => contentStore.resetToDefault()
  };
};