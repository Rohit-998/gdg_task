import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";


export default function ProtectedRoute({ children, adminOnly = false }) {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => !!state.user);
  const isAdmin = useAuthStore((state) => state.user?.role === 'Admin');

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
}