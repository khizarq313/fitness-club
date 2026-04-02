import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeedbackModal } from '@/components/ui/FeedbackModal';
import { useAuthStore } from '@/stores/authStore';
import {
  MessageSquare,
  User,
  Users,
  Dumbbell,
  CreditCard,
  Percent,
  Camera,
  Award,
  Star,
  MessageCircle,
  ClipboardCheck,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useReducedMotion } from '@/hooks/useReducedMotion';


interface QuickAction {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  action: () => void;
}

function scrollToSection(id: string) {
  const el = document.querySelector(id);
  el?.scrollIntoView({ behavior: 'smooth' });
}

export function QuickAccessGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const actions: QuickAction[] = [
    {
      id: 'qa-enquiry',
      icon: MessageSquare,
      label: 'Enquiry',
      description: 'Get in touch with our team',
      action: () => window.open('https://wa.me/9876543210?text=Hi%20Fitness%20Club%2C%20I%20am%20interested%20in%20Personal%20Training.', '_blank'),
    },
    {
      id: 'qa-login',
      icon: User,
      label: user ? 'Already Logged In' : 'Client Login',
      description: user ? 'Access your portal' : 'Access your member portal',
      action: () => {
        if (!user) navigate('/login');
      },
    },
    {
      id: 'qa-group-class',
      icon: Users,
      label: 'Book Group Class',
      description: 'Join our elite group sessions',
      action: () => window.open('https://wa.me/9876543210?text=Hi%20Fitness%20Club%2C%20I%20am%20interested%20in%20joining%20the%20group%20classes.', '_blank'),
    },
    {
      id: 'qa-book-pt',
      icon: Dumbbell,
      label: 'Book PT',
      description: 'Personal training sessions',
      action: () => window.open('https://wa.me/9876543210?text=Hi%20Vigor%20Fitness%2C%20I%20would%20like%20to%20book%20a%20PT%20Session.', '_blank'),
    },
    {
      id: 'qa-packages',
      icon: CreditCard,
      label: 'Packages',
      description: 'View membership plans',
      action: () => scrollToSection('#packages'),
    },
    {
      id: 'qa-offers',
      icon: Percent,
      label: 'Offers',
      description: 'Current promotions & deals',
      action: () => scrollToSection('#offers'),
    },
    {
      id: 'qa-gallery',
      icon: Camera,
      label: 'Photo Gallery',
      description: 'Tour our facilities',
      action: () => scrollToSection('#facilities'),
    },
    {
      id: 'qa-trainers',
      icon: Award,
      label: 'Trainers',
      description: 'Meet our expert coaches',
      action: () => scrollToSection('#coaches'),
    },
    {
      id: 'qa-reviews',
      icon: Star,
      label: 'Reviews',
      description: 'What our members say',
      action: () => scrollToSection('#reviews'),
    },
    {
      id: 'qa-feedback',
      icon: MessageCircle,
      label: 'Feedback',
      description: 'Share your experience',
      action: () => setIsFeedbackOpen(true),
    },
    {
      id: 'qa-parq',
      icon: ClipboardCheck,
      label: 'PAR-Q',
      description: 'Physical activity readiness',
      action: () => navigate('/par-q'),
    },
    {
      id: 'qa-pt-contract',
      icon: FileText,
      label: 'PT Contract',
      description: 'Personal training agreement',
      action: () => navigate('/pt-contract'),
    },
    {
      id: 'qa-trial-waiver',
      icon: ShieldCheck,
      label: 'Trial Waiver',
      description: 'Safety & liability waiver',
      action: () => navigate('/trial-waiver'),
    },
  ];

  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.04,
      },
    },
  };

  const cardVariants = {
    hidden: prefersReducedMotion
      ? {}
      : { opacity: 0, y: 24, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section id="quick-access" className="py-20 md:py-28 bg-surface">
      <div className="section-container">
        <SectionHeading
          title="Rapid Access Portal"
          subtitle="Everything you need, one tap away. Navigate to any section of our digital command center."
        />

        <motion.div
          ref={ref}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
          variants={gridVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <motion.button
                key={action.id}
                id={action.id}
                className="glass-card p-5 md:p-6 text-left group relative overflow-hidden"
                variants={cardVariants}
                onClick={action.action}
                whileHover={{
                  scale: 1.03,
                  borderColor: 'rgba(245, 166, 35, 0.35)',
                  boxShadow: '0 0 24px rgba(245, 166, 35, 0.15)',
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Hover glow background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-surface-high border border-outline/30 mb-4 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-400 ease-vault">
                    <IconComponent
                      size={20}
                      className="text-on-surface-variant group-hover:text-primary transition-colors duration-300"
                    />
                  </div>
                  <h3 className="font-headline text-sm md:text-base uppercase tracking-wider text-on-surface mb-1 group-hover:text-primary transition-colors duration-300">
                    {action.label}
                  </h3>
                  <p className="text-on-surface-variant text-[11px] md:text-xs leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </section>
  );
}
