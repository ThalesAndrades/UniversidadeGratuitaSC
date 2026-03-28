import { memo } from 'react';

// ── Logo infinito da marca (figura-8 vertical) ──────────────────────────────
interface InfinityLogoProps {
  size?: number;
  color?: string;
  className?: string;
}

export const InfinityLogo = memo(function InfinityLogo({
  size = 40,
  color = '#8FBE3F',
  className = '',
}: InfinityLogoProps) {
  // viewBox 60×110 — dois laços simétricos conectados no centro
  return (
    <svg
      width={size * (60 / 110)}
      height={size}
      viewBox="0 0 60 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M 30 55
           C 46 55 54 43 54 31
           C 54 17 44 6 30 6
           C 16 6 6 17 6 31
           C 6 43 14 55 30 55
           C 46 55 54 67 54 79
           C 54 93 44 104 30 104
           C 16 104 6 93 6 79
           C 6 67 14 55 30 55
           Z"
        stroke={color}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

// ── Quadrados sobrepostos (motivo decorativo) ────────────────────────────────
interface OverlapSquaresProps {
  size?: number;
  colorA?: string;
  colorB?: string;
  className?: string;
}

export const OverlapSquares = memo(function OverlapSquares({
  size = 40,
  colorA = '#3E5715',
  colorB = '#8FBE3F',
  className = '',
}: OverlapSquaresProps) {
  const sq = size;
  const offset = Math.round(size * 0.38);
  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: sq + offset, height: sq + offset }}
      aria-hidden="true"
    >
      <div
        className="absolute top-0 left-0 rounded-sm"
        style={{ width: sq, height: sq, backgroundColor: colorA }}
      />
      <div
        className="absolute rounded-sm"
        style={{
          width: sq,
          height: sq,
          top: offset,
          left: offset,
          backgroundColor: colorB,
        }}
      />
    </div>
  );
});

// ── Bracket-L (canto decorativo) ────────────────────────────────────────────
interface BracketCornerProps {
  size?: number;
  color?: string;
  className?: string;
  rotate?: number;
}

export const BracketCorner = memo(function BracketCorner({
  size = 24,
  color = '#8FBE3F',
  className = '',
  rotate = 0,
}: BracketCornerProps) {
  const t = Math.round(size * 0.22); // espessura do traço
  return (
    <div
      className={`flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        position: 'relative',
        transform: `rotate(${rotate}deg)`,
      }}
      aria-hidden="true"
    >
      {/* traço horizontal superior */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: t,
          backgroundColor: color,
          borderRadius: 2,
        }}
      />
      {/* traço vertical esquerdo */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: t,
          height: '100%',
          backgroundColor: color,
          borderRadius: 2,
        }}
      />
    </div>
  );
});
