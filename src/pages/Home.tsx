import { useState, useRef, lazy, Suspense, memo, useEffect } from 'react';
import { PassportFormData } from '@/lib/validations';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { InfinityLogo, OverlapSquares, BracketCorner, GraduationCapLogo, AcafeConstellation } from '@/components/features/BrandElements';

const Header = lazy(() => import('@/components/layout/Header').then(m => ({ default: m.Header })));
const UniversityLogos = lazy(() => import('@/components/features/UniversityLogos'));
const PassportSplash = lazy(() => import('@/components/features/PassportSplash').then(m => ({ default: m.PassportSplash })));
const PassportForm = lazy(() => import('@/components/forms/PassportForm').then(m => ({ default: m.PassportForm })));

const RATE_LIMIT_TIME = 10000;

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
      setShowPassportModal(false);
      setShowSplash(true);
      toast.success('Passaporte gerado com sucesso!');
    } catch {
      toast.error('Ação bloqueada. Dados inválidos.');
      setShowPassportModal(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans flex flex-col">
      <Suspense fallback={<div className="h-16 w-full bg-card/50" />}>
        <Header />
      </Suspense>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-primary/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-6 pt-20 sm:pt-28 relative z-10">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="bg-card rounded-2xl sm:rounded-3xl border border-border/50 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden relative">

            {/* Bracket corner decorations */}
            <BracketCorner size={20} color="#8FBE3F" className="absolute top-3 left-3 opacity-40" rotate={0} />
            <BracketCorner size={20} color="#8FBE3F" className="absolute top-3 right-3 opacity-40" rotate={90} />
            <BracketCorner size={20} color="#8FBE3F" className="absolute bottom-3 left-3 opacity-40" rotate={270} />
            <BracketCorner size={20} color="#8FBE3F" className="absolute bottom-3 right-3 opacity-40" rotate={180} />

            {/* Card Header */}
            <div className="relative bg-card px-6 pt-7 pb-5 border-b border-border/50 flex flex-col items-center text-center">

              {/* OverlapSquares decoration — top right corner */}
              <div className="absolute top-4 right-4 opacity-60">
                <OverlapSquares size={18} colorA="#3E5715" colorB="#8FBE3F" />
              </div>

              {/* Graduation cap logomark */}
              <div className="mb-4 relative">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <GraduationCapLogo size={42} color="#8FBE3F" />
                </div>
                {/* glow pulse ring */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 animate-ping" style={{ animationDuration: '3s' }} />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight leading-none">
                Universidade<br />
                <span className="text-primary">Gratuita</span>
              </h2>
              {/* SC flag accent stripe under title */}
              <div className="flex gap-[3px] mt-2 mb-1" aria-hidden="true">
                <div className="h-[3px] w-8 rounded-full" style={{ backgroundColor: '#8FBE3F' }} />
                <div className="h-[3px] w-5 rounded-full" style={{ backgroundColor: '#A40006' }} />
                <div className="h-[3px] w-3 rounded-full" style={{ backgroundColor: '#F5E306' }} />
              </div>
              <p className="text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase">
                Programa do Governo de SC
              </p>
            </div>

            {/* University logos strip */}
            <div className="border-b border-border/30 bg-background/20">
              {/* ACAFE brand header */}
              <div className="flex items-center justify-center gap-2 pt-3 pb-0">
                <AcafeConstellation size={16} color="#8FBE3F" />
                <span className="text-[11px] font-black tracking-[0.22em] text-primary lowercase">acafe</span>
                <span className="text-[9px] font-semibold text-muted-foreground/70 uppercase tracking-wider">· Rede de Universidades Catarinenses</span>
              </div>
              <Suspense fallback={<div className="h-12 animate-pulse bg-muted/20 rounded" />}>
                <UniversityLogos />
              </Suspense>
            </div>

            {/* Body */}
            <div className="px-6 py-6 sm:px-8 sm:py-8 flex flex-col items-center text-center gap-5">
              {/* Tagline */}
              <div className="flex flex-col items-start font-sans tracking-tighter leading-[0.82] w-full">
                <span className="text-3xl sm:text-4xl font-black">A gente</span>
                <div className="flex items-end gap-3">
                  <span className="text-[2.6rem] sm:text-5xl font-black">
                    ajuda a gente<span className="text-primary">.</span>
                  </span>
                  {/* OverlapSquares inline decoration */}
                  <OverlapSquares size={16} colorA="#3E5715" colorB="#8FBE3F" className="mb-1 opacity-70 shrink-0" />
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Gere seu passaporte estudantil e acesse as universidades da rede ACAFE gratuitamente.
              </p>

              <button
                onClick={() => setShowPassportModal(true)}
                className="w-full py-4 sm:py-5 bg-primary hover:bg-primary/90 active:scale-[0.98] active:opacity-90 text-primary-foreground rounded-xl font-black text-lg sm:text-xl shadow-[0_8px_24px_hsl(var(--primary)/0.4)] hover:shadow-[0_12px_32px_hsl(var(--primary)/0.6)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 uppercase tracking-wide select-none touch-manipulation"
              >
                Gerar Passaporte
                <ArrowRight className="w-5 h-5 stroke-[3px] shrink-0" />
              </button>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-border/30 text-center bg-background/20 flex items-center justify-center gap-3">
              <BracketCorner size={10} color="#8FBE3F" className="opacity-50" rotate={0} />
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                Governo de Santa Catarina · Rede ACAFE
              </p>
              <BracketCorner size={10} color="#8FBE3F" className="opacity-50" rotate={180} />
            </div>
          </div>
        </div>
      </main>

      {/* Form Modal */}
      {showPassportModal && (
        <div
          className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex flex-col sm:items-center sm:justify-center sm:p-4 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPassportModal(false); }}
        >
          <div className="bg-card w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:rounded-3xl sm:max-w-md shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col border-0 sm:border sm:border-border/50 animate-slide-in overflow-hidden">
            <div className="bg-card border-b border-border px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <InfinityLogo size={22} color="#8FBE3F" />
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">Criar Passaporte</h2>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">Preencha seus dados oficiais</p>
                </div>
              </div>
              <button
                onClick={() => setShowPassportModal(false)}
                aria-label="Fechar formulário"
                className="w-9 h-9 rounded-full border border-border bg-background hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive text-muted-foreground flex items-center justify-center transition-all duration-200 shrink-0 active:scale-95 touch-manipulation"
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
