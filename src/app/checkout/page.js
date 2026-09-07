import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/shared/Footer";
import CheckoutPage from "@/components/cart/CheckoutPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Checkout", {
  description: "Complete your Crochet Corner order.",
  path: "/checkout",
});

export default function CheckoutRoutePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <CheckoutPage />
      </main>
      <Footer />
    </div>
  );
}
