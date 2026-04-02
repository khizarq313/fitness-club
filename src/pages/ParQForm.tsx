import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, FileSignature } from 'lucide-react';
import { db } from '@/lib/firebase';
import { SignaturePad, type SignaturePadRef } from '@/components/ui/SignaturePad';

// PAR-Q strict schema validation
const parqSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  mobile: z.string().regex(/^[0-9]{10}$/, '10-digit mobile required'),
  dob: z.string().min(1, 'Date of birth is required'),
  emergencyContact: z.string().min(2, 'Emergency contact is required'),
  emergencyPhone: z.string().regex(/^[0-9]{10}$/, '10-digit mobile required'),
  
  // PAR-Q specific health flags
  qHeartCondition: z.boolean(),
  qPainWithActivity: z.boolean(),
  qPainWithoutActivity: z.boolean(),
  qDizziness: z.boolean(),
  qJointProblems: z.boolean(),
  qBloodPressureMeds: z.boolean(),
  qOtherReasons: z.boolean(),
  
  // Acknowledge Truth
  declaration: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the declaration' }),
  }),
});

type ParQFormData = z.infer<typeof parqSchema>;

export default function ParQForm() {
  const navigate = useNavigate();
  const signatureRef = useRef<SignaturePadRef>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureError, setSignatureError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParQFormData>({
    resolver: zodResolver(parqSchema),
    defaultValues: {
      qHeartCondition: false,
      qPainWithActivity: false,
      qPainWithoutActivity: false,
      qDizziness: false,
      qJointProblems: false,
      qBloodPressureMeds: false,
      qOtherReasons: false,
    },
  });

  // Ensure window starts at top when loading this distinct route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (data: ParQFormData) => {
    // Manually validate signature
    if (signatureRef.current?.isEmpty()) {
      setSignatureError('Please provide your signature');
      return;
    }
    setSignatureError('');

    const signatureDataUrl = signatureRef.current?.toDataURL();
    if (!signatureDataUrl) return;

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'parq'), {
        ...data,
        signature: signatureDataUrl,
        submittedAt: serverTimestamp(),
      });

      toast.success('PAR-Q Form successfully submitted & stored.');
      navigate('/');
    } catch (error) {
      console.error('Error submitting PAR-Q:', error);
      toast.error('Submission failed. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-background border border-outline px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-300 placeholder-on-surface-variant";
  const labelClass = "font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1";

  const questionClass = "flex items-start gap-4 p-4 border border-outline/30 bg-surface-high";

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="section-container max-w-4xl">
        
        {/* Header */}
        <motion.div 
          className="mb-12 border-b border-outline/30 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 font-headline text-xs tracking-widest uppercase"
          >
            <ArrowLeft size={16} /> Back to HQ
          </button>
          
          <div className="flex items-center gap-4 text-primary mb-4">
            <FileSignature size={32} />
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wider text-on-surface">
              PAR-Q <span className="text-primary">Declaration</span>
            </h1>
          </div>
          <p className="text-on-surface-variant text-sm max-w-2xl leading-relaxed">
            Physical Activity Readiness Questionnaire. Regular physical activity is fun and healthy, but before you start, let's ensure it's safe for you. Please read and answer honestly.
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          className="bg-surface p-6 md:p-12 border border-outline shadow-2xl relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Brutalist accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            
            {/* Section 1: Details */}
            <div className="space-y-6">
              <h2 className="font-headline text-xl text-primary uppercase tracking-widest border-b border-outline pb-2 mb-6">
                1. Member Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input {...register('fullName')} type="text" className={inputClass} placeholder="John Doe" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input {...register('dob')} type="date" className={inputClass} />
                  {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input {...register('email')} type="email" className={inputClass} placeholder="john@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Mobile Number *</label>
                  <input {...register('mobile')} type="tel" className={inputClass} placeholder="9876543210" />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Emergency Contact Name *</label>
                  <input {...register('emergencyContact')} type="text" className={inputClass} placeholder="Jane Doe" />
                  {errors.emergencyContact && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Emergency Contact Phone *</label>
                  <input {...register('emergencyPhone')} type="tel" className={inputClass} placeholder="9876543210" />
                  {errors.emergencyPhone && <p className="text-red-500 text-xs mt-1">{errors.emergencyPhone.message}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Questionnaire */}
            <div className="space-y-6">
              <h2 className="font-headline text-xl text-primary uppercase tracking-widest border-b border-outline pb-2 mb-6">
                2. Medical History
              </h2>
              <p className="text-xs text-on-surface-variant font-headline tracking-widest uppercase mb-4">
                Check the box if you answer YES to any of the following:
              </p>

              <div className="space-y-3">
                <label className={questionClass}>
                  <input type="checkbox" {...register('qHeartCondition')} className="mt-1 w-5 h-5 accent-primary bg-background border-outline" />
                  <span className="text-sm text-on-surface">Has your doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?</span>
                </label>
                <label className={questionClass}>
                  <input type="checkbox" {...register('qPainWithActivity')} className="mt-1 w-5 h-5 accent-primary bg-background border-outline" />
                  <span className="text-sm text-on-surface">Do you feel pain in your chest when you do physical activity?</span>
                </label>
                <label className={questionClass}>
                  <input type="checkbox" {...register('qPainWithoutActivity')} className="mt-1 w-5 h-5 accent-primary bg-background border-outline" />
                  <span className="text-sm text-on-surface">In the past month, have you had chest pain when you were not doing physical activity?</span>
                </label>
                <label className={questionClass}>
                  <input type="checkbox" {...register('qDizziness')} className="mt-1 w-5 h-5 accent-primary bg-background border-outline" />
                  <span className="text-sm text-on-surface">Do you lose your balance because of dizziness or do you ever lose consciousness?</span>
                </label>
                <label className={questionClass}>
                  <input type="checkbox" {...register('qJointProblems')} className="mt-1 w-5 h-5 accent-primary bg-background border-outline" />
                  <span className="text-sm text-on-surface">Do you have a bone or joint problem that could be made worse by a change in your physical activity?</span>
                </label>
                <label className={questionClass}>
                  <input type="checkbox" {...register('qBloodPressureMeds')} className="mt-1 w-5 h-5 accent-primary bg-background border-outline" />
                  <span className="text-sm text-on-surface">Is your doctor currently prescribing drugs (for example, water pills) for your blood pressure or heart condition?</span>
                </label>
                <label className={questionClass}>
                  <input type="checkbox" {...register('qOtherReasons')} className="mt-1 w-5 h-5 accent-primary bg-background border-outline" />
                  <span className="text-sm text-on-surface">Do you know of any other reason why you should not do physical activity?</span>
                </label>
              </div>
            </div>

            {/* Section 3: Declaration & Signature */}
            <div className="space-y-6">
              <h2 className="font-headline text-xl text-primary uppercase tracking-widest border-b border-outline pb-2 mb-6">
                3. Final Declaration
              </h2>

              <label className="flex items-start gap-4 p-6 border-l-4 border-primary bg-surface-elevated cursor-pointer">
                <input type="checkbox" {...register('declaration')} className="mt-1 w-6 h-6 accent-primary" />
                <div className="space-y-1">
                  <span className="block text-sm text-on-surface font-bold">I agree to the terms of this PAR-Q form</span>
                  <span className="block text-xs text-on-surface-variant leading-relaxed">
                    I have read, understood and completed this questionnaire. Any questions I had were answered to my full satisfaction.
                  </span>
                  {errors.declaration && <p className="text-red-500 text-xs mt-2">{errors.declaration.message}</p>}
                </div>
              </label>

              {/* Digital Signature */}
              <div className="mt-8">
                <SignaturePad 
                  ref={signatureRef} 
                  label="Member Signature" 
                  error={signatureError}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-outline flex items-center justify-end gap-4">
              <button 
                type="button"
                onClick={() => navigate('/')}
                className="btn-ghost text-sm py-4 px-8"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold text-sm py-4 px-12 flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Processing...
                  </>
                ) : (
                  'Submit & Sign PAR-Q'
                )}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}
