/**
 * Authentication service using Supabase REST API
 * This bypasses the Supabase SDK to avoid multiple client instance issues
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase configuration. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

const API_BASE = `${SUPABASE_URL}/auth/v1`;

interface SignUpRequest {
  email: string;
  password: string;
  user_metadata?: {
    full_name?: string;
    username?: string;
  };
}

interface SignInRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export const authService = {
  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, fullName?: string, username?: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
        },
        body: JSON.stringify({
          email,
          password,
          user_metadata: {
            full_name: fullName,
            username: username,
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error_description || 'Sign up failed',
          data
        };
      }

      console.log('Sign up response:', data);

      // Store user session in localStorage if available
      if (data.session) {
        localStorage.setItem('sciventure-auth-session', JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          user: data.user,
          expires_at: data.session.expires_at || new Date().getTime() + (3600 * 1000)
        }));
        return {
          success: true,
          data,
          message: 'Account created successfully! You are now signed in.'
        };
      }

      // If no session, try to confirm email first (development only)
      console.log('No session in signup response. Attempting to confirm email...');
      try {
        const confirmResponse = await fetch('/api/auth/confirm-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        });
        
        const confirmData = await confirmResponse.json();
        console.log('Email confirmation result:', confirmData);
      } catch (confirmError) {
        console.log('Email confirmation attempt failed (expected in production):', confirmError);
      }

      // Try to sign in after confirmation attempt
      console.log('Attempting sign in after email confirmation...');
      const loginResult = await this.signIn(email, password);
      
      if (loginResult.success) {
        return {
          success: true,
          data: loginResult.data,
          message: 'Account created successfully! You are now signed in.'
        };
      } else {
        return {
          success: true,
          data,
          message: 'Account created successfully. Please sign in with your credentials.'
        };
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: error.message || 'Sign up failed. Please try again.'
      };
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Attempting sign in with:', { email });
      
      const response = await fetch(`${API_BASE}/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();
      
      console.log('Sign in response status:', response.status);
      console.log('Sign in response data:', data);

      if (!response.ok) {
        const errorMsg = data.error_description || data.message || data.error || 'Sign in failed';
        console.error('Sign in error:', errorMsg);
        return {
          success: false,
          error: errorMsg,
          data
        };
      }

      // Check if we have the required fields
      if (!data.access_token || !data.user) {
        console.error('Missing access_token or user in response');
        return {
          success: false,
          error: 'Invalid response from sign in. Missing authentication data.'
        };
      }

      // Store session in localStorage
      localStorage.setItem('sciventure-auth-session', JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
        expires_at: new Date().getTime() + (data.expires_in * 1000)
      }));

      console.log('Sign in successful, session stored');

      return {
        success: true,
        data,
        message: 'Sign in successful!'
      };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      return {
        success: false,
        error: error.message || 'Sign in failed. Please try again.'
      };
    }
  },

  /**
   * Sign out user
   */
  async signOut(): Promise<AuthResponse> {
    try {
      const session = localStorage.getItem('sciventure-auth-session');
      
      if (session) {
        const parsed = JSON.parse(session);
        
        // Call Supabase logout endpoint
        await fetch(`${API_BASE}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${parsed.access_token}`
          }
        });
      }

      localStorage.removeItem('sciventure-auth-session');

      return {
        success: true,
        message: 'Signed out successfully'
      };
    } catch (error: any) {
      // Clear local session even if remote logout fails
      localStorage.removeItem('sciventure-auth-session');
      return {
        success: true,
        message: 'Signed out'
      };
    }
  },

  /**
   * Get current session
   */
  getSession() {
    const session = localStorage.getItem('sciventure-auth-session');
    if (!session) return null;

    try {
      const parsed = JSON.parse(session);
      
      // Check if session is expired
      if (parsed.expires_at && parsed.expires_at < Date.now()) {
        localStorage.removeItem('sciventure-auth-session');
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  },

  /**
   * Get current user
   */
  getUser() {
    const session = this.getSession();
    return session?.user || null;
  },

  /**
   * Get access token
   */
  getAccessToken() {
    const session = this.getSession();
    return session?.access_token || null;
  }
};
