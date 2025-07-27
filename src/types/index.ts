export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'donor' | 'ngo';
  createdAt: Date;
  updatedAt: Date;
}

export interface Donor extends User {
  userType: 'donor';
  phone?: string;
  address?: string;
  connectedNGOs: string[]; // Array of NGO IDs
  donationHistory: Donation[];
}

export interface NGO extends User {
  userType: 'ngo';
  organizationName: string;
  description: string;
  mission: string;
  website?: string;
  phone: string;
  address: string;
  logo?: string;
  verified: boolean;
  works: NGOWork[];
  awards: NGOAward[];
  requirements: NGORequirement[];
  connectedDonors: string[]; // Array of donor IDs
  donationHistory: Donation[];
}

export interface NGOWork {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: Date;
  impact: string;
  location: string;
}

export interface NGOAward {
  id: string;
  title: string;
  description: string;
  year: number;
  issuer: string;
  image?: string;
}

export interface NGORequirement {
  id: string;
  title: string;
  description: string;
  category: 'money' | 'food' | 'essentials' | 'other';
  quantity?: number;
  unit?: string;
  urgency: 'low' | 'medium' | 'high';
  deadline?: Date;
  createdAt: Date;
  status: 'active' | 'fulfilled' | 'expired';
}

export interface Donation {
  id: string;
  donorId: string;
  ngoId: string;
  type: 'money' | 'food' | 'essentials' | 'other';
  amount?: number;
  description: string;
  quantity?: number;
  unit?: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  donorName: string;
  ngoName: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'donation' | 'requirement' | 'connection' | 'general';
  read: boolean;
  createdAt: Date;
  relatedId?: string; // ID of related donation, requirement, etc.
} 