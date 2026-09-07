import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}
