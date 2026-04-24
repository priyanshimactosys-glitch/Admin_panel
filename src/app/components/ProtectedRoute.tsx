import { Navigate, Outlet } from 'react-router';

export default function ProtectedRoute() {
  const authData = localStorage.getItem('nvbs_auth');
  const isAuthenticated = authData ? JSON.parse(authData).authenticated : false;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
