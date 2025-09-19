import { Navigate } from "react-router-dom";
import { getUserDetails } from "../../lib/apiClient";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, adminOnly }) {
  const token = localStorage.getItem("token");
  const [role, setRole] = useState(null); 

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await getUserDetails();

     

        if (res && res.data && res.data.role) {
          setRole(res.data.role);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUserDetails();
  }, []);

  if (!token) return <Navigate to="/login" />;

 
  if (role === null) return <div>Loading...</div>;

  if (adminOnly && role !== "Admin") return <Navigate to="/" />;

  return children;
}
