import { siteConfig } from "@/config/site";

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "",
} = {}) {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const url = `${siteConfig.url}${path}`;

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    icons: {
      icon: siteConfig.logo.src,
      apple: siteConfig.logo.src,
    },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: siteConfig.logo.src,
          width: siteConfig.logo.width,
          height: siteConfig.logo.height,
          alt: siteConfig.logo.alt,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description,
      images: [siteConfig.logo.src],
    },
  };
}

export function createPageMetadata(title, options = {}) {
  return createMetadata({ title, ...options });
}
