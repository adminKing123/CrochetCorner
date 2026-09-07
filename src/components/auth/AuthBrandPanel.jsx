import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function AuthBrandPanel() {
  const { logo, name, tagline } = siteConfig;

  return (
    <aside className="auth-panel-left relative flex flex-col items-center justify-center overflow-hidden px-8 py-12 text-center lg:px-14 lg:py-16">
      <div className="auth-blob auth-blob-1" aria-hidden="true" />
      <div className="auth-blob auth-blob-2" aria-hidden="true" />
      <div className="auth-blob auth-blob-3" aria-hidden="true" />

      <div className="relative z-10 flex max-w-md flex-col items-center">
        <Image
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          className="mb-8 rounded-full drop-shadow-lg"
          priority
        />

        <h1 className="font-display text-4xl font-bold leading-tight text-white drop-shadow-sm sm:text-5xl">
          {name}
        </h1>

        <p className="mt-6 font-body text-lg italic leading-relaxed text-white/95 sm:text-xl">
          {tagline}
        </p>
      </div>
    </aside>
  );
}
