import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Trainer } from '@/types';

export function TrainersSection() {
  const { data: trainers, loading } = useFirestoreData<Trainer>(
    'trainers',
    [],
    'order',
  );
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const prefersReducedMotion = useReducedMotion();

  if (loading) return null;

  return (
    <section id="coaches" className="py-24 md:py-32 bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="font-headline text-primary tracking-[0.3em] uppercase text-xs mb-4 block">
            Meet Our Elite Team
          </span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight uppercase text-on-surface">
            Master Coaches
          </h2>
        </div>

        {/* Coaches Grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-outline/30"
        >
          {trainers.map((trainer, index) => (
            <motion.div
              key={trainer.id}
              className="relative aspect-[4/5] overflow-hidden group bg-surface cursor-pointer"
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Image or Placeholder */}
              {trainer.imageUrl ? (
                <img
                  src={trainer.imageUrl}
                  alt={trainer.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-vault group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-high">
                  <svg
                    className="w-28 h-28 text-primary/30"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}

              {/* Inner Gold Border on Hover */}
              <div className="absolute inset-0 border-[6px] border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Name & Role Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-vault">
                <p className="font-headline text-primary text-[10px] md:text-xs tracking-widest uppercase mb-1">
                  {trainer.role}
                </p>
                <h3 className="font-display text-2xl md:text-3xl uppercase text-on-surface">
                  {trainer.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
