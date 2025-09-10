# Luxury Car Service Booking Application

## Overview
This is a React-based frontend application for a luxury car service booking platform. The application features a modern UI built with React, TypeScript, Tailwind CSS, and shadcn/ui components. It includes customer-facing pages for booking luxury car services and an admin dashboard for managing bookings, services, and customers.

## Recent Changes
- **September 10, 2025**: Initial Replit environment setup
  - Configured Vite to serve on port 5000 with proper host settings for Replit proxy
  - Set up workflow for development server
  - Updated server configuration to work with Replit's iframe proxy system

## User Preferences
- Prefers modern React development patterns with TypeScript
- Uses shadcn/ui component library for consistent UI design
- Follows clean code architecture with proper separation of concerns

## Project Architecture
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM v6
- **State Management**: TanStack React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives via shadcn/ui

### Key Features
- **Customer Portal**: Service browsing, booking, and account management
- **Admin Dashboard**: Complete management interface for services, bookings, and customers
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Professional design with luxury car service theming

### Project Structure
```
src/
├── components/
│   ├── admin/          # Admin-specific components
│   ├── ui/             # shadcn/ui component library
│   └── *.tsx           # Shared components (Navigation, Footer, etc.)
├── pages/
│   ├── admin/          # Admin dashboard pages
│   └── *.tsx           # Customer-facing pages
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and stores
└── assets/             # Static assets
```

### Development Configuration
- **Dev Server**: Runs on port 5000 with host 0.0.0.0
- **HMR**: Configured for Replit's proxy environment
- **Build**: Standard Vite build process for production
- **Deployment**: Configured for autoscale deployment target

### Current Status
✅ Application successfully configured for Replit environment
✅ Development server running on port 5000
✅ All dependencies installed and working
✅ Routing and navigation functional
✅ UI components rendering correctly

### Next Steps
- Connect to backend API when available
- Implement authentication flow
- Add data persistence layer
- Configure production deployment