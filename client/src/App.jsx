import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";

import Dashboard from "./pages/DashBoard";
import AddBook from "./pages/AddBook";
import Analytics from "./pages/Analytics";

import { Background } from "./components/Background";
import SignUp from "./pages/Signup";


export default function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/signup"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

 
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen flex flex-col relative">
      <Background />

      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow relative z-10 container mx-auto p-4">
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

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-book"
            element={
              <ProtectedRoute>
                <AddBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute adminOnly>
                <Analytics />
              </ProtectedRoute>
            }
          />

          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      
    </div>
  );
}
