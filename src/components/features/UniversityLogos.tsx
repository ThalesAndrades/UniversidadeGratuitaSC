import { memo } from 'react';

// ─── Logos oficiais das universidades ACAFE (imagens reais) ─────────────────

import univaliLogo from '../../assets/universities/univali.jpeg';
import unescLogo from '../../assets/universities/unesc.jpeg';
import uniplacLogo from '../../assets/universities/uniplac.jpeg';
import univilleLogo from '../../assets/universities/univille.jpeg';
import unifebeLogo from '../../assets/universities/unifebe.jpeg';
import unoChapecoLogo from '../../assets/universities/uno-chapeco.jpeg';
import furbLogo from '../../assets/universities/furb.jpeg';
import unoescLogo from '../../assets/universities/unoesc.jpeg';
import unidaviLogo from '../../assets/universities/unidavi.jpeg';
import catolicaScLogo from '../../assets/universities/catolica-sc.jpeg';
import uncLogo from '../../assets/universities/unc.jpeg';
import uniarpLogo from '../../assets/universities/uniarp.jpeg';
import unibaveLogo from '../../assets/universities/unibave.jpeg';
import unisatcLogo from '../../assets/universities/unisatc.jpeg';
import ieluscLogo from '../../assets/universities/ielusc.jpeg';

// ─── Dados das universidades ACAFE ──────────────────────────────────────────

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

// ─── Badge (somente logo, sem texto) ────────────────────────────────────────

function UniversityBadge({ u }: { u: University }) {
  return (
    <div className="flex items-center justify-center px-2 sm:px-3 shrink-0 cursor-default group">
      <div
        className="w-[4.5rem] h-[3rem] sm:w-[5.5rem] sm:h-[3.5rem] rounded-lg overflow-hidden
                   flex items-center justify-center p-1 sm:p-1.5 bg-white
                   group-hover:scale-105 group-hover:shadow-md transition-all duration-300"
        style={{
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
        title={u.name}
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
