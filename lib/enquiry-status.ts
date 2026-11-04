export const STATUSES = ["new", "contacted", "closed"] as const;
export type EnquiryStatus = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

export function isStatus(value: unknown): value is EnquiryStatus {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}
