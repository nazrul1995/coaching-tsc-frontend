'use client';

import { useRouter } from 'next/navigation';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export type User = {
  _id?: string;
  email: string;
  role: 'student' | 'teacher' | 'admin' | 'user';
  name?: string;
  image?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to restore auth:', error);

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));

    // Next.js middleware/client route protection-এর জন্য
    document.cookie = `token=${newToken}; Path=/; Max-Age=${
      7 * 24 * 60 * 60
    }; SameSite=Lax`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // frontend cookie remove
    document.cookie =
      'token=; Path=/; Max-Age=0; SameSite=Lax';

    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!token && !!user,
        isLoading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
