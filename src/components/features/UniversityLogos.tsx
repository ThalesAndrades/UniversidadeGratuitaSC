import { memo } from 'react';

// ─── Logos oficiais das universidades ACAFE (PNG transparente, defringe) ────

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

// ─── Badge ──────────────────────────────────────────────────────────────────

function UniversityBadge({ u }: { u: University }) {
  return (
    <div className="shrink-0 px-2 sm:px-2.5 cursor-default group">
      <div
        className="w-12 h-9 sm:w-14 sm:h-10
                   flex items-center justify-center
                   group-hover:scale-110 transition-transform duration-300"
        title={u.name}
      >
        <img
          src={u.logo}
          alt={u.name}
          className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
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
      className="w-full overflow-hidden py-2 sm:py-2.5 flex items-center"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
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
