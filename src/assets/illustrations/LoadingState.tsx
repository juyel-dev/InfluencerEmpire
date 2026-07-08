interface IllustrationProps {
  className?: string;
  size?: number | string;
}

export function LoadingState({ className = "", size = 96 }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="40" stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
      <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="60 200" className="animate-spin" style={{ transformOrigin: "center" }} />
    </svg>
  );
}