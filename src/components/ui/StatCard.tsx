import type { ReactNode } from "react";
import { cn } from "@lib/cn";

interface StatCardProps {
  label: string;
  value: ReactNode;
  color?: string;
  className?: string;
}

export function StatCard({ label, value, color, className = "" }: StatCardProps) {
  return (
    <div className={cn("text-center bg-white/[0.04] rounded-card-xs p-2", className)}>
      <p className="text-text-secondary text-[10px]">{label}</p>
      <p className="font-bold tabular-nums" style={{ color: color ?? "white" }}>{value}</p>
    </div>
  );
}