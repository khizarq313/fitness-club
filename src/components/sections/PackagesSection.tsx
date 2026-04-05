import { useFirestoreData } from '@/hooks/useFirestoreData';
import {
  CinematicHorizontalSection,
  CinematicRailCard,
} from '@/components/ui/CinematicHorizontalSection';
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
  const sortedPackages = [...packages].sort(
    (a, b) =>
      Number(Boolean(b.isPopular)) - Number(Boolean(a.isPopular)) ||
      a.order - b.order,
  );

  if (loading) {
    return (
      <section id="packages" className="bg-surface py-20 md:py-28 lg:py-32">
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
    <CinematicHorizontalSection
      id="packages"
      desktopBehavior="carousel"
      sectionClassName="bg-surface"
      contentClassName="w-full py-20 md:py-28 lg:py-32"
      railClassName="items-stretch pb-6 md:pb-8"
      header={
        <div className="section-container relative z-10">
          <div className="mb-12 md:mb-16 lg:mb-20">
            <div className="mb-6">
              <span className="mb-4 block font-headline text-xs uppercase tracking-[0.3em] text-primary">
                Membership Tiers
              </span>
              <h2 className="font-display text-4xl uppercase tracking-tight text-on-surface md:text-5xl lg:text-6xl">
                Select Your Plan
              </h2>
            </div>
            <p className="max-w-md font-body text-sm leading-relaxed text-zinc-400">
              Transparent pricing for premium results. Select the tier that
              matches your ambition.
            </p>
          </div>
        </div>
      }
      renderBackground={() => (
        <>
          <div className="absolute top-0 right-0 -translate-y-1/4 pointer-events-none select-none">
            <span className="watermark-text font-display text-[30vw] leading-none">
              ELITE
            </span>
          </div>
          <div className="absolute left-[12%] top-[18%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        </>
      )}
      renderCards={({
        progress,
        isPinned,
        isInView,
        prefersReducedMotion,
      }) =>
        sortedPackages.map((pkg, index) => {
          const isFeatured = Boolean(pkg.isPopular) || index === 0;

          return (
            <CinematicRailCard
              key={pkg.id}
              progress={progress}
              index={index}
              total={sortedPackages.length}
              isPinned={isPinned}
              isInView={isInView}
              prefersReducedMotion={prefersReducedMotion}
              outerClassName="w-full flex-shrink-0"
              innerClassName={`group relative flex h-full flex-col overflow-hidden rounded-sm border p-8 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-500 ease-vault md:p-10 lg:p-12 ${
                isFeatured
                  ? 'z-10 border-primary bg-surface-elevated shadow-[0_0_24px_rgba(245,166,35,0.15)]'
                  : 'border-white/10 bg-surface-high'
              }`}
              hoverScale={1.03}
            >
              {isFeatured && (
                <div className="absolute top-0 right-0 bg-primary px-4 py-1.5 font-headline text-[10px] font-bold uppercase tracking-widest text-on-primary">
                  Most Popular
                </div>
              )}

              <span className="pointer-events-none absolute -right-4 -bottom-8 select-none font-display text-[8rem] leading-none text-white/[0.02] md:text-9xl">
                {pkg.price}
              </span>

              <h3 className="mb-2 font-headline text-lg uppercase tracking-wider text-on-surface md:text-xl">
                {pkg.name}
              </h3>

              <div className="mb-8">
                <span className="font-display text-5xl text-primary md:text-6xl">
                  &#8377;{pkg.price.toLocaleString('en-IN')}
                </span>
                <span className="ml-1 font-body text-sm text-zinc-400">
                  /{pkg.durationDays} Days
                </span>
              </div>

              <ul className="mb-10 space-y-4 border-t border-white/10 pt-8 text-sm text-zinc-400">
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 shrink-0 bg-primary" />
                  Full Gym Access
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 shrink-0 bg-primary" />
                  Premium Equipment
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 shrink-0 bg-primary" />
                  Locker Access
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 shrink-0 bg-primary" />
                  Steam Bath
                </li>
                {isFeatured && (
                  <>
                    <li className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 shrink-0 bg-primary" />
                      Priority Class Booking
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 shrink-0 bg-primary" />
                      Recovery Zone Access
                    </li>
                  </>
                )}
              </ul>

              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/9876543210?text=Hi%20Fitness%20Club%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20package.`,
                    '_blank',
                  )
                }
                className={`mt-auto w-full py-4 font-headline text-sm uppercase tracking-widest transition-all duration-300 ease-vault ${
                  isFeatured
                    ? 'btn-gold'
                    : 'border border-zinc-500 text-white hover:border-primary hover:text-primary'
                }`}
              >
                Select Plan
              </button>
            </CinematicRailCard>
          );
        })
      }
    />
  );
}
