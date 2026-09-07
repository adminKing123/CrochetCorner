export default function CollectionBadges({ collection, className = "" }) {
  if (!collection.isTrending && !collection.isWeeklyCollection) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {collection.isTrending ? (
        <span className="rounded-full bg-peach/15 px-3 py-1 font-body text-xs font-semibold text-peach-dark">
          Trending
        </span>
      ) : null}
      {collection.isWeeklyCollection ? (
        <span className="rounded-full bg-mint/15 px-3 py-1 font-body text-xs font-semibold text-mint-dark">
          Weekly collection
        </span>
      ) : null}
    </div>
  );
}
