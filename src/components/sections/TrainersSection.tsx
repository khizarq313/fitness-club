import { useFirestoreData } from '@/hooks/useFirestoreData';
import {
  CinematicHorizontalSection,
  CinematicRailCard,
} from '@/components/ui/CinematicHorizontalSection';
import type { Trainer } from '@/types';

export function TrainersSection() {
  const { data: trainers, loading } = useFirestoreData<Trainer>(
    'trainers',
    [],
    'order',
  );

  if (loading) return null;

  return (
    <CinematicHorizontalSection
      id="coaches"
      desktopBehavior="carousel"
      sectionClassName="bg-background"
      railClassName="pb-4 md:pb-6"
      header={
        <div className="section-container">
          <div className="mb-12 md:mb-16 lg:mb-20">
            <span className="mb-4 block font-headline text-xs uppercase tracking-[0.3em] text-primary">
              Meet Our Elite Team
            </span>
            <h2 className="font-display text-4xl uppercase tracking-tight text-on-surface md:text-5xl lg:text-6xl">
              Master Coaches
            </h2>
          </div>
        </div>
      }
      renderBackground={() => (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="watermark-text font-display text-[24vw] leading-none tracking-tight">
              COACHES
            </span>
          </div>
          <div className="absolute right-[10%] top-[18%] h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        </>
      )}
      renderCards={({
        progress,
        isPinned,
        isInView,
        prefersReducedMotion,
      }) =>
        trainers.map((trainer, index) => (
          <CinematicRailCard
            key={trainer.id}
            progress={progress}
            index={index}
            total={trainers.length}
            isPinned={isPinned}
            isInView={isInView}
            prefersReducedMotion={prefersReducedMotion}
            outerClassName="w-full flex-shrink-0"
            innerClassName="group relative h-full aspect-[4/5] cursor-pointer overflow-hidden rounded-sm border border-white/10 bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          >
            {trainer.imageUrl ? (
              <img
                src={trainer.imageUrl}
                alt={trainer.name}
                className="h-full w-full object-cover grayscale transition-all duration-700 ease-vault group-hover:scale-105 group-hover:grayscale-0"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-high">
                <svg
                  className="h-28 w-28 text-primary/30"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 border-[6px] border-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="absolute bottom-0 left-0 w-full translate-y-2 bg-gradient-to-t from-black via-black/80 to-transparent p-6 transition-transform duration-500 ease-vault group-hover:translate-y-0 md:p-8">
              <p className="mb-1 font-headline text-[10px] uppercase tracking-widest text-primary md:text-xs">
                {trainer.role}
              </p>
              <h3 className="font-display text-lg uppercase text-on-surface md:text-xl">
                {trainer.name}
              </h3>
            </div>
          </CinematicRailCard>
        ))
      }
    />
  );
}
