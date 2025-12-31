import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  roles?:string[]
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>; 
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const storedUser = localStorage.getItem('user');
  const token = localStorage.getItem('accessToken');

  try {
    if (storedUser && token && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    localStorage.removeItem("user");
    setUser(null);
  }

  setIsLoading(false); 
}, []);


const login = async (email: string, password: string) => {
  try {
    const response = await authApi.login(email, password);

      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken || "";
      const backendUser = response.data.data || {};
    
      if (!accessToken) {
        throw new Error("Backend did not return accessToken");
      }

      const userData: User = {
        id: backendUser._id || "",
        name: backendUser.name,
        email: backendUser.email || "",
        profileImage: backendUser.imageUrl || "",
        roles: backendUser.roles || [],
      };

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", ""); 
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    return userData;
  } catch (error: any) {
    throw error;
  }
};


  const register = async (name: string, email: string, password: string) => {
    await authApi.register(name, email, password);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
