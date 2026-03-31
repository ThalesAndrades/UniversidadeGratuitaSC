import { memo } from 'react';

// ─── Logos oficiais das universidades ACAFE (imagens reais) ─────────────────

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

// ─── Badge (somente logo, sem texto) ────────────────────────────────────────

function UniversityBadge({ u }: { u: University }) {
  return (
    <div className="flex items-center justify-center px-3 sm:px-4 shrink-0 cursor-default group">
      <div
        className="w-[5rem] h-[3.2rem] sm:w-[6rem] sm:h-[3.8rem]
                   flex items-center justify-center
                   group-hover:scale-110 transition-transform duration-300"
        title={u.name}
      >
        <img
          src={u.logo}
          alt={u.name}
          className="max-w-full max-h-full object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
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
