import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Using environment variables from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Singleton pattern to ensure only one Supabase client exists
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'sciventure-auth',
      }
    });
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();

// Authentication helper functions
export const signUp = async (email: string, password: string, userData?: Record<string, any>) => {
  try {
    console.log('Attempting signup with:', { email, hasPassword: !!password });
    console.log('Supabase client:', supabaseUrl);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) {
      console.error('Supabase signup error details:', {
        message: error.message,
        status: (error as any).status,
        statusCode: (error as any).statusCode,
        name: (error as any).name,
        stack: (error as any).stack
      });
    } else {
      console.log('Signup successful:', data);
    }
    
    return { data, error };
  } catch (err: any) {
    console.error('Signup exception:', err);
    console.error('Exception details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    throw err;
  }
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};

export const getUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
};