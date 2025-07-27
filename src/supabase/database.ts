// import { supabase } from './config';
import { Donation, Donor, NGO, Requirement } from '../types';

// Temporary mock implementation until Supabase is properly set up

// User operations
export const userService = {
  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Donor | NGO;
  },

  async updateUser(id: string, updates: Partial<Donor | NGO>) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Donor | NGO;
  }
};

// Donation operations
export const donationService = {
  async createDonation(donation: Omit<Donation, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('donations')
      .insert([{ ...donation, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Donation;
  },

  async getDonationsByDonor(donorId: string) {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('donor_id', donorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Donation[];
  },

  async getDonationsByNGO(ngoId: string) {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('ngo_id', ngoId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Donation[];
  },

  async getAllDonations() {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Donation[];
  }
};

// Requirement operations
export const requirementService = {
  async createRequirement(requirement: Omit<Requirement, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('requirements')
      .insert([{ ...requirement, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Requirement;
  },

  async getRequirementsByNGO(ngoId: string) {
    const { data, error } = await supabase
      .from('requirements')
      .select('*')
      .eq('ngo_id', ngoId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Requirement[];
  },

  async getAllRequirements() {
    const { data, error } = await supabase
      .from('requirements')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Requirement[];
  },

  async updateRequirement(id: string, updates: Partial<Requirement>) {
    const { data, error } = await supabase
      .from('requirements')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Requirement;
  },

  async deleteRequirement(id: string) {
    const { error } = await supabase
      .from('requirements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// NGO operations
export const ngoService = {
  async getAllNGOs() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_type', 'ngo')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as NGO[];
  },

  async getNGOById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .eq('user_type', 'ngo')
      .single();
    
    if (error) throw error;
    return data as NGO;
  }
}; 