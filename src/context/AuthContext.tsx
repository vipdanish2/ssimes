
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define user roles
export type UserRole = 'student' | 'mentor' | 'admin';

// Define user interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Define AuthContext interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Mock user data for testing
const MOCK_USERS = [
  { id: '1', email: 'student@example.com', password: 'password', name: 'John Student', role: 'student' as UserRole },
  { id: '2', email: 'mentor@example.com', password: 'password', name: 'Jane Mentor', role: 'mentor' as UserRole },
  { id: '3', email: 'admin@example.com', password: 'password', name: 'Admin User', role: 'admin' as UserRole },
];

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));

      // Navigate based on role
      if (userWithoutPassword.role === 'student') {
        navigate('/dashboard');
      } else if (userWithoutPassword.role === 'mentor') {
        navigate('/mentor-dashboard');
      } else if (userWithoutPassword.role === 'admin') {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if email already exists
      if (MOCK_USERS.find(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        email,
        password,
        name,
        role,
      };
      
      // In a real app, this would be an API call
      MOCK_USERS.push(newUser);
      
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Store user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));

      // Navigate based on role
      if (userWithoutPassword.role === 'student') {
        navigate('/dashboard');
      } else if (userWithoutPassword.role === 'mentor') {
        navigate('/mentor-dashboard');
      } else if (userWithoutPassword.role === 'admin') {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
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
