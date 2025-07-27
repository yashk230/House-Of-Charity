export interface User {
  id: string;
  email: string;
  name?: string;
  user_type: 'donor' | 'ngo';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  description?: string;
  website?: string;
  logo_url?: string;
  verified?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Donor extends User {
  user_type: 'donor';
}

export interface NGO extends User {
  user_type: 'ngo';
  // Additional NGO-specific fields are handled in the base User interface
}

export interface Donation {
  id: string;
  donor_id: string;
  ngo_id: string;
  amount: number;
  currency: string;
  payment_method?: string;
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  message?: string;
  anonymous: boolean;
  created_at: string;
  updated_at: string;
}

export interface Requirement {
  id: string;
  ngo_id: string;
  title: string;
  description?: string;
  category?: string;
  amount_needed?: number;
  currency: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'fulfilled' | 'cancelled';
  deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'donation' | 'requirement' | 'connection' | 'general';
  read: boolean;
  created_at: string;
  related_id?: string; // ID of related donation, requirement, etc.
} 