import { Hero } from '@/components/sections/Hero';
import { QuickAccessGrid } from '@/components/sections/QuickAccessGrid';
import { OffersSection } from '@/components/sections/OffersSection';
import { PackagesSection } from '@/components/sections/PackagesSection';
import { TrainersSection } from '@/components/sections/TrainersSection';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <QuickAccessGrid />
      <OffersSection />
      <PackagesSection />
      <TrainersSection />
      <ReviewsSection />
      <GallerySection />
      <Footer />
    </>
  );
}
