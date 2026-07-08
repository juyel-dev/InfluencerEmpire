import type { ReactNode } from "react";
import { cn } from "@lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  accentColor?: string;
}

const baseStyle = "rounded-button font-semibold transition-all active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed";

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-4 text-base",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-white/10 text-white hover:bg-white/15 border border-white/10",
  secondary: "bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/10",
  ghost: "bg-transparent text-white/40 hover:text-white/70",
  accent: "text-black font-bold",
};

export function Button({ children, onClick, variant = "secondary", size = "md", disabled, className = "", style, accentColor }: ButtonProps) {
  const accentStyle = variant === "accent" && accentColor
    ? { background: accentColor, ...style }
    : style;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyle, sizeStyles[size], variantStyles[variant], className)}
      style={accentStyle}
    >
      {children}
    </button>
  );
}