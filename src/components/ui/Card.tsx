import type { ReactNode } from "react";
import { cn } from "@lib/cn";

type CardVariant = "default" | "glass" | "surface" | "flat";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  as?: "div" | "button";
  onClick?: () => void;
  style?: React.CSSProperties;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white/[0.06] backdrop-blur-2xl border border-white/10",
  glass: "bg-white/[0.04] backdrop-blur-xl border border-white/10",
  surface: "bg-white/[0.04] border border-white/5",
  flat: "bg-white/[0.03] border border-white/5",
};

export function Card({ children, variant = "default", className = "", as: Tag = "div", onClick, style }: CardProps) {
  const cls = cn("rounded-card", variantStyles[variant], className);
  if (Tag === "button") {
    return (
      <button type="button" onClick={onClick} className={cn(cls, "cursor-pointer hover:bg-white/[0.08] active:scale-[0.98] transition-all")} style={style}>
        {children}
      </button>
    );
  }
  return <div className={cls} style={style}>{children}</div>;
}