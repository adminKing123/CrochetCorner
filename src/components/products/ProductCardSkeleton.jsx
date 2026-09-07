export default function ProductCardSkeleton({ imageAspectRatio = "2/3" }) {
  const aspectClass = imageAspectRatio === "1/1" ? "aspect-square" : "aspect-[2/3]";

  return (
    <div className="overflow-hidden rounded-3xl border border-peach/10 bg-white shadow-sm">
      <div className={`${aspectClass} animate-pulse bg-peach/10`} />
      <div className="space-y-3 p-4 md:p-5">
        <div className="h-5 w-4/5 animate-pulse rounded-full bg-peach/10" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-peach/10" />
      </div>
    </div>
  );
}
