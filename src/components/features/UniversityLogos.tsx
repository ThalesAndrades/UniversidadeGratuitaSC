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
    <div className="shrink-0 px-1 sm:px-1.5 cursor-default group">
      <div
        className="w-11 h-8 sm:w-13 sm:h-9
                   flex items-center justify-center p-1
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
      className="w-full overflow-hidden py-1.5 sm:py-2 mx-4 sm:mx-5 rounded-lg flex items-center"
      style={{
        width: 'calc(100% - 2rem)',
        backgroundColor: '#f8f8f8',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
        maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
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
