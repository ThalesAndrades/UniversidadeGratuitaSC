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
    <div className="flex items-center justify-center px-3 sm:px-4 shrink-0 cursor-default group">
      <div
        className="w-[5rem] h-[3.2rem] sm:w-[6rem] sm:h-[3.8rem]
                   flex items-center justify-center
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
    <div className="w-full px-3 sm:px-4">
      <div
        className="w-full bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)]
                   overflow-hidden py-4 sm:py-5 flex items-center
                   [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      >
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
          {items.map((u, i) => (
            <MemoizedBadge key={`${u.name}-${i}`} u={u} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(UniversityLogos);
