export type Expression = "neutral" | "happy" | "sad" | "surprised" | "angry";
export type Accessory = "none" | "glasses" | "headphones" | "hat" | "earrings";

export interface CharacterConfig {
  skin: string;
  hair: string;
  hairStyle: "short" | "long" | "bun" | "bald" | "curly";
  accessory: Accessory;
  accent: string;
}

export const NPC_PORTRAITS: Record<string, CharacterConfig> = {
  zara: { skin: "#e8b89a", hair: "#2d2438", hairStyle: "long", accessory: "headphones", accent: "#d946ef" },
  leo: { skin: "#d99a76", hair: "#1a1a1a", hairStyle: "curly", accessory: "none", accent: "#3b82f6" },
  maya: { skin: "#f0c9a8", hair: "#6d4c33", hairStyle: "short", accessory: "glasses", accent: "#10b981" },
  omar: { skin: "#c88a5e", hair: "#0f0f0f", hairStyle: "bald", accessory: "hat", accent: "#f59e0b" },
  ava: { skin: "#e2b48c", hair: "#9b6bd6", hairStyle: "bun", accessory: "earrings", accent: "#d946ef" },
};

interface CharacterPortraitProps {
  config: CharacterConfig;
  expression?: Expression;
  className?: string;
  size?: number | string;
}

function Hair({ style, color }: { style: CharacterConfig["hairStyle"]; color: string }) {
  switch (style) {
    case "long":
      return <path d="M22 50 Q22 18 50 18 Q78 18 78 50 L78 72 Q72 58 68 72 L68 40 Q50 30 32 40 L32 72 Q28 58 22 72 Z" fill={color} />;
    case "short":
      return <path d="M26 46 Q26 20 50 20 Q74 20 74 46 Q66 36 50 36 Q34 36 26 46 Z" fill={color} />;
    case "curly":
      return (
        <g fill={color}>
          <circle cx="34" cy="30" r="14" />
          <circle cx="50" cy="22" r="15" />
          <circle cx="66" cy="30" r="14" />
          <rect x="26" y="28" width="48" height="20" rx="10" />
        </g>
      );
    case "bun":
      return (
        <g fill={color}>
          <circle cx="50" cy="14" r="10" />
          <path d="M28 44 Q28 22 50 22 Q72 22 72 44 Q62 34 50 34 Q38 34 28 44 Z" />
        </g>
      );
    case "bald":
      return <path d="M32 40 Q32 26 50 26 Q68 26 68 40 Q58 34 50 34 Q42 34 32 40 Z" fill={color} opacity="0.3" />;
  }
}

function Eyes({ expression }: { expression: Expression }) {
  const eyeY = 52;
  switch (expression) {
    case "happy":
      return (
        <g stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M36 52 Q42 46 48 52" />
          <path d="M52 52 Q58 46 64 52" />
        </g>
      );
    case "surprised":
      return (
        <g fill="#1a1a1a">
          <circle cx="42" cy={eyeY} r="4" />
          <circle cx="58" cy={eyeY} r="4" />
        </g>
      );
    case "angry":
      return (
        <g stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M36 49 L48 54" />
          <path d="M64 49 L52 54" />
        </g>
      );
    case "sad":
      return (
        <g stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M36 54 Q42 50 48 54" />
          <path d="M52 54 Q58 50 64 54" />
        </g>
      );
    default:
      return (
        <g fill="#1a1a1a">
          <circle cx="42" cy={eyeY} r="2.5" />
          <circle cx="58" cy={eyeY} r="2.5" />
        </g>
      );
  }
}

function Mouth({ expression }: { expression: Expression }) {
  const mouthY = 68;
  switch (expression) {
    case "happy":
      return <path d="M40 66 Q50 76 60 66" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    case "sad":
      return <path d="M40 70 Q50 62 60 70" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    case "surprised":
      return <ellipse cx="50" cy={mouthY} rx="5" ry="7" fill="#1a1a1a" />;
    case "angry":
      return <path d="M38 70 Q50 64 62 70" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    default:
      return <path d="M42 68 Q50 72 58 68" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  }
}

function AccessoryLayer({ accessory, accent }: { accessory: Accessory; accent: string }) {
  switch (accessory) {
    case "glasses":
      return (
        <g stroke={accent} strokeWidth="2" fill="none">
          <rect x="32" y="48" width="14" height="10" rx="3" />
          <rect x="54" y="48" width="14" height="10" rx="3" />
          <path d="M46 52 L54 52" />
        </g>
      );
    case "headphones":
      return (
        <g stroke={accent} strokeWidth="3" fill="none">
          <path d="M28 50 Q28 22 50 22 Q72 22 72 50" />
          <rect x="24" y="48" width="8" height="14" rx="4" fill={accent} stroke="none" />
          <rect x="68" y="48" width="8" height="14" rx="4" fill={accent} stroke="none" />
        </g>
      );
    case "hat":
      return (
        <g fill={accent}>
          <rect x="26" y="40" width="48" height="6" rx="3" />
          <path d="M34 40 Q34 22 50 22 Q66 22 66 40 Z" />
        </g>
      );
    case "earrings":
      return (
        <g fill={accent}>
          <circle cx="30" cy="64" r="2.5" />
          <circle cx="70" cy="64" r="2.5" />
        </g>
      );
    default:
      return null;
  }
}

import { useId } from "react";

export function CharacterPortrait({ config, expression = "neutral", className = "", size = 64 }: CharacterPortraitProps) {
  const gradientId = useId();
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={config.accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={config.accent} stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#${gradientId})`} />
      {/* Neck */}
      <rect x="44" y="70" width="12" height="16" rx="4" fill={config.skin} />
      {/* Face */}
      <ellipse cx="50" cy="52" rx="22" ry="24" fill={config.skin} />
      <Hair style={config.hairStyle} color={config.hair} />
      <Eyes expression={expression} />
      <Mouth expression={expression} />
      <AccessoryLayer accessory={config.accessory} accent={config.accent} />
    </svg>
  );
}