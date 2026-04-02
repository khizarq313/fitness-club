import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { useReducedMotion } from '@/hooks/useReducedMotion';
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
    OFFER_CONDITIONS
  );
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const prefersReducedMotion = useReducedMotion();

  if (loading) {
    return (
      <section id="offers" className="py-20 md:py-32 bg-background border-y border-outline/30">
        <div className="section-container text-center">
          <div className="w-8 h-8 border-2 border-outline border-t-primary animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  // If no active offers, don't render the section
  if (!offers || offers.length === 0) return null;

  return (
    <section id="offers" className="py-20 md:py-32 bg-background border-y border-outline/30 overflow-hidden relative">
      <div className="section-container" ref={ref}>
        <SectionHeading 
          title="Exclusive Offers" 
          subtitle="Limited time promotions for new and existing members." 
        />

        {/* Horizontal scroll container without visible scrollbars */}
        <motion.div
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {offers.map((offer) => (
            <div 
              key={offer.id} 
              className="flex-none w-[85vw] md:w-[400px] snap-center bg-[#141414] border border-outline/50 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 text-primary">
                    <Tag size={20} />
                  </div>
                  <h3 className="font-display tracking-wider text-xl md:text-2xl uppercase text-on-surface">
                    {offer.title}
                  </h3>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  {offer.description}
                </p>
              </div>

              <div className="flex items-end justify-between border-t border-outline/30 pt-4 mt-auto">
                <div className="flex flex-col">
                  {offer.code && (
                    <span className="font-headline text-xs uppercase tracking-widest text-primary mb-1">
                      Code: {offer.code}
                    </span>
                  )}
                  {offer.validUntil && (
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                      Valid until: {offer.validUntil}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => window.open(`https://wa.me/9876543210?text=Hi%20Fitness%20Club%2C%20I%20am%20interested%20in%20the%20offer:%20${encodeURIComponent(offer.title)}.`, '_blank')}
                  className="font-headline text-xs uppercase tracking-widest text-on-surface hover:text-primary transition-colors"
                >
                  Claim Offer &rarr;
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Hide Scrollbar CSS in JS block */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
