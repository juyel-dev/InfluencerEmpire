import { cn } from "@lib/cn";
import { LoadingState as LoadingIllustration } from "@assets/illustrations";

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: number;
}

export function LoadingState({ message = "Loading...", className = "", size = 64 }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-6 space-y-4", className)}>
      <LoadingIllustration className="text-accent-cyan" size={size} />
      <p className="text-sm text-text-secondary font-mono animate-pulse">{message}</p>
    </div>
  );
}