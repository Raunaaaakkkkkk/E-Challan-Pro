import React, { createContext, useState, ReactNode, useContext } from 'react';
import type { User, Role } from '../types';
import { DataContext } from './DataContext';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, role: Role, password?: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { users } = useContext(DataContext); // Use users from DataContext

  const login = (username: string, role: Role, password?: string): boolean => {
    const user = users.find(u => u.name.toLowerCase() === username.toLowerCase() && u.role === role);
    
    if (user) {
      // Admin can log in without a password if none is set (for demo), employees must have a password.
      if (role === 'admin' && !user.password) {
        setCurrentUser(user);
        return true;
      }
      if (user.password === password) {
        setCurrentUser(user);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};