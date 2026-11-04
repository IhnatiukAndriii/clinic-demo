import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";

export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" className="section-pad relative isolate overflow-hidden bg-brand-900">
      <Image
        src="/demo/city-night.jpg"
        alt="A city skyline at night with a tall tower"
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-brand-900/80" />
      <div className="page-container flex flex-col items-center text-center">
        <SectionHeader
          id="cta-title"
          align="center"
          tone="dark"
          title="Ready to compare your options?"
          intro="Pick a clinic and send a short enquiry. There is no charge for a quote."
        />
        <Button href="#clinics" size="lg" className="mt-10">
          Get a free quote
        </Button>
      </div>
    </section>
  );
}
