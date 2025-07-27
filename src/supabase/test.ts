// import { supabase } from './config';

export const testSupabaseConnection = async () => {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
};

export const testAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase auth test failed:', error);
      return false;
    }
    
    console.log('Supabase auth test successful, session:', session ? 'exists' : 'none');
    return true;
  } catch (error) {
    console.error('Supabase auth test error:', error);
    return false;
  }
}; 