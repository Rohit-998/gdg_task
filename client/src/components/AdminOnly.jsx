import useAuthStore from "../store/authStore";


export default function useIsAdmin() {
  const isAdmin = useAuthStore((state) => state.user?.role === 'Admin');
  return isAdmin;
}