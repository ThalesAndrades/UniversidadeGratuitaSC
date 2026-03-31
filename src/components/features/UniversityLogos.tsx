import { memo } from 'react';

// ─── Logos oficiais das universidades ACAFE (SVGs baseados nas identidades visuais reais) ─

// UNIVALI — Barras geométricas angulares azuis formando pirâmide
const UnivaliLogo = () => (
  <svg viewBox="0 0 60 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <polygon points="30,2 58,18 30,18" fill="#1A3F7D" />
    <polygon points="22,18 58,18 50,26 14,26" fill="#1D4F91" />
    <polygon points="14,26 50,26 42,34 6,34" fill="#2260A5" />
    <polygon points="6,34 42,34 34,42 2,42" fill="#2870B5" />
    <text x="30" y="51" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="7" fontWeight="800" fill="#1A3F7D" letterSpacing="1.2">UNIVALI</text>
  </svg>
);

// UNESC — Flor/tulipa estilizada (pétalas verdes + acento vermelho)
const UnescLogo = () => (
  <svg viewBox="0 0 48 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Pétalas verdes */}
    <path d="M24 6 Q30 14 28 22 Q24 18 20 22 Q18 14 24 6Z" fill="#4CAF50" />
    <path d="M16 12 Q22 16 22 22 Q18 20 14 22 Q12 16 16 12Z" fill="#388E3C" />
    <path d="M32 12 Q26 16 26 22 Q30 20 34 22 Q36 16 32 12Z" fill="#388E3C" />
    {/* Acento vermelho no topo */}
    <circle cx="24" cy="8" r="3" fill="#E53935" />
    {/* Caule */}
    <line x1="24" y1="22" x2="24" y2="38" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
    <text x="24" y="48" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="8" fontWeight="700" fill="#333">unesc</text>
  </svg>
);

// UNIPLAC — Retângulo azul arredondado com U branco recortado
const UniplacLogo = () => (
  <svg viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="2" y="2" width="60" height="28" rx="8" fill="#00508C" />
    <path d="M20 8 L20 20 Q20 26 32 26 Q44 26 44 20 L44 8"
      fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round" />
    <text x="32" y="41" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="7" fontWeight="800" fill="#00508C" letterSpacing="0.8">UNIPLAC</text>
  </svg>
);

// Univille — Duas folhas verdes brotando
const UnivilleLogo = () => (
  <svg viewBox="0 0 48 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Folha esquerda */}
    <path d="M22 8 Q10 16 14 28 Q18 22 22 18 Z" fill="#2E7D32" />
    {/* Folha direita */}
    <path d="M26 8 Q38 16 34 28 Q30 22 26 18 Z" fill="#43A047" />
    {/* Caule central */}
    <line x1="24" y1="18" x2="24" y2="36" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round" />
    <text x="24" y="47" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="7.5" fontWeight="700" fill="#2E7D32">univille</text>
  </svg>
);

// UNIFEBE — Texto azul com swoosh/arco pontilhado
const UnifebeLogo = () => (
  <svg viewBox="0 0 68 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <text x="34" y="22" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="14" fontWeight="900" fill="#1565C0" letterSpacing="0.5">UNIFEBE</text>
    <path d="M8 28 Q34 36 60 28" stroke="#1E88E5" strokeWidth="2" fill="none" strokeLinecap="round" />
    <text x="34" y="37" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fontWeight="600" fill="#666">é nosso, é daqui</text>
  </svg>
);

