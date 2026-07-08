interface IllustrationProps {
  className?: string;
  size?: number | string;
}

export function EmptyState({ className = "", size = 96 }: IllustrationProps) {
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
        <linearGradient id="empty-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* Empty box */}
      <path d="M30 42 L60 28 L90 42 L90 82 L60 96 L30 82 Z" stroke="currentColor" strokeWidth="2.5" fill="url(#empty-grad)" strokeLinejoin="round" />
      <path d="M30 42 L60 56 L90 42 M60 56 L60 96" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity="0.4" />
      {/* Floating sparkle */}
      <circle cx="78" cy="34" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="42" cy="104" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}