import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Dumbbell } from 'lucide-react';
import { db } from '@/lib/firebase';
import { SignaturePad, type SignaturePadRef } from '@/components/ui/SignaturePad';

const ptContractSchema = z.object({
  clientName: z.string().min(2, 'Client name is required'),
  clientEmail: z.string().email('Valid email is required'),
  clientPhone: z.string().regex(/^[0-9]{10}$/, '10-digit mobile required'),
  ptName: z.string().min(2, 'Trainer name is required'),
  packageDuration: z.string().min(1, 'Duration must be specified'),
  
  // Agreements
  agreeCancellation: z.boolean().refine(val => val === true, { message: 'Must agree to cancellation policy' }),
  agreeLiability: z.boolean().refine(val => val === true, { message: 'Must agree to liability bounds' }),
  agreeDietary: z.boolean().refine(val => val === true, { message: 'Must agree to dietary limits' }),
});

type PtFormData = z.infer<typeof ptContractSchema>;

export default function PtContract() {
  const navigate = useNavigate();
  const signatureRef = useRef<SignaturePadRef>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureError, setSignatureError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<PtFormData>({
    resolver: zodResolver(ptContractSchema),
  });

  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

  const onSubmit = async (data: PtFormData) => {
    if (signatureRef.current?.isEmpty()) {
      setSignatureError('Please provide your signature');
      return;
    }
    setSignatureError('');
    const sig = signatureRef.current?.toDataURL();

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'pt_contracts'), {
        ...data,
        signature: sig,
        submittedAt: serverTimestamp(),
      });
      toast.success('Contract signed. Welcome to Fitness Club.');
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
            <Dumbbell size={32} />
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wider text-on-surface">
              PT <span className="text-primary">Contract</span>
            </h1>
          </div>
          <p className="text-on-surface-variant text-sm max-w-2xl leading-relaxed">
            Legal agreement outlining expectations, limits of liability, and mutual commitment to elite results.
          </p>
        </motion.div>

        <motion.div className="bg-surface p-6 md:p-12 border border-outline shadow-2xl relative" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Client Full Name *</label>
                <input {...register('clientName')} className={inputClass} placeholder="John Doe" />
                {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Selected Trainer *</label>
                <input {...register('ptName')} className={inputClass} placeholder="Marcus Reed" />
                {errors.ptName && <p className="text-red-500 text-xs mt-1">{errors.ptName.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Client Email *</label>
                <input {...register('clientEmail')} className={inputClass} placeholder="your@email.com" />
                {errors.clientEmail && <p className="text-red-500 text-xs mt-1">{errors.clientEmail.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Client Phone *</label>
                <input {...register('clientPhone')} className={inputClass} placeholder="9876543210" />
                {errors.clientPhone && <p className="text-red-500 text-xs mt-1">{errors.clientPhone.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Package Duration * (E.G. 12 Session Pack)</label>
                <input {...register('packageDuration')} className={inputClass} />
                {errors.packageDuration && <p className="text-red-500 text-xs mt-1">{errors.packageDuration.message}</p>}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-headline text-lg text-primary uppercase tracking-widest border-b border-outline pb-2 mb-4">Terms of Engagement</h2>
              
              <label className="flex flex-col gap-2 p-4 border border-outline/30 bg-surface-high cursor-pointer">
                <div className="flex gap-4">
                  <input type="checkbox" {...register('agreeCancellation')} className="mt-1 w-5 h-5 accent-primary shrink-0" />
                  <span className="text-sm text-on-surface">I acknowledge the strict 24-hour cancellation policy. Sessions cancelled within 24 hours will be forfeited.</span>
                </div>
                {errors.agreeCancellation && <p className="text-red-500 text-xs ml-9">{errors.agreeCancellation.message}</p>}
              </label>

              <label className="flex flex-col gap-2 p-4 border border-outline/30 bg-surface-high cursor-pointer">
                <div className="flex gap-4">
                  <input type="checkbox" {...register('agreeLiability')} className="mt-1 w-5 h-5 accent-primary shrink-0" />
                  <span className="text-sm text-on-surface">I fully release Fitness Club from any liability regarding injuries sustained during my training.</span>
                </div>
                {errors.agreeLiability && <p className="text-red-500 text-xs ml-9">{errors.agreeLiability.message}</p>}
              </label>

              <label className="flex flex-col gap-2 p-4 border border-outline/30 bg-surface-high cursor-pointer">
                <div className="flex gap-4">
                  <input type="checkbox" {...register('agreeDietary')} className="mt-1 w-5 h-5 accent-primary shrink-0" />
                  <span className="text-sm text-on-surface">I understand trainers provide general nutritional guidance, not medical dietary prescriptions.</span>
                </div>
                {errors.agreeDietary && <p className="text-red-500 text-xs ml-9">{errors.agreeDietary.message}</p>}
              </label>
            </div>

            <div className="pt-4">
              <SignaturePad ref={signatureRef} label="Client Signature" error={signatureError} />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-gold w-full py-4 mt-8 flex justify-center gap-2">
              {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Processing</> : 'Acknowledge & Sign Phase 1'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
