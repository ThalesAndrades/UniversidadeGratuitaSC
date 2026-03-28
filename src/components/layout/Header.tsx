import { memo } from 'react';
import { InfinityLogo } from '@/components/features/BrandElements';

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Brand infinity logomark */}
          <div className="flex items-center justify-center w-9 h-9 bg-primary/10 rounded-lg border border-primary/20">
            <InfinityLogo size={26} color="#8FBE3F" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-[10px] sm:text-xs font-bold text-muted-foreground leading-tight tracking-widest uppercase">
              Governo de
            </h1>
            <p className="text-sm sm:text-base font-black text-foreground uppercase tracking-tight leading-none">
              Santa Catarina
            </p>
          </div>
        </div>

        {/* Right badge */}
        <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">ACAFE</span>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
export { Header };
