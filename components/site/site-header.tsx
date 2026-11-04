import Link from "next/link";
import { Button } from "@/components/ui/button";

const TREATMENT = "/treatments/dental-implants";

const links = [
  { href: `${TREATMENT}#compare`, label: "Compare clinics" },
  { href: `${TREATMENT}#how-it-works`, label: "How it works" },
  { href: `${TREATMENT}#faq`, label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-sand-200 bg-white">
      <div className="page-container flex items-center justify-between gap-4 py-4">
        <Link href={TREATMENT} className="whitespace-nowrap font-display text-lg font-semibold text-brand-700 sm:text-xl">
          Implants Vietnam
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink transition-colors duration-150 hover:text-brand-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button href={`${TREATMENT}#clinics`} size="sm">
          Get a free quote
        </Button>
      </div>
    </header>
  );
}
