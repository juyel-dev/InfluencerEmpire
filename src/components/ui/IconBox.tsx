import type { ReactNode } from "react";
import { cn } from "@lib/cn";

type BoxSize = "sm" | "md" | "lg";

interface IconBoxProps {
  children: ReactNode;
  size?: BoxSize;
  color?: string;
  className?: string;
}

const sizeStyles: Record<BoxSize, string> = {
  sm: "w-8 h-8 rounded-lg text-sm",
  md: "w-12 h-12 rounded-xl text-2xl",
  lg: "w-14 h-14 rounded-2xl text-3xl",
};

export function IconBox({ children, size = "md", color, className = "" }: IconBoxProps) {
  return (
    <div
      className={cn("flex items-center justify-center border border-white/10", sizeStyles[size], className)}
      style={{ background: color ? `${color}22` : "rgba(255,255,255,0.04)" }}
    >
      {children}
    </div>
  );
}