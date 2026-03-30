import { memo } from 'react';

import catolicaScLogo from '@/assets/universities/catolica-sc.png';
import furbLogo from '@/assets/universities/furb.png';
import ieluscLogo from '@/assets/universities/ielusc.png';
import uncLogo from '@/assets/universities/unc.png';
import unescLogo from '@/assets/universities/unesc.png';
import uniarpLogo from '@/assets/universities/uniarp.png';
import unibaveLogo from '@/assets/universities/unibave.png';
import unidaviLogo from '@/assets/universities/unidavi.png';
import unifebeLogo from '@/assets/universities/unifebe.png';
import uniplacLogo from '@/assets/universities/uniplac.png';
import unisatcLogo from '@/assets/universities/unisatc.png';
import univaliLogo from '@/assets/universities/univali.png';
import univilleLogo from '@/assets/universities/univille.png';
import unoChapecoLogo from '@/assets/universities/uno-chapeco.png';
import unoescLogo from '@/assets/universities/unoesc.png';

const UNIVERSITIES = [
  { id: 'univali', label: 'UNIVALI', src: univaliLogo },
  { id: 'unesc', label: 'UNESC', src: unescLogo },
  { id: 'uniplac', label: 'UNIPLAC', src: uniplacLogo },
  { id: 'univille', label: 'UNIVILLE', src: univilleLogo },
  { id: 'unifebe', label: 'UNIFEBE', src: unifebeLogo },
  { id: 'unochapeco', label: 'UNO CHAPECÓ', src: unoChapecoLogo },
  { id: 'furb', label: 'FURB', src: furbLogo },
  { id: 'unoesc', label: 'UNOESC', src: unoescLogo },
  { id: 'unidavi', label: 'UNIDAVI', src: unidaviLogo },
  { id: 'catolica_sc', label: 'CATÓLICA SC', src: catolicaScLogo },
  { id: 'unisatc', label: 'UNISATC', src: unisatcLogo },
  { id: 'unibave', label: 'UNIBAVE', src: unibaveLogo },
  { id: 'uniarp', label: 'UNIARP', src: uniarpLogo },
  { id: 'unc', label: 'UnC', src: uncLogo },
  { id: 'ielusc', label: 'IELUSC', src: ieluscLogo },
] as const;

type University = (typeof UNIVERSITIES)[number];

function UniversityBadge({ u, priority }: { u: University; priority: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 px-3 sm:px-4 shrink-0 cursor-default group">
      <div
        className="w-16 h-12 sm:w-[72px] sm:h-14 rounded-2xl overflow-hidden
                   flex items-center justify-center bg-white/95 border border-border/60
                   group-hover:scale-105 group-hover:shadow-xl transition-all duration-300"
      >
        <img
          src={u.src}
          alt={u.label}
          width={96}
          height={64}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'low'}
          draggable={false}
          className="max-w-[78%] max-h-[72%] object-contain select-none"
        />
      </div>
      <span className="text-[10px] sm:text-[11px] font-black text-foreground/70 group-hover:text-foreground transition-colors duration-300 select-none whitespace-nowrap tracking-tight leading-tight">
        {u.label}
      </span>
    </div>
  );
}

const MemoizedBadge = memo(UniversityBadge);

function UniversityLogos() {
  const items = [...UNIVERSITIES, ...UNIVERSITIES];
  const priorityCount = 6;
  return (
    <div className="w-full overflow-hidden py-3 sm:py-4 flex items-center [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-end">
        {items.map((u, i) => (
          <MemoizedBadge key={`${u.id}-${i}`} u={u} priority={i < priorityCount} />
        ))}
      </div>
    </div>
  );
}

export default memo(UniversityLogos);
