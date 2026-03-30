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
  // Proporção fiel ao logo oficial: viewBox 300×222
  const height = Math.round(width * (222 / 300));
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 222"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* ── Superfície superior do tabuleiro (topo com cantos arredondados) ── */}
      <rect x="0" y="0" width="300" height="34" rx="4" fill={color} />

      {/* gap y=34..42 → linha escura de separação 3-D */}

      {/* ── Face frontal do tabuleiro (trapézio — borda esq. diagonal = profundidade 3-D)
           Borda esq. vai de (0,42) até (26,74) criando triângulo escuro de perspectiva ── */}
      <path d="M0 42 L300 42 L300 74 L26 74 Z" fill={color} />

      {/* gap y=74..90 → sombra entre tabuleiro e cúpula */}

      {/* ── Cúpula do capelo — forma em ARCO curvado (Q-bezier nos cantos superiores)
           Cantos sup arredondados: a cúpula flui como meia-elipse, não como retângulo
           Topo: x=54..246 (64% da largura), flares para x=36..264 no máx ── */}
      <path
        d="M54 90 L246 90 Q264 90 264 128 Q264 206 150 206 Q36 206 36 128 Q36 90 54 90 Z"
        fill={color}
      />

      {/* ── Cordão da borla — nasce no topo, atravessa o tabuleiro ── */}
      <rect x="242" y="0" width="12" height="96" fill={color} />

      {/* ── Fita/borla com V-notch ── */}
      <path
        d="M224 74 L262 74 L262 192 L243 168 L224 192 Z"
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
  // Rede orgânica fiel ao logo oficial ACAFE:
  // 5 nós de tamanhos variados + conexões irregulares (não hexagonal)
  // N1=grande(direita-baixo), N2=médio(direita-cima), N3=médio(centro-cima),
  // N4=médio(esquerda), N5=pequeno(esquerda-baixo)
  const nodes = [
    { x: 52, y: 44, r: 8.0 },  // N1 — grande, dominante (direita-baixo)
    { x: 47, y: 16, r: 5.5 },  // N2 — médio (direita-cima)
    { x: 28, y: 9,  r: 5.0 },  // N3 — médio (centro-cima)
    { x: 9,  y: 25, r: 5.5 },  // N4 — médio (esquerda)
    { x: 18, y: 43, r: 3.5 },  // N5 — pequeno (esquerda-baixo)
  ];
  const edges = [
    [0, 1], // N1-N2
    [1, 2], // N2-N3
    [2, 3], // N3-N4
    [3, 4], // N4-N5
    [4, 0], // N5-N1 (base)
    [1, 4], // N2-N5 (diagonal interna)
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 62 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Conexões */}
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke={color} strokeWidth="1.8" strokeLinecap="round"
        />
      ))}
      {/* Nós */}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={color} />
      ))}
    </svg>
  );
});

interface AcafeLockupProps {
  size?: number;
  color?: string;
  textColor?: string;
  className?: string;
  textClassName?: string;
}

export const AcafeLockup = memo(function AcafeLockup({
  size = 20,
  color = '#8FBE3F',
  textColor = 'hsl(var(--primary))',
  className = '',
  textClassName = '',
}: AcafeLockupProps) {
  return (
    <div className={`inline-flex items-center gap-2 leading-none ${className}`}>
      <AcafeConstellation size={size} color={color} className="opacity-90 shrink-0" />
      <span
        className={`text-[11px] font-black lowercase tracking-wider ${textClassName}`}
        style={{ color: textColor }}
      >
        acafe
      </span>
    </div>
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
