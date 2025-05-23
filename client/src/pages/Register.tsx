import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signUp } from '@/lib/supabase';
import sciVentureLogo from '@assets/SciVenture.png';

interface RegisterProps {
  onRegisterSuccess?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  // Set document title
  useEffect(() => {
    document.title = "Create Account - SciVenture";
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register the user with Supabase authentication
      const { data, error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        username: formData.username
      });
      
      if (error) {
        throw error;
      }
      
      // Note: User profile creation in Firebase is handled by the auth listener in App.tsx
      // This ensures data consistency between Supabase auth and Firebase database
      
      setIsLoading(false);
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please check your email for verification.",
      });
      
      // Call the onRegisterSuccess callback if provided
      if (onRegisterSuccess) {
        onRegisterSuccess();
        // Redirect to login page after successful registration
        setLocation('/login');
      } else {
        // Fallback if callback not provided
        setLocation('/login');
      }
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Registration failed",
        description: error.message || "There was a problem creating your account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Simple header with logo */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <a href="/" className="flex items-center">
            <img 
              src={sciVentureLogo} 
              alt="SciVenture Logo" 
              className="h-12 w-auto" 
            />
          </a>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-10">
        <div className="container max-w-md mx-auto px-4">
          <Card className="w-full shadow-lg">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
              <CardDescription className="text-center">
                Join SciVenture to start your science learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                  <Input 
                    id="fullName"
                    name="fullName"
                    placeholder="Your full name"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <Input 
                    id="username"
                    name="username"
                    placeholder="Choose a username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input 
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                  <Input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 mt-2" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="text-center text-sm">
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </a>
              </div>
              <div className="text-center text-xs text-gray-500">
                By registering, you agree to our Terms of Service and Privacy Policy
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Simple footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SciVenture. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Register;