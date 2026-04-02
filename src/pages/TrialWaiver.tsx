import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { db } from '@/lib/firebase';
import { SignaturePad, type SignaturePadRef } from '@/components/ui/SignaturePad';

const trialWaiverSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  mobile: z.string().regex(/^[0-9]{10}$/, '10-digit mobile required'),
  emergencyContact: z.string().min(2, 'Emergency contact is required'),
  emergencyPhone: z.string().regex(/^[0-9]{10}$/, '10-digit emergency mobile required'),
  
  agreeRelease: z.boolean().refine(val => val === true, { message: 'Must agree to liability release' }),
  agreeMedical: z.boolean().refine(val => val === true, { message: 'Must confirm medical clearance' }),
});

type TrialWaiverData = z.infer<typeof trialWaiverSchema>;

export default function TrialWaiver() {
  const navigate = useNavigate();
  const signatureRef = useRef<SignaturePadRef>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureError, setSignatureError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<TrialWaiverData>({
    resolver: zodResolver(trialWaiverSchema),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (data: TrialWaiverData) => {
    if (signatureRef.current?.isEmpty()) {
      setSignatureError('Please provide your signature');
      return;
    }
    setSignatureError('');
    const sig = signatureRef.current?.toDataURL();

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'trial_waivers'), {
        ...data,
        signature: sig,
        submittedAt: serverTimestamp(),
      });
      toast.success('Waiver accepted. Welcome to VIGOR.');
      navigate('/');
    } catch (error) {
      toast.error('Failed to submit. Check network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-background border border-outline px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-300 placeholder-on-surface-variant";
  const labelClass = "font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1";

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="section-container max-w-4xl">
        <motion.div 
          className="mb-12 border-b border-outline/30 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 font-headline text-xs tracking-widest uppercase">
            <ArrowLeft size={16} /> Back to HQ
          </button>
          
          <div className="flex items-center gap-4 text-primary mb-4">
            <ShieldCheck size={32} />
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wider text-on-surface">
              Trial <span className="text-primary">Waiver</span>
            </h1>
          </div>
          <p className="text-on-surface-variant text-sm max-w-2xl leading-relaxed">
            Guest liability release and facility access agreement for trial sessions.
          </p>
        </motion.div>

        <motion.div className="bg-surface p-6 md:p-12 border border-outline shadow-2xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input {...register('fullName')} className={inputClass} placeholder="John Doe" />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Mobile Number *</label>
                <input {...register('mobile')} className={inputClass} placeholder="9876543210" />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Email *</label>
                <input {...register('email')} className={inputClass} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Emergency Contact Name *</label>
                <input {...register('emergencyContact')} className={inputClass} />
                {errors.emergencyContact && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Emergency Contact Phone *</label>
                <input {...register('emergencyPhone')} className={inputClass} />
                {errors.emergencyPhone && <p className="text-red-500 text-xs mt-1">{errors.emergencyPhone.message}</p>}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-headline text-lg text-primary uppercase tracking-widest border-b border-outline pb-2 mb-4">Release of Liability</h2>
              
              <label className="flex flex-col gap-2 p-4 border border-outline/30 bg-surface-high cursor-pointer">
                <div className="flex gap-4">
                  <input type="checkbox" {...register('agreeRelease')} className="mt-1 w-5 h-5 accent-primary shrink-0" />
                  <span className="text-sm text-on-surface">I fully release Fitness Club from any liability regarding injuries sustained during my trial period.</span>
                </div>
                {errors.agreeRelease && <p className="text-red-500 text-xs ml-9">{errors.agreeRelease.message}</p>}
              </label>

              <label className="flex flex-col gap-2 p-4 border border-outline/30 bg-surface-high cursor-pointer">
                <div className="flex gap-4">
                  <input type="checkbox" {...register('agreeMedical')} className="mt-1 w-5 h-5 accent-primary shrink-0" />
                  <span className="text-sm text-on-surface">I declare I am medically cleared to engage in rigorous physical activity.</span>
                </div>
                {errors.agreeMedical && <p className="text-red-500 text-xs ml-9">{errors.agreeMedical.message}</p>}
              </label>
            </div>

            <div className="pt-4">
              <SignaturePad ref={signatureRef} label="Guest Signature" error={signatureError} />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-gold w-full py-4 mt-8 flex justify-center gap-2">
              {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Processing</> : 'Submit Trial Waiver'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
