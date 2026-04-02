import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Package } from '@/types';

const PACKAGE_CONDITIONS = [
  { field: 'isActive', operator: '==' as const, value: true },
];

export function PackagesSection() {
  const { data: packages, loading } = useFirestoreData<Package>(
    'packages',
    PACKAGE_CONDITIONS,
    'order',
  );
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const prefersReducedMotion = useReducedMotion();

  if (loading) {
    return (
      <section id="packages" className="py-32 bg-surface">
        <div className="section-container text-center">
          <div className="w-10 h-10 border-2 border-outline border-t-primary animate-spin mx-auto" />
          <p className="mt-4 font-headline text-sm uppercase tracking-widest text-on-surface-variant">
            Loading Tiers
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="packages" className="py-24 md:py-32 bg-surface relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none select-none -translate-y-1/4">
        <span className="watermark-text font-display text-[30vw] leading-none">
          ELITE
        </span>
      </div>

      <div className="section-container relative z-10" ref={ref}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-6">
          <div>
            <span className="font-headline text-primary tracking-[0.3em] uppercase text-xs mb-4 block">
              Membership Tiers
            </span>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight uppercase text-on-surface">
              Select Your Plan
            </h2>
          </div>
          <p className="text-on-surface-variant max-w-sm font-body text-sm leading-relaxed">
            Transparent pricing for premium results. Select the tier that
            matches your ambition.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {packages.map((pkg, index) => {
            const isFeatured = index === 1;

            return (
              <motion.div
                key={pkg.id}
                className={`p-8 md:p-12 relative overflow-hidden group transition-all duration-500 ease-vault ${
                  isFeatured
                    ? 'bg-surface-elevated border-t-2 border-primary md:scale-105 z-10 shadow-[0_0_24px_rgba(245,166,35,0.15)]'
                    : 'bg-surface-high border border-outline hover:border-primary/30'
                }`}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: index * 0.12,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute top-0 right-0 bg-primary text-on-primary px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase font-headline">
                    Most Popular
                  </div>
                )}

                {/* Ghost Price Watermark */}
                <span className="absolute -right-4 -bottom-8 font-display text-[8rem] md:text-9xl text-white/[0.02] select-none pointer-events-none leading-none">
                  {pkg.price}
                </span>

                {/* Package Name */}
                <h3 className="font-headline text-xl md:text-2xl mb-2 text-on-surface uppercase tracking-wider">
                  {pkg.name}
                </h3>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-primary text-5xl md:text-6xl font-display">
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-body text-on-surface-variant ml-1">
                    /{pkg.durationDays} Days
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-10 text-sm text-on-surface-variant border-t border-outline/50 pt-8">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-primary shrink-0" />
                    Full Gym Access
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-primary shrink-0" />
                    Premium Equipment
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-primary shrink-0" />
                    Locker Access
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-primary shrink-0" />
                    Steam Bath
                  </li>
                  {isFeatured && (
                    <>
                      <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-primary shrink-0" />
                        Priority Class Booking
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-primary shrink-0" />
                        Recovery Zone Access
                      </li>
                    </>
                  )}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => window.open(`https://wa.me/9876543210?text=Hi%20Fitness%20Club%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20package.`, '_blank')}
                  className={`w-full py-4 text-sm font-headline tracking-widest uppercase transition-all duration-300 ease-vault ${
                    isFeatured
                      ? 'btn-gold'
                      : 'border border-zinc-500 text-white hover:border-primary hover:text-primary'
                  }`}
                >
                  Select Plan
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
