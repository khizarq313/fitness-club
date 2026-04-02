import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';

const feedbackSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  rating: z.number().min(1, 'Please select a rating').max(5),
  message: z.string().min(10, 'Feedback must be at least 10 characters'),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: user?.displayName || '',
      rating: 0,
      message: '',
    },
  });

  const rating = watch('rating');

  const onSubmit = async (data: FeedbackFormData) => {
    if (!user) {
      localStorage.setItem('vigorDraftReview', JSON.stringify(data));
      toast.error('Please login to submit feedback');
      onClose();
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        reviewerName: data.name,
        reviewText: data.message,
        rating: data.rating,
        memberType: 'Verified Member',
        isVisible: false, // Requires admin approval
        createdAt: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
      });

      toast.success('Thank you! Your feedback has been submitted.');
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => !isSubmitting && onClose()}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-lg bg-surface-high border border-outline shadow-2xl"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
        >
          <div className="p-6 md:p-8 border-b border-outline/50 flex items-center justify-between">
            <div>
              <h2 className="font-display text-3xl uppercase tracking-wider text-on-surface">
                Member <span className="text-primary">Feedback</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Rating */}
              <div className="space-y-2">
                <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Overall Experience <span className="text-primary">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue('rating', star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`transition-colors duration-200 ${
                          star <= (hoveredStar || rating)
                            ? 'text-primary fill-primary'
                            : 'text-outline/50'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Your Full Name <span className="text-primary">*</span>
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full bg-background border border-outline px-4 py-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Your Thoughts <span className="text-primary">*</span>
                </label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className="w-full bg-background border border-outline px-4 py-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                  placeholder="Tell us what you loved or how we can improve..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-gold py-4 text-sm flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
