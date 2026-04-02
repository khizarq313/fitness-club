import { create } from 'zustand';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  loading: boolean;
  initializeAuthListener: () => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  initializeAuthListener: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },

  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      set({ loading: true });
      await signInWithPopup(auth, provider);
      toast.success('Successfully logged in with Google');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      toast.error(error?.message || 'Failed to login with Google');
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      toast.success('Successfully logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}));
