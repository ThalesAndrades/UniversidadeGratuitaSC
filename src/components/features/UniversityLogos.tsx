import { memo } from 'react';

// ─── SVG logos fieis às identidades visuais reais das universidades ACAFE ────

// UNIVALI — forma U+V contínua com linhas diagonais (páginas de livro) na aba direita
const UnivaliLogo = () => (
  <svg viewBox="0 0 62 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Traço principal U-V: braço esquerdo + fundo em V + braço direito */}
    <path d="M8 6 L8 38 L30 54 L52 38 L52 6"
      stroke="#0068B8" strokeWidth="8" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
    {/* Três linhas diagonais no braço direito — páginas de livro */}
    <line x1="52" y1="8"  x2="60" y2="4"  stroke="#0068B8" strokeWidth="3.5" strokeLinecap="round" opacity="0.80" />
    <line x1="52" y1="20" x2="61" y2="18" stroke="#0068B8" strokeWidth="3"   strokeLinecap="round" opacity="0.58" />
    <line x1="52" y1="32" x2="61" y2="32" stroke="#0068B8" strokeWidth="2.5" strokeLinecap="round" opacity="0.38" />
  </svg>
);

// UNESC — figura humana estilizada (cabeça vermelha + corpo com braços verdes)
const UnescLogo = () => (
  <svg viewBox="0 0 60 62" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="30" cy="9" r="8" fill="#E31E24" />
    <path d="M6 26 Q16 16 30 22 Q44 16 54 26" stroke="#00A859" strokeWidth="5" fill="none" strokeLinecap="round" />
    <line x1="30" y1="22" x2="30" y2="40" stroke="#00A859" strokeWidth="5" strokeLinecap="round" />
    <line x1="30" y1="40" x2="20" y2="58" stroke="#00A859" strokeWidth="4" strokeLinecap="round" />
    <line x1="30" y1="40" x2="40" y2="58" stroke="#00A859" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// UNIPLAC — fundo teal escuro + arco U branco
const UniplacLogo = () => (
  <svg viewBox="0 0 70 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="70" height="50" rx="4" fill="#006080" />
    <path d="M20 8 L20 30 Q20 44 35 44 Q50 44 50 30 L50 8"
      fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

// Univille — duas folhas verdes sobrepostas (confirmado na identidade real)
const UnivilleLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M30 54 Q6 44 8 22 Q16 6 30 20" fill="#4CAF50" />
    <path d="M30 54 Q54 44 52 22 Q44 6 30 20" fill="#81C784" />
    <line x1="30" y1="20" x2="30" y2="54" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// UNIFEBE — figura humana abstrata em azul (nova identidade: "forma humana como conceito central")
const UnifebeLogo = () => (
  <svg viewBox="0 0 60 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="30" cy="9" r="7" fill="#004B9D" />
    <line x1="30" y1="16" x2="30" y2="36" stroke="#004B9D" strokeWidth="5" strokeLinecap="round" />
    <path d="M10 26 Q18 18 30 22 Q42 18 50 26" stroke="#004B9D" strokeWidth="5" fill="none" strokeLinecap="round" />
    <line x1="30" y1="36" x2="20" y2="56" stroke="#004B9D" strokeWidth="4" strokeLinecap="round" />
    <line x1="30" y1="36" x2="40" y2="56" stroke="#004B9D" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// UNO Chapecó — identidade 2023: U moderno com gradiente azul+ciano, acento roxo
const UnoChapecoLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="uno-g" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#003DA5" />
        <stop offset="100%" stopColor="#0098D9" />
      </linearGradient>
    </defs>
    {/* Forma U moderna com gradiente */}
    <path d="M8 6 L8 36 Q8 56 30 56 Q52 56 52 36 L52 6"
      stroke="url(#uno-g)" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* Acento roxo — base do U */}
    <circle cx="30" cy="56" r="4.5" fill="#7030A0" />
    {/* Acentos ciano nos topos */}
    <line x1="8" y1="6" x2="19" y2="6" stroke="#00C4D4" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="41" y1="6" x2="52" y2="6" stroke="#00C4D4" strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

// FURB — raios azul gradiente em leque + quadrado roxo (esquerda) + arco amarelo (base)
const FurbLogo = () => (
  <svg viewBox="0 0 64 58" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="furb-g" x1="0.5" y1="1" x2="0.5" y2="0">
        <stop offset="0%"   stopColor="#1a3d8a" />
        <stop offset="100%" stopColor="#4a9fd4" />
      </linearGradient>
    </defs>
    {/* Arco amarelo na base — conecta todos os elementos */}
    <path d="M4 48 Q34 36 62 48 L62 56 L4 56 Z" fill="#FFD700" />
    {/* Quadrado roxo — elemento esquerdo */}
    <rect x="3" y="6" width="18" height="38" rx="2" fill="#7030A0" />
    {/* 4 raios em gradiente azul, em leque a partir do ponto focal (42,50) */}
    <polygon points="42,50 26,5 33,5" fill="#1a3d8a" />
    <polygon points="42,50 35,4 41,4" fill="#2a5498" />
    <polygon points="42,50 43,4 49,4" fill="#3a6db8" />
    <polygon points="42,50 56,14 62,26" fill="#4a9fd4" />
  </svg>
);

// UNOESC — fita abstrata verde + acento azul (cores confirmadas: verde #60C659, azul #3A75C4)
const UnoescLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M10 50 Q6 28 18 18 Q28 8 40 14 Q54 22 48 38 Q42 54 28 50 Q16 46 14 36 Q12 26 22 20"
      stroke="#60C659" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 20 Q34 12 44 18 Q54 24 50 36"
      stroke="#3A75C4" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// UNIDAVI — grande U azul + silhueta de pessoa dentro
const UnidaviLogo = () => (
  <svg viewBox="0 0 70 68" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M6 6 L6 44 Q6 64 35 64 Q64 64 64 44 L64 6"
      stroke="#003087" strokeWidth="11" fill="none" strokeLinecap="round" />
    <circle cx="35" cy="28" r="6" fill="#003087" />
    <line x1="35" y1="34" x2="35" y2="50" stroke="#003087" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="22" y1="38" x2="48" y2="38" stroke="#003087" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

// Católica SC — diamantes vermelhos empilhados + cruz branca
const CatolicaScLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M30 58 L2 32 L30 6  L58 32 Z" fill="#6B1010" />
    <path d="M30 52 L6  30 L30 8  L54 30 Z" fill="#8B1A1A" />
    <path d="M30 46 L10 28 L30 10 L50 28 Z" fill="#A52020" />
    <path d="M30 40 L14 26 L30 12 L46 26 Z" fill="#C03030" />
    <line x1="30" y1="20" x2="30" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="22" y1="28" x2="38" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// UNIBAVE — laço oval alongado verde (identidade folha/loop)
const UnibaveLogo = () => (
  <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M12 36 Q6 24 12 14 Q20 4 36 6 Q56 8 62 20 Q68 34 54 42 Q38 50 24 42 Q16 38 14 30 Q12 22 20 16 Q28 8 42 12 Q56 16 58 28"
      stroke="#00A651" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Uniarp — fundo azul escuro + U branco (estilo institucional sóbrio)
const UniarpLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="60" height="60" rx="4" fill="#003087" />
    <path d="M14 10 L14 34 Q14 52 30 52 Q46 52 46 34 L46 10"
      fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

// UnC — C curvo azul + círculo no topo (Universidade do Contestado)
const UncLogo = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M48 10 Q18 6 10 28 Q4 44 20 54 Q36 64 52 52"
      stroke="#003087" strokeWidth="7" fill="none" strokeLinecap="round" />
    <circle cx="34" cy="20" r="5.5" fill="#003087" />
  </svg>
);

// ─── Dados das 13 universidades ACAFE ────────────────────────────────────────

interface University {
  name: string;
  region: string;
  color: string;
  Logo: React.FC;
  darkBg?: boolean;
}

const UNIVERSITIES: University[] = [
  { name: 'UNIVALI',     region: 'Itajaí · SC',     color: '#0068B8', Logo: UnivaliLogo    },
  { name: 'unesc',       region: 'Criciúma · SC',   color: '#00A859', Logo: UnescLogo      },
  { name: 'UNIPLAC',     region: 'Lages · SC',      color: '#006080', Logo: UniplacLogo,   darkBg: true },
  { name: 'univille',    region: 'Joinville · SC',  color: '#4CAF50', Logo: UnivilleLogo   },
  { name: 'UNIFEBE',     region: 'Brusque · SC',    color: '#004B9D', Logo: UnifebeLogo    },
  { name: 'UNO',         region: 'Chapecó · SC',    color: '#003DA5', Logo: UnoChapecoLogo },
  { name: 'FURB',        region: 'Blumenau · SC',   color: '#1a3d8a', Logo: FurbLogo       },
  { name: 'UNOESC',      region: 'Joaçaba · SC',    color: '#60C659', Logo: UnoescLogo     },
  { name: 'UNIDAVI',     region: 'Rio do Sul · SC', color: '#003087', Logo: UnidaviLogo    },
  { name: 'Católica SC', region: 'Joinville · SC',  color: '#8B1A1A', Logo: CatolicaScLogo },
  { name: 'unibave',     region: 'Orleans · SC',    color: '#00A651', Logo: UnibaveLogo    },
  { name: 'Uniarp',      region: 'Caçador · SC',    color: '#003087', Logo: UniarpLogo,    darkBg: true },
  { name: 'UnC',         region: 'Concórdia · SC',  color: '#003087', Logo: UncLogo        },
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
