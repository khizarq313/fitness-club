import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { useUIStore } from '@/stores/uiStore';

// Validation Schema
const enquirySchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().regex(/^[0-9]{10}$/, 'Must be a valid 10-digit number'),
  email: z.string().email('Invalid email address'),
  interestedIn: z.string().min(1, 'Please select what you are interested in'),
  heardFrom: z.string().min(1, 'Please select an option'),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

const INTEREST_OPTIONS = [
  'General Enquiry',
  'Base Performance', // Package name
  'Elite Performance', // Package name
  'Vigor Ultimate', // Package name
  'Personal Training',
  'Group Class',
];

const HEARD_FROM_OPTIONS = [
  'Instagram',
  'Facebook',
  'Google Search',
  'Friend / Referral',
  'Walk-in',
  'Other',
];

export function EnquiryModal() {
  const { isEnquiryModalOpen, closeEnquiryModal, enquiryPrefilledPackage } = useUIStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: '',
      mobile: '',
      email: '',
      interestedIn: 'General Enquiry',
      heardFrom: '',
    },
  });

  // Pre-fill interest if opened from a specific package
  useEffect(() => {
    if (isEnquiryModalOpen && enquiryPrefilledPackage) {
      // Allow custom package names that might not be in the hardcoded list
      if (!INTEREST_OPTIONS.includes(enquiryPrefilledPackage)) {
         // Optionally you can dynamically add it or just set it
      }
      setValue('interestedIn', enquiryPrefilledPackage);
    }
  }, [isEnquiryModalOpen, enquiryPrefilledPackage, setValue]);

  // Reset form on close
  useEffect(() => {
    if (!isEnquiryModalOpen) {
      setTimeout(() => reset(), 300); // Wait for exit animation
    }
  }, [isEnquiryModalOpen, reset]);

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'enquiries'), {
        ...data,
        status: 'new',
        createdAt: serverTimestamp(),
      });

      toast.success('Enquiry submitted successfully! We will contact you soon.');
      closeEnquiryModal();
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent scroll on body when modal is open
  useEffect(() => {
    if (isEnquiryModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isEnquiryModalOpen]);

  return (
    <AnimatePresence>
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => !isSubmitting && closeEnquiryModal()}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-lg bg-surface-high border border-outline shadow-2xl overflow-y-auto max-h-[90vh]"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-outline/50 flex items-center justify-between sticky top-0 bg-surface-high z-10">
              <div>
                <h2 className="font-display text-3xl uppercase tracking-wider text-on-surface">
                  Start Your <span className="text-primary">Journey</span>
                </h2>
                <p className="text-on-surface-variant font-headline text-xs tracking-widest uppercase mt-1">
                  Enquire at Vigor HQ
                </p>
              </div>
              <button
                onClick={closeEnquiryModal}
                disabled={isSubmitting}
                className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50 object-contain p-2 -mr-2"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <input
                    {...register('fullName')}
                    type="text"
                    className="w-full bg-background border border-outline px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-300"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mobile */}
                  <div className="space-y-1">
                    <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Mobile Number <span className="text-primary">*</span>
                    </label>
                    <input
                      {...register('mobile')}
                      type="tel"
                      className="w-full bg-background border border-outline px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-300"
                      placeholder="10-digit number"
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Email address <span className="text-primary">*</span>
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full bg-background border border-outline px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-300"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Interested In */}
                <div className="space-y-1">
                  <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Interested In <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <select
                      {...register('interestedIn')}
                      className="w-full bg-background border border-outline px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-300 appearance-none"
                    >
                      {INTEREST_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                      {enquiryPrefilledPackage && !INTEREST_OPTIONS.includes(enquiryPrefilledPackage) && (
                         <option value={enquiryPrefilledPackage}>{enquiryPrefilledPackage}</option>
                      )}
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-on-surface-variant">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  {errors.interestedIn && (
                    <p className="text-red-500 text-xs mt-1">{errors.interestedIn.message}</p>
                  )}
                </div>

                {/* Heard From */}
                <div className="space-y-1">
                  <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    How did you hear about us? <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <select
                      {...register('heardFrom')}
                      className="w-full bg-background border border-outline px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-300 appearance-none"
                    >
                      <option value="" disabled>Select an option</option>
                      {HEARD_FROM_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                     {/* Custom Dropdown Arrow */}
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-on-surface-variant">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  {errors.heardFrom && (
                    <p className="text-red-500 text-xs mt-1">{errors.heardFrom.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gold py-4 text-sm mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Enquiry'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
