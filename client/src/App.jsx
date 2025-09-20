import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddBook from "./pages/AddBook";
import Analytics from "./pages/Analytics";
import SignUp from "./pages/SignUp";
import useAuthStore from "./store/authStore";
import { Background } from "./components/Background";

export default function App() {
  const location = useLocation();
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => !!state.user);

  console.log(`App Render: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}`);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-white">Verifying Session...</p>
      </div>
    );
  }

  const hideNavbarRoutes = ["/login", "/signup"];
  const shouldHideNavbar = !isAuthenticated || hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Background />
      {!shouldHideNavbar && <Navbar/>}
      <main className="flex-grow container mx-auto p-4">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add-book" element={<ProtectedRoute adminOnly><AddBook /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute adminOnly><Analytics /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}