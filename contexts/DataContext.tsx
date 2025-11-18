import React, { createContext, useState, ReactNode } from 'react';
import type { User, Offense, Challan } from '../types';
import { MOCK_USERS, MOCK_OFFENSES, MOCK_CHALLANS } from '../mockData';

interface DataContextType {
  users: User[];
  addUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  updateUser: (userId: string, updatedData: Partial<User>) => void;
  offenses: Offense[];
  addOffense: (offense: Offense) => void;
  deleteOffense: (offenseId: string) => void;
  updateOffense: (offenseId: string, updatedData: Partial<Offense>) => void;
  challans: Challan[];
  addChallan: (challan: Challan) => void;
  customChallanFields: string[];
  addCustomChallanField: (fieldName: string) => void;
  deleteCustomChallanField: (fieldName: string) => void;
}

export const DataContext = createContext<DataContextType>({} as DataContextType);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [offenses, setOffenses] = useState<Offense[]>(MOCK_OFFENSES);
  const [challans, setChallans] = useState<Challan[]>(MOCK_CHALLANS);
  const [customChallanFields, setCustomChallanFields] = useState<string[]>(['Driver License Number']);

  const addUser = (user: User) => setUsers(prev => [...prev, user]);
  const deleteUser = (userId: string) => setUsers(prev => prev.filter(u => u.id !== userId));
  const updateUser = (userId: string, updatedData: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
  };
  
  const addOffense = (offense: Offense) => setOffenses(prev => [offense, ...prev]);
  const deleteOffense = (offenseId: string) => setOffenses(prev => prev.filter(o => o.id !== offenseId));
  const updateOffense = (offenseId: string, updatedData: Partial<Offense>) => {
    setOffenses(prev => prev.map(o => o.id === offenseId ? { ...o, ...updatedData } : o));
  };

  const addChallan = (challan: Challan) => setChallans(prev => [challan, ...prev]);

  const addCustomChallanField = (fieldName: string) => setCustomChallanFields(prev => [...prev, fieldName]);
  const deleteCustomChallanField = (fieldName: string) => setCustomChallanFields(prev => prev.filter(f => f !== fieldName));

  const value = {
    users, addUser, deleteUser, updateUser,
    offenses, addOffense, deleteOffense, updateOffense,
    challans, addChallan,
    customChallanFields, addCustomChallanField, deleteCustomChallanField
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};