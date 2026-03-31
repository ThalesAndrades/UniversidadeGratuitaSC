import { memo } from 'react';

// ─── Logos oficiais das universidades ACAFE (baseadas na identidade visual real) ─

// FURB — Barras verticais (skyline) em gradiente azul + folha verde (Blumenau)
const FurbLogo = () => (
  <svg viewBox="0 0 64 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M6 13 Q3 9 7 7 Q11 5 11 10 Q10 14 6 13Z" fill="#4DB848"/>
    <path d="M12 10 Q10 6 14 5 Q17 4 16 9 Q15 12 12 10Z" fill="#3DA83A"/>
    <rect x="3" y="22" width="8" height="30" fill="#8ED1E0"/>
    <rect x="13" y="15" width="8" height="37" fill="#5BB5E8"/>
    <rect x="23" y="9" width="8" height="43" fill="#3498DB"/>
    <rect x="33" y="19" width="8" height="33" fill="#2980B9"/>
    <rect x="43" y="13" width="8" height="39" fill="#1F6FAD"/>
    <rect x="53" y="25" width="8" height="27" fill="#134C79"/>
  </svg>
);

// UNESC — Flor/tulipa estilizada (pétalas vermelhas + caule verde)
const UnescLogo = () => (
  <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Pétalas */}
    <ellipse cx="24" cy="14" rx="7" ry="11" fill="#E63329"/>
    <ellipse cx="16" cy="18" rx="5" ry="9" fill="#E63329" transform="rotate(-25 16 18)"/>
    <ellipse cx="32" cy="18" rx="5" ry="9" fill="#E63329" transform="rotate(25 32 18)"/>
    {/* Folha verde */}
    <path d="M24 22 Q18 28 14 26 Q10 24 16 18" fill="#4CAF50"/>
    <path d="M24 22 Q30 28 34 26 Q38 24 32 18" fill="#43A047"/>
    {/* Caule */}
    <line x1="24" y1="22" x2="24" y2="48" stroke="#4CAF50" strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
);

// UNIPLAC — Quadrado azul escuro com U branco recortado
const UniplacLogo = () => (
  <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="2" y="2" width="48" height="48" rx="4" fill="#003F7F"/>
    <path d="M14 12 L14 30 Q14 42 26 42 Q38 42 38 30 L38 12"
      fill="none" stroke="white" strokeWidth="5.5" strokeLinecap="round"/>
  </svg>
);

// UNIVALI — Escudo azul/roxo com onda branca
const UnivaliLogo = () => (
  <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M4 4 L44 4 L44 32 Q44 52 24 56 Q4 52 4 32 Z" fill="#1A237E"/>
    <path d="M4 28 Q14 20 24 28 Q34 36 44 28 L44 32 Q44 52 24 56 Q4 52 4 32 Z" fill="#283593"/>
    <path d="M8 30 Q16 22 24 30 Q32 38 40 30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
);

// Univille — Folha/gota verde
const UnivilleLogo = () => (
  <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M24 4 Q42 20 38 36 Q34 50 24 52 Q14 50 10 36 Q6 20 24 4Z" fill="#4CAF50"/>
    <path d="M24 14 L24 44" stroke="white" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
    <path d="M24 24 Q18 20 14 24" stroke="white" strokeWidth="1.2" fill="none" opacity="0.4" strokeLinecap="round"/>
    <path d="M24 30 Q30 26 34 30" stroke="white" strokeWidth="1.2" fill="none" opacity="0.4" strokeLinecap="round"/>
  </svg>
);

// UNIFEBE — Símbolo ornamental em cruz/padrão decorativo
const UnifebeLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Quatro folhas ornamentais em cruz */}
    <path d="M24 4 Q30 12 24 20 Q18 12 24 4Z" fill="#5C6670"/>
    <path d="M24 28 Q30 36 24 44 Q18 36 24 28Z" fill="#5C6670"/>
    <path d="M4 24 Q12 18 20 24 Q12 30 4 24Z" fill="#5C6670"/>
    <path d="M28 24 Q36 18 44 24 Q36 30 28 24Z" fill="#5C6670"/>
    {/* Diagonais menores */}
    <path d="M10 10 Q16 16 14 20 Q10 16 10 10Z" fill="#78909C"/>
    <path d="M38 10 Q32 16 34 20 Q38 16 38 10Z" fill="#78909C"/>
    <path d="M10 38 Q16 32 14 28 Q10 32 10 38Z" fill="#78909C"/>
    <path d="M38 38 Q32 32 34 28 Q38 32 38 38Z" fill="#78909C"/>
    <circle cx="24" cy="24" r="3" fill="#455A64"/>
  </svg>
);

// UNO Chapecó — Estrela/asterisco verde
const UnoChapecoLogo = () => (
  <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* 6 pontas de estrela */}
    <path d="M26 2 L29 20 L26 22 L23 20Z" fill="#2E7D32"/>
    <path d="M26 50 L29 32 L26 30 L23 32Z" fill="#2E7D32"/>
    <path d="M4 14 L20 22 L20 26 L18 24Z" fill="#388E3C"/>
    <path d="M48 14 L32 22 L32 26 L34 24Z" fill="#388E3C"/>
    <path d="M4 38 L20 30 L20 26 L18 28Z" fill="#43A047"/>
    <path d="M48 38 L32 30 L32 26 L34 28Z" fill="#43A047"/>
    <circle cx="26" cy="26" r="5" fill="#1B5E20"/>
  </svg>
);

// UNOESC — Folhas curvas verde + azul
const UnoescLogo = () => (
  <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M26 46 Q4 40 8 20 Q12 6 26 10 Q18 20 20 32 Q22 40 26 46Z" fill="#4CAF50"/>
    <path d="M26 46 Q48 40 44 20 Q40 6 26 10 Q34 20 32 32 Q30 40 26 46Z" fill="#2196F3"/>
    <circle cx="26" cy="10" r="3" fill="#388E3C"/>
  </svg>
);

// UNIDAVI — Swoosh circular azul + cyan
const UnidaviLogo = () => (
  <svg viewBox="0 0 56 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M28 4 Q48 4 50 24 Q52 40 36 48 Q24 54 14 44"
      stroke="#003087" strokeWidth="7" fill="none" strokeLinecap="round"/>
    <path d="M14 44 Q4 34 6 20 Q8 10 20 6"
      stroke="#0097D4" strokeWidth="7" fill="none" strokeLinecap="round"/>
  </svg>
);

// Católica SC — Livro aberto vermelho/bordô
const CatolicaScLogo = () => (
  <svg viewBox="0 0 56 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Livro aberto — duas páginas abrindo para cima */}
    <path d="M28 40 L4 14 Q2 10 6 8 L28 20Z" fill="#B71C1C"/>
    <path d="M28 40 L52 14 Q54 10 50 8 L28 20Z" fill="#C62828"/>
    {/* Lombada central */}
    <line x1="28" y1="20" x2="28" y2="40" stroke="#7F0000" strokeWidth="2"/>
    {/* Brilho nas páginas */}
    <path d="M12 14 L26 24" stroke="white" strokeWidth="0.8" opacity="0.3"/>
    <path d="M44 14 L30 24" stroke="white" strokeWidth="0.8" opacity="0.3"/>
  </svg>
);

// UNIBAVE — Oval verde horizontal com acento amarelo
const UnibaveLogo = () => (
  <svg viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <ellipse cx="32" cy="20" rx="28" ry="14" fill="none" stroke="#00A651" strokeWidth="5"/>
    {/* Folha/acento amarelo no topo-direita */}
    <path d="M46 8 Q52 2 56 6 Q54 12 48 10Z" fill="#F9A825"/>
  </svg>
);

