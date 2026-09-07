import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/shared/Footer";
import AboutPage from "@/components/about/AboutPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Our Story", {
  description: "Our Story — coming soon.",
  path: "/about",
});

export default function AboutRoutePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <AboutPage />
      </main>
      <Footer />
    </div>
  );
}
