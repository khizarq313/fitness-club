import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Eye, X } from 'lucide-react';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import {
  CinematicHorizontalSection,
  CinematicRailCard,
} from '@/components/ui/CinematicHorizontalSection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { GalleryImage } from '@/types';

export function GallerySection() {
  const { data: images, loading } = useFirestoreData<GalleryImage>(
    'gallery',
    [],
    'order',
  );
  const prefersReducedMotion = useReducedMotion();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (!selectedImage) {
      document.body.style.overflow = '';
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  if (loading) return null;
  if (images.length === 0) {
    return (
      <section id="facilities" className="mt-16 bg-background py-20 md:mt-24 md:py-28 lg:py-32">
        <div className="section-container">
          <span className="mb-4 block font-headline text-xs uppercase tracking-[0.3em] text-primary">
            Tour Our World-Class Facilities
          </span>
          <h2 className="font-display text-4xl uppercase tracking-tight text-on-surface md:text-5xl lg:text-6xl">
            The Arena
          </h2>
          <p className="mt-4 max-w-md font-headline text-sm uppercase tracking-widest text-zinc-400">
            Gallery images coming soon
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <CinematicHorizontalSection
        id="facilities"
        desktopBehavior="carousel"
        sectionClassName="bg-background"
        railClassName="items-stretch pb-4 md:pb-6"
        header={
          <div className="section-container">
            <div className="mb-12 md:mb-16 lg:mb-20">
              <span className="mb-4 block font-headline text-xs uppercase tracking-[0.3em] text-primary">
                Tour Our World-Class Facilities
              </span>
              <h2 className="font-display text-4xl uppercase tracking-tight text-on-surface md:text-5xl lg:text-6xl">
                The Arena
              </h2>
            </div>
          </div>
        }
        renderBackground={() => (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="watermark-text font-display text-[24vw] leading-none tracking-tight">
                ARENA
              </span>
            </div>
            <div className="absolute left-[10%] top-[16%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          </>
        )}
        renderCards={({
          progress,
          isPinned,
          isInView,
          prefersReducedMotion: reduceMotionForCards,
        }) =>
          images.map((img, index) => (
            <CinematicRailCard
              key={img.id}
              progress={progress}
              index={index}
              total={images.length}
              isPinned={isPinned}
              isInView={isInView}
              prefersReducedMotion={reduceMotionForCards}
              outerClassName="w-full flex-shrink-0"
              innerClassName="group relative h-full overflow-hidden rounded-sm border border-white/10 bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.3)] aspect-[4/5] md:aspect-[3/4] md:max-h-[500px] lg:max-h-[550px]"
              hoverScale={1.02}
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.imageUrl}
                alt={img.caption ?? 'Vigor Fitness Facility'}
                className="h-full w-full object-cover transition-transform duration-700 ease-vault group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-400 group-hover:opacity-100">
                <Eye size={28} className="mb-3 text-primary" />
                <span className="border border-primary/40 px-5 py-2 font-headline text-xs uppercase tracking-widest text-primary">
                  View
                </span>
                {img.caption && (
                  <p className="mt-3 px-4 text-center text-xs text-on-surface-variant">
                    {img.caption}
                  </p>
                )}
              </div>
            </CinematicRailCard>
          ))
        }
      />

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-6"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              type="button"
              className="absolute top-5 right-5 text-white/80 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Close gallery preview"
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <X size={28} />
            </motion.button>

            <motion.div
              className="max-h-[90vh] max-w-[90vw] flex flex-col items-center gap-4"
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.caption ?? 'Gallery preview'}
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
              {selectedImage.caption && (
                <p className="text-sm text-on-surface-variant text-center">
                  {selectedImage.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
