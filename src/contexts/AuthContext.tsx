import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '@/lib/api-client';

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
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credential: string) => {
    try {
      // Decode JWT token to get user info
      const payloadBase64 = credential.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      
      // Get or create user in database
      const dbUser = await userApi.googleLogin({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });

      const newUser: User = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        picture: dbUser.picture || undefined,
        role: dbUser.role,
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      // For now, we'll just check if user exists by email
      // In a real app, you'd verify password hash
      const dbUser = await userApi.getUserByEmail(email);
      
      const newUser: User = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        picture: dbUser.picture || undefined,
        role: dbUser.role,
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error logging in with email:', error);
      throw new Error('Invalid email or password');
    }
  };

  const signUp = async (userData: { email: string; name: string; phone?: string; password: string }) => {
    try {
      const { password, ...userDataWithoutPassword } = userData;
      // Create user without storing password (in real app, hash password)
      const dbUser = await userApi.createUser(userDataWithoutPassword);
      
      const newUser: User = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        picture: dbUser.picture || undefined,
        role: dbUser.role,
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error signing up:', error);
      throw new Error('Failed to create account');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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