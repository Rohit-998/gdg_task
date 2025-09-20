import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => !!state.user);
  const isAdmin = useAuthStore((state) => state.user?.role === 'Admin');

  console.log(`ProtectedRoute Render: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}`);

  if (isLoading) {
    return <div className="text-center">Verifying Session...</div>;
  }

  if (!isAuthenticated) {
    console.log("Redirecting to login: User not authenticated.");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
}