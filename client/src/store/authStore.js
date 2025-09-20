import { create } from 'zustand';
import { 
  getUserDetails, 
  signin as signinApi, 
  signup as signupApi, 
  logout as logoutApi 
} from '../../lib/apiClient';

const useAuthStore = create((set) => ({
  
  user: null,
  isLoading: true,

 
  checkAuthStatus: async () => {
    try {
      const res = await getUserDetails();
      set({ user: res.data, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },

  login: async (credentials) => {
    const res = await signinApi(credentials);
    set({ user: res.data.user });
    return res;
  },

  signup: async (data) => {
    const res = await signupApi(data);
    set({ user: res.data.user });
    return res;
  },

  logout: async () => {
    await logoutApi();
    set({ user: null });
  },
}));


useAuthStore.getState().checkAuthStatus();

export default useAuthStore;