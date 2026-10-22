import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { StorageService, DEMO_USERS } from '../services/storage';

interface AuthContextType {
  currentUser: User;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (name: string, email: string, role: UserRole, department?: string) => { success: boolean; error?: string };
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User>(() => StorageService.getCurrentUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUserState(StorageService.getCurrentUser());
    };
    window.addEventListener('civicai_auth_changed', handleAuthChange);
    return () => window.removeEventListener('civicai_auth_changed', handleAuthChange);
  }, []);

  const login = (email: string, password?: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();

    // Check demo credentials
    const demoUser = DEMO_USERS.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (demoUser) {
      if (password) {
        let expectedPassword = '';
        if (demoUser.role === 'citizen') expectedPassword = 'Citizen123!';
        if (demoUser.role === 'officer') expectedPassword = 'Officer123!';
        if (demoUser.role === 'worker') expectedPassword = 'Worker123!';

        if (password !== expectedPassword) {
          return { success: false, error: `Invalid password for demo account. Expected: ${expectedPassword}` };
        }
      }
      StorageService.setCurrentUser(demoUser);
      setCurrentUserState(demoUser);
      return { success: true };
    }

    // Allow custom login for testing
    if (trimmedEmail) {
      const customUser: User = {
        id: `user-${Date.now()}`,
        name: trimmedEmail.split('@')[0],
        email: trimmedEmail,
        role: trimmedEmail.includes('officer')
          ? 'officer'
          : trimmedEmail.includes('worker')
          ? 'worker'
          : 'citizen',
      };
      StorageService.setCurrentUser(customUser);
      setCurrentUserState(customUser);
      return { success: true };
    }

    return { success: false, error: 'Please enter a valid email address.' };
  };

  const register = (
    name: string,
    email: string,
    role: UserRole,
    department?: string
  ): { success: boolean; error?: string } => {
    if (!name.trim() || !email.trim()) {
      return { success: false, error: 'Name and email are required.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      department: role === 'worker' ? department || 'Road Maintenance' : department,
      phone: '+91 98000 00000',
      ward: 'Ward 112 - Central Zone',
    };

    StorageService.setCurrentUser(newUser);
    setCurrentUserState(newUser);
    return { success: true };
  };

  const logout = () => {
    // Default back to Citizen demo user or null
    StorageService.setCurrentUser(DEMO_USERS[0]);
    setCurrentUserState(DEMO_USERS[0]);
  };

  const switchDemoRole = (role: UserRole) => {
    const targetUser = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    StorageService.setCurrentUser(targetUser);
    setCurrentUserState(targetUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
