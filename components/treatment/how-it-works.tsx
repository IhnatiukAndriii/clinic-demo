import Image from "next/image";
import { SectionHeader } from "@/components/ui/section-header";
import { StepCard } from "@/components/ui/step-card";

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="section-pad scroll-mt-4">
      <div className="page-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader id="how-title" title="How it works" intro="Three steps from first look to a written quote." />
          <ol className="mt-10 space-y-8">
            <StepCard step={1} title="Explore">
              Browse the clinics and see where each one is based, which languages the team speaks and what each package includes.
            </StepCard>
            <StepCard step={2} title="Compare">
              Use the table and the cards to line up prices for a single implant and a full arch in the same units.
            </StepCard>
            <StepCard step={3} title="Get your quote">
              Send a short enquiry to the clinics you like. They reply with a written quote for your situation.
            </StepCard>
          </ol>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-panel shadow-lift">
          <Image
            src="/demo/consult.jpg"
            alt="A dentist talking with a patient during a consultation"
            fill
            sizes="(min-width: 1152px) 560px, (min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
