import Navbar from "@/components/landing/Navbar";
import HeroCarousel from "@/components/landing/HeroCarousel";
import BestSellersSection from "@/components/landing/BestSellersSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <HeroCarousel />
        <BestSellersSection />
      </main>
    </div>
  );
}
