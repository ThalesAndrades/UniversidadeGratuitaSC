import { memo } from 'react';

// ─── Logos oficiais das universidades ACAFE (PNG transparente) ───────────────

import univaliLogo from '../../assets/universities/univali.png';
import unescLogo from '../../assets/universities/unesc.png';
import uniplacLogo from '../../assets/universities/uniplac.png';
import univilleLogo from '../../assets/universities/univille.png';
import unifebeLogo from '../../assets/universities/unifebe.png';
import unoChapecoLogo from '../../assets/universities/uno-chapeco.png';
import furbLogo from '../../assets/universities/furb.png';
import unoescLogo from '../../assets/universities/unoesc.png';
import unidaviLogo from '../../assets/universities/unidavi.png';
import catolicaScLogo from '../../assets/universities/catolica-sc.png';
import uncLogo from '../../assets/universities/unc.png';
import uniarpLogo from '../../assets/universities/uniarp.png';
import unibaveLogo from '../../assets/universities/unibave.png';
import unisatcLogo from '../../assets/universities/unisatc.png';
import ieluscLogo from '../../assets/universities/ielusc.png';

// ─── Dados ──────────────────────────────────────────────────────────────────

interface University {
  name: string;
  logo: string;
}

const UNIVERSITIES: University[] = [
  { name: 'UNIVALI',          logo: univaliLogo    },
  { name: 'UNESC',            logo: unescLogo      },
  { name: 'UNIPLAC',          logo: uniplacLogo    },
  { name: 'Univille',         logo: univilleLogo   },
  { name: 'UNIFEBE',          logo: unifebeLogo    },
  { name: 'UNO Chapecó',      logo: unoChapecoLogo },
  { name: 'FURB',             logo: furbLogo       },
  { name: 'UNOESC',           logo: unoescLogo     },
  { name: 'UNIDAVI',          logo: unidaviLogo    },
  { name: 'Católica SC',      logo: catolicaScLogo },
  { name: 'UnC',              logo: uncLogo        },
  { name: 'Uniarp',           logo: uniarpLogo     },
  { name: 'Unibave',          logo: unibaveLogo    },
  { name: 'UNISATC',          logo: unisatcLogo    },
  { name: 'IELUSC',           logo: ieluscLogo     },
];

// ─── Mini-card com profundidade ─────────────────────────────────────────────

const CARD_SHADOW = [
  '0 0.5px 0 rgba(255,255,255,0.9)',           // top edge highlight (inner bevel)
  '0 1px 2px rgba(0,0,0,0.08)',                // tight contact shadow
  '0 2px 6px rgba(0,0,0,0.06)',                // medium spread
  '0 4px 12px rgba(0,0,0,0.04)',               // soft ambient
].join(', ');

function UniversityBadge({ u }: { u: University }) {
  return (
    <div className="shrink-0 px-1.5 sm:px-2 cursor-default group" title={u.name}>
      <div
        className="w-[3.4rem] h-[2.6rem] sm:w-[4rem] sm:h-[3rem] rounded-[7px]
                   flex items-center justify-center p-[5px] sm:p-1.5
                   group-hover:-translate-y-0.5 group-hover:scale-[1.06]
                   transition-all duration-300 ease-out"
        style={{
          backgroundColor: '#ffffff',
          boxShadow: CARD_SHADOW,
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <img
          src={u.logo}
          alt={u.name}
          className="max-w-full max-h-full object-contain"
          loading="lazy"
          decoding="async"
        />
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
      className="w-full overflow-hidden py-2.5 sm:py-3 flex items-center"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
      }}
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
