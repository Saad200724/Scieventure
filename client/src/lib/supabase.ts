import { createClient } from '@supabase/supabase-js';

// Using environment variables from .env.local
const supabaseUrl = 'https://ilgohuntvxzpvcsxxtur.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZ29odW50dnh6cHZjc3h4dHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTM1ODAsImV4cCI6MjA2MzQyOTU4MH0.N7T7WskCLkms7WY92IjV1OIOmG8CcFvpu4HiEwxT7ls';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication helper functions
export const signUp = async (email: string, password: string, userData?: Record<string, any>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  
  return { data, error };
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