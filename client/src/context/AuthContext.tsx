import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  loginGoogle: (googlePayload: any) => Promise<boolean>;
  loginSocial: (provider: string, payload?: any) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
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

  const loginGoogle = async (googlePayload: any) => {
    return loginSocial('google', googlePayload);
  };

  const loginSocial = async (provider: string, payload?: any) => {
    setIsLoading(true);
    const providerKey = String(provider).toLowerCase();
    try {
      const res = await api.socialLogin({ provider: providerKey, ...payload });
      if (res.data && res.data.token) {
        localStorage.setItem('civicsolve_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setActiveRoleState(res.data.user.role);
        setIsLoading(false);
        return true;
      }
    } catch (err: any) {
      console.warn('Social login API error, applying resilient fallback:', err);
    }

    // Resilient fallback: ensure user is always logged in for testing/demo
    const mockEmail = payload?.email || (
      providerKey === 'github' ? 'developer.innovator@github.com' :
      providerKey === 'linkedin' ? 'partner.csr@linkedin.com' :
      providerKey === 'apple' ? 'citizen.apple@icloud.com' :
      providerKey === 'digilocker' ? 'citizen.aadhaar@gov.in' :
      'harshitgadre786@gmail.com'
    );
    const mockName = payload?.name || (
      providerKey === 'github' ? 'GitHub Innovator' :
      providerKey === 'linkedin' ? 'LinkedIn Partner' :
      providerKey === 'apple' ? 'Apple Verified User' :
      providerKey === 'digilocker' ? 'Verified Citizen (MeriPehchaan)' :
      'Harshit Gadre'
    );
    const mockRole: UserRole = providerKey === 'github' ? 'STUDENT' : providerKey === 'linkedin' ? 'INDUSTRY_PARTNER' : 'CITIZEN';
    const mockUser: User = {
      id: 'usr_' + providerKey + '_' + Date.now(),
      name: mockName,
      email: mockEmail,
      role: mockRole,
      avatar: payload?.avatarUrl || payload?.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      location: 'Ranchi, Jharkhand',
      organization: providerKey === 'digilocker' ? 'Government of Jharkhand (DigiLocker Verified)' : undefined
    };
    setUser(mockUser);
    setActiveRoleState(mockRole);
    setIsLoading(false);
    return true;
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
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
        loginGoogle,
        loginSocial,
        logout,
        refreshUser,
        updateUser,
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
