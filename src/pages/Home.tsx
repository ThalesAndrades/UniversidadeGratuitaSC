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
      
      <main className="flex-1 flex items-center justify-center relative mt-16 p-4">
        {/* Decorative Background Elements based on official banner */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-70 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-primary/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        
        <div className="w-full max-w-md bg-card rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-border/40 relative z-10 overflow-hidden flex flex-col transform transition-all hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)] duration-300 ring-1 ring-white/5 group">
          {/* Card Header with official branding */}
          <div className="bg-card p-6 sm:p-8 text-center border-b-[6px] border-primary relative flex flex-col items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.4)] z-20">
             <div className="absolute top-4 right-4 bg-card p-2 rounded-lg border border-border shadow-sm group-hover:border-primary/50 transition-colors duration-300">
                <QrCode className="w-6 h-6 text-primary drop-shadow-[0_0_12px_hsl(var(--primary)/0.8)] group-hover:scale-110 transition-transform duration-300" />
             </div>
             
             {/* Official Logo Construction based on OCR */}
             <div className="flex flex-col items-center mb-4 relative">
                {/* Stylized Graduation Cap (Simulated with CSS/Icons) */}
                <div className="relative w-24 h-20 flex flex-col items-center mb-2 group-hover:scale-105 transition-transform duration-500">
                   {/* Top Red Bar */}
                   <div className="w-20 h-4 bg-primary rounded-sm absolute top-0 z-0 shadow-[0_0_10px_hsl(var(--primary)/0.3)]"></div>
                   {/* Green Cap Body */}
                   <div className="w-24 h-12 bg-foreground absolute top-3 z-10" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
                   <div className="w-16 h-6 bg-foreground absolute top-10 z-0 rounded-b-xl border-b-4 border-black/20"></div>
                   {/* Red Ribbon */}
                   <div className="w-3 h-8 bg-primary absolute right-2 top-6 z-20 border-l border-white/30" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}></div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight leading-none mt-2 group-hover:text-primary group-hover:drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)] transition-all duration-300" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Universidade<br/>
                  <span className="text-3xl sm:text-4xl">Gratuita</span>
                </h2>
             </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center items-center text-center space-y-6 bg-gradient-to-b from-card to-background relative border-t border-border/10 z-10 shadow-[inset_0_20px_20px_-20px_rgba(0,0,0,0.8)] w-full">
            <div className="absolute inset-0 bg-primary/5 opacity-0 mix-blend-overlay pointer-events-none transition-opacity duration-500 group-hover:opacity-100"></div>
            
            <Suspense fallback={<div className="h-12 w-full animate-pulse bg-muted rounded-xl"></div>}>
              <UniversityLogos />
            </Suspense>

            <div className="space-y-3 w-full">
              <p className="text-primary text-xs font-black tracking-widest uppercase group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)] transition-all duration-300">
                Programa do Governo
              </p>
              <h3 className="text-xl font-bold text-foreground leading-tight max-w-[250px] mx-auto">
                Gere seu passaporte para o sonho universitário.
              </h3>
            </div>

            <button
              onClick={() => setShowPassportModal(true)}
              className="w-full px-6 py-4 mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black text-lg shadow-[0_8px_20px_hsl(var(--primary)/0.5)] hover:shadow-[0_12px_30px_hsl(var(--primary)/0.7)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wide border-b-[5px] border-black/50 active:translate-y-0 active:border-b-0 active:mt-[9px] mb-1 relative overflow-hidden group/btn"
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
