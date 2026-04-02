import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useInView, useMotionValue } from 'framer-motion';
import { Star } from 'lucide-react';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Review } from '@/types';

const REVIEW_CONDITIONS = [
  { field: 'isVisible', operator: '==' as const, value: true },
];

export function ReviewsSection() {
  const { data: reviews, loading } = useFirestoreData<Review>(
    'reviews',
    REVIEW_CONDITIONS,
  );
  const ref = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const prefersReducedMotion = useReducedMotion();
  const marqueeX = useMotionValue(0);
  const [loopWidth, setLoopWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (loading || reviews.length === 0 || prefersReducedMotion) {
      setLoopWidth(0);
      marqueeX.set(0);
      return;
    }

    const updateLoopWidth = () => {
      const nextWidth = firstSetRef.current?.scrollWidth ?? 0;
      setLoopWidth(nextWidth);
      marqueeX.set(0);
    };

    updateLoopWidth();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updateLoopWidth())
        : null;

    if (firstSetRef.current && resizeObserver) {
      resizeObserver.observe(firstSetRef.current);
    }

    window.addEventListener('resize', updateLoopWidth);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateLoopWidth);
    };
  }, [loading, prefersReducedMotion, reviews, marqueeX]);

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || isPaused || loopWidth === 0) return;

    const distance = (delta / 1000) * 28;
    const nextValue = marqueeX.get() - distance;

    marqueeX.set(nextValue <= -loopWidth ? nextValue + loopWidth : nextValue);
  });

  const renderReviewCard = (review: Review, index: number, key: string) => (
    <motion.div
      key={key}
      className="flex-shrink-0 w-[340px] md:w-[400px] bg-background p-8 md:p-10 border-l-4 border-primary snap-center"
      initial={prefersReducedMotion ? {} : { opacity: 0, x: 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="flex gap-1 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < review.rating ? 'text-primary fill-primary' : 'text-outline'}
          />
        ))}
      </div>

      <p className="font-body text-on-surface-variant mb-8 leading-relaxed italic text-sm">
        &ldquo;{review.reviewText}&rdquo;
      </p>

      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-surface-elevated flex items-center justify-center font-display text-lg text-primary border border-outline">
          {review.reviewerName.charAt(0)}
        </div>
        <div>
          <div className="font-headline font-bold uppercase tracking-widest text-on-surface text-sm">
            {review.reviewerName}
          </div>
          {review.memberType && (
            <div className="text-[10px] text-primary uppercase tracking-widest font-headline mt-0.5">
              {review.memberType}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (loading || reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-24 md:py-32 bg-surface-high relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="watermark-text font-display text-[25vw] leading-none tracking-tighter">
          REVIEWS
        </span>
      </div>

      {/* Header */}
      <div className="section-container relative z-10 mb-12 md:mb-16" ref={ref}>
        <motion.div
          className="flex items-center gap-6"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <span className="font-headline text-primary tracking-[0.3em] uppercase text-xs mb-3 block">
              What Our Members Say
            </span>
            <h2 className="font-headline text-3xl md:text-4xl uppercase tracking-widest text-on-surface">
              Client Echoes
            </h2>
          </div>
          <div className="h-px flex-1 bg-outline hidden md:block" />
        </motion.div>
      </div>

      {prefersReducedMotion ? (
        <div className="relative z-10 flex gap-6 md:gap-8 px-6 md:px-12 overflow-x-auto snap-x snap-mandatory pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {reviews.map((review, index) =>
            renderReviewCard(review, index, review.id),
          )}
        </div>
      ) : (
        <div className="relative z-10 overflow-hidden px-6 md:px-12 pb-8">
          <motion.div
            className="flex w-max will-change-transform"
            style={{ x: marqueeX }}
            onHoverStart={() => setIsPaused(true)}
            onHoverEnd={() => setIsPaused(false)}
          >
            <div ref={firstSetRef} className="flex gap-6 md:gap-8 pr-6 md:pr-8">
              {reviews.map((review, index) =>
                renderReviewCard(review, index, review.id),
              )}
            </div>
            <div className="flex gap-6 md:gap-8" aria-hidden="true">
              {reviews.map((review, index) =>
                renderReviewCard(review, index, `${review.id}-duplicate-${index}`),
              )}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
