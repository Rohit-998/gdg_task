import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useIsAdmin from "../hooks/AdminOnly";
import { Button } from "./ui/button";
import useAuthStore from "../store/authStore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAdmin = useIsAdmin();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinkClasses = "text-lg md:text-sm hover:text-blue-400 transition-colors";

  if (isLoading) {
    return null;
  }

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-purple-400 flex items-center gap-2">
            <img src="/logo.png" alt="Library Hub Logo" className="w-8 h-8" />
            Library Hub
          </Link>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-200 focus:outline-none">
              <div className="w-6 h-6 flex flex-col justify-around">
                <span className={`block w-full h-0.5 bg-gray-200 transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
                <span className={`block w-full h-0.5 bg-gray-200 transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
                <span className={`block w-full h-0.5 bg-gray-200 transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
              </div>
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/home" className={navLinkClasses}>Home</Link>
            <Link to="/dashboard" className={navLinkClasses}>Dashboard</Link>
            {isAdmin && (
              <>
                <Link to="/add-book" className={navLinkClasses}>Add Book</Link>
                <Link to="/analytics" className={navLinkClasses}>Analytics</Link>
              </>
            )}
            <Button onClick={handleLogout} variant="destructive" size="sm">Logout</Button>
          </div>
        </div>
        <div className={`md:hidden absolute top-full left-0 w-full bg-gray-700/90 backdrop-blur-sm transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-screen py-4 border-t border-gray-600" : "max-h-0"}`}>
          <div className="flex flex-col items-center gap-4">
            <Link to="/home" className={navLinkClasses} onClick={closeMenu}>Home</Link>
            <Link to="/dashboard" className={navLinkClasses} onClick={closeMenu}>Dashboard</Link>
            {isAdmin && (
              <>
                <Link to="/add-book" className={navLinkClasses} onClick={closeMenu}>Add Book</Link>
                <Link to="/analytics" className={navLinkClasses} onClick={closeMenu}>Analytics</Link>
              </>
            )}
            <Button onClick={handleLogout} variant="destructive" className="mt-2">Logout</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}