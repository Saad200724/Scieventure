import { useState, useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/providers/LanguageProvider";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CurioBot from "@/components/ai/CurioBot";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import AIAssistant from "@/pages/AIAssistant";
import Projects from "@/pages/Projects";
import Resources from "@/pages/Resources";
import ModuleDetail from "@/pages/ModuleDetail";
import Modules from "@/pages/Modules";
import Community from "@/pages/Community";
import OfflineContent from "@/pages/OfflineContent";
import { ROUTES } from "@/lib/constants";
import { authService } from "@/lib/auth";

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();
  
  // Check if current page is a public page (landing, login, register)
  const isPublicPage = 
    location === "/" || 
    location === "/login" || 
    location === "/register";

  // Check for an existing session when the app loads
  useEffect(() => {
    const checkSession = () => {
      setLoading(true);
      
      const session = authService.getSession();
      if (session && session.user) {
        setIsAuthenticated(true);
        setUser(session.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      
      setLoading(false);
    };
    
    checkSession();
  }, []);

  // Login handler
  const handleLogin = () => {
    const session = authService.getSession();
    if (session && session.user) {
      setIsAuthenticated(true);
      setUser(session.user);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await authService.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setLocation('/login');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            {/* Only show Header on authenticated pages */}
            {!isPublicPage && <Header />}
            
            <main className="flex-grow">
              <Switch>
                {/* Public routes (pre-login) */}
                <Route path="/" component={Landing} />
                <Route path="/login">
                  {() => (
                    <Login onLoginSuccess={handleLogin} />
                  )}
                </Route>
                <Route path="/register">
                  {() => (
                    <Register onRegisterSuccess={handleLogin} />
                  )}
                </Route>
                
                {/* Protected routes (post-login) */}
                <Route path="/home">
                  {() => (
                    isAuthenticated ? <Home /> : <Redirect to="/login" />
                  )}
                </Route>
                <Route path={ROUTES.dashboard}>
                  {() => (
                    isAuthenticated ? <Dashboard /> : <Redirect to="/login" />
                  )}
                </Route>
                <Route path={ROUTES.modules}>
                  {() => (
                    isAuthenticated ? <Modules /> : <Redirect to="/login" />
                  )}
                </Route>
                <Route path={ROUTES.aiAssistant}>
                  {() => (
                    isAuthenticated ? <AIAssistant /> : <Redirect to="/login" />
                  )}
                </Route>
                <Route path={ROUTES.projects}>
                  {() => (
                    isAuthenticated ? <Projects /> : <Redirect to="/login" />
                  )}
                </Route>
                <Route path={ROUTES.resources}>
                  {() => (
                    isAuthenticated ? <Resources /> : <Redirect to="/login" />
                  )}
                </Route>
                <Route path={ROUTES.moduleDetail}>
                  {(params) => (
                    isAuthenticated ? <ModuleDetail /> : <Redirect to="/login" />
                  )}
                </Route>
                <Route path={ROUTES.community}>
                  {() => (
                    isAuthenticated ? <Community /> : <Redirect to="/login" />
                  )}
                </Route>
                
                {/* Offline content page */}
                <Route path="/offline-content">
                  {() => (
                    isAuthenticated ? <OfflineContent /> : <Redirect to="/login" />
                  )}
                </Route>
                
                {/* Fallback to 404 */}
                <Route component={NotFound} />
              </Switch>
            </main>
            
            {/* Only show Footer on authenticated pages */}
            {!isPublicPage && <Footer />}
            
            {/* Only show Curio Bot on authenticated pages */}
            {!isPublicPage && <CurioBot />}
          </div>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
