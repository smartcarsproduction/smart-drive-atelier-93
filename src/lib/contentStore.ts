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

// Default content
const defaultContent: WebsiteContent = {
  homepage: {
    heroTitle: "Elite Customer Support",
    heroSubtitle: "Experience personalized support from our dedicated concierge team. We're available 24/7 to ensure your luxury automotive needs are met with precision and care.",
    heroImage: "/src/assets/hero-luxury-car.jpg",
    heroButton: "Book Elite Service",
    servicesTitle: "Premium Automotive Services",
    aboutTitle: "Smart Cars Elite",
    aboutDescription: "Redefining luxury automotive care with AI-powered diagnostics and precision engineering."
  },
  services: {
    title: "Premium Services",
    subtitle: "Experience the future of automotive care with our AI-powered diagnostic services and expert craftsmanship.",
    services: [
      {
        id: "ai-diagnostics",
        name: "AI Diagnostics",
        description: "Advanced AI-powered vehicle diagnostics for precise problem identification.",
        price: "₹15,999",
        duration: "2 hours",
        image: "/src/assets/hero-luxury-car.jpg"
      },
      {
        id: "engine-rebuild",
        name: "Engine Rebuild",
        description: "Complete engine rebuilding service with precision engineering.",
        price: "₹1,49,999",
        duration: "5 days",
        image: "/src/assets/hero-luxury-car.jpg"
      },
      {
        id: "smart-customization",
        name: "Smart Customization",
        description: "AI-assisted vehicle customization for enhanced performance.",
        price: "₹79,999",
        duration: "3 days",
        image: "/src/assets/hero-luxury-car.jpg"
      },
      {
        id: "predictive-maintenance",
        name: "Predictive Maintenance",
        description: "Proactive maintenance using AI prediction algorithms.",
        price: "₹11,999",
        duration: "1 hour",
        image: "/src/assets/hero-luxury-car.jpg"
      }
    ]
  },
  about: {
    title: "About Smart Cars Elite",
    subtitle: "Pioneering the future of luxury automotive care",
    description: "Smart Cars Elite represents the pinnacle of automotive excellence, where cutting-edge AI technology meets traditional craftsmanship. We've revolutionized vehicle care through predictive diagnostics, precision engineering, and unparalleled customer service.",
    features: [
      {
        title: "AI-Powered Diagnostics",
        description: "Advanced machine learning algorithms for precise vehicle analysis",
        icon: "Brain"
      },
      {
        title: "Expert Craftsmanship",
        description: "Master technicians with decades of luxury automotive experience",
        icon: "Award"
      },
      {
        title: "24/7 Premium Support",
        description: "Round-the-clock concierge service for all your automotive needs",
        icon: "Clock"
      }
    ]
  },
  contact: {
    title: "Elite Customer Support",
    subtitle: "Experience personalized support from our dedicated concierge team.",
    phone: "+91 98765-43210",
    email: "premium@smartcarselite.co.in",
    address: "Phoenix Mills Compound, Lower Parel, Mumbai - 400013, Maharashtra",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM"
  },
  footer: {
    companyName: "Smart Cars Elite",
    description: "Redefining the future of luxury automotive care through AI diagnostics, precision engineering, and timeless craftsmanship.",
    phone: "+91 98765-43210",
    email: "premium@smartcarselite.co.in",
    address: "Lower Parel, Mumbai"
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