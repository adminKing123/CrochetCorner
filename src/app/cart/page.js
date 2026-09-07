import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/shared/Footer";
import CartPage from "@/components/cart/CartPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Cart", {
  description: "Review items in your Crochet Corner cart.",
  path: "/cart",
});

export default function CartRoutePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <CartPage />
      </main>
      <Footer />
    </div>
  );
}
