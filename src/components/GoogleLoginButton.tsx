import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleLoginButtonProps {
  text?: string;
  redirectPath?: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ 
  text = "Continue with Google",
  redirectPath = "/dashboard"
}) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
        });
      }
    };

    const handleCredentialResponse = async (response: any) => {
      try {
        await login(response.credential);
        toast.success('Successfully signed in with Google!');
        navigate(redirectPath);
      } catch (error) {
        toast.error('Failed to sign in with Google. Please try again.');
        console.error('Google sign-in error:', error);
      }
    };

    // Check if Google script is loaded
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Wait for script to load
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn();
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [login, navigate, redirectPath]);

  return (
    <div className="w-full">
      <div ref={buttonRef} className="w-full flex justify-center" />
    </div>
  );
};

export default GoogleLoginButton;