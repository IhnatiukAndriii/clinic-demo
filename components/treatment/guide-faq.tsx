import Image from "next/image";
import { FaqItem } from "@/components/ui/faq-item";
import { SectionHeader } from "@/components/ui/section-header";

// Sample text: generic, factual placeholder copy for the demo. It makes no
// medical claims and promises no outcomes. Replace it with reviewed content.

const CHECKLIST = [
  "Ask for a written quote that lists every item, so you can compare like with like.",
  "Check what the price includes, such as scans, the crown, transfers and follow-up visits.",
  "Ask how many visits are needed and how long each stay would be.",
  "Ask who to contact at home if you have questions after you return.",
  "Ask the clinic to explain the qualifications of the dentist who would treat you.",
];

const FAQS = [
  {
    question: "How long would I need to stay in Vietnam?",
    answer:
      "It depends on your treatment plan. Some plans need more than one trip, so ask each clinic for a timeline based on your situation.",
  },
  {
    question: "What does the quote include?",
    answer:
      "Each clinic lists its inclusions on its card and profile. The written quote confirms the exact items and prices that apply to you.",
  },
  {
    question: "Do I need to send scans or photos first?",
    answer:
      "Many clinics ask for recent dental records or x-rays so they can prepare a quote. The clinic will tell you what it needs.",
  },
  {
    question: "Are the prices final?",
    answer:
      "The prices shown are starting points. A dentist assesses your case before confirming a final price in writing.",
  },
  {
    question: "How do I contact a clinic?",
    answer:
      "Use the quote form on a clinic's page and choose the way you prefer to be contacted: WhatsApp, Viber, Telegram or email.",
  },
];

export function GuideFaq() {
  return (
    <section aria-labelledby="guide-title" className="section-pad">
      <div className="page-container grid gap-16 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-panel shadow-card">
            <Image
              src="/demo/guide-banner.jpg"
              alt="A stethoscope resting on a desk"
              fill
              sizes="(min-width: 1152px) 560px, (min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="mt-10">
            <SectionHeader id="guide-title" title="Choosing an implant clinic abroad" intro="Questions worth asking before you decide." />
          </div>
          <ul className="mt-8 space-y-4">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="font-semibold text-brand-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div id="faq" className="scroll-mt-4">
          <SectionHeader title="Frequently asked questions" />
          <div className="mt-8">
            {FAQS.map((faq) => (
              <FaqItem key={faq.question} question={faq.question}>
                {faq.answer}
              </FaqItem>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
