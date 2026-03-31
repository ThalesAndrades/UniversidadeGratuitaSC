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

// ─── Badge ──────────────────────────────────────────────────────────────────

function UniversityBadge({ u }: { u: University }) {
  return (
    <div className="shrink-0 px-1.5 sm:px-2 cursor-default group">
      <div
        className="w-14 h-10 sm:w-16 sm:h-11 rounded-md
                   flex items-center justify-center p-1.5
                   group-hover:scale-105 transition-transform duration-300"
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
      className="w-full bg-white/95 overflow-hidden py-2.5 sm:py-3 flex items-center
                 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
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
