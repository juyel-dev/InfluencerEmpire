interface IllustrationProps {
  className?: string;
  size?: number | string;
}

export function ErrorState({ className = "", size = 96 }: IllustrationProps) {
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
        <linearGradient id="error-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="42" stroke="currentColor" strokeWidth="3" fill="url(#error-grad)" />
      <path d="M44 44 L76 76 M76 44 L44 76" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}