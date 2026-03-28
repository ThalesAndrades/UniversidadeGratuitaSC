import { memo } from 'react';

// ─── SVG logos inspirados nas identidades visuais reais das universidades ────

const UnivaliLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <polygon points="30,2 58,30 30,58 2,30" fill="#003E7E" />
    <polyline points="14,18 30,50 46,18"
      fill="none" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="18" y1="11" x2="42" y2="11" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const UnescLogo = () => (
  <svg viewBox="0 0 60 62" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Cabeça */}
    <circle cx="30" cy="9" r="8" fill="#E31E24" />
    {/* Braços abertos */}
    <path d="M6 26 Q16 16 30 22 Q44 16 54 26" stroke="#00A859" strokeWidth="5" fill="none" strokeLinecap="round" />
    {/* Corpo */}
    <line x1="30" y1="22" x2="30" y2="40" stroke="#00A859" strokeWidth="5" strokeLinecap="round" />
    {/* Pernas */}
    <line x1="30" y1="40" x2="20" y2="58" stroke="#00A859" strokeWidth="4" strokeLinecap="round" />
    <line x1="30" y1="40" x2="40" y2="58" stroke="#00A859" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const UniplacLogo = () => (
  <svg viewBox="0 0 70 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="70" height="50" rx="4" fill="#006080" />
    <path d="M20 8 L20 30 Q20 44 35 44 Q50 44 50 30 L50 8"
      fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const UnivilleLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Folha esquerda */}
    <path d="M30 54 Q6 44 8 22 Q16 6 30 20" fill="#4CAF50" />
    {/* Folha direita */}
    <path d="M30 54 Q54 44 52 22 Q44 6 30 20" fill="#81C784" />
    {/* Nervura central */}
    <line x1="30" y1="20" x2="30" y2="54" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

const UnifebeLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Eixos azuis: vertical + horizontal */}
    <line x1="30" y1="4"  x2="30" y2="56" stroke="#004B9D" strokeWidth="8" strokeLinecap="round" />
    <line x1="4"  y1="30" x2="56" y2="30" stroke="#004B9D" strokeWidth="8" strokeLinecap="round" />
    {/* Diagonais laranja */}
    <line x1="10" y1="10" x2="50" y2="50" stroke="#F47920" strokeWidth="8" strokeLinecap="round" />
    <line x1="50" y1="10" x2="10" y2="50" stroke="#F47920" strokeWidth="8" strokeLinecap="round" />
    <circle cx="30" cy="30" r="5" fill="white" />
  </svg>
);

const UnoChapecoLogo = () => {
  // 8 raios pré-calculados (centro 30,30, r interno 17, r externo 26)
  const rays = [
    [30, 13, 30, 4],
    [42, 17.2, 48.4, 11.6],
    [47, 30, 56, 30],
    [42, 42.8, 48.4, 48.4],
    [30, 47, 30, 56],
    [18, 42.8, 11.6, 48.4],
    [13, 30, 4, 30],
    [18, 17.2, 11.6, 11.6],
  ];
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="30" cy="30" r="28" fill="#002B7F" />
      <circle cx="30" cy="30" r="17" fill="none" stroke="#FFD700" strokeWidth="2" />
      {rays.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" />
      ))}
      <circle cx="30" cy="30" r="5.5" fill="#FFD700" />
    </svg>
  );
};

const FurbLogo = () => (
  <svg viewBox="0 0 70 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* 5 colunas de alturas diferentes — estilo prédios */}
    <rect x="4"  y="36" width="10" height="18" rx="1" fill="#003087" />
    <rect x="16" y="24" width="10" height="30" rx="1" fill="#003087" />
    <rect x="28" y="12" width="10" height="42" rx="1" fill="#003087" />
    <rect x="40" y="20" width="10" height="34" rx="1" fill="#003087" />
    <rect x="52" y="32" width="10" height="22" rx="1" fill="#003087" />
    {/* Topos amarelos */}
    <rect x="4"  y="34" width="10" height="4" rx="1" fill="#FFD700" />
    <rect x="16" y="22" width="10" height="4" rx="1" fill="#FFD700" />
    <rect x="28" y="10" width="10" height="4" rx="1" fill="#FFD700" />
    <rect x="40" y="18" width="10" height="4" rx="1" fill="#FFD700" />
    <rect x="52" y="30" width="10" height="4" rx="1" fill="#FFD700" />
    {/* Base */}
    <rect x="2" y="54" width="66" height="2" rx="1" fill="#003087" />
  </svg>
);

const UnoescLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Figura abstraída — fita/pessoa em verde */}
    <path d="M10 50 Q6 28 18 18 Q28 8 40 14 Q54 22 48 38 Q42 54 28 50 Q16 46 14 36 Q12 26 22 20"
      stroke="#00A651" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UnidaviLogo = () => (
  <svg viewBox="0 0 70 68" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Grande U azul */}
    <path d="M6 6 L6 44 Q6 64 35 64 Q64 64 64 44 L64 6"
      stroke="#003087" strokeWidth="11" fill="none" strokeLinecap="round" />
    {/* Figura humana estilizada dentro */}
    <circle cx="35" cy="28" r="6" fill="#003087" />
    <line x1="35" y1="34" x2="35" y2="50" stroke="#003087" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="22" y1="38" x2="48" y2="38" stroke="#003087" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

const CatolicaScLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Livro aberto — camadas em vermelho */}
    <path d="M30 58 L2 32 L30 6  L58 32 Z" fill="#6B1010" />
    <path d="M30 52 L6  30 L30 8  L54 30 Z" fill="#8B1A1A" />
    <path d="M30 46 L10 28 L30 10 L50 28 Z" fill="#A52020" />
    <path d="M30 40 L14 26 L30 12 L46 26 Z" fill="#C03030" />
    {/* Cruz branca */}
    <line x1="30" y1="20" x2="30" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="22" y1="28" x2="38" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const UnisatcLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Hexágono externo */}
    <polygon points="30,3 54,17 54,43 30,57 6,43 6,17"
      fill="rgba(80,158,47,0.1)" stroke="#509E2F" strokeWidth="4" />
    {/* Hexágono interno */}
    <polygon points="30,13 46,22 46,38 30,47 14,38 14,22"
      fill="none" stroke="#509E2F" strokeWidth="2" opacity="0.5" />
  </svg>
);

const UnibaveLogo = () => (
  <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Loop oval alongado — identidade folha/laço */}
    <path d="M12 36 Q6 24 12 14 Q20 4 36 6 Q56 8 62 20 Q68 34 54 42 Q38 50 24 42 Q16 38 14 30 Q12 22 20 16 Q28 8 42 12 Q56 16 58 28"
      stroke="#00A651" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UniarpLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="60" height="60" rx="4" fill="#003087" />
    <path d="M14 10 L14 34 Q14 52 30 52 Q46 52 46 34 L46 10"
      fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const UncLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* C curvo + figura humana */}
    <path d="M48 10 Q18 6 10 28 Q4 44 20 54 Q36 64 52 52"
      stroke="#003087" strokeWidth="7" fill="none" strokeLinecap="round" />
    <circle cx="34" cy="20" r="5.5" fill="#003087" />
  </svg>
);

const IeluscLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Crachá circular */}
    <circle cx="30" cy="30" r="28" fill="#002B7F" />
    <circle cx="30" cy="30" r="22" fill="none" stroke="white" strokeWidth="1.5" />
    <circle cx="30" cy="30" r="8"  fill="none" stroke="#FFD700" strokeWidth="1.5" />
    {/* Cruz luterana */}
    <line x1="30" y1="12" x2="30" y2="48" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="14" y1="30" x2="46" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// ─── Dados das universidades ─────────────────────────────────────────────────

interface University {
  name: string;
  region: string;
  color: string;
  Logo: React.FC;
  darkBg?: boolean; // badge usa fundo escuro (ex: UNIPLAC, Uniarp)
}

const UNIVERSITIES: University[] = [
  { name: 'UNIVALI',     region: 'Itajaí · SC',     color: '#003E7E', Logo: UnivaliLogo    },
  { name: 'unesc',       region: 'Criciúma · SC',   color: '#00A859', Logo: UnescLogo      },
  { name: 'UNIPLAC',     region: 'Lages · SC',      color: '#006080', Logo: UniplacLogo,   darkBg: true },
  { name: 'univille',    region: 'Joinville · SC',  color: '#4CAF50', Logo: UnivilleLogo   },
  { name: 'UNIFEBE',     region: 'Brusque · SC',    color: '#004B9D', Logo: UnifebeLogo    },
  { name: 'UNO',         region: 'Chapecó · SC',    color: '#002B7F', Logo: UnoChapecoLogo, darkBg: true },
  { name: 'FURB',        region: 'Blumenau · SC',   color: '#003087', Logo: FurbLogo       },
  { name: 'UNOESC',      region: 'Joaçaba · SC',    color: '#00A651', Logo: UnoescLogo     },
  { name: 'UNIDAVI',     region: 'Rio do Sul · SC', color: '#003087', Logo: UnidaviLogo    },
  { name: 'Católica SC', region: 'Joinville · SC',  color: '#8B1A1A', Logo: CatolicaScLogo },
  { name: 'UNISATC',     region: 'Criciúma · SC',   color: '#509E2F', Logo: UnisatcLogo    },
  { name: 'unibave',     region: 'Orleans · SC',    color: '#00A651', Logo: UnibaveLogo    },
  { name: 'Uniarp',      region: 'Caçador · SC',    color: '#003087', Logo: UniarpLogo,    darkBg: true },
  { name: 'UnC',         region: 'Concórdia · SC',  color: '#003087', Logo: UncLogo        },
  { name: 'IELUSC',      region: 'Joinville · SC',  color: '#002B7F', Logo: IeluscLogo,    darkBg: true },
];

// ─── Badge ───────────────────────────────────────────────────────────────────

function UniversityBadge({ u }: { u: University }) {
  const { Logo, darkBg, color, name, region } = u;
  return (
    <div className="flex flex-col items-center gap-2 px-3 sm:px-4 shrink-0 cursor-default group">
      {/* Card da logo */}
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] sm:rounded-2xl overflow-hidden
                   flex items-center justify-center p-1.5 sm:p-2
                   shadow-md group-hover:scale-110 group-hover:shadow-xl transition-all duration-300"
        style={{
          background: darkBg ? color : '#ffffff',
          border: darkBg ? 'none' : `1.5px solid ${color}28`,
          boxShadow: `0 4px 14px ${color}35`,
        }}
      >
        <Logo />
      </div>

      {/* Rótulos */}
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
