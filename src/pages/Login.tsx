import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

async function processDraftReview(uid: string, email: string | null) {
  const draft = localStorage.getItem('vigorDraftReview');
  if (draft) {
    try {
      const data = JSON.parse(draft);
      await addDoc(collection(db, 'reviews'), {
        reviewerName: data.name,
        reviewText: data.message,
        rating: data.rating,
        memberType: 'Verified Member',
        isVisible: false,
        createdAt: serverTimestamp(),
        userId: uid,
        userEmail: email,
      });
      localStorage.removeItem('vigorDraftReview');
      toast.success('Your saved feedback has been submitted!');
    } catch (e) {
      console.error('Failed to submit draft review', e);
    }
  }
}

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = async (data: AuthFormData) => {
    setIsSubmitting(true);
    try {
      let userCredential;
      if (isLoginMode) {
        userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        toast.success('Welcome back to the Club');
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        toast.success('Account created successfully');
      }
      
      await processDraftReview(userCredential.user.uid, userCredential.user.email);
      navigate('/');
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      toast.success('Successfully logged in with Google');
      
      await processDraftReview(userCredential.user.uid, userCredential.user.email);
      navigate('/');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      toast.error(error?.message || 'Failed to login with Google');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-background border border-outline px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-300";
  const labelClass = "font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent pointer-events-none" />

      <motion.div
        className="w-full max-w-md bg-surface border border-outline p-8 relative z-10 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <button 
          onClick={() => navigate('/')}
          className="absolute -top-12 left-0 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-headline text-xs tracking-widest uppercase"
        >
          <ArrowLeft size={16} /> HQ
        </button>

        <div className="section-container max-w-lg relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6 border-b border-outline/30 pb-6">
            <h1 className="font-display text-4xl uppercase tracking-wider text-on-surface">
              Fitness <span className="text-primary">Club</span>
            </h1>
          </div>
          <p className="text-on-surface-variant text-sm mb-8 text-center">
            {isLoginMode ? 'Access your elite membership.' : 'Forge your new path today.'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className={labelClass}>Email Address</label>
            <input {...register('email')} type="email" className={inputClass} placeholder="john@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input {...register('password')} type="password" className={inputClass} placeholder="••••••••" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-gold py-3 sm:py-3.5 flex items-center justify-center gap-2 mt-4 text-sm sm:text-base font-headline tracking-widest uppercase disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (isLoginMode ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className="my-6 flex items-center justify-between text-on-surface-variant">
          <div className="h-px bg-outline flex-1" />
          <span className="px-4 font-headline text-[10px] tracking-widest uppercase">Or continue with</span>
          <div className="h-px bg-outline flex-1" />
        </div>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleGoogleSignIn}
          className="w-full bg-surface-high border border-outline hover:border-primary transition-colors duration-300 py-3 flex items-center justify-center gap-3 font-headline uppercase tracking-widest text-sm text-on-surface disabled:opacity-50"
        >
          {/* Subtle Google G SVG */}
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-primary hover:text-primary-container font-headline text-xs tracking-widest uppercase transition-colors"
          >
            {isLoginMode ? "Don't have an account? Sign up" : 'Already forged? Login here'}
          </button>
        </div>

      </motion.div>
    </div>
  );
}
