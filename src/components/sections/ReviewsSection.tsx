import { Star } from 'lucide-react';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import {
  CinematicHorizontalSection,
  CinematicRailCard,
} from '@/components/ui/CinematicHorizontalSection';
import type { Review } from '@/types';

const REVIEW_CONDITIONS = [
  { field: 'isVisible', operator: '==' as const, value: true },
];

export function ReviewsSection() {
  const { data: reviews, loading } = useFirestoreData<Review>(
    'reviews',
    REVIEW_CONDITIONS,
  );

  if (loading || reviews.length === 0) return null;

  return (
    <CinematicHorizontalSection
      id="reviews"
      desktopBehavior="carousel"
      sectionClassName="bg-surface-high"
      railClassName="items-stretch pb-4 md:pb-6"
      header={
        <div className="section-container relative z-10 mb-12 md:mb-16 lg:mb-20">
          <div className="flex items-start gap-6">
            <div>
              <span className="mb-3 block font-headline text-xs uppercase tracking-[0.3em] text-primary">
                What Our Members Say
              </span>
              <h2 className="font-display text-4xl uppercase tracking-tight text-on-surface md:text-5xl lg:text-6xl">
                Client Echoes
              </h2>
            </div>
            <div className="hidden h-px flex-1 bg-outline md:block" />
          </div>
        </div>
      }
      renderBackground={() => (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="watermark-text font-display text-[25vw] leading-none tracking-tighter">
            REVIEWS
          </span>
        </div>
      )}
      renderCards={({
        progress,
        isPinned,
        isInView,
        prefersReducedMotion,
      }) =>
        reviews.map((review, index) => (
          <CinematicRailCard
            key={review.id}
            progress={progress}
            index={index}
            total={reviews.length}
            isPinned={isPinned}
            isInView={isInView}
            prefersReducedMotion={prefersReducedMotion}
            outerClassName="w-full flex-shrink-0"
            innerClassName="flex h-full flex-col rounded-sm border border-white/10 border-l-4 border-l-primary bg-background p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] md:p-8"
          >
            <div className="mb-6 flex gap-1">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star
                  key={starIndex}
                  size={18}
                  className={
                    starIndex < review.rating
                      ? 'fill-primary text-primary'
                      : 'text-outline'
                  }
                />
              ))}
            </div>

            <p className="mb-8 font-body text-sm italic leading-relaxed text-zinc-400">
              &ldquo;{review.reviewText}&rdquo;
            </p>

            <div className="mt-auto flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center border border-outline bg-surface-elevated font-display text-lg text-primary">
                {review.reviewerName.charAt(0)}
              </div>
              <div>
                <div className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface">
                  {review.reviewerName}
                </div>
                {review.memberType && (
                  <div className="mt-0.5 font-headline text-[10px] uppercase tracking-widest text-primary">
                    {review.memberType}
                  </div>
                )}
              </div>
            </div>
          </CinematicRailCard>
        ))
      }
    />
  );
}
