import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dental implants in Vietnam",
    template: "%s | Dental implants in Vietnam",
  },
  description:
    "Compare dental implant clinics in Ho Chi Minh City, Hanoi and Da Nang with clear prices and what each package includes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${figtree.variable} ${bricolage.variable}`}>
      <body className="flex min-h-screen flex-col">
        <header className="border-b border-line bg-surface">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Link href="/" className="font-display text-xl font-semibold text-accent">
              Implants Vietnam
            </Link>
            <Link href="/treatments/dental-implants" className="text-sm text-muted hover:text-ink">
              Dental implants
            </Link>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-line bg-surface">
          <p className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted">
            Demo directory. Clinics and prices shown are fictional examples.
          </p>
        </footer>
      </body>
    </html>
  );
}