// UNIARP — U estilizado com gradiente amarelo→laranja→verde
const UniarpLogo = () => (
  <svg viewBox="0 0 52 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="uniarp-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDD835"/>
        <stop offset="40%" stopColor="#FF9800"/>
        <stop offset="70%" stopColor="#E65100"/>
        <stop offset="100%" stopColor="#2E7D32"/>
      </linearGradient>
    </defs>
    <path d="M8 6 L8 32 Q8 50 26 50 Q44 50 44 32 L44 6"
      stroke="url(#uniarp-g)" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// UnC — Universidade do Contestado — Figura abstrata verde
const UncLogo = () => (
  <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Figura humana/árvore estilizada */}
    <circle cx="24" cy="10" r="7" fill="#2E7D32"/>
    <path d="M24 17 L24 38" stroke="#388E3C" strokeWidth="5" strokeLinecap="round"/>
    <path d="M10 24 Q16 18 24 22 Q32 18 38 24"
      stroke="#4CAF50" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M24 38 L16 52" stroke="#388E3C" strokeWidth="4" strokeLinecap="round"/>
    <path d="M24 38 L32 52" stroke="#388E3C" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

// ─── Dados das universidades ACAFE ──────────────────────────────────────────

interface University {
  name: string;
  region: string;
  color: string;
  Logo: React.FC;
  darkBg?: boolean;
}

const UNIVERSITIES: University[] = [
  { name: 'UNIVALI',     region: 'Itajaí · SC',     color: '#1A237E', Logo: UnivaliLogo    },
  { name: 'UNESC',       region: 'Criciúma · SC',   color: '#E63329', Logo: UnescLogo      },
  { name: 'UNIPLAC',     region: 'Lages · SC',      color: '#003F7F', Logo: UniplacLogo,   darkBg: true },
  { name: 'Univille',    region: 'Joinville · SC',  color: '#4CAF50', Logo: UnivilleLogo   },
  { name: 'UNIFEBE',     region: 'Brusque · SC',    color: '#5C6670', Logo: UnifebeLogo    },
  { name: 'UNO',         region: 'Chapecó · SC',    color: '#2E7D32', Logo: UnoChapecoLogo },
  { name: 'FURB',        region: 'Blumenau · SC',   color: '#1F6FAD', Logo: FurbLogo       },
  { name: 'UNOESC',      region: 'Joaçaba · SC',    color: '#4CAF50', Logo: UnoescLogo     },
  { name: 'UNIDAVI',     region: 'Rio do Sul · SC', color: '#003087', Logo: UnidaviLogo    },
  { name: 'Católica SC', region: 'Joinville · SC',  color: '#B71C1C', Logo: CatolicaScLogo },
  { name: 'UNIBAVE',     region: 'Orleans · SC',    color: '#00A651', Logo: UnibaveLogo    },
  { name: 'Uniarp',      region: 'Caçador · SC',    color: '#FF9800', Logo: UniarpLogo     },
  { name: 'UnC',         region: 'Concórdia · SC',  color: '#2E7D32', Logo: UncLogo        },
];

// ─── Badge ───────────────────────────────────────────────────────────────────

function UniversityBadge({ u }: { u: University }) {
  const { Logo, darkBg, color, name, region } = u;
  return (
    <div className="flex flex-col items-center gap-2 px-3 sm:px-4 shrink-0 cursor-default group">
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] sm:rounded-2xl overflow-hidden
                   flex items-center justify-center p-1.5 sm:p-2
                   group-hover:scale-110 group-hover:shadow-xl transition-all duration-300"
        style={{
          background: darkBg ? color : '#ffffff',
          border: darkBg ? 'none' : `1.5px solid ${color}28`,
          boxShadow: `0 4px 14px ${color}35`,
        }}
      >
        <Logo />
      </div>
      <div className="flex flex-col items-center gap-0">
        <span className="text-[10px] sm:text-[11px] font-black text-foreground/75 group-hover:text-foreground
                         transition-colors duration-300 select-none whitespace-nowrap tracking-tight leading-tight">
          {name}
        </span>
        <span className="text-[8px] sm:text-[9px] text-muted-foreground/40 select-none whitespace-nowrap
                         leading-tight hidden sm:block">
          {region}
        </span>
      </div>
    </div>
  );
}

const MemoizedBadge = memo(UniversityBadge);

// ─── Marquee ─────────────────────────────────────────────────────────────────

function UniversityLogos() {
  const items = [...UNIVERSITIES, ...UNIVERSITIES];
  return (
    <div
      className="w-full overflow-hidden py-3 sm:py-4 flex items-center
                 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-end">
        {items.map((u, i) => (
          <MemoizedBadge key={`${u.name}-${i}`} u={u} />
        ))}
      </div>
    </div>
  );
}

export default memo(UniversityLogos);
