import { redirect } from "next/navigation";
import HeroCarouselSetup from "@/components/admin/hero-carousel/HeroCarouselSetup";
import { authRoutes } from "@/config/site";
import { isAdminEmailConfigured } from "@/lib/auth/admin";

export default function AdminHeroCarouselPage() {
  if (!isAdminEmailConfigured()) {
    redirect(authRoutes.home);
  }

  return <HeroCarouselSetup />;
}
