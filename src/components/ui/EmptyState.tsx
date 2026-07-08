import type { ReactNode } from "react";
import { cn } from "@lib/cn";
import { EmptyState as EmptyIllustration } from "@assets/illustrations";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  iconClassName?: string;
}

export function EmptyState({ title, description, action, className = "", iconClassName = "" }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-6 space-y-3", className)}>
      <EmptyIllustration className={cn("text-text-muted", iconClassName)} size={80} />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white/80">{title}</p>
        {description && <p className="text-xs text-text-secondary max-w-xs">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}