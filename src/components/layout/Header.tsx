import { memo } from 'react';
import { InfinityLogo, AcafeConstellation } from '@/components/features/BrandElements';

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      {/* SC flag accent stripe — verde / vermelho / amarelo */}
      <div className="h-[3px] w-full flex" aria-hidden="true">
        <div className="flex-[3]" style={{ backgroundColor: '#8FBE3F' }} />
        <div className="flex-[2]" style={{ backgroundColor: '#A40006' }} />
        <div className="flex-1" style={{ backgroundColor: '#F5E306' }} />
      </div>

      <div className="container mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Left: SC Government brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 bg-primary/10 rounded-lg border border-primary/20">
            <InfinityLogo size={26} color="#8FBE3F" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold leading-tight tracking-widest uppercase"
              style={{ color: '#A40006' }}>
              Governo de
            </span>
            <p className="text-sm sm:text-base font-black text-foreground uppercase tracking-tight leading-none">
              Santa Catarina
            </p>
          </div>
        </div>

        {/* Right: ACAFE brand */}
        <div className="flex items-center gap-2 bg-card border border-border/60 rounded-xl px-3 py-1.5">
          <AcafeConstellation size={20} color="#8FBE3F" />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-black text-primary tracking-wider lowercase">acafe</span>
            <span className="text-[8px] font-semibold text-muted-foreground uppercase tracking-widest hidden sm:block">
              Rede de Universidades
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
export { Header };
