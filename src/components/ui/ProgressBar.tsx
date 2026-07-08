import { cn } from "@lib/cn";

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  className?: string;
  height?: "sm" | "md";
}

const heightStyles = {
  sm: "h-1.5",
  md: "h-2",
};

export function ProgressBar({ value, max, color, label, showValue = true, className = "", height = "md" }: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className={cn(className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          {label && <span className="text-text-secondary">{label}</span>}
          {showValue && <span className="font-semibold" style={{ color: color ?? "#06b6d4" }}>{value}/{max}</span>}
        </div>
      )}
      <div className={cn("w-full rounded-full bg-white/5 overflow-hidden", heightStyles[height])}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: color ? `linear-gradient(90deg, ${color}, ${color}cc)` : "linear-gradient(90deg, #06b6d4, #10b981)",
          }}
        />
      </div>
    </div>
  );
}