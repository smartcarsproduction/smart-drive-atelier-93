import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleBasedRedirectProps {
  children: React.ReactNode;
}

export function RoleBasedRedirect({ children }: RoleBasedRedirectProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    // If user is authenticated and is admin, redirect to admin dashboard
    if (user && user.role === 'admin') {
      navigate('/admin', { replace: true });
      return;
    }

    // If user is authenticated but not admin, stay on current page
    if (user && user.role !== 'admin') {
      return;
    }

    // If no user, redirect to login
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
  }, [user, isLoading, navigate]);

  // Show loading while checking authentication
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

  // If admin user, don't render children as they'll be redirected
  if (user && user.role === 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to admin dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}