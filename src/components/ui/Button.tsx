import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  variant: "solid" | "outline";
  icon?: ReactNode;
  children: ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">;

const variants = {
  solid: "bg-fg text-bg hover:bg-fg/85",
  outline: "border border-white/25 text-fg hover:bg-white/10",
};

export function Button({ href, variant, icon, children, className = "", ...rest }: ButtonProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
      {icon}
    </a>
  );
}
