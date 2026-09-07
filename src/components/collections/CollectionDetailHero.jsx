import CollectionBadges from "@/components/collections/CollectionBadges";
import ProductImage from "@/components/products/ProductImage";

export default function CollectionDetailHero({ collection }) {
  const productCount = collection.productIds.length;

  return (
    <header className="grid items-start gap-8 md:gap-10 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:items-center lg:gap-12">
      <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-3xl shadow-md sm:max-w-[300px] lg:mx-0 lg:max-w-none">
        <ProductImage
          src={collection.imagePortrait || collection.imageSquare}
          alt={collection.title}
          aspectRatio="2/3"
          className="rounded-3xl"
          priority
        />
      </div>

      <div className="flex min-w-0 flex-col gap-4 md:gap-5">
        <CollectionBadges collection={collection} />

        <div>
          <p className="mb-2 font-body text-sm font-bold uppercase tracking-widest text-peach">
            Collection
          </p>
          <h1 className="font-display text-3xl font-bold text-charcoal md:text-4xl">
            {collection.title}
          </h1>
        </div>

        {collection.description ? (
          <p className="max-w-2xl font-body text-base leading-relaxed text-charcoal/70 md:text-lg">
            {collection.description}
          </p>
        ) : null}

        <p className="font-body text-sm font-semibold text-charcoal/55">
          {productCount} product{productCount === 1 ? "" : "s"} in this collection
        </p>
      </div>
    </header>
  );
}
