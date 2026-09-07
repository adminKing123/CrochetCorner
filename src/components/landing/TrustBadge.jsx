import TrustBadgeIcon from "@/components/landing/trust-badge-icons";

export default function TrustBadge({ label, icon }) {
  return (
    <div className="trust-badge-item flex flex-col items-center justify-center gap-3 px-2 py-3 sm:px-3 md:py-4">
      <div className="flex h-[90px] w-[90px] shrink-0 items-center justify-center overflow-hidden text-trust-badge-foreground">
        <TrustBadgeIcon type={icon} />
      </div>
      <span className="max-w-[130px] break-words text-center font-body text-[18px] font-normal leading-tight tracking-normal text-trust-badge-foreground">
        {label}
      </span>
    </div>
  );
}
