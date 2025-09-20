import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className=" shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        <Link to="/" className="text-xl font-bold text-purple-400">
          <img src="/logo.png" alt="Library Hub Logo" className="inline-block w-8 h-8 mr-2" />
          Library Hub
        </Link>
        <button
          className="md:hidden text-gray-200"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
        <div
          className={`${
            open ? "block" : "hidden"
          } md:flex space-x-6 items-center`}
        >
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          <Link to="/add-book" className="hover:text-blue-400">Add Book</Link>
          <Link to="/analytics" className="hover:text-blue-400">Analytics</Link>
          {localStorage.getItem("token") ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400">Login</Link>
              <Link to="/signup" className="hover:text-blue-400">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
