import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService.ts';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const useMock = (process.env.REACT_APP_USE_MOCK_API || '').toLowerCase() === 'true';
  if (useMock) {
    // In mock mode, allow access without strict auth to avoid bouncing
    return children;
  }

  const isAuthed = authService.isAuthenticated();

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: (location as any).pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
