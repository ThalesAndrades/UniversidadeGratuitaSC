import { memo } from 'react';
import { AcafeConstellation } from '@/components/features/BrandElements';

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50" role="banner">

      {/* ── Barra de identificação institucional ─────────────────────────── */}
      <div className="bg-background border-b border-border/15">
        <div className="container mx-auto px-4 h-7 flex items-center justify-between">
          <span className="text-[9px] font-semibold text-muted-foreground/40 uppercase tracking-[0.24em]">
            ACAFE · Santa Catarina
          </span>

          {/* passaporteacafe.app wordmark */}
          <a
            href="https://passaporteacafe.app/"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            aria-label="Passaporte Acafe — Página inicial"
          >
            <span className="text-[10px] font-black leading-none tracking-tight select-none">
              <span style={{ color: '#8FBE3F' }}>passaporte</span>
              <span style={{ color: '#1B5FAD' }}>acafe</span>
              <span className="text-muted-foreground/50">.app</span>
            </span>
          </a>
        </div>
      </div>

      {/* ── Faixa de cores ACAFE ─────────────────────────────────────────── */}
      <div className="h-[2.5px] w-full flex" role="presentation" aria-hidden="true">
        <div className="flex-[3]" style={{ backgroundColor: '#8FBE3F' }} />
        <div className="flex-[2]" style={{ backgroundColor: '#1B5FAD' }} />
        <div className="flex-1"  style={{ backgroundColor: '#E8B931' }} />
      </div>

      {/* ── Barra principal ───────────────────────────────────────────────── */}
      <nav
        className="bg-card/95 backdrop-blur-none sm:backdrop-blur-md border-b border-border/50"
        style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.28)' }}
        aria-label="Navegação principal"
      >
        <div className="container mx-auto px-4 h-11 sm:h-12 flex items-center justify-between gap-4">

          {/* Identidade do programa */}
          <div className="flex items-center gap-2 shrink-0">
            <AcafeConstellation size={28} color="#8FBE3F" className="shrink-0 drop-shadow-[0_0_6px_rgba(143,190,63,0.3)]" />
            <div className="flex flex-col">
              <span className="text-[8px] font-semibold text-muted-foreground/45 uppercase tracking-[0.22em] leading-none mb-[3px]">
                Gere seu
              </span>
              <h1 className="text-[13px] sm:text-sm font-black text-foreground uppercase tracking-tight leading-none">
                Passaporte <span className="text-primary">Acafe</span>
              </h1>
            </div>
          </div>

          {/* Linha divisória central — desktop */}
          <div className="hidden sm:block flex-1 h-px bg-border/25" aria-hidden="true" />

          {/* Parceiro ACAFE */}
          <a
            href="https://acafe.org.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
            aria-label="ACAFE — Associação Catarinense das Fundações Educacionais"
          >
            {/* Label — desktop */}
            <div className="hidden sm:flex flex-col items-end leading-none">
              <span className="text-[7px] font-semibold text-muted-foreground/38 uppercase tracking-[0.22em] mb-[3px]">
                Rede de universidades
              </span>
              <span className="text-[11px] font-black text-primary lowercase tracking-wider">acafe</span>
            </div>
            <div className="w-px h-7 bg-border/35 hidden sm:block" aria-hidden="true" />
            <AcafeConstellation size={20} color="#8FBE3F" />
            {/* Label — mobile */}
            <span className="text-[10px] font-black text-primary lowercase tracking-wider sm:hidden">acafe</span>
          </a>

        </div>
      </nav>
    </header>
  );
}

export default memo(Header);
export { Header };
