import { memo } from 'react';
import { 
  Shield, 
  Leaf, 
  Square, 
  Clover, 
  Network, 
  Sun, 
  BarChart, 
  User, 
  Orbit, 
  ShieldPlus, 
  Hexagon, 
  RefreshCw, 
  Layers, 
  GraduationCap, 
  Award 
} from 'lucide-react';

const LOGOS = [
  { name: 'UNIVALI', icon: Shield, color: 'text-[#004a8f]', style: 'uppercase font-bold' },
  { name: 'unesc', icon: Leaf, color: 'text-[#00a859]', style: 'lowercase font-bold tracking-tight' },
  { name: 'UNIPLAC', icon: Square, color: 'text-[#003b73]', style: 'uppercase font-bold' },
  { name: 'univille', icon: Clover, color: 'text-[#419448]', style: 'lowercase font-bold' },
  { name: 'UNIFEBE', icon: Network, color: 'text-[#00529b]', style: 'uppercase font-bold' },
  { name: 'UNO CHAPECÓ', icon: Sun, color: 'text-[#0033a0]', style: 'uppercase font-black leading-none text-center' },
  { name: 'FURB', icon: BarChart, color: 'text-[#004b87]', style: 'uppercase font-bold tracking-widest' },
  { name: 'UNOESC', icon: User, color: 'text-[#00a94f]', style: 'uppercase font-bold' },
  { name: 'UNIDAVI', icon: Orbit, color: 'text-[#003882]', style: 'uppercase font-black' },
  { name: 'Católica SC', icon: ShieldPlus, color: 'text-[#cc0000]', style: 'font-bold' },
  { name: 'UNISATC', icon: Hexagon, color: 'text-[#509e2f]', style: 'uppercase font-bold' },
  { name: 'unibave', icon: RefreshCw, color: 'text-[#008c4a]', style: 'lowercase font-bold' },
  { name: 'Uniarp', icon: Layers, color: 'text-[#f37021]', style: 'font-bold' },
  { name: 'UnC', icon: GraduationCap, color: 'text-[#004c97]', style: 'font-black' },
  { name: 'IELUSC', icon: Award, color: 'text-[#003876]', style: 'uppercase font-black' },
];

function UniversityLogos() {
  // Duplicating the array to create a seamless infinite scroll effect
  const marqueeItems = [...LOGOS, ...LOGOS];

  return (
    <div className="w-full overflow-hidden py-6 sm:py-8 relative flex items-center bg-transparent my-2 sm:my-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      {/* Fallback gradient masks for older browsers */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none sm:hidden"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none sm:hidden"></div>
      
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {marqueeItems.map((logo, index) => {
          const Icon = logo.icon;
          return (
            <div 
              key={`${logo.name}-${index}`} 
              className={`flex items-center justify-center gap-2 px-6 sm:px-10 opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-default group`}
            >
              <div className={`p-2.5 sm:p-3 rounded-2xl bg-transparent group-hover:bg-card/50 ${logo.color} transition-all duration-300`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} fill={logo.name === 'UNO CHAPECÓ' || logo.name === 'Católica SC' || logo.name === 'IELUSC' ? 'currentColor' : 'none'} />
              </div>
              <span className={`text-xs sm:text-sm whitespace-nowrap text-foreground/80 group-hover:text-foreground ${logo.style}`}>
                {logo.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(UniversityLogos);
