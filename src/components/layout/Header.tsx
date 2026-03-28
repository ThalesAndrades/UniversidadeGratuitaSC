import { memo } from 'react';
import { AcafeConstellation } from '@/components/features/BrandElements';

// Logo oficial sc.gov.br em SVG
const ScGovLogo = memo(function ScGovLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 110 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SC Gov BR — Governo de Santa Catarina"
    >
      {/* Ícone bandeira SC (escudo simplificado) */}
      <rect x="0" y="2" width="18" height="24" rx="2" fill="#A40006" />
      <rect x="0" y="2" width="18" height="6"  rx="1" fill="#A40006" />
      <rect x="0" y="8" width="18" height="5"  fill="white" />
      <rect x="0" y="13" width="18" height="5" fill="#A40006" />
      <rect x="0" y="18" width="18" height="8" rx="2" fill="#1A5C1A" />
      {/* Estrela dourada */}
      <text x="9" y="25.5" textAnchor="middle" fill="#F5E306" fontSize="7" fontWeight="900"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">★</text>
      {/* Borda do escudo */}
      <rect x="0.5" y="2.5" width="17" height="23" rx="1.5" fill="none" stroke="white" strokeWidth="0.8" opacity="0.4" />

      {/* "sc." em vermelho */}
      <text x="24" y="20" fill="#A40006" fontSize="16" fontWeight="900"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        letterSpacing="-0.3">sc.</text>

      {/* "gov.br" em verde escuro */}
      <text x="52" y="20" fill="#1A5C1A" fontSize="16" fontWeight="900"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        letterSpacing="-0.3">gov.br</text>
    </svg>
  );
});

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      {/* SC flag accent stripe */}
      <div className="h-[3px] w-full flex" aria-hidden="true">
        <div className="flex-[3]" style={{ backgroundColor: '#8FBE3F' }} />
        <div className="flex-[2]" style={{ backgroundColor: '#A40006' }} />
        <div className="flex-1"  style={{ backgroundColor: '#F5E306' }} />
      </div>

      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left: sc.gov.br */}
        <ScGovLogo className="h-6 sm:h-7 w-auto" />

        {/* Right: ACAFE */}
        <div className="flex items-center gap-2 bg-card border border-border/60 rounded-xl px-3 py-1.5">
          <AcafeConstellation size={18} color="#8FBE3F" />
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
