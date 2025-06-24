
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Define user roles
export type UserRole = 'student' | 'mentor' | 'admin';

// Define user interface that includes profile data
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Define AuthContext interface
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile from our profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Initialize auth state with proper deadlock prevention
  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST - this prevents deadlocks
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout(0) to defer Supabase calls and prevent deadlock
          setTimeout(() => {
            if (!mounted) return;
            fetchUserProfile(session.user.id).then(profile => {
              if (!mounted) return;
              if (profile) {
                setUser({
                  id: profile.id,
                  email: profile.email,
                  name: profile.name,
                  role: profile.role as UserRole,
                });
              }
              setLoading(false);
            });
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (session) {
        setSession(session);
        // Use setTimeout(0) here too for consistency
        setTimeout(() => {
          if (!mounted) return;
          fetchUserProfile(session.user.id).then(profile => {
            if (!mounted) return;
            if (profile) {
              setUser({
                id: profile.id,
                email: profile.email,
                name: profile.name,
                role: profile.role as UserRole,
              });
            }
            setLoading(false);
          });
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Enhanced login with better error handling
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          const userRole = profile.role as UserRole;
          
          // Navigate based on role
          if (userRole === 'student') {
            navigate('/dashboard');
          } else if (userRole === 'mentor') {
            navigate('/mentor-dashboard');
          } else if (userRole === 'admin') {
            navigate('/admin-dashboard');
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      throw error;
    }
  };

  // Enhanced signup with security improvements
  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true);
    try {
      // Input validation and sanitization
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Sanitize inputs
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedName = name.trim().replace(/[<>]/g, ''); // Basic XSS prevention

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: sanitizedName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Wait for the trigger to create the profile
        setTimeout(async () => {
          const profile = await fetchUserProfile(data.user!.id);
          if (profile) {
            const actualRole = profile.role as UserRole;
            
            // Navigate based on actual assigned role
            if (actualRole === 'student') {
              navigate('/dashboard');
            } else if (actualRole === 'mentor') {
              navigate('/mentor-dashboard');
            } else if (actualRole === 'admin') {
              navigate('/admin-dashboard');
            }
          } else {
            navigate('/dashboard');
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setLoading(false);
      throw error;
    }
  };

  // Enhanced logout with proper cleanup
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
