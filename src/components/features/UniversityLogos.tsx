import { memo } from 'react';

// ─── Logos oficiais das universidades ACAFE (imagens reais) ─────────────────

import furbLogo from '../../assets/universities/furb.png';
import unescLogo from '../../assets/universities/unesc.png';
import uniplacLogo from '../../assets/universities/uniplac.png';
import univaliLogo from '../../assets/universities/univali.png';
import univilleLogo from '../../assets/universities/univille.png';
import unifebeLogo from '../../assets/universities/unifebe.png';
import unoChapecoLogo from '../../assets/universities/uno-chapeco.png';
import unoescLogo from '../../assets/universities/unoesc.png';
import unidaviLogo from '../../assets/universities/unidavi.png';
import catolicaScLogo from '../../assets/universities/catolica-sc.png';
import unibaveLogo from '../../assets/universities/unibave.png';
import uniarpLogo from '../../assets/universities/uniarp.png';
import uncLogo from '../../assets/universities/unc.png';
import unisatcLogo from '../../assets/universities/unisatc.png';
import ieluscLogo from '../../assets/universities/ielusc.png';

// ─── Dados das universidades ACAFE ──────────────────────────────────────────

interface University {
  name: string;
  logo: string;
}

const UNIVERSITIES: University[] = [
  { name: 'UNIVALI',     logo: univaliLogo    },
  { name: 'UNESC',       logo: unescLogo      },
  { name: 'UNIPLAC',     logo: uniplacLogo    },
  { name: 'Univille',    logo: univilleLogo   },
  { name: 'UNIFEBE',     logo: unifebeLogo    },
  { name: 'UNO Chapecó', logo: unoChapecoLogo },
  { name: 'FURB',        logo: furbLogo       },
  { name: 'UNOESC',      logo: unoescLogo     },
  { name: 'UNIDAVI',     logo: unidaviLogo    },
  { name: 'Católica SC', logo: catolicaScLogo },
  { name: 'UNIBAVE',     logo: unibaveLogo    },
  { name: 'Uniarp',      logo: uniarpLogo     },
  { name: 'UnC',         logo: uncLogo        },
  { name: 'UNISATC',     logo: unisatcLogo    },
  { name: 'IELUSC',      logo: ieluscLogo     },
];

// ─── Badge (somente logo, sem texto) ────────────────────────────────────────

function UniversityBadge({ u }: { u: University }) {
  return (
    <div className="flex items-center justify-center px-3 sm:px-5 shrink-0 cursor-default group">
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden
                   flex items-center justify-center p-2 sm:p-2.5 bg-white
                   group-hover:scale-110 group-hover:shadow-xl transition-all duration-300"
        style={{
          border: '1.5px solid rgba(0,0,0,0.06)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        }}
      >
        <img
          src={u.logo}
          alt={u.name}
          className="w-full h-full object-contain"
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
