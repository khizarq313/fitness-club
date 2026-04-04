import { useFirestoreData } from '@/hooks/useFirestoreData';
import {
  CinematicHorizontalSection,
  CinematicRailCard,
} from '@/components/ui/CinematicHorizontalSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  validUntil?: string;
  code?: string;
  isActive: boolean;
  order: number;
}

const OFFER_CONDITIONS = [
  { field: 'isActive', operator: '==' as const, value: true },
];

export function OffersSection() {
  const { data: offers, loading } = useFirestoreData<Offer>(
    'offers',
    OFFER_CONDITIONS,
  );

  if (loading) {
    return (
      <section id="offers" className="bg-background py-20 md:py-28 lg:py-32">
        <div className="section-container text-center">
          <div className="w-8 h-8 border-2 border-outline border-t-primary animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  // If no active offers, don't render the section
  if (!offers || offers.length === 0) return null;

  return (
    <CinematicHorizontalSection
      id="offers"
      desktopBehavior="carousel"
      sectionClassName="bg-background border-y border-outline/30"
      railClassName="pb-4 md:pb-6"
      header={
        <div className="section-container">
          <SectionHeading
            title="Exclusive Offers"
            subtitle="Limited time promotions for new and existing members."
          />
        </div>
      }
      renderBackground={() => (
        <>
          <div className="absolute left-[-8rem] top-16 h-80 w-80 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute bottom-0 right-[-10rem] h-96 w-96 rounded-full bg-white/6 blur-3xl" />
          <div className="absolute inset-0 flex items-center justify-end pr-[6vw]">
            <span className="watermark-text font-display text-[22vw] leading-none tracking-tight">
              OFFERS
            </span>
          </div>
        </>
      )}
      renderCards={({
        progress,
        isPinned,
        isInView,
        prefersReducedMotion,
      }) =>
        offers.map((offer, index) => (
          <CinematicRailCard
            key={offer.id}
            progress={progress}
            index={index}
            total={offers.length}
            isPinned={isPinned}
            isInView={isInView}
            prefersReducedMotion={prefersReducedMotion}
            outerClassName="w-full flex-shrink-0"
            innerClassName="flex h-full flex-col justify-between rounded-sm border border-white/10 bg-[#141414]/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm md:p-8"
          >
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-primary/10 p-2 text-primary">
                  <Tag size={20} />
                </div>
                <h3 className="font-display text-lg uppercase tracking-wider text-on-surface md:text-xl">
                  {offer.title}
                </h3>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-zinc-400">
                {offer.description}
              </p>
            </div>

            <div className="mt-auto flex items-end justify-between border-t border-outline/30 pt-4">
              <div className="flex flex-col">
                {offer.code && (
                  <span className="mb-1 font-headline text-xs uppercase tracking-widest text-primary">
                    Code: {offer.code}
                  </span>
                )}
                {offer.validUntil && (
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                    Valid until: {offer.validUntil}
                  </span>
                )}
              </div>
              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/9876543210?text=Hi%20Fitness%20Club%2C%20I%20am%20interested%20in%20the%20offer:%20${encodeURIComponent(offer.title)}.`,
                    '_blank',
                  )
                }
                className="font-headline text-xs uppercase tracking-widest text-on-surface transition-colors hover:text-primary"
              >
                Claim Offer &rarr;
              </button>
            </div>
          </CinematicRailCard>
        ))
      }
    />
  );
}
