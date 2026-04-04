import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { CSSProperties, ReactElement, ReactNode, RefObject } from 'react';
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const TOUCH_DEVICE_QUERY = '(hover: none) and (pointer: coarse)';
const MOBILE_BREAKPOINT = 600;
const SPRING_CONFIG = {
  stiffness: 50,
  damping: 20,
  mass: 0.8,
};
const EASE = [0.16, 1, 0.3, 1] as const;

function getCardsPerView(width: number) {
  if (width < MOBILE_BREAKPOINT) return 1;
  if (width < 1024) return 2;
  return 3;
}

function getCarouselCardPadding(width: number) {
  if (width >= 1280) return 20;
  if (width >= 768) return 16;
  return 12;
}

interface CinematicRailContext {
  progress: MotionValue<number>;
  isPinned: boolean;
  isMobile: boolean;
  isOverflowing: boolean;
  isInView: boolean;
  prefersReducedMotion: boolean;
}

interface CinematicHorizontalSectionProps {
  id: string;
  header: ReactNode;
  renderCards: (context: CinematicRailContext) => ReactNode;
  renderBackground?: (context: CinematicRailContext) => ReactNode;
  desktopBehavior?: 'pinned-scroll' | 'carousel';
  sectionClassName?: string;
  stickyClassName?: string;
  contentClassName?: string;
  railViewportClassName?: string;
  railClassName?: string;
  pinnedRailClassName?: string;
  mobileRailClassName?: string;
}

interface CinematicRailCardProps {
  progress: MotionValue<number>;
  index: number;
  total: number;
  outerClassName: string;
  innerClassName: string;
  children: ReactNode;
  isPinned: boolean;
  isInView: boolean;
  prefersReducedMotion: boolean;
  hoverScale?: number;
  staggerDelay?: number;
  onClick?: () => void;
  style?: CSSProperties;
}

interface RailMetrics {
  trackWidth: number;
  viewportWidth: number;
  viewportHeight: number;
}

function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(TOUCH_DEVICE_QUERY);

    const updateTouchState = () => {
      setIsTouchDevice(mediaQuery.matches);
    };

    updateTouchState();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateTouchState);
    } else {
      mediaQuery.addListener(updateTouchState);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', updateTouchState);
      } else {
        mediaQuery.removeListener(updateTouchState);
      }
    };
  }, []);

  return isTouchDevice;
}

function useRailMetrics(
  viewportRef: RefObject<HTMLDivElement>,
  trackRef: RefObject<HTMLDivElement>,
) {
  const [metrics, setMetrics] = useState<RailMetrics>({
    trackWidth: 0,
    viewportWidth: 0,
    viewportHeight: 0,
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track || typeof window === 'undefined') {
      return;
    }

    const updateMetrics = () => {
      setMetrics({
        trackWidth: track.scrollWidth,
        viewportWidth: viewport.offsetWidth,
        viewportHeight: window.innerHeight,
      });
    };

    const observeTrackChildren = (resizeObserver: ResizeObserver) => {
      Array.from(track.children).forEach((child) => {
        resizeObserver.observe(child as Element);
      });
    };

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updateMetrics())
        : null;
    const mutationObserver =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => {
            updateMetrics();

            if (resizeObserver) {
              observeTrackChildren(resizeObserver);
            }
          })
        : null;

    updateMetrics();

    if (resizeObserver) {
      resizeObserver.observe(viewport);
      resizeObserver.observe(track);
      observeTrackChildren(resizeObserver);
    }

    mutationObserver?.observe(track, {
      childList: true,
      subtree: true,
    });

    window.addEventListener('resize', updateMetrics);

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('resize', updateMetrics);
    };
  }, [trackRef, viewportRef]);

  return metrics;
}

