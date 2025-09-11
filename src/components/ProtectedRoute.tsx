import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer' | 'technician';
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;

    // If no user and we need authentication, redirect
    if (!user) {
      setShouldRedirect(true);
      return;
    }

    // If user doesn't have required role, redirect
    if (requiredRole && user.role !== requiredRole) {
      setShouldRedirect(true);
      return;
    }

    setShouldRedirect(false);
  }, [user, isLoading, requiredRole]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if necessary
  if (shouldRedirect) {
    // Store the attempted location for redirect after login
    const redirectPath = location.pathname !== '/login' ? location.pathname : '/';
    return <Navigate to={`${fallbackPath}?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }

  // User is authenticated and has correct role
  return <>{children}</>;
}

interface RequireRoleProps {
  children: React.ReactNode;
  roles: ('admin' | 'customer' | 'technician')[];
  fallback?: React.ReactNode;
}

export function RequireRole({ children, roles, fallback }: RequireRoleProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !roles.includes(user.role as any)) {
    return fallback || (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to view this content.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}