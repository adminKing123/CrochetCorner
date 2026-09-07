import Navbar from "@/components/landing/Navbar";
import HeroCarousel from "@/components/landing/HeroCarousel";
import BestSellersSection from "@/components/landing/BestSellersSection";
import TrustBadgesSection from "@/components/landing/TrustBadgesSection";
import TrendingCollectionsSection from "@/components/landing/TrendingCollectionsSection";
import WeeklyCollectionSection from "@/components/landing/WeeklyCollectionSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <HeroCarousel />
        <BestSellersSection />
        <TrustBadgesSection />
        <TrendingCollectionsSection />
        <WeeklyCollectionSection />
      </main>
    </div>
  );
}
