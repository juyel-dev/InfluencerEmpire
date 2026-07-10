import type { LocationId } from "@game/types";

interface LocationSceneProps {
  id: LocationId;
  className?: string;
  size?: number | string;
  color?: string;
}

export function LocationScene({ id, className = "", size = 120, color = "#06b6d4" }: LocationSceneProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    fill: "none",
    className,
    "aria-hidden": true,
  } as const;

  const stroke = { stroke: color, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (id) {
    case "home":
      return (
        <svg {...common}>
          <path d="M20 50 L50 26 L80 50" {...stroke} />
          <path d="M28 48 V78 H72 V48" {...stroke} />
          <rect x="44" y="60" width="14" height="18" {...stroke} />
          <circle cx="50" cy="22" r="4" fill={color} />
        </svg>
      );
    case "studio":
      return (
        <svg {...common}>
          <rect x="26" y="34" width="48" height="34" rx="6" {...stroke} />
          <circle cx="50" cy="51" r="12" {...stroke} />
          <path d="M38 34 L38 26 H62 L62 34" {...stroke} />
          <circle cx="74" cy="30" r="3" fill={color} />
        </svg>
      );
    case "gym":
      return (
        <svg {...common}>
          <rect x="30" y="26" width="10" height="48" rx="5" {...stroke} />
          <rect x="60" y="26" width="10" height="48" rx="5" {...stroke} />
          <line x1="30" y1="40" x2="70" y2="40" {...stroke} />
          <line x1="30" y1="60" x2="70" y2="60" {...stroke} />
        </svg>
      );
    case "cafe":
      return (
        <svg {...common}>
          <path d="M28 42 H64 V66 H28 Z" {...stroke} />
          <path d="M64 48 H72 V60 H64" {...stroke} />
          <path d="M34 34 C34 28 44 28 44 34" {...stroke} />
          <path d="M48 34 C48 28 58 28 58 34" {...stroke} />
        </svg>
      );
    case "club":
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="22" {...stroke} />
          <circle cx="50" cy="50" r="10" {...stroke} />
          <path d="M50 8 V18 M50 82 V92 M8 50 H18 M82 50 H92 M20 20 L27 27 M80 20 L73 27 M20 80 L27 73 M80 80 L73 73" {...stroke} />
        </svg>
      );
    case "mall":
      return (
        <svg {...common}>
          <path d="M34 30 H66 L72 42 V74 H28 V42 Z" {...stroke} />
          <path d="M42 42 H58 V74 H42 Z" {...stroke} />
          <path d="M40 30 C40 22 60 22 60 30" {...stroke} />
        </svg>
      );
    default:
      return null;
  }
}
