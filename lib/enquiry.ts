export const CHANNELS = ["whatsapp", "viber", "telegram", "email"] as const;
export type Channel = (typeof CHANNELS)[number];

export const CHANNEL_LABELS: Record<Channel, string> = {
  whatsapp: "WhatsApp",
  viber: "Viber",
  telegram: "Telegram",
  email: "Email",
};

export interface EnquiryInput {
  clinicId: string;
  treatmentId: string;
  name: string;
  email: string;
  phone: string;
  channel: Channel;
  message: string;
}

export type EnquiryErrors = Partial<Record<keyof EnquiryInput, string>>;

export type EnquiryResult =
  | { ok: true; value: EnquiryInput }
  | { ok: false; errors: EnquiryErrors; value: Partial<EnquiryInput> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+()\d\s-]{6,25}$/;

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function parseEnquiry(form: FormData): EnquiryResult {
  const channel = text(form, "channel");
  const value = {
    clinicId: text(form, "clinicId"),
    treatmentId: text(form, "treatmentId"),
    name: text(form, "name"),
    email: text(form, "email"),
    phone: text(form, "phone"),
    channel: channel as Channel,
    message: text(form, "message"),
  };

  const errors: EnquiryErrors = {};
  if (!value.clinicId) errors.clinicId = "This clinic could not be found. Reload the page and try again.";
  if (!value.treatmentId) errors.treatmentId = "This treatment could not be found. Reload the page and try again.";
  if (value.name.length < 2) errors.name = "Enter your name.";
  if (value.name.length > 120) errors.name = "Use 120 characters or fewer for your name.";
  if (!EMAIL.test(value.email)) errors.email = "Enter a valid email address, like name@example.com.";
  if (value.phone && !PHONE.test(value.phone)) errors.phone = "Enter a phone number using digits, spaces, + or -.";
  if (!CHANNELS.includes(value.channel)) errors.channel = "Choose how you would like to be contacted.";
  if (value.message.length < 10) errors.message = "Tell the clinic a little about what you need (at least 10 characters).";
  if (value.message.length > 2000) errors.message = "Use 2000 characters or fewer for your message.";

  if (Object.keys(errors).length > 0) return { ok: false, errors, value };
  return { ok: true, value };
}
