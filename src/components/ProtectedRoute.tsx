
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading } = useAuth();

  // If auth state is loading, show nothing
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on actual role
    if (user.role === 'student') {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === 'mentor') {
      return <Navigate to="/mentor-dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    
    // Fallback to login if role is unrecognized
    return <Navigate to="/login" replace />;
  }

  // If authenticated and has required role, show the protected route
  return <>{children}</>;
};

export default ProtectedRoute;
