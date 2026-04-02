import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring, motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}

export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  label,
  duration = 2,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
    duration: duration * 1000,
  });
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, motionValue, target]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (displayRef.current) {
        displayRef.current.textContent = `${prefix}${Math.round(latest)}${suffix}`;
      }
    });
    return unsubscribe;
  }, [springValue, prefix, suffix]);

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className="text-center">
        <span className="font-display text-4xl md:text-5xl lg:text-6xl text-primary">
          {prefix}{target}{suffix}
        </span>
        <p className="mt-2 text-on-surface-variant text-xs md:text-sm uppercase tracking-widest font-headline">
          {label}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <span
        ref={displayRef}
        className="font-display text-4xl md:text-5xl lg:text-6xl text-primary"
      >
        {prefix}0{suffix}
      </span>
      <p className="mt-2 text-on-surface-variant text-xs md:text-sm uppercase tracking-widest font-headline">
        {label}
      </p>
    </motion.div>
  );
}
