interface LogoMarkProps {
  className?: string;
  size?: number | string;
}

export function LogoMark({ className = "", size = 40 }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-label="Influencer Empire"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="36" height="36" rx="10" stroke="url(#logo-grad)" strokeWidth="2.5" fill="none" />
      {/* Stylized "IE" monogram */}
      <path d="M16 16 L16 32 M16 16 L24 16 M16 24 L22 24" stroke="url(#logo-grad)" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 16 L28 24 L32 32 M28 24 L34 24" stroke="url(#logo-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}