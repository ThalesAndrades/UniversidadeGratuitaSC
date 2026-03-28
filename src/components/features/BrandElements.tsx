import { memo } from 'react';

// ── Chapéu de formatura (Universidade Gratuita) ─────────────────────────────
interface GraduationCapLogoProps {
  size?: number;
  color?: string;
  className?: string;
}

export const GraduationCapLogo = memo(function GraduationCapLogo({
  size = 48,
  color = '#8FBE3F',
  className = '',
}: GraduationCapLogoProps) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.85)}
      viewBox="0 0 80 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Tabuleiro (diamond) */}
      <polygon points="40,4 76,20 40,36 4,20" fill={color} />
      {/* Destaque central no tabuleiro */}
      <polygon points="40,10 68,22 40,34 12,22" fill={color} fillOpacity="0.25" />
      {/* Corpo do capelo */}
      <path
        d="M14 24 L14 44 Q14 54 40 54 Q66 54 66 44 L66 24"
        fill={color}
        fillOpacity="0.18"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cordão do borla */}
      <path d="M76 20 L76 38" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Borla */}
      <circle cx="76" cy="42" r="4.5" fill={color} />
      <line x1="74" y1="46" x2="71" y2="57" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="76" y1="46.5" x2="76" y2="59" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="78" y1="46" x2="81" y2="57" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
});

// ── Constelação ACAFE (rede de universidades) ────────────────────────────────
interface AcafeConstellationProps {
  size?: number;
  color?: string;
  className?: string;
}

export const AcafeConstellation = memo(function AcafeConstellation({
  size = 40,
  color = '#8FBE3F',
  className = '',
}: AcafeConstellationProps) {
  // Hexagonal network — 1 nó central + 6 externos (universidades da rede)
  const cx = 30, cy = 30, r = 22;
  const outerNodes = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Linhas do centro para os nós externos */}
      {outerNodes.map((n, i) => (
        <line key={`c${i}`} x1={cx} y1={cy} x2={n.x} y2={n.y}
          stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      ))}
      {/* Linhas entre nós externos adjacentes */}
      {outerNodes.map((n, i) => {
        const next = outerNodes[(i + 1) % 6];
        return (
          <line key={`e${i}`} x1={n.x} y1={n.y} x2={next.x} y2={next.y}
            stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.35" />
        );
      })}
      {/* Nós externos */}
      {outerNodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r="3.8" fill={color} />
      ))}
      {/* Nó central (maior) */}
      <circle cx={cx} cy={cy} r="5.5" fill={color} />
    </svg>
  );
});

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
