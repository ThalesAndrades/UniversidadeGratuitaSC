import { useState, useRef, lazy, Suspense, memo, useEffect } from 'react';
import type { PassportFormData } from '@/lib/validations';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { InfinityLogo, OverlapSquares, BracketCorner, AcafeConstellation, AcafeLockup, AcafeOfficialLogo, ScStateSeal } from '@/components/features/BrandElements';
import univGratuitaLogo from '@/assets/universidade-gratuita-logo.png';
import sedLogo from '@/assets/sed-logo.png';

const Header = lazy(() => import('@/components/layout/Header').then(m => ({ default: m.Header })));
const UniversityLogos = lazy(() => import('@/components/features/UniversityLogos'));
const PassportSplash = lazy(() => import('@/components/features/PassportSplash').then(m => ({ default: m.PassportSplash })));
const PassportForm = lazy(() => import('@/components/forms/PassportForm').then(m => ({ default: m.PassportForm })));

const RATE_LIMIT_TIME = 10000;

function captureLead(data: PassportFormData) {
  if (typeof window === 'undefined') return;
  if (!data?.consent) return;

  const run = () => {
    try {
      const url = new URL('/api/leads.php', window.location.origin).toString();
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        university: data.university,
        course: data.course,
        consent: !!data.consent,
        ts: Math.floor(Date.now() / 1000),
        hp: '',
      };

      const body = JSON.stringify(payload);

      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const ok = navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
        if (ok) return;
      }

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    } catch {}
  };

  const ric = (window as any).requestIdleCallback as undefined | ((cb: () => void, opts?: { timeout: number }) => void);
  if (typeof ric === 'function') ric(run, { timeout: 1200 });
  else setTimeout(run, 0);
}

/* ── Layered shadow system ──────────────────────────────────────────────────
   Level 1 (card):    close contact shadow + medium spread + deep ambient
   Level 2 (header):  inset bottom edge light + subtle top highlight
   Level 3 (CTA):     glow + lift shadow
   Level 4 (inset):   recessed panels (carousel, footer)
*/
const SHADOW = {
  card: '0 1px 2px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.25), 0 16px 48px rgba(0,0,0,0.4)',
  header: 'inset 0 -1px 0 rgba(255,255,255,0.04)',
  footerInset: 'inset 0 1px 3px rgba(0,0,0,0.15)',
  sedChip: '0 1px 3px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
  modal: '0 0 0 1px rgba(255,255,255,0.05), 0 24px 80px rgba(0,0,0,0.7)',
} as const;

