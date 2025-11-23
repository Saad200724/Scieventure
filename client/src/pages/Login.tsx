import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/auth';
import sciVentureLogo from '@assets/SciVenture.png';

interface LoginProps {
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    document.title = "Sign In - SciVenture";
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.signIn(formData.email, formData.password);

      if (!result.success) {
        throw new Error(result.error || 'Sign in failed');
      }

      setIsLoading(false);
      toast({
        title: "Login successful",
        description: "Welcome back to SciVenture!",
      });

      if (onLoginSuccess) {
        onLoginSuccess();
      }

      setLocation('/home');
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
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
              <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Welcome back! Sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <form onSubmit={handleSubmit} className="space-y-5">
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
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input 
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Your password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    data-testid="input-password"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full mt-2" 
                  disabled={isLoading}
                  data-testid="button-signin"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="text-center text-sm">
                Don't have an account?{' '}
                <a 
                  href="/register" 
                  className="font-medium text-primary hover:underline"
                  data-testid="link-signup"
                >
                  Sign up
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SciVenture. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Login;
