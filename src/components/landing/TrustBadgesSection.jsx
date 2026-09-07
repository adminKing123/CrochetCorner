import TrustBadge from "@/components/landing/TrustBadge";
import { trustBadges } from "@/lib/landing/trust-badges";

export default function TrustBadgesSection() {
  return (
    <section aria-label="Why shop with us" className="trust-badges-bar">
      <div className="trust-badges-inner mx-auto w-full max-w-6xl">
        {trustBadges.map((badge) => (
          <TrustBadge key={badge.id} label={badge.label} icon={badge.icon} />
        ))}
      </div>
    </section>
  );
}
