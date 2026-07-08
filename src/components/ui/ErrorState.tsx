import type { ReactNode } from "react";
import { cn } from "@lib/cn";
import { ErrorState as ErrorIllustration } from "@assets/illustrations";

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({ title = "Something went wrong", message, action, className = "" }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-6 space-y-3", className)}>
      <ErrorIllustration className="text-error" size={80} />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white/80">{title}</p>
        {message && <p className="text-xs text-text-secondary max-w-xs">{message}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}