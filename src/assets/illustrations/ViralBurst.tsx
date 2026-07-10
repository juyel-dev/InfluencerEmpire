interface ViralBurstProps {
  className?: string;
  size?: number | string;
  color?: string;
}

export function ViralBurst({ className = "", size = 220, color = "#06b6d4" }: ViralBurstProps) {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const x1 = 60 + Math.cos(angle) * 26;
    const y1 = 60 + Math.sin(angle) * 26;
    const x2 = 60 + Math.cos(angle) * 50;
    const y2 = 60 + Math.sin(angle) * 50;
    return { x1, y1, x2, y2, delay: i * 0.05 };
  });

  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill="none" className={className} aria-hidden>
      <defs>
        <radialGradient id="vb-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vb-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>

      {rays.map((r, i) => (
        <line
          key={i}
          x1={r.x1}
          y1={r.y1}
          x2={r.x2}
          y2={r.y2}
          stroke="url(#vb-ring)"
          strokeWidth="3"
          strokeLinecap="round"
          className="vb-ray"
          style={{ animationDelay: `${r.delay}s` }}
        />
      ))}

      <circle cx="60" cy="60" r="34" fill="url(#vb-core)" className="vb-core" />
      <circle cx="60" cy="60" r="30" stroke="url(#vb-ring)" strokeWidth="2.5" fill="none" className="vb-ring" />
      <text x="60" y="68" textAnchor="middle" fontSize="30" className="vb-emoji">🌟</text>
    </svg>
  );
}
