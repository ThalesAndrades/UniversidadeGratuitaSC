import { memo } from 'react';
import { GraduationCapLogo, AcafeConstellation } from '@/components/features/BrandElements';

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* ── Barra de identificação governamental ─────────────────────────── */}
      <div className="bg-background border-b border-border/15">
        <div className="container mx-auto px-4 h-7 flex items-center justify-between">
          <span className="text-[9px] font-semibold text-muted-foreground/40 uppercase tracking-[0.24em]">
            Estado de Santa Catarina
          </span>

          {/* sc.gov.br wordmark */}
          <div className="flex items-center gap-1.5">
            {/* Miniatura bandeira SC */}
            <div className="flex rounded-[2px] overflow-hidden shrink-0" style={{ width: 15, height: 11 }}>
              <div className="flex flex-col w-full">
                <div className="flex-1" style={{ backgroundColor: '#A40006' }} />
                <div className="flex-1" style={{ backgroundColor: '#ffffff22' }} />
                <div className="flex-1" style={{ backgroundColor: '#A40006' }} />
                <div className="flex-1 bg-white/10" />
                <div className="flex-1" style={{ backgroundColor: '#1A5C1A' }} />
              </div>
            </div>
            <span className="text-[10px] font-black leading-none tracking-tight select-none">
              <span style={{ color: '#CC0000' }}>sc.</span>
              <span style={{ color: '#2D7A1F' }}>gov.br</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Faixa de cores bandeira SC ────────────────────────────────────── */}
      <div className="h-[2.5px] w-full flex" aria-hidden="true">
        <div className="flex-[3]" style={{ backgroundColor: '#8FBE3F' }} />
        <div className="flex-[2]" style={{ backgroundColor: '#A40006' }} />
        <div className="flex-1"  style={{ backgroundColor: '#F5E306' }} />
      </div>

      {/* ── Barra principal ───────────────────────────────────────────────── */}
      <div
        className="bg-card/95 backdrop-blur-none sm:backdrop-blur-md border-b border-border/50"
        style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.28)' }}
      >
        <div className="container mx-auto px-4 h-11 sm:h-12 flex items-center justify-between gap-4">

          {/* Identidade do programa */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <GraduationCapLogo size={17} color="#8FBE3F" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-semibold text-muted-foreground/45 uppercase tracking-[0.22em] leading-none mb-[3px]">
                Programa
              </span>
              <h1 className="text-[13px] sm:text-sm font-black text-foreground uppercase tracking-tight leading-none">
                Universidade <span className="text-primary">Gratuita</span>
              </h1>
            </div>
          </div>

          {/* Linha divisória central — desktop */}
          <div className="hidden sm:block flex-1 h-px bg-border/25" />

          {/* Parceiro ACAFE */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Label — desktop */}
            <div className="hidden sm:flex flex-col items-end leading-none">
              <span className="text-[7px] font-semibold text-muted-foreground/38 uppercase tracking-[0.22em] mb-[3px]">
                Em parceria com
              </span>
              <span className="text-[11px] font-black text-primary lowercase tracking-wider">acafe</span>
            </div>
            <div className="w-px h-7 bg-border/35 hidden sm:block" />
            <AcafeConstellation size={20} color="#8FBE3F" className="opacity-90" />
            {/* Label — mobile */}
            <span className="text-[10px] font-black text-primary lowercase tracking-wider sm:hidden">acafe</span>
          </div>

        </div>
      </div>
    </header>
  );
}

export default memo(Header);
export { Header };
