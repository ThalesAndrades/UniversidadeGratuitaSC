import { memo, type CSSProperties } from 'react';

// ── Marca Universidade Gratuita (chapéu oficial — referência do programa) ─────
interface GraduationCapBrandProps {
  width?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export const GraduationCapBrand = memo(function GraduationCapBrand({
  width = 180,
  color = '#ffffff',
  className = '',
  style,
}: GraduationCapBrandProps) {
  const height = Math.round(width * 0.7);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 196"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Superfície superior do tabuleiro — largura total */}
      <rect x="0" y="0" width="280" height="30" rx="3" fill={color} />

      {/* Face frontal do tabuleiro (sobrepõe, cria profundidade 3-D) */}
      <rect x="0" y="22" width="280" height="40" fill={color} />

      {/* Gap natural y=62..76 — fundo aparece, dá profundidade */}

      {/* Cúpula do capelo — 74% da largura do tabuleiro, centralizado */}
      <path
        d="M36 76 L244 76 L244 142 Q244 172 140 174 Q36 172 36 142 Z"
        fill={color}
      />

      {/* Cordão da borla — da borda do tabuleiro até a fita */}
      <rect x="218" y="0" width="14" height="96" fill={color} />

      {/* Borla/fita estilo marcador — V-notch na base */}
      <path
        d="M204 76 L248 76 L248 138 L226 118 L204 138 Z"
        fill={color}
      />
    </svg>
  );
});

// ── Chapéu de formatura (ícone compacto) ────────────────────────────────────
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
      <polygon points="40,4 76,20 40,36 4,20" fill={color} />
      <polygon points="40,10 68,22 40,34 12,22" fill={color} fillOpacity="0.25" />
      <path
        d="M14 24 L14 44 Q14 54 40 54 Q66 54 66 44 L66 24"
        fill={color}
        fillOpacity="0.18"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M76 20 L76 38" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
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
      {outerNodes.map((n, i) => (
        <line key={`c${i}`} x1={cx} y1={cy} x2={n.x} y2={n.y}
          stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      ))}
      {outerNodes.map((n, i) => {
        const next = outerNodes[(i + 1) % 6];
        return (
          <line key={`e${i}`} x1={n.x} y1={n.y} x2={next.x} y2={next.y}
            stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.35" />
        );
      })}
      {outerNodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r="3.8" fill={color} />
      ))}
      <circle cx={cx} cy={cy} r="5.5" fill={color} />
    </svg>
  );
});

// ── Escudo do Estado de Santa Catarina (Brasão / SED) ──────────────────────
// Fiel ao brasão oficial: listras vermelhas + fundo verde + estrela dourada
interface ScStateSealProps {
  size?: number;
  className?: string;
}

export const ScStateSeal = memo(function ScStateSeal({
  size = 36,
  className = '',
}: ScStateSealProps) {
  const w = size;
  const h = Math.round(size * 1.22);
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 44 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="sc-shield">
          <path d="M2 2 L42 2 L42 32 Q42 50 22 54 Q2 50 2 32 Z" />
        </clipPath>
      </defs>

      {/* Conteúdo recortado ao escudo */}
      <g clipPath="url(#sc-shield)">
        {/* Base branca */}
        <rect x="0" y="0" width="44" height="54" fill="white" />
        {/* Listras vermelhas horizontais — 4 bandas (porção superior) */}
        <rect x="0" y="2"  width="44" height="6"  fill="#A40006" />
        <rect x="0" y="11" width="44" height="5"  fill="#A40006" />
        <rect x="0" y="20" width="44" height="4"  fill="#A40006" />
        <rect x="0" y="28" width="44" height="3"  fill="#A40006" />
        {/* Seção verde (porção inferior) */}
        <rect x="0" y="30" width="44" height="26" fill="#006B3C" />
        {/* Estrela de 5 pontas dourada */}
        <polygon
          points="22,34 23.9,40.2 30.4,40.2 25.1,44.4 27.0,50.6 22,46.6 17.0,50.6 18.9,44.4 13.6,40.2 20.1,40.2"
          fill="#F5E306"
        />
      </g>

      {/* Borda dourada do escudo */}
      <path
        d="M2 2 L42 2 L42 32 Q42 50 22 54 Q2 50 2 32 Z"
        fill="none"
        stroke="#C8A000"
        strokeWidth="2"
      />
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
      <div className="absolute top-0 left-0 rounded-sm" style={{ width: sq, height: sq, backgroundColor: colorA }} />
      <div className="absolute rounded-sm" style={{ width: sq, height: sq, top: offset, left: offset, backgroundColor: colorB }} />
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
  const t = Math.round(size * 0.22);
  return (
    <div
      className={`flex-shrink-0 ${className}`}
      style={{ width: size, height: size, position: 'relative', transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: t, backgroundColor: color, borderRadius: 2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: t, height: '100%', backgroundColor: color, borderRadius: 2 }} />
    </div>
  );
});
