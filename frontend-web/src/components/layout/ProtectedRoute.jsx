import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0) {
    const userRoles = user.roles || [];
    const hasRequiredRole = roles.some(role => 
      userRoles.some(r => r.code === role || r === role)
    );
    
    if (!hasRequiredRole) {
      // Redirect based on user's actual role instead of generic /dashboard
      if (userRoles.some(r => r === 'ADMIN' || r.code === 'ADMIN')) {
        return <Navigate to="/admin" replace />;
      } else if (userRoles.some(r => r === 'DOCTOR' || r.code === 'DOCTOR')) {
        return <Navigate to="/doctor" replace />;
      } else if (userRoles.some(r => r === 'PATIENT' || r.code === 'PATIENT' || r === 'USER' || r.code === 'USER')) {
        return <Navigate to="/patient" replace />;
      } else {
        // Fallback to home for unknown roles
        return <Navigate to="/" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
