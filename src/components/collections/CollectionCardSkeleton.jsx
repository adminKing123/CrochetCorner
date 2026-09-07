export default function CollectionCardSkeleton({ variant = "default", className = "" }) {
  if (variant === "overlay") {
    return (
      <div
        className={`aspect-square overflow-hidden rounded-2xl bg-peach/10 shadow-md ${className}`}
      >
        <div className="flex h-full flex-col justify-end p-4 md:p-5">
          <div className="h-5 w-3/4 animate-pulse rounded-full bg-white/30" />
          <div className="mt-2 h-4 w-1/3 animate-pulse rounded-full bg-white/20" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-3xl border border-peach/10 bg-white shadow-sm ${className}`}
    >
      <div className="aspect-square animate-pulse bg-peach/10" />
      <div className="space-y-3 p-4 md:p-5">
        <div className="h-5 w-4/5 animate-pulse rounded-full bg-peach/10" />
        <div className="h-4 w-full animate-pulse rounded-full bg-peach/10" />
        <div className="h-4 w-1/3 animate-pulse rounded-full bg-peach/10" />
      </div>
    </div>
  );
}
