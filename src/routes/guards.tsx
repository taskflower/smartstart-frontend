// src/routes/guards.tsx
import { Navigate } from 'react-router-dom';
import { useAuthState } from '../hooks/useAuthState';

export const withPrivateRoute = (element: React.ReactNode): React.ReactNode => {
  const PrivateRouteWrapper = () => {
    const { user, loading } = useAuthState();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Trwa ładowanie...</div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    return <>{element}</>;
  };

  return <PrivateRouteWrapper />;
};

export const withPublicRoute = (element: React.ReactNode): React.ReactNode => {
  const PublicRouteWrapper = () => {
    const { user, loading } = useAuthState();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Trwa ładowanie...</div>
        </div>
      );
    }

    if (user) {
      return <Navigate to="/dashboard" />;
    }

    return <>{element}</>;
  };

  return <PublicRouteWrapper />;
};