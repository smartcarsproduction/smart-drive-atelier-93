import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi, TokenManager } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credential: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (userData: { email: string; name: string; phone?: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in token manager
    const storedUser = TokenManager.getUserData();
    const accessToken = TokenManager.getAccessToken();
    
    if (storedUser && accessToken && !TokenManager.isTokenExpired(accessToken)) {
      setUser(storedUser);
    } else {
      // Clear invalid/expired tokens
      TokenManager.clearTokens();
    }
    
    // Listen for logout events from API client
    const handleLogout = () => {
      setUser(null);
    };
    
    window.addEventListener('auth:logout', handleLogout);
    setIsLoading(false);
    
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const login = async (credential: string) => {
    try {
      // Decode JWT token to get user info for Google OAuth
      const payloadBase64 = credential.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      
      // Get or create user in database and get JWT tokens
      const authResponse = await userApi.googleLogin({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });

      // Store JWT tokens and user data
      TokenManager.setTokens(authResponse.accessToken, authResponse.refreshToken, authResponse.user);
      setUser(authResponse.user);
    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      // Use secure login endpoint with password verification
      const authResponse = await userApi.login({ email, password });
      
      // Store JWT tokens and user data
      TokenManager.setTokens(authResponse.accessToken, authResponse.refreshToken, authResponse.user);
      setUser(authResponse.user);
    } catch (error) {
      console.error('Error logging in with email:', error);
      throw new Error('Invalid email or password');
    }
  };

  const signUp = async (userData: { email: string; name: string; phone?: string; password: string }) => {
    try {
      // Use secure registration endpoint with password hashing
      const authResponse = await userApi.register(userData);
      
      // Store JWT tokens and user data
      TokenManager.setTokens(authResponse.accessToken, authResponse.refreshToken, authResponse.user);
      setUser(authResponse.user);
    } catch (error) {
      console.error('Error signing up:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        throw new Error('An account with this email already exists');
      }
      throw new Error('Failed to create account');
    }
  };

  const logout = () => {
    // Clear JWT tokens and user data
    TokenManager.clearTokens();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    loginWithEmail,
    signUp,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};