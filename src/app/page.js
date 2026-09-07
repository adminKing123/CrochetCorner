import Navbar from "@/components/landing/Navbar";
import HeroCarousel from "@/components/landing/HeroCarousel";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <HeroCarousel />
      </main>
    </div>
  );
}
