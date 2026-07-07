import type { ReactNode } from "react";

interface StatDisplayProps {
  label: string;
  value: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
}

export function StatDisplay({ label, value, icon, trend }: StatDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="shrink-0 text-lg opacity-60">{icon}</span>}
      <div className="min-w-0">
        <p className="text-xs text-white/50 font-medium uppercase tracking-wider truncate">{label}</p>
        <p className="text-lg font-semibold tabular-nums tracking-tight text-white">
          {value}
          {trend && (
            <span className={`ml-1 text-xs font-medium ${trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-white/40"}`}>
              {trend === "up" && "↑"}
              {trend === "down" && "↓"}
              {trend === "neutral" && "→"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
