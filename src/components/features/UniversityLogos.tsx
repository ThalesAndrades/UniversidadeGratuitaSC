import { memo, useState } from 'react';

interface University {
  name: string;
  region: string;
  domain: string;
  color: string;
  accent: string;
  mark: string;
}

const UNIVERSITIES: University[] = [
  { name: 'UNIVALI',     region: 'Itajaí · SC',      domain: 'univali.br',        color: '#003E7E', accent: '#0055B3', mark: 'UV'   },
  { name: 'UNESC',       region: 'Criciúma · SC',     domain: 'unesc.net',         color: '#005C33', accent: '#008C4F', mark: 'UE'   },
  { name: 'UNIPLAC',     region: 'Lages · SC',        domain: 'uniplac.edu.br',    color: '#1B2F6E', accent: '#2B48A8', mark: 'UP'   },
  { name: 'univille',    region: 'Joinville · SC',    domain: 'univille.edu.br',   color: '#256B25', accent: '#389638', mark: 'UVL'  },
  { name: 'UNIFEBE',     region: 'Brusque · SC',      domain: 'unifebe.edu.br',    color: '#003D82', accent: '#005ABF', mark: 'UF'   },
  { name: 'UNOCHAPECÓ',  region: 'Chapecó · SC',      domain: 'unochapeco.edu.br', color: '#002070', accent: '#0033A0', mark: 'UNO'  },
  { name: 'FURB',        region: 'Blumenau · SC',     domain: 'furb.br',           color: '#003C70', accent: '#004B87', mark: 'FURB' },
  { name: 'UNOESC',      region: 'Joaçaba · SC',      domain: 'unoesc.edu.br',     color: '#006830', accent: '#009646', mark: 'UO'   },
  { name: 'UNIDAVI',     region: 'Rio do Sul · SC',   domain: 'unidavi.edu.br',    color: '#002860', accent: '#003882', mark: 'UD'   },
  { name: 'Católica SC', region: 'Joinville · SC',    domain: 'catolicasc.edu.br', color: '#8B0000', accent: '#C00000', mark: 'CSC'  },
  { name: 'UNISATC',     region: 'Criciúma · SC',     domain: 'unisatc.com.br',    color: '#2A6010', accent: '#509E2F', mark: 'US'   },
  { name: 'unibave',     region: 'Orleans · SC',      domain: 'unibave.net',       color: '#005530', accent: '#007A45', mark: 'UB'   },
  { name: 'Uniarp',      region: 'Caçador · SC',      domain: 'uniarp.edu.br',     color: '#B04000', accent: '#E05010', mark: 'UA'   },
  { name: 'UnC',         region: 'Concórdia · SC',    domain: 'unc.br',            color: '#003870', accent: '#004C97', mark: 'UC'   },
  { name: 'IELUSC',      region: 'Joinville · SC',    domain: 'ielusc.br',         color: '#002050', accent: '#003070', mark: 'IE'   },
];

function FallbackMark({ u, idx }: { u: University; idx: number }) {
  const gradId = `fbg-${idx}`;
  const fs = u.mark.length >= 4 ? 11 : u.mark.length === 3 ? 13 : 16;
  return (
    <svg width="100%" height="100%" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={u.color} />
          <stop offset="100%" stopColor={u.accent} />
        </linearGradient>
      </defs>
      <rect width="56" height="56" fill={`url(#${gradId})`} />
      <circle cx="54" cy="2"  r="22" fill="white" fillOpacity="0.07" />
      <circle cx="2"  cy="54" r="16" fill="white" fillOpacity="0.05" />
      <rect x="6" y="4" width="44" height="15" rx="7" fill="white" fillOpacity="0.09" />
      <text
        x="28" y="33"
        textAnchor="middle"
        fill="white"
        fontWeight="900"
        fontSize={fs}
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        letterSpacing={u.mark.length >= 3 ? '-0.5' : '0.5'}
      >{u.mark}</text>
      <rect x="14" y="49" width="28" height="2.5" rx="1.25" fill="white" fillOpacity="0.22" />
    </svg>
  );
}

function UniversityBadge({ u, idx }: { u: University; idx: number }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const showReal = !error;

  return (
    <div className="flex flex-col items-center gap-2 px-3 sm:px-4 shrink-0 cursor-default group">
      {/* Badge */}
      <div
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] sm:rounded-2xl overflow-hidden
                   shadow-md group-hover:scale-110 transition-all duration-300 flex items-center justify-center"
        style={{
          background: loaded && showReal ? '#ffffff' : undefined,
          border: loaded && showReal ? `1.5px solid ${u.color}28` : 'none',
          boxShadow: `0 4px 14px ${u.color}40`,
        }}
      >
        {/* Real logo via clearbit */}
        {showReal && (
          <img
            src={`https://logo.clearbit.com/${u.domain}`}
            alt={u.name}
            width={56}
            height={56}
            className={`absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-500
                        ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            loading="lazy"
          />
        )}

        {/* Fallback gradient badge — shown while loading or on error */}
        {(!loaded || error) && (
          <div className="absolute inset-0">
            <FallbackMark u={u} idx={idx} />
          </div>
        )}

        {/* Brand color bottom stripe on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
          style={{ backgroundColor: u.color }}
        />
      </div>

      {/* Labels */}
      <div className="flex flex-col items-center gap-0">
        <span className="text-[10px] sm:text-[11px] font-black text-foreground/70 group-hover:text-foreground
                         transition-colors duration-300 select-none whitespace-nowrap tracking-tight leading-tight">
          {u.name}
        </span>
        <span className="text-[8px] sm:text-[9px] text-muted-foreground/40 select-none whitespace-nowrap
                         leading-tight hidden sm:block">
          {u.region}
        </span>
      </div>
    </div>
  );
}

const MemoizedBadge = memo(UniversityBadge);

function UniversityLogos() {
  const items = [...UNIVERSITIES, ...UNIVERSITIES];

  return (
    <div
      className="w-full overflow-hidden py-3 sm:py-4 flex items-center
                 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-end">
        {items.map((u, i) => (
          <MemoizedBadge key={`${u.name}-${i}`} u={u} idx={i} />
        ))}
      </div>
    </div>
  );
}

export default memo(UniversityLogos);