// UNO Chapecó — Escudo azul com colunas douradas
const UnoChapecoLogo = () => (
  <svg viewBox="0 0 60 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Escudo */}
    <path d="M10 4 L50 4 L50 28 Q50 42 30 46 Q10 42 10 28 Z" fill="#1A3F7D" stroke="#1A3F7D" strokeWidth="1" />
    {/* Colunas douradas */}
    <rect x="20" y="12" width="3" height="20" rx="1" fill="#D4A843" />
    <rect x="28.5" y="12" width="3" height="20" rx="1" fill="#D4A843" />
    <rect x="37" y="12" width="3" height="20" rx="1" fill="#D4A843" />
    {/* Teto/frontão */}
    <path d="M16 14 L30 6 L44 14" stroke="#D4A843" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* Base */}
    <rect x="18" y="32" width="24" height="2.5" rx="1" fill="#D4A843" />
    <text x="30" y="51" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fontWeight="800" fill="#1A3F7D" letterSpacing="0.3">UNO CHAPECÓ</text>
  </svg>
);

// FURB — Barras coloridas (skyline) + livro aberto
const FurbLogo = () => (
  <svg viewBox="0 0 56 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Barras de cidade (skyline) */}
    <rect x="8" y="14" width="5" height="16" fill="#64B5F6" />
    <rect x="15" y="8" width="5" height="22" fill="#42A5F5" />
    <rect x="22" y="4" width="5" height="26" fill="#2196F3" />
    <rect x="29" y="10" width="5" height="20" fill="#1E88E5" />
    <rect x="36" y="6" width="5" height="24" fill="#1976D2" />
    <rect x="43" y="16" width="5" height="14" fill="#1565C0" />
    {/* Livro aberto */}
    <path d="M10 32 Q28 28 28 32" stroke="#D4A843" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M46 32 Q28 28 28 32" stroke="#D4A843" strokeWidth="2" fill="none" strokeLinecap="round" />
    <text x="28" y="44" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="9" fontWeight="900" fill="#1A3F7D" letterSpacing="0.8">FURB</text>
  </svg>
);

// UNOESC — Swooshes verde e azul curvados
const UnoescLogo = () => (
  <svg viewBox="0 0 68 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Swoosh verde */}
    <path d="M6 20 Q20 6 38 12 Q28 16 22 22" stroke="#43A047" strokeWidth="4" fill="none" strokeLinecap="round" />
    {/* Swoosh azul */}
    <path d="M22 22 Q36 10 54 16" stroke="#1976D2" strokeWidth="4" fill="none" strokeLinecap="round" />
    <text x="34" y="36" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="9" fontWeight="800" fill="#1565C0" letterSpacing="0.5">UNOESC</text>
  </svg>
);

// UNIDAVI — Texto bold azul circular/arredondado
const UnidaviLogo = () => (
  <svg viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <text x="32" y="28" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="18" fontWeight="900" fill="#1A3F7D" letterSpacing="-0.5">UNIDAVI</text>
  </svg>
);

// Católica SC — Livro aberto vermelho/bordô
const CatolicaScLogo = () => (
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Livro aberto */}
    <path d="M32 28 L10 12 Q8 10 10 8 L32 18 Z" fill="#C62828" />
    <path d="M32 28 L54 12 Q56 10 54 8 L32 18 Z" fill="#B71C1C" />
    <line x1="32" y1="18" x2="32" y2="28" stroke="#7F0000" strokeWidth="1.5" />
    <text x="32" y="38" textAnchor="middle" fontFamily="Georgia,serif" fontSize="6" fontWeight="700" fill="#8B1A1A">
      Católica
    </text>
    <text x="32" y="45" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4" fill="#666">de Santa Catarina</text>
  </svg>
);

// IELUSC — Texto azul com swoosh/onda
const IeluscLogo = () => (
  <svg viewBox="0 0 68 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Swoosh/livro aberto azul */}
    <path d="M20 6 Q34 2 48 6 Q42 12 34 10 Q26 12 20 6Z" fill="#1565C0" />
    <text x="34" y="14" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4" fontWeight="600" fill="#666" letterSpacing="1.5">FACULDADE</text>
    <text x="34" y="30" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="16" fontWeight="900" fill="#1A3F7D" letterSpacing="0.5">IELUSC</text>
  </svg>
);

