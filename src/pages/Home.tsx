import { useState, lazy, Suspense, memo, useEffect } from 'react';
import { PassportFormData } from '@/lib/validations';
import { ArrowRight, QrCode } from 'lucide-react';
import { toast } from 'sonner';

const Header = lazy(() => import('@/components/layout/Header').then(m => ({ default: m.Header })));
const UniversityLogos = lazy(() => import('@/components/features/UniversityLogos'));
const PassportSplash = lazy(() => import('@/components/features/PassportSplash').then(m => ({ default: m.PassportSplash })));
const PassportForm = lazy(() => import('@/components/forms/PassportForm').then(m => ({ default: m.PassportForm })));

const RATE_LIMIT_TIME = 10000;
let lastSubmitTime = 0;

function Home() {
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [passportData, setPassportData] = useState<PassportFormData | null>(null);

  useEffect(() => {
    if (window.location.search || window.location.hash) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSubmit = async (data: PassportFormData) => {
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_TIME) {
      toast.error('Aguarde alguns segundos antes de tentar novamente.');
      return;
    }
    lastSubmitTime = now;

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
          <div className="bg-card rounded-2xl sm:rounded-3xl border border-border/50 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">

            {/* Header */}
            <div className="relative bg-card px-6 pt-7 pb-5 border-b border-border/50 flex flex-col items-center text-center">
              <div className="absolute top-4 right-4">
                <div className="bg-background/50 p-1.5 rounded-lg border border-border/50">
                  <QrCode className="w-4 h-4 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.7)]" />
                </div>
              </div>

              {/* Graduation cap logo */}
              <div className="relative w-14 h-12 mb-3 shrink-0">
                <div className="w-10 h-2 bg-primary rounded-sm absolute top-0 left-1/2 -translate-x-1/2" />
                <div className="w-14 h-7 bg-foreground absolute top-1.5 left-1/2 -translate-x-1/2"
                  style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                <div className="w-9 h-3.5 bg-foreground absolute top-5 left-1/2 -translate-x-1/2 rounded-b-lg" />
                <div className="w-1.5 h-4 bg-primary absolute right-2 top-3.5"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }} />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight leading-none">
                Universidade<br />
                <span className="text-primary">Gratuita</span>
              </h2>
              <p className="text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase mt-2">
                Programa do Governo de SC
              </p>
            </div>

            {/* Logos */}
            <div className="border-b border-border/30 bg-background/20">
              <Suspense fallback={<div className="h-12 animate-pulse bg-muted/20 rounded" />}>
                <UniversityLogos />
              </Suspense>
            </div>

            {/* Body */}
            <div className="px-6 py-6 sm:px-8 sm:py-8 flex flex-col items-center text-center gap-5">
              <div className="flex flex-col items-start font-sans tracking-tighter leading-[0.82]">
                <span className="text-3xl sm:text-4xl font-black">A gente</span>
                <span className="text-[2.6rem] sm:text-5xl font-black relative">
                  ajuda a gente<span className="text-primary">.</span>
                  <svg viewBox="0 0 100 100"
                    className="absolute -top-5 -right-7 w-7 h-7 sm:w-9 sm:h-9 rotate-[15deg] fill-current opacity-80"
                    aria-hidden="true">
                    <path d="M50 25 L90 40 L50 55 L10 40 Z" />
                    <path d="M70 38 L70 68 L65 75 L75 75 Z" />
                    <path d="M30 50 L30 80 C30 85 40 88 50 88 C60 88 70 85 70 80 L70 50 Z" />
                  </svg>
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Gere seu passaporte estudantil e acesse as universidades da rede ACAFE gratuitamente.
              </p>

              <button
                onClick={() => setShowPassportModal(true)}
                className="w-full py-4 sm:py-5 bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground rounded-xl font-black text-lg sm:text-xl shadow-[0_8px_24px_hsl(var(--primary)/0.4)] hover:shadow-[0_12px_32px_hsl(var(--primary)/0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-3 uppercase tracking-wide border-b-4 border-black/40 active:border-b-0 active:mt-1 select-none touch-manipulation"
              >
                Gerar Passaporte
                <ArrowRight className="w-5 h-5 stroke-[3px] shrink-0" />
              </button>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-border/30 text-center bg-background/20">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                Governo de Santa Catarina · Rede ACAFE
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Form Modal */}
      {showPassportModal && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex flex-col sm:items-center sm:justify-center sm:p-4 animate-fade-in">
          <div className="bg-card w-full h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl sm:max-w-md shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col border-0 sm:border sm:border-border/50 animate-slide-in overflow-hidden">
            <div className="bg-card border-b border-border px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">Criar Passaporte</h2>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">Preencha seus dados oficiais</p>
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
