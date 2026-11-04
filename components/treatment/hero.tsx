import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HeroFacts } from "./hero-facts";

interface Props {
  title: string;
  summary: string;
}

export function Hero({ title, summary }: Props) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-brand-900 text-white">
      <Image
        src="/demo/hero.jpg"
        alt="A dental treatment room with a patient chair and overhead light"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900/90 via-brand-900/70 to-brand-900/30" />
      <div className="page-container pt-20 sm:pt-28">
        <h1 id="hero-title" className="max-w-3xl text-display">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-lead text-brand-50">{summary}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="#clinics" size="lg">
            Get a free quote
          </Button>
          <Button href="#compare" size="lg" variant="onDark">
            Compare clinics
          </Button>
        </div>
        <HeroFacts />
      </div>
    </section>
  );
}