function Home() {
  const lastSubmitTimeRef = useRef(0);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [passportData, setPassportData] = useState<PassportFormData | null>(null);

  useEffect(() => {
    if (window.location.search || window.location.hash) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!showPassportModal) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPassportModal(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showPassportModal]);

  const handleSubmit = async (data: PassportFormData) => {
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < RATE_LIMIT_TIME) {
      toast.error('Aguarde alguns segundos antes de tentar novamente.');
      return;
    }
    lastSubmitTimeRef.current = now;

    try {
      if (!data.photo.startsWith('data:image/') || data.firstName.includes('<script>')) {
        throw new Error('Dados inválidos.');
      }
      setPassportData(data);
      captureLead(data);
      setShowPassportModal(false);
      setShowSplash(true);
      toast.success('Passaporte gerado com sucesso!');
    } catch {
      toast.error('Ação bloqueada. Dados inválidos.');
      setShowPassportModal(false);
    }
  };

  return (
    <div
      className="min-h-[100dvh] w-full bg-background text-foreground font-sans flex flex-col"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(143,190,63,0.04) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <Suspense fallback={<div className="h-16 w-full bg-card/50" />}>
        <Header />
      </Suspense>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-[20%] -right-[10%] w-[55vw] h-[55vw] max-w-[500px] max-h-[500px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(143,190,63,0.12) 0%, transparent 70%)', willChange: 'transform' }}
        />
        <div
          className="absolute -bottom-[15%] -left-[10%] w-[45vw] h-[45vw] max-w-[380px] max-h-[380px] rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(143,190,63,0.06) 0%, transparent 70%)', willChange: 'transform' }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-4 pt-[4.5rem] sm:pt-24 pb-6 relative z-10">
        <div className="w-full max-w-[22rem] sm:max-w-md">

          {/* ═══════════════ CARD PRINCIPAL ═══════════════ */}
          <div
            className="bg-card rounded-2xl overflow-hidden relative"
            style={{
              boxShadow: SHADOW.card,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >

            {/* Bracket corners */}
            {([
              { pos: 'top-2.5 left-2.5',    rot: 0   },
              { pos: 'top-2.5 right-2.5',   rot: 90  },
              { pos: 'bottom-2.5 left-2.5', rot: 270 },
              { pos: 'bottom-2.5 right-2.5',rot: 180 },
            ] as const).map(({ pos, rot }) => (
              <BracketCorner key={rot} size={16} color="#8FBE3F" className={`absolute ${pos} opacity-25`} rotate={rot} />
            ))}

            {/* ── Card Header ── */}
            <div
              className="relative px-5 pt-6 pb-4 sm:px-6 sm:pt-7 sm:pb-5 flex flex-col items-center text-center overflow-hidden"
              style={{
                background: 'linear-gradient(165deg, hsl(82,28%,21%) 0%, hsl(82,12%,15%) 100%)',
                boxShadow: SHADOW.header,
              }}
            >
              {/* Decorative radial */}
              <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-12 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #8FBE3F 0%, transparent 65%)' }} />

              <div className="absolute top-3 right-3 opacity-40">
                <OverlapSquares size={14} colorA="#3E5715" colorB="#8FBE3F" />
              </div>

              <div className="mb-3" style={{ filter: 'drop-shadow(0 2px 12px rgba(143,190,63,0.3))' }}>
                <AcafeOfficialLogo size={90} color="#ffffff" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight leading-none">
                Passaporte{' '}
                <span className="text-primary">Acafe</span>
              </h2>

              <div className="flex gap-[3px] mt-2" aria-hidden="true">
                <div className="h-[2.5px] w-7 rounded-full bg-[#8FBE3F]" />
                <div className="h-[2.5px] w-4 rounded-full bg-[#1B5FAD]" />
                <div className="h-[2.5px] w-2.5 rounded-full bg-[#E8B931]" />
              </div>

              <p className="text-[9px] sm:text-[10px] text-muted-foreground/50 font-bold tracking-[0.2em] uppercase mt-1.5">
                Associação Catarinense · ACAFE
              </p>
            </div>

            {/* ── Faixa universidades (recessed) ── */}
            <div>
              <a
                href="https://acafe.org.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 pt-2.5 pb-1 px-4 group transition-colors duration-200"
              >
                <div className="flex-1 h-px bg-border/25 group-hover:bg-primary/20 transition-colors" />
                <div className="flex items-center gap-1.5">
                  <AcafeLockup size={12} textClassName="tracking-[0.25em] text-primary/75 group-hover:text-primary transition-colors" />
                  <span className="text-[8px] font-semibold text-muted-foreground/35 uppercase tracking-wider group-hover:text-primary/60 transition-colors">
                    <span className="hidden sm:inline">· universidades associadas · </span>
                    <span className="inline-flex items-center gap-0.5">
                      acafe.org.br
                      <svg className="w-2 h-2 opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </span>
                  </span>
                </div>
                <div className="flex-1 h-px bg-border/25 group-hover:bg-primary/20 transition-colors" />
              </a>
              <Suspense fallback={<div className="h-12 animate-pulse bg-muted/10 rounded mx-4 my-1.5" />}>
                <UniversityLogos />
              </Suspense>
            </div>

            {/* ── Body / CTA ── */}
            <div className="px-5 py-5 sm:px-7 sm:py-6 flex flex-col items-center text-center gap-3.5">
              <img
                src="./tagline.png"
                alt="A gente ajuda a gente."
                className="w-full h-auto select-none rounded-lg"
                draggable={false}
                loading="eager"
              />

              <p className="text-[13px] sm:text-sm text-muted-foreground/70 leading-relaxed w-full text-left">
                Gere seu passaporte estudantil para as universidades da rede ACAFE de Santa Catarina.
              </p>

              <button
                onClick={() => setShowPassportModal(true)}
                className="w-full py-3.5 sm:py-4 rounded-xl font-black text-base sm:text-lg
                           text-primary-foreground uppercase tracking-wide select-none touch-manipulation
                           flex items-center justify-center gap-2.5 cta-pulse
                           active:scale-[0.98] active:opacity-90 transition-all duration-200
                           hover:-translate-y-0.5 hover:brightness-110 hover:[animation-play-state:paused]"
                style={{
                  background: 'linear-gradient(135deg, #8FBE3F 0%, #6FA030 100%)',
                  boxShadow: '0 2px 8px rgba(143,190,63,0.35), 0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
              >
                Gerar Passaporte
                <ArrowRight className="w-4.5 h-4.5 stroke-[3px] shrink-0" />
              </button>
            </div>

            {/* ── Rodapé institucional (recessed) ── */}
            <div
              style={{
                boxShadow: SHADOW.footerInset,
                background: 'linear-gradient(180deg, hsl(82,14%,16%) 0%, hsl(82,14%,14%) 100%)',
              }}
            >
              <div className="grid grid-cols-3 divide-x divide-border/15">

                {/* Universidade Gratuita */}
                <div className="flex items-center justify-center py-3 px-2">
                  <img
                    src={univGratuitaLogo}
                    alt="Universidade Gratuita"
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain invert dark:invert-0 opacity-85"
                  />
                </div>

                {/* ACAFE */}
                <a
                  href="https://www.instagram.com/acafeoficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1 py-3 px-2 group hover:bg-primary/5 transition-colors duration-200 active:bg-primary/10"
                  aria-label="ACAFE no Instagram"
                >
                  <AcafeOfficialLogo size={60} color="hsl(var(--primary))" />
                  <span className="text-[7px] text-muted-foreground/35 group-hover:text-primary/60 transition-colors">
                    @acafeoficial
                  </span>
                </a>

                {/* SED */}
                <div className="flex items-center justify-center py-3 px-2">
                  <div
                    className="rounded-md p-1 sm:p-1.5"
                    style={{
                      backgroundColor: '#ffffff',
                      boxShadow: SHADOW.sedChip,
                    }}
                  >
                    <img
                      src={sedLogo}
                      alt="SED - Secretaria da Educação"
                      className="h-7 sm:h-9 w-auto object-contain"
                    />
                  </div>
                </div>

              </div>

              <div className="border-t border-border/10 py-1.5 px-4 text-center">
                <p className="text-[8px] sm:text-[9px] text-muted-foreground/30 uppercase tracking-[0.15em] leading-none">
                  ACAFE · Associação Catarinense das Fundações Educacionais
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Form Modal */}
      {showPassportModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="passport-modal-title"
          className="fixed inset-0 bg-background/95 backdrop-blur-none sm:backdrop-blur-xl z-50 flex flex-col sm:items-center sm:justify-center sm:p-4 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPassportModal(false); }}
        >
          <div
            className="bg-card w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:rounded-2xl sm:max-w-md flex flex-col border-0 sm:border sm:border-border/50 animate-slide-in overflow-hidden"
            style={{ boxShadow: SHADOW.modal }}
          >
            <div className="bg-card border-b border-border px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <InfinityLogo size={20} color="#8FBE3F" />
                <div>
                  <h2 id="passport-modal-title" className="text-base sm:text-lg font-black text-foreground uppercase tracking-tight">Passaporte Acafe</h2>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Preencha seus dados para gerar</p>
                </div>
              </div>
              <button
                onClick={() => setShowPassportModal(false)}
                aria-label="Fechar formulário"
                className="w-10 h-10 rounded-full border border-border bg-background hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive text-muted-foreground flex items-center justify-center transition-all duration-200 shrink-0 active:scale-95 touch-manipulation"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Suspense fallback={
                <div className="h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              }>
                <PassportForm onSubmit={handleSubmit} />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Splash */}
      {showSplash && passportData && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <PassportSplash data={passportData} onClose={() => { setShowSplash(false); setPassportData(null); }} />
        </Suspense>
      )}
    </div>
  );
}

export default memo(Home);
