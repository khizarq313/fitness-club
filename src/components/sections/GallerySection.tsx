import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Eye } from 'lucide-react';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { GalleryImage } from '@/types';

export function GallerySection() {
  const { data: images, loading } = useFirestoreData<GalleryImage>(
    'gallery',
    [],
    'order',
  );
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const prefersReducedMotion = useReducedMotion();

  if (loading) return null;

  return (
    <section id="facilities" className="py-24 md:py-32 bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="font-headline text-primary tracking-[0.3em] uppercase text-xs mb-4 block">
            Tour Our World-Class Facilities
          </span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight uppercase text-on-surface">
            The Arena
          </h2>
        </div>

        {/* Masonry Grid */}
        <div
          ref={ref}
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        >
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              className="relative overflow-hidden group cursor-pointer break-inside-avoid bg-surface"
              initial={
                prefersReducedMotion ? {} : { opacity: 0, scale: 0.96 }
              }
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                delay: (index % 3) * 0.1,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <img
                src={img.imageUrl}
                alt={img.caption ?? 'Vigor Fitness Facility'}
                className="w-full h-auto object-cover transition-transform duration-700 ease-vault group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-center backdrop-blur-sm">
                <Eye size={28} className="text-primary mb-3" />
                <span className="font-headline text-primary tracking-widest uppercase text-xs border border-primary/40 px-5 py-2">
                  View
                </span>
                {img.caption && (
                  <p className="text-on-surface-variant text-xs mt-3 px-4 text-center">
                    {img.caption}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && images.length === 0 && (
          <div className="text-center py-20">
            <p className="text-on-surface-variant font-headline text-sm uppercase tracking-widest">
              Gallery images coming soon
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
