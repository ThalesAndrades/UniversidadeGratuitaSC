import { useState, useRef, lazy, Suspense, memo, useEffect } from 'react';
import type { PassportFormData } from '@/lib/validations';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { InfinityLogo, OverlapSquares, BracketCorner, AcafeConstellation, AcafeLockup, AcafeOfficialLogo, UnivGratuitaLogo, GovernoScLogo, ScStateSeal } from '@/components/features/BrandElements';

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
      className="min-h-screen w-full bg-background text-foreground font-sans flex flex-col"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(143,190,63,0.065) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <Suspense fallback={<div className="h-16 w-full bg-card/50" />}>
        <Header />
      </Suspense>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[70vw] h-[70vw] sm:w-[60vw] sm:h-[60vw] max-w-[700px] max-h-[700px] bg-primary/10 rounded-full blur-[70px] sm:blur-[120px] -translate-y-1/3 translate-x-1/4" style={{ willChange: 'transform' }} />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] sm:w-[50vw] sm:h-[50vw] max-w-[500px] max-h-[500px] bg-primary/5 rounded-full blur-[60px] sm:blur-[100px] translate-y-1/3 -translate-x-1/4" style={{ willChange: 'transform' }} />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-6 pt-[4.8rem] sm:pt-28 relative z-10">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="bg-card rounded-2xl sm:rounded-3xl border border-border/50 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden relative">

            {/* Bracket corner decorations */}
            {([
              { pos: 'top-3 left-3',    rot: 0   },
              { pos: 'top-3 right-3',   rot: 90  },
              { pos: 'bottom-3 left-3', rot: 270 },
              { pos: 'bottom-3 right-3',rot: 180 },
            ] as const).map(({ pos, rot }) => (
              <BracketCorner key={rot} size={20} color="#8FBE3F" className={`absolute ${pos} opacity-40`} rotate={rot} />
            ))}

            {/* Card Header */}
            <div className="relative px-6 pt-7 pb-5 border-b border-border/50 flex flex-col items-center text-center overflow-hidden"
              style={{ background: 'linear-gradient(160deg, hsl(82,30%,22%) 0%, hsl(82,15%,18%) 55%)' }}
            >
              {/* Decorative arc background */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #8FBE3F 0%, transparent 70%)' }} />

              {/* OverlapSquares decoration — top right corner */}
              <div className="absolute top-4 right-4 opacity-60">
                <OverlapSquares size={18} colorA="#3E5715" colorB="#8FBE3F" />
              </div>

              {/* Marca oficial ACAFE */}
              <div className="mb-4 w-full flex flex-col items-center justify-center">
                <div style={{ filter: 'drop-shadow(0 0 20px rgba(143,190,63,0.4))' }}>
                  <AcafeOfficialLogo size={110} color="#ffffff" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight leading-none">
                Passaporte<br />
                <span className="text-primary">Acafe</span>
              </h2>
              {/* Accent stripe */}
              <div className="flex gap-[3px] mt-2 mb-1" aria-hidden="true">
                <div className="h-[3px] w-8 rounded-full" style={{ backgroundColor: '#8FBE3F' }} />
                <div className="h-[3px] w-5 rounded-full" style={{ backgroundColor: '#1B5FAD' }} />
                <div className="h-[3px] w-3 rounded-full" style={{ backgroundColor: '#E8B931' }} />
              </div>
              <p className="text-[10px] text-muted-foreground/60 font-bold tracking-[0.22em] uppercase">
                Associação Catarinense · ACAFE
              </p>
            </div>

            {/* University logos strip */}
            <div className="border-b border-border/30 bg-background/20">
              {/* ACAFE brand header */}
              <div className="flex items-center justify-center gap-2 pt-3 px-4">
                <div className="flex-1 h-px bg-border/40" />
                <div className="flex items-center gap-2">
                  <AcafeLockup size={14} textClassName="tracking-[0.28em] text-primary/90" />
                  <span className="text-[9px] font-medium text-muted-foreground/50 uppercase tracking-wider hidden sm:inline">· universidades associadas</span>
                </div>
                <div className="flex-1 h-px bg-border/40" />
              </div>
              <Suspense fallback={<div className="h-20 animate-pulse bg-muted/20 rounded mx-4 my-3" />}>
                <UniversityLogos />
              </Suspense>
            </div>

            {/* Body */}
            <div className="px-6 py-6 sm:px-8 sm:py-7 flex flex-col items-center text-center gap-4">
              {/* Tagline — "A gente ajuda a gente." com chapéu na referência oficial */}
              <div className="relative w-full" style={{ letterSpacing: '-0.03em' }}>
                <div className="text-[2.2rem] sm:text-[2.65rem] font-black text-foreground/90 leading-[1.3]">
                  A gente
                </div>
                <div className="text-[2.35rem] sm:text-[2.75rem] font-black leading-[1.3]">
                  ajuda a gente<span className="text-primary">.</span>
                </div>
                {/* Chapéu posicionado absoluto: espaço vazio à direita de "A gente", acima do final de "gente" */}
                <span
                  aria-hidden="true"
                  className="absolute"
                  style={{
                    right: '8%',
                    top: '-4%',
                    width: '2.4rem',
                    height: '2.4rem',
                    pointerEvents: 'none',
                  }}
                >
                  <svg viewBox="0 0 120 100" fill="currentColor" width="100%" height="100%">
                    {/* Tabuleiro do capelo (mortarboard — vista 3/4) */}
                    <polygon points="60,4 116,28 60,52 4,28" />
                    {/* Cúpula semi-esférica */}
                    <path d="M30 34 Q30 62 60 68 Q90 62 90 34" opacity="0.85" />
                    {/* Cordão da borla */}
                    <line x1="88" y1="38" x2="104" y2="58" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                    {/* Bolinha da borla */}
                    <circle cx="106" cy="62" r="5.5" fill="currentColor" />
                    {/* Pendentes da borla */}
                    <line x1="102" y1="66" x2="98" y2="82" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="106" y1="67" x2="106" y2="84" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="110" y1="66" x2="114" y2="82" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </span>
              </div>

              <p className="text-sm text-muted-foreground/80 leading-relaxed w-full text-left">
                Gere seu passaporte estudantil para as universidades da rede ACAFE de Santa Catarina.
              </p>

              <button
                onClick={() => setShowPassportModal(true)}
                className="w-full py-4 sm:py-5 rounded-xl font-black text-lg sm:text-xl
                           text-primary-foreground uppercase tracking-wide select-none touch-manipulation
                           flex items-center justify-center gap-3 cta-pulse
                           active:scale-[0.98] active:opacity-90 transition-all duration-200
                           hover:-translate-y-0.5 hover:brightness-110 hover:[animation-play-state:paused]"
                style={{
                  background: 'linear-gradient(135deg, #8FBE3F 0%, #6FA030 100%)',
                }}
              >
                Gerar Passaporte
                <ArrowRight className="w-5 h-5 stroke-[3px] shrink-0" />
              </button>
            </div>

            {/* Rodapé institucional */}
            <div className="border-t border-border/30">

              {/* Trio de logos institucionais — partes envolvidas */}
              <div className="grid grid-cols-3 divide-x divide-border/30">

                {/* Universidade Gratuita — programa */}
                <div className="flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-[#2D3A1A] flex items-center justify-center"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                    <UnivGratuitaLogo size={28} color="#ffffff" />
                  </div>
                  <div className="text-center leading-none mt-0.5">
                    <span className="text-[8px] sm:text-[9px] font-black text-foreground/70 uppercase tracking-tight leading-[1.2] block">
                      Universidade<br />Gratuita
                    </span>
                  </div>
                </div>

                {/* ACAFE — associação (logo oficial destaque) */}
                <a
                  href="https://www.instagram.com/acafeoficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 group hover:bg-primary/5 transition-colors duration-200 active:bg-primary/10"
                  aria-label="ACAFE no Instagram"
                >
                  <AcafeOfficialLogo size={72} color="hsl(var(--primary))" />
                  <div className="text-center leading-none">
                    <span className="text-[7px] sm:text-[8px] text-muted-foreground/45 block group-hover:text-primary/60 transition-colors">
                      @acafeoficial
                    </span>
                  </div>
                </a>

                {/* Governo de SC — SED */}
                <div className="flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 cursor-default">
                  <GovernoScLogo size={30} />
                  <div className="text-center leading-none">
                    <span className="text-[8px] sm:text-[9px] font-black text-foreground/70 uppercase tracking-tight leading-[1.2] block">
                      Governo<br />de SC
                    </span>
                    <span className="text-[7px] text-muted-foreground/40 block mt-[1px] hidden sm:block">
                      Secretaria de Educação
                    </span>
                  </div>
                </div>

              </div>

              {/* Linha legal */}
              <div className="border-t border-border/20 bg-background/40 py-2 px-4 text-center">
                <p className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.18em] leading-none">
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
          <div className="bg-card w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:rounded-3xl sm:max-w-md shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col border-0 sm:border sm:border-border/50 animate-slide-in overflow-hidden">
            <div className="bg-card border-b border-border px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <InfinityLogo size={22} color="#8FBE3F" />
                <div>
                  <h2 id="passport-modal-title" className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">Passaporte Acafe</h2>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">Preencha seus dados para gerar</p>
                </div>
              </div>
              <button
                onClick={() => setShowPassportModal(false)}
                aria-label="Fechar formulário"
                className="w-11 h-11 rounded-full border border-border bg-background hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive text-muted-foreground flex items-center justify-center transition-all duration-200 shrink-0 active:scale-95 touch-manipulation"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
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
