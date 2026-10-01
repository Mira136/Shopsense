import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth(); const loc = useLocation();
  if (loading) return <LoadingSpinner />;
  return user ? children : <Navigate to="/login" state={{ from: loc.pathname }} replace />;
}
