import type { ReactNode } from "react";

interface Props {
  title: string;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  id?: string;
}

export function SectionHeader({ title, intro, align = "left", tone = "light", as: Heading = "h2", id }: Props) {
  const centered = align === "center";
  const dark = tone === "dark";
  return (
    <div className={`max-w-2xl ${centered ? "mx-auto text-center" : ""}`}>
      <Heading id={id} className={`text-heading ${dark ? "text-white" : "text-brand-900"}`}>
        {title}
      </Heading>
      {intro ? (
        <p className={`mt-4 text-lead ${dark ? "text-brand-100" : "text-muted"}`}>{intro}</p>
      ) : null}
    </div>
  );
}
