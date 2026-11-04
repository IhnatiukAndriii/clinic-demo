import type { Metadata } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

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
    <html lang="en" className={`${figtree.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col">
        {children}
      </body>
    </html>
  );
}
