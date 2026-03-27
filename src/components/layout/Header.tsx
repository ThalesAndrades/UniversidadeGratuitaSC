import { memo } from 'react';

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Official SC Icon based on image */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Red rounded square background */}
            <div className="absolute inset-0 bg-primary rounded-lg"></div>
            {/* Green gradient diamond */}
            <div className="absolute inset-1 bg-gradient-to-br from-foreground to-foreground/80 rotate-45 rounded-sm"></div>
            {/* SC Text */}
            <span className="relative z-10 text-background font-black text-lg tracking-tighter" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>SC</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[10px] sm:text-xs font-bold text-muted-foreground leading-tight tracking-widest uppercase">Governo de</h1>
            <p className="text-sm sm:text-base font-black text-foreground uppercase tracking-tight leading-none">Santa Catarina</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
export { Header };
