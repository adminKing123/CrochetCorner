import Image from "next/image";
import Link from "next/link";
import { authRoutes, landingCopy, siteConfig } from "@/config/site";

export default function Hero() {
  const { hero } = landingCopy;

  return (
    <section className="landing-hero relative overflow-hidden">
      <div className="auth-blob auth-blob-1 opacity-30" aria-hidden="true" />
      <div className="auth-blob auth-blob-2 opacity-30" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-20 text-center md:flex-row md:py-28 md:text-left">
        <div className="flex-1">
          <h1 className="font-display text-4xl font-bold leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-xl font-body text-lg leading-relaxed text-charcoal/70">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link
              href={authRoutes.signup}
              className="rounded-2xl bg-peach px-6 py-3.5 font-body text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-peach-dark hover:shadow-lg"
            >
              {hero.primaryCta}
            </Link>
            <Link
              href={authRoutes.login}
              className="rounded-2xl border-2 border-peach/25 bg-white px-6 py-3.5 font-body text-sm font-bold text-charcoal transition hover:border-mint/40 hover:bg-mint/5"
            >
              {hero.secondaryCta}
            </Link>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-center">
          <Image
            src={siteConfig.logo.src}
            alt={siteConfig.logo.alt}
            width={280}
            height={280}
            className="rounded-full drop-shadow-xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
