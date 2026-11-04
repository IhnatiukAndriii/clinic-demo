import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  // Coral is reserved for the one primary call to action in a view.
  primary: "bg-coral-500 text-white hover:bg-coral-600",
  secondary: "bg-brand-600 text-white hover:bg-brand-700",
  outline: "border-2 border-brand-600 text-brand-700 hover:bg-brand-50",
  ghost: "text-brand-700 hover:bg-brand-50",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function buttonClasses({ variant = "primary", size = "md", className = "" }: StyleProps): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
}

type LinkButtonProps = StyleProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">;
type NativeButtonProps = StyleProps & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: LinkButtonProps | NativeButtonProps) {
  if (props.href !== undefined) {
    const { variant, size, className, ...rest } = props;
    return <Link {...rest} className={buttonClasses({ variant, size, className })} />;
  }
  const { variant, size, className, type = "button", ...rest } = props;
  return <button {...rest} type={type} className={buttonClasses({ variant, size, className })} />;
}
