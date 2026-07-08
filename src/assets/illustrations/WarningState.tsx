interface IllustrationProps {
  className?: string;
  size?: number | string;
}

export function WarningState({ className = "", size = 96 }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="warning-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <path d="M60 24 L100 92 L20 92 Z" stroke="currentColor" strokeWidth="3" fill="url(#warning-grad)" strokeLinejoin="round" />
      <rect x="55" y="48" width="10" height="26" rx="5" fill="currentColor" />
      <circle cx="60" cy="84" r="5" fill="currentColor" />
    </svg>
  );
}