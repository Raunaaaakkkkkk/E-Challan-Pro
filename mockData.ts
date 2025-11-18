import type { User, Offense, Challan } from './types';

export const MOCK_USERS: User[] = [
    { id: 'admin1', name: 'Admin', role: 'admin', password: 'admin' },
    { id: 'emp1', name: 'Ravi Kumar', role: 'employee', password: 'password1' },
    { id: 'emp2', name: 'Sunita Sharma', role: 'employee', password: 'password2' },
];

export const MOCK_OFFENSES: Offense[] = [
  { id: '1', name: 'Driving without a valid license', fine: 5000 },
  { id: '2', name: 'Driving without a helmet', fine: 1000 },
  { id: '3', name: 'Triple riding on a two-wheeler', fine: 1000 },
  { id: '4', name: 'Jumping a red light', fine: 5000 },
  { id: '5', name: 'Overspeeding', fine: 2000 },
  { id: '6', name: 'Using a mobile phone while driving', fine: 5000 },
  { id: '7', 'name': 'Driving without a seatbelt', 'fine': 1000 },
  { id: '8', name: 'Driving under the influence of alcohol', fine: 10000 },
  { id: '9', name: 'No Parking', fine: 500 },
  { id: '10', name: 'Driving without insurance', fine: 2000 },
  { id: '11', name: 'Driving without PUC certificate', fine: 1500 },
  { id: '12', name: 'Not giving way to emergency vehicles', fine: 10000 }
];

export const MOCK_CHALLANS: Challan[] = [
    {
        id: 'C1721200',
        vehicleNumber: 'MH12AB3456',
        driverName: 'Amit Singh',
        driverLicense: 'DL123456',
        offenses: [MOCK_OFFENSES[1]],
        totalFine: 1000,
        location: { latitude: 19.0760, longitude: 72.8777 },
        date: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        issuedBy: 'emp1'
    },
    {
        id: 'C1721100',
        vehicleNumber: 'GJ05CD7890',
        driverName: 'Priya Patel',
        driverLicense: 'DL789012',
        offenses: [MOCK_OFFENSES[3]],
        totalFine: 5000,
        location: { latitude: 23.0225, longitude: 72.5714 },
        date: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        issuedBy: 'emp2'
    },
     {
        id: 'C1721000',
        vehicleNumber: 'KA01GH5678',
        driverName: 'Rajesh Kumar',
        driverLicense: 'DL567890',
        offenses: [MOCK_OFFENSES[9]],
        totalFine: 2000,
        location: { latitude: 12.9716, longitude: 77.5946 },
        date: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        issuedBy: 'emp1'
    }
];