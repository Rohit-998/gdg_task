import { getUserDetails } from "../../lib/apiClient";
import { useEffect, useState } from "react";

export default function useIsAdmin() {
    const [isAdmin, setIsAdmin] = useState();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await getUserDetails();
                console.log("User details:", res);
                setIsAdmin(res?.data?.role === "Admin");
            } catch (err) {
                setIsAdmin(false);
                console.error("Error fetching user details:", err);
            }
        };
        fetchUserDetails();
    }, []);

    return isAdmin;
}
