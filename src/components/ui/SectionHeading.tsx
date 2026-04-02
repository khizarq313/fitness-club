import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  alignment = 'left',
  className = '',
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();

  const alignClass = alignment === 'center' ? 'text-center' : 'text-left';

  return (
    <div ref={ref} className={`mb-12 md:mb-16 ${alignClass} ${className}`}>
      {/* Gold accent line */}
      <motion.div
        className={`h-[2px] w-16 bg-primary mb-6 ${alignment === 'center' ? 'mx-auto' : ''}`}
        initial={prefersReducedMotion ? {} : { scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: alignment === 'center' ? 0.5 : 0 }}
      />

      <motion.h2
        className="font-headline text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider text-on-surface"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          className="mt-4 text-on-surface-variant text-sm md:text-base max-w-xl leading-relaxed"
          style={alignment === 'center' ? { marginInline: 'auto' } : {}}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
