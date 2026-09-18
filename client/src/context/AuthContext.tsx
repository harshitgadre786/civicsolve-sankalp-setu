import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const DEFAULT_USER: User = {
  id: 'usr_harshit',
  name: 'Harshit Gadre',
  email: 'harshitgadre706@gmail.com',
  role: 'CITIZEN',
  organization: 'BIT Sindri / Student Innovator',
  location: 'Ranchi, Jharkhand',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  skills: JSON.stringify(['Python', 'IoT', 'C++', 'React', 'GIS'])
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [token, setToken] = useState<string | null>(localStorage.getItem('civicsolve_token') || 'demo_token');
  const [activeRole, setActiveRoleState] = useState<UserRole>('CITIZEN');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    if (user) {
      setUser({ ...user, role });
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.data) {
        setUser(res.data);
        setActiveRoleState(res.data.role);
      }
    } catch {
      // Fallback to local default user if server isn't logged in yet
      if (!user) setUser(DEFAULT_USER);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password = 'password123') => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.data && res.data.token) {
        localStorage.setItem('civicsolve_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setActiveRoleState(res.data.user.role);
        setIsLoading(false);
        return true;
      }
    } catch (e) {
      console.warn('API login failed, using fallback mock login:', e);
      // Mock login for demo robustness
      const roleMap: Record<string, UserRole> = {
        'admin@bitsindri.ac.in': 'UNIVERSITY_ADMIN',
        'priya.nair@tatasteel.com': 'INDUSTRY_PARTNER',
        'director.planning@jharkhand.gov.in': 'GOVERNMENT'
      };
      const assignedRole = roleMap[email] || 'CITIZEN';
      const mockUser: User = {
        id: 'usr_' + Date.now(),
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email,
        role: assignedRole,
        location: 'Ranchi, Jharkhand'
      };
      setUser(mockUser);
      setActiveRoleState(assignedRole);
    }
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('civicsolve_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeRole,
        setActiveRole,
        login,
        logout,
        refreshUser,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
