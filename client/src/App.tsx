import { useState, useEffect, lazy, Suspense } from "react";
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
import Projects from "@/pages/Projects";
import Resources from "@/pages/Resources";
import Modules from "@/pages/Modules";
import Community from "@/pages/Community";
import OfflineContent from "@/pages/OfflineContent";
import { ROUTES } from "@/lib/constants";
import { supabase, getSession } from "@/lib/supabase";

// Lazy load heavy pages to improve initial load time
const AIAssistant = lazy(() => import("@/pages/AIAssistant"));
const ModuleDetail = lazy(() => import("@/pages/ModuleDetail"));

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();
  
  // Check if current page is a public page (landing, login, register, AI assistant)
  const isPublicPage = 
    location === "/" || 
    location === "/login" || 
    location === "/register" ||
    location === "/ai-assistant";

  // Check for an existing session when the app loads (non-blocking)
  useEffect(() => {
    async function checkSession() {
      // First check for existing session in local storage to avoid flicker
      const storedSession = localStorage.getItem('supabase_session');
      if (storedSession) {
        try {
          const sessionData = JSON.parse(storedSession);
          if (sessionData && Date.now() < sessionData.expiresAt) {
            setIsAuthenticated(true);
            setUser(sessionData.user);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Error parsing stored session:", e);
        }
      }
      
      // If no valid cached session, mark loading as done and validate in background
      setLoading(false);
      
      // Then validate with the actual Supabase session
      const { data, error } = await getSession();
      
      if (data && data.session) {
        setIsAuthenticated(true);
        setUser(data.session.user);
        
        // Store session info in localStorage with expiry
        localStorage.setItem('supabase_session', JSON.stringify({
          user: data.session.user,
          expiresAt: Date.now() + 1000 * 60 * 60 * 24 // 24 hours
        }));
      } else if (error) {
        console.error("Session error:", error);
        localStorage.removeItem('supabase_session');
      }
    }
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          setUser(session.user);
          
          // Update stored session
          localStorage.setItem('supabase_session', JSON.stringify({
            user: session.user,
            expiresAt: Date.now() + 1000 * 60 * 60 * 24 // 24 hours
          }));
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('supabase_session');
        }
      }
    );
    
    // Clean up subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Login handler
  const handleLogin = () => {
    // The actual authentication is handled by the Supabase auth listener
    // This is just for immediate UI feedback if needed
    setIsAuthenticated(true);
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
                <Route path="/">
                  {() => (
                    isAuthenticated ? <Redirect to="/home" /> : <Landing />
                  )}
                </Route>
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
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading AI Assistant...</div>}>
                      <AIAssistant />
                    </Suspense>
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
                    isAuthenticated ? (
                      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Module...</div>}>
                        <ModuleDetail />
                      </Suspense>
                    ) : (
                      <Redirect to="/login" />
                    )
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
