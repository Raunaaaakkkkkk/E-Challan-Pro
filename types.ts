
export type Role = 'admin' | 'employee';
export type View = 'dashboard' | 'challan' | 'search' | 'rules' | 'admin';
export type Theme = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  name: string;
  role: Role;
  password?: string;
}

export interface Offense {
  id: string;
  name: string;
  fine: number;
}

export interface VehicleInfo {
  ownerName: string;
  registrationDate: string;
  vehicleModel: string;
  insuranceStatus: 'Active' | 'Expired';
  pucStatus: 'Active' | 'Expired';
}

export interface Challan {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverLicense: string;
  offenses: Offense[];
  totalFine: number;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  date: string;
  photoEvidence?: string; // base64 string
  issuedBy: string; // User ID
  customFields?: { [key: string]: string };
}
