import Link from "next/link";

export default function HeroSlideImage({ slide, priority = false, className = "" }) {
  return (
    <picture className={`relative block h-full w-full ${className}`}>
      <source media="(max-width: 767px)" srcSet={slide.srcMobile} sizes="100vw" />
      <img
        src={slide.src}
        alt={slide.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </picture>
  );
}

export function HeroSlideWrapper({ slide, children, className = "" }) {
  const redirectUrl = slide.redirectUrl?.trim();

  if (!redirectUrl) {
    return <div className={className}>{children}</div>;
  }

  const isExternal = redirectUrl.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={redirectUrl}
        className={`${className} block`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={redirectUrl} className={`${className} block`}>
      {children}
    </Link>
  );
}
