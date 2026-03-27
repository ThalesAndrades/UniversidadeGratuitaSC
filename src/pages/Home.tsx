import { useState, lazy, Suspense, memo, useEffect } from 'react';
import { PassportFormData } from '@/lib/validations';
import { ArrowRight, QrCode, ShieldCheck, FileText, CheckCircle, BellRing, Sparkles, LogOut } from 'lucide-react';
import { toast } from 'sonner';

// Lazy load components for better initial load performance
const Header = lazy(() => import('@/components/layout/Header').then(module => ({ default: module.Header })));
const UniversityLogos = lazy(() => import('@/components/features/UniversityLogos'));
const PassportSplash = lazy(() => import('@/components/features/PassportSplash').then(module => ({ default: module.PassportSplash })));
const PassportForm = lazy(() => import('@/components/forms/PassportForm').then(module => ({ default: module.PassportForm })));

// Rate Limiting Simples no Frontend (Proteção contra bots básicos/spam de cliques)
const RATE_LIMIT_TIME = 10000; // 10 segundos entre envios
let lastSubmitTime = 0;

function Home() {
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [passportData, setPassportData] = useState<PassportFormData | null>(null);

  // Prevenir injeção via URL / Manipulação de estado de histórico
  useEffect(() => {
    if (window.location.search || window.location.hash) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSubmit = async (data: PassportFormData) => {
    // 1. Rate Limiting Check
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_TIME) {
      toast.error('Aguarde alguns segundos antes de tentar novamente.');
      return;
    }
    lastSubmitTime = now;

    try {
      // 2. Double Check dos dados vitais (Evita bypass do Zod modificando o state)
      if (!data.photo.startsWith('data:image/') || data.firstName.includes('<script>')) {
        throw new Error('Dados inválidos detectados pela segurança do sistema.');
      }

      // Apenas salva no estado local (sem vínculo com banco de dados)
      setPassportData(data);
      setShowPassportModal(false);
      setShowSplash(true);
      toast.success('Passaporte gerado com sucesso!');
    } catch (error) {
      console.error('Falha de segurança detectada:', error);
      toast.error('Ação bloqueada. Dados inválidos.');
      setShowPassportModal(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-brand-teal to-brand-teal/80 text-foreground font-sans flex flex-col">
      <Suspense fallback={<div className="h-16 w-full animate-pulse bg-background/50"></div>}>
        <Header />
      </Suspense>
      
      <main className="flex-1 flex items-center justify-center relative mt-16 sm:mt-20 p-4 sm:p-6 w-full max-w-[480px] mx-auto">
        {/* Decorative Background Elements based on official banner */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-70 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-primary/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        
        <div className="w-full bg-card rounded-[1.5rem] sm:rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-border/40 relative z-10 overflow-hidden flex flex-col transform transition-all hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] duration-300 ring-1 ring-white/5 group">
          {/* Card Header with official branding */}
          <div className="bg-card p-5 sm:p-8 text-center border-b-[5px] sm:border-b-[6px] border-primary relative flex flex-col items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.4)] z-20">
             <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-card p-2 rounded-lg border border-border shadow-sm group-hover:border-primary/50 transition-colors duration-300">
                <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-primary drop-shadow-[0_0_12px_hsl(var(--primary)/0.8)] group-hover:scale-110 transition-transform duration-300" />
             </div>
             
             {/* Official Logo Construction based on OCR */}
             <div className="flex flex-col items-center mb-2 sm:mb-4 relative">
                {/* Stylized Graduation Cap (Simulated with CSS/Icons) */}
                <div className="relative w-20 h-16 sm:w-24 sm:h-20 flex flex-col items-center mb-2 group-hover:scale-105 transition-transform duration-500">
                   {/* Top Red Bar */}
                   <div className="w-16 sm:w-20 h-3 sm:h-4 bg-primary rounded-sm absolute top-0 z-0 shadow-[0_0_10px_hsl(var(--primary)/0.3)]"></div>
                   {/* Green Cap Body */}
                   <div className="w-20 sm:w-24 h-10 sm:h-12 bg-foreground absolute top-2.5 sm:top-3 z-10" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
                   <div className="w-14 sm:w-16 h-5 sm:h-6 bg-foreground absolute top-8 sm:top-10 z-0 rounded-b-xl border-b-4 border-black/20"></div>
                   {/* Red Ribbon */}
                   <div className="w-2 sm:w-3 h-7 sm:h-8 bg-primary absolute right-2 top-5 sm:top-6 z-20 border-l border-white/30" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}></div>
                </div>
                
                <h2 className="text-[1.35rem] sm:text-3xl font-black text-foreground uppercase tracking-tight leading-none mt-1 sm:mt-2 group-hover:text-primary group-hover:drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)] transition-all duration-300" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Universidade<br/>
                  <span className="text-[1.75rem] sm:text-4xl">Gratuita</span>
                </h2>
             </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-10 flex-1 flex flex-col justify-center items-center text-center space-y-6 sm:space-y-8 bg-gradient-to-b from-card to-background relative border-t border-border/10 z-10 shadow-[inset_0_20px_20px_-20px_rgba(0,0,0,0.8)] w-full">
            <div className="absolute inset-0 bg-primary/5 opacity-0 mix-blend-overlay pointer-events-none transition-opacity duration-500 group-hover:opacity-100"></div>
            
            <Suspense fallback={<div className="h-12 w-full animate-pulse bg-muted rounded-xl"></div>}>
              <UniversityLogos />
            </Suspense>

            <div className="space-y-4 w-full">
              <p className="text-primary text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)] transition-all duration-300">
                Programa do Governo
              </p>
              <h3 className="text-foreground mx-auto flex justify-center w-full px-2 sm:px-0">
                <div className="flex flex-col items-start font-sans tracking-tighter leading-[0.85] sm:leading-[0.9]">
                  <span className="text-3xl sm:text-5xl font-black">A gente</span>
                  <span className="text-4xl sm:text-6xl font-black relative flex items-end">
                    ajuda a gent
                    <span className="relative inline-block">
                      e
                      <svg 
                        viewBox="0 0 100 100" 
                        className="absolute -top-[0.6em] sm:-top-[0.7em] -right-1.5 sm:-right-2 w-8 h-8 sm:w-12 sm:h-12 rotate-[15deg] drop-shadow-md text-foreground fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M50 25 L90 40 L50 55 L10 40 Z" />
                        <path d="M70 38 L70 68 L65 75 L75 75 Z" />
                        <path d="M30 50 L30 80 C30 85 40 88 50 88 C60 88 70 85 70 80 L70 50 Z" />
                      </svg>
                    </span>
                    <span className="text-primary">.</span>
                  </span>
                </div>
              </h3>
            </div>

            <button
              onClick={() => setShowPassportModal(true)}
              className="w-full px-6 py-4 sm:py-5 mt-4 sm:mt-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl sm:rounded-2xl font-black text-lg sm:text-xl shadow-[0_8px_20px_hsl(var(--primary)/0.5)] hover:shadow-[0_12px_30px_hsl(var(--primary)/0.7)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wide border-b-[5px] border-black/50 active:translate-y-0 active:border-b-0 active:mt-[9px] mb-1 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
              Gerar Passaporte
              <ArrowRight className="w-5 h-5 stroke-[3px] group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card Footer */}
          <div className="bg-card p-4 text-center border-t border-border/50 flex flex-col items-center justify-center space-y-1 z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
            <p className="text-[10px] sm:text-xs text-foreground font-bold uppercase tracking-wider">
              Governo de Santa Catarina
            </p>
          </div>
        </div>
      </main>

      {/* Passport Modal (Optimized for Mobile/No-Scroll Feel) */}
      {showPassportModal && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex items-center justify-center sm:p-4 transition-all duration-300">
          <div className="bg-background w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl sm:max-w-md shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col animate-slide-in relative overflow-hidden border border-border/50 ring-1 ring-white/5">
            {/* Sticky Header inside Modal */}
            <div className="sticky top-0 bg-card border-b border-border p-4 sm:p-6 flex items-center justify-between z-20 shadow-sm">
               <div className="flex flex-col">
                 <h2 className="text-xl font-extrabold text-foreground uppercase">Criar Passaporte</h2>
                 <p className="text-xs text-muted-foreground font-medium">Preencha seus dados oficiais</p>
               </div>
               <button
                onClick={() => setShowPassportModal(false)}
                className="w-10 h-10 bg-background hover:bg-destructive hover:text-destructive-foreground text-muted-foreground border border-border rounded-full flex items-center justify-center transition-all duration-300 font-bold text-lg shrink-0 shadow-sm hover:shadow-[0_0_15px_hsl(var(--destructive)/0.5)] active:scale-95"
              >
                ✕
              </button>
            </div>
            
            {/* Horizontal Scrollable Form Content */}
            <div className="flex-1 relative bg-card/10 overflow-hidden">
              <Suspense fallback={<div className="h-full flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"/></div>}>
                <PassportForm onSubmit={handleSubmit} />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Splash Screen */}
      {showSplash && passportData && (
        <Suspense fallback={<div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
          <PassportSplash data={passportData} onClose={() => setShowSplash(false)} />
        </Suspense>
      )}
    </div>
  );
}

export default memo(Home);