export function CinematicHorizontalSection({
  id,
  header,
  renderCards,
  renderBackground,
  desktopBehavior = 'pinned-scroll',
  sectionClassName = '',
  stickyClassName = '',
  contentClassName = 'w-full py-20 md:py-28 lg:py-32',
  railViewportClassName = 'mx-auto w-full max-w-[1440px] px-6 md:px-10 xl:px-16',
  railClassName = '',
  pinnedRailClassName = '',
  mobileRailClassName = 'snap-x snap-mandatory',
}: CinematicHorizontalSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isTouchDevice = useTouchDevice();
  const [windowWidth, setWindowWidth] = useState(1280);
  const [isMobileCarousel, setIsMobileCarousel] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isInView = useInView(sectionRef, { once: true, margin: '-15%' });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const { trackWidth, viewportWidth, viewportHeight } = useRailMetrics(
    viewportRef,
    trackRef,
  );

  const isMobile = windowWidth < MOBILE_BREAKPOINT;
  const isOverflowing = trackWidth > viewportWidth + 1;
  const isDesktopCarousel = desktopBehavior === 'carousel' && !isMobile;
  const isPinned =
    desktopBehavior === 'pinned-scroll' &&
    !isTouchDevice &&
    !isMobile &&
    isOverflowing;
  const maxTranslate = Math.max(0, trackWidth - viewportWidth);
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxTranslate]);
  const smoothX = useSpring(x, SPRING_CONFIG);
  const progressVelocity = useVelocity(scrollYProgress);
  const motionBlurOpacity = useTransform(
    progressVelocity,
    [-0.8, 0, 0.8],
    [0.86, 1, 0.86],
  );
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const sectionHeight =
    isPinned && viewportHeight > 0 ? viewportHeight + maxTranslate : undefined;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setCardsPerView(getCardsPerView(width));
      setIsMobileCarousel(desktopBehavior === 'carousel' && width < 600);
      setCurrentIndex(0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [desktopBehavior]);

  const context: CinematicRailContext = {
    progress: scrollYProgress,
    isPinned,
    isMobile,
    isOverflowing,
    isInView,
    prefersReducedMotion,
  };

  const renderedCards = Children.toArray(renderCards(context));
  const totalCards = renderedCards.length;
  const effectiveCardsPerView = Math.min(Math.max(totalCards, 1), cardsPerView);
  const maxIndex = Math.max(0, totalCards - effectiveCardsPerView);
  const desktopStep =
    effectiveCardsPerView > 0 ? viewportWidth / effectiveCardsPerView : 0;
  const desktopCarouselCardStyle: CSSProperties | undefined =
    isDesktopCarousel && effectiveCardsPerView > 0
      ? {
          width: `${100 / effectiveCardsPerView}%`,
          minWidth: `${100 / effectiveCardsPerView}%`,
          maxWidth: `${100 / effectiveCardsPerView}%`,
          flexShrink: 0,
          boxSizing: 'border-box',
          paddingInline: `${getCarouselCardPadding(windowWidth)}px`,
        }
      : undefined;
  const desktopCarouselCards = isDesktopCarousel
    ? renderedCards.map((child) => {
        if (!isValidElement(child)) {
          return child;
        }

        const element = child as ReactElement<{ style?: CSSProperties }>;

        return cloneElement(element, {
          style: {
            ...(element.props.style ?? {}),
            ...(desktopCarouselCardStyle ?? {}),
          },
        });
      })
    : renderedCards;
  const showCarouselArrows =
    isDesktopCarousel && !isMobile && !isMobileCarousel && totalCards > effectiveCardsPerView;
  const resolvedRailViewportClassName = isMobileCarousel
    ? 'mx-auto w-full max-w-[1440px]'
    : railViewportClassName;

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const trackStyle = isPinned
    ? {
        x: prefersReducedMotion ? x : smoothX,
        opacity: prefersReducedMotion ? 1 : motionBlurOpacity,
      }
    : undefined;

  const backgroundStyle =
    isPinned && !prefersReducedMotion ? { y: backgroundY } : undefined;

  const backgroundLayer = (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={backgroundStyle}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,166,35,0.16),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.07),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:180px_180px]" />
      {renderBackground?.(context)}
    </motion.div>
  );

  const content = (
    <div className={`relative z-10 ${contentClassName}`}>
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {header}
      </motion.div>

      <div className={resolvedRailViewportClassName}>
        {isDesktopCarousel ? (
          <div className="w-full">
            <div ref={viewportRef} className="w-full overflow-hidden">
              <motion.div
                ref={trackRef}
                animate={{
                  x: -(currentIndex * desktopStep),
                }}
                transition={{
                  type: 'spring',
                  stiffness: 70,
                  damping: 18,
                  mass: 0.8,
                }}
                className={`flex items-stretch ${railClassName}`.trim()}
              >
                {desktopCarouselCards}
              </motion.div>
            </div>

            {showCarouselArrows && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur transition hover:border-primary disabled:opacity-30"
                  aria-label="Previous cards"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === maxIndex}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur transition hover:border-primary disabled:opacity-30"
                  aria-label="Next cards"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        ) : isMobileCarousel ? (
          <div
            ref={viewportRef}
            className="w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="flex gap-6 px-6">
              {renderedCards.map((child, index) => (
                <div
                  key={`mobile-${index}`}
                  className="w-[calc(100vw-3rem)] flex-shrink-0 snap-center"
                >
                  {child}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            ref={viewportRef}
            className={
              isPinned
                ? 'w-full overflow-hidden'
                : `w-full overflow-x-auto scroll-smooth no-scrollbar ${mobileRailClassName}`.trim()
            }
            style={
              isPinned
                ? undefined
                : {
                    WebkitOverflowScrolling: 'touch',
                  }
            }
          >
            <motion.div
              ref={trackRef}
              className={
                isPinned
                  ? `flex w-max justify-start gap-6 md:gap-8 lg:gap-10 will-change-transform ${railClassName} ${pinnedRailClassName}`.trim()
                  : `flex w-max flex-nowrap gap-6 md:gap-8 lg:gap-10 ${railClassName}`.trim()
              }
                style={
                  isPinned
                    ? {
                      ...trackStyle,
                      minWidth: 'max-content',
                    }
                  : {
                      minWidth: 'max-content',
                    }
              }
            >
              {isPinned && (
                <div className="w-6 shrink-0 md:w-12 xl:w-20" aria-hidden="true" />
              )}
              {renderedCards}
              {isPinned && (
                <div className="w-6 shrink-0 md:w-12 xl:w-20" aria-hidden="true" />
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative mt-16 md:mt-24 ${sectionClassName}`}
      style={sectionHeight ? { height: `${Math.ceil(sectionHeight)}px` } : undefined}
    >
      {isPinned ? (
        <div
          className={`sticky top-0 flex h-screen items-center overflow-hidden ${stickyClassName}`}
        >
          {backgroundLayer}
          {content}
        </div>
      ) : (
        <>
          {backgroundLayer}
          {content}
        </>
      )}
    </section>
  );
}

export function CinematicRailCard({
  progress,
  index,
  total,
  outerClassName,
  innerClassName,
  children,
  isPinned,
  isInView,
  prefersReducedMotion,
  hoverScale = 1.05,
  staggerDelay = 0.08,
  onClick,
  style,
}: CinematicRailCardProps) {
  const center = total <= 1 ? 0.5 : index / (total - 1);
  const spread = total <= 1 ? 1 : Math.min(0.32, 0.78 / (total - 1));
  const start = Math.max(0, center - spread);
  const end = Math.min(1, center + spread);

  const scale = useSpring(
    useTransform(progress, [start, center, end], [0.9, 1.06, 0.9]),
    SPRING_CONFIG,
  );
  const opacity = useSpring(
    useTransform(progress, [start, center, end], [0.55, 1, 0.62]),
    SPRING_CONFIG,
  );
  const y = useSpring(
    useTransform(progress, [start, center, end], [50, 0, 50]),
    SPRING_CONFIG,
  );
  const boxShadow = useTransform(
    progress,
    [start, center, end],
    [
      '0 18px 50px rgba(0, 0, 0, 0.18)',
      '0 30px 90px rgba(245, 166, 35, 0.20)',
      '0 18px 50px rgba(0, 0, 0, 0.18)',
    ],
  );

  return (
    <motion.div
      className={outerClassName}
      style={style}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * staggerDelay,
        ease: EASE,
      }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              scale: hoverScale,
              y: -8,
            }
      }
      onClick={onClick}
    >
      <motion.div
        className={innerClassName}
        style={
          isPinned && !prefersReducedMotion
            ? {
                scale,
                opacity,
                y,
                boxShadow,
              }
            : undefined
        }
      >
        {children}
      </motion.div>
    </motion.div>
  );
}