// UnC — Texto azul bold com elemento gráfico
const UncLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Figura humana/livro estilizado */}
    <path d="M24 4 Q32 8 30 16 Q28 12 24 14 Q20 12 18 16 Q16 8 24 4Z" fill="#1565C0" />
    <circle cx="24" cy="10" r="3" fill="#1976D2" />
    <text x="24" y="36" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="16" fontWeight="900" fill="#1A3F7D">UnC</text>
  </svg>
);

// Uniarp — U estilizado com gradiente amarelo→laranja→verde
const UniarpLogo = () => (
  <svg viewBox="0 0 60 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="uniarp-gr" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDD835" />
        <stop offset="50%" stopColor="#FF9800" />
        <stop offset="100%" stopColor="#2E7D32" />
      </linearGradient>
    </defs>
    <path d="M10 4 L10 22 Q10 34 22 34 Q30 34 30 22 L30 4"
      stroke="url(#uniarp-gr)" strokeWidth="6" fill="none" strokeLinecap="round" />
    <text x="42" y="28" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="9" fontWeight="700" fill="#555">Uniarp</text>
  </svg>
);

// Unibave — Texto verde com swoosh curvo
const UnibaveLogo = () => (
  <svg viewBox="0 0 68 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <text x="34" y="22" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#2E7D32" letterSpacing="-0.3">unibave</text>
    <path d="M8 28 Q34 34 60 26" stroke="#43A047" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

// UNISATC — Texto com Q estilizado verde
const UnisatcLogo = () => (
  <svg viewBox="0 0 68 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Q estilizado (globo com seta) */}
    <circle cx="16" cy="16" r="10" stroke="#2E7D32" strokeWidth="2.5" fill="none" />
    <path d="M22 20 L28 26" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
    <text x="42" y="14" fontFamily="Arial,sans-serif" fontSize="5" fontWeight="600" fill="#666" letterSpacing="0.8">CENTRO UNIVERSITÁRIO</text>
    <text x="42" y="26" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="900" fill="#333" letterSpacing="0.5">UNISATC</text>
  </svg>
);

// ─── Dados das universidades ACAFE ──────────────────────────────────────────

interface University {
  name: string;
  Logo: React.FC;
}

const UNIVERSITIES: University[] = [
  { name: 'UNIVALI',          Logo: UnivaliLogo    },
  { name: 'UNESC',            Logo: UnescLogo      },
  { name: 'UNIPLAC',          Logo: UniplacLogo    },
  { name: 'Univille',         Logo: UnivilleLogo   },
  { name: 'UNIFEBE',          Logo: UnifebeLogo    },
  { name: 'UNO Chapecó',      Logo: UnoChapecoLogo },
  { name: 'FURB',             Logo: FurbLogo       },
  { name: 'UNOESC',           Logo: UnoescLogo     },
  { name: 'UNIDAVI',          Logo: UnidaviLogo    },
  { name: 'Católica SC',      Logo: CatolicaScLogo },
  { name: 'IELUSC',           Logo: IeluscLogo     },
  { name: 'UnC',              Logo: UncLogo        },
  { name: 'Uniarp',           Logo: UniarpLogo     },
  { name: 'Unibave',          Logo: UnibaveLogo    },
  { name: 'UNISATC',          Logo: UnisatcLogo    },
];

// ─── Badge (somente logo, sem texto descritivo) ─────────────────────────────

function UniversityBadge({ u }: { u: University }) {
  return (
    <div className="flex items-center justify-center px-2 sm:px-3 shrink-0 cursor-default group">
      <div
        className="w-[4.2rem] h-[3.2rem] sm:w-[5.2rem] sm:h-[3.8rem] rounded-lg overflow-hidden
                   flex items-center justify-center p-1.5 sm:p-2 bg-white
                   group-hover:scale-105 group-hover:shadow-md transition-all duration-300"
        style={{
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
        title={u.name}
      >
        <u.Logo />
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
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
        {items.map((u, i) => (
          <MemoizedBadge key={`${u.name}-${i}`} u={u} />
        ))}
      </div>
    </div>
  );
}

export default memo(UniversityLogos);
