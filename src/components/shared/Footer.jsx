import Image from "next/image";
import Link from "next/link";
import { authRoutes, contactInfo, footerLinks, siteConfig } from "@/config/site";
import { getContactEmail } from "@/lib/site/contact";

export default function Footer() {
  const year = new Date().getFullYear();
  const contactEmail = getContactEmail();

  return (
    <footer className="border-t border-peach/15 bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          <div>
            <Link href={authRoutes.home} className="inline-flex items-center gap-3">
              <Image
                src={siteConfig.logo.src}
                alt={siteConfig.logo.alt}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-display text-lg font-bold text-charcoal">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          <nav aria-label="Footer links" className="flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body text-sm font-semibold text-charcoal/75 transition hover:text-mint"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div>
            <h3 className="font-body text-sm font-bold uppercase tracking-widest text-peach">
              Contact Us
            </h3>
            <ul className="mt-3 space-y-2 font-body text-sm text-charcoal/75">
              {contactEmail ? (
                <li>
                  <a href={`mailto:${contactEmail}`} className="transition hover:text-mint">
                    {contactEmail}
                  </a>
                </li>
              ) : null}
              {contactInfo.location ? <li>{contactInfo.location}</li> : null}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-peach/10 pt-6">
          <p className="text-center font-body text-sm text-charcoal/55 md:text-left">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
