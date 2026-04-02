import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useUIStore } from '@/stores/uiStore';

const HERO_STATS = [
  { target: 500, suffix: '+', label: 'Elite Members' },
  { target: 10, suffix: '+', label: 'Expert Trainers' },
  { target: 5, suffix: '★', label: 'Google Rated' },
] as const;

/**
 * Hero background image from Unsplash.
 * Note: Replace with actual Vigor Fitness Club gym photography before production.
 * Search terms used: "dark moody gym, heavy weights, luxury fitness"
 */
const HERO_BG_URL =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80';

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const { openEnquiryModal } = useUIStore();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: prefersReducedMotion ? 0 : 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: prefersReducedMotion ? {} : { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden"
      style={{ height: '100svh' }}
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        {/* Actual gym photo */}
        <img
          src={HERO_BG_URL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          // @ts-expect-error: User specifically required lowercase fetchpriority but React types prefer camelCase
          fetchpriority="high"
        />

        {/* Linear gradient overlay — ensures text readability per design system */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.92) 80%, #0A0A0A 100%)',
          }}
        />

        {/* Subtle gold ambience */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 40% at 30% 70%, rgba(245, 166, 35, 0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Massive Watermark */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="watermark-text font-display text-[18vw] md:text-[14vw] lg:text-[12vw] leading-none tracking-widest whitespace-nowrap">
          FITNESS CLUB
        </span>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 section-container pb-8 md:pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          className="font-headline text-xs md:text-sm uppercase tracking-[0.3em] text-on-surface-variant mb-4 md:mb-6"
          variants={itemVariants}
        >
          The Elite Performance Sanctuary
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] leading-[0.85] uppercase mb-6 md:mb-8"
          variants={itemVariants}
        >
          Forge Your Strength
          <br />
          <span
            className="text-primary"
            style={{ WebkitTextStroke: '1px #F5A623' }}
          >
            Fitness <span className="text-primary">Club</span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-on-surface-variant text-sm md:text-base max-w-md leading-relaxed mb-8 md:mb-10"
          variants={itemVariants}
        >
          Step into Amravati&apos;s most elite performance sanctuary, engineered
          for those who refuse to settle. Premium coaching, unmatched facilities.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-4 mb-16 md:mb-20"
          variants={itemVariants}
        >
          <button
            className="btn-gold text-sm md:text-base"
            id="hero-explore-packages"
            onClick={() => {
              const el = document.querySelector('#packages');
              el?.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
              });
            }}
          >
            Explore Packages
          </button>
          <button
            className="btn-ghost text-sm md:text-base"
            id="hero-book-trial"
            onClick={() => openEnquiryModal()}
          >
            Book Free Trial
          </button>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="grid grid-cols-3 gap-4 md:gap-8 py-6 md:py-8 border-t border-outline/30"
          variants={itemVariants}
        >
          {HERO_STATS.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              target={stat.target}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
