import { useState, lazy, Suspense, memo, useEffect } from 'react';
import { PassportFormData } from '@/lib/validations';
import { ArrowRight, QrCode, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/layout/Header';

// Lazy load components
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
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-brand-teal to-[#0ab8ab] text-gray-900 font-sans flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center relative mt-16 p-4">
        {/* Decorative Background Elements based on official banner */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        
        <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 relative z-10 overflow-hidden flex flex-col transform transition-transform hover:scale-[1.01] duration-300">
          {/* Card Header with official branding */}
          <div className="bg-white p-6 sm:p-8 text-center border-b-4 border-brand-accent relative flex flex-col items-center justify-center">
             <div className="absolute top-4 right-4 bg-brand-light p-2 rounded-lg border border-brand-teal/20 shadow-sm">
                <QrCode className="w-6 h-6 text-brand-teal" />
             </div>
             
             {/* Official Logo Construction based on OCR */}
             <div className="flex flex-col items-center mb-4 relative">
                {/* Stylized Graduation Cap (Simulated with CSS/Icons) */}
                <div className="relative w-24 h-20 flex flex-col items-center mb-2">
                   {/* Top Red Bar */}
                   <div className="w-20 h-4 bg-brand-accent rounded-sm absolute top-0 z-0 shadow-sm"></div>
                   {/* Green Cap Body */}
                   <div className="w-24 h-12 bg-brand-green absolute top-3 z-10" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
                   <div className="w-16 h-6 bg-brand-green absolute top-10 z-0 rounded-b-xl border-b-4 border-black/20"></div>
                   {/* Red Ribbon */}
                   <div className="w-3 h-8 bg-brand-accent absolute right-2 top-6 z-20 border-l border-white/30" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}></div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight leading-none mt-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Universidade<br/>
                  <span className="text-3xl sm:text-4xl">Gratuita</span>
                </h2>
             </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center items-center text-center space-y-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-green/10 text-brand-green rounded-full font-bold text-xs border border-brand-green/20 uppercase tracking-wide shadow-inner">
              <ShieldCheck className="w-4 h-4" />
              Acesso Exclusivo
            </div>

            <div className="space-y-3">
              <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">
                Programa do Governo
              </p>
              <h3 className="text-xl font-bold text-gray-800 leading-tight max-w-[250px] mx-auto">
                Gere seu documento de identificação estudantil.
              </h3>
            </div>

            <button
              onClick={() => setShowPassportModal(true)}
              className="w-full px-6 py-4 mt-2 bg-brand-accent hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-black text-lg shadow-[0_8px_20px_rgba(227,6,19,0.3)] hover:shadow-[0_12px_25px_rgba(227,6,19,0.4)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 uppercase tracking-wide border-b-4 border-black/20"
            >
              Gerar Passaporte
              <ArrowRight className="w-5 h-5 stroke-[3px]" />
            </button>
          </div>

          {/* Card Footer */}
          <div className="bg-gray-100 p-4 text-center border-t border-gray-200 flex flex-col items-center justify-center space-y-1">
            <p className="text-[10px] sm:text-xs text-black font-bold uppercase tracking-wider">
              Governo de Santa Catarina
            </p>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest">
              teste.sbs
            </p>
          </div>
        </div>
      </main>

      {/* Passport Modal (Optimized for Mobile/No-Scroll Feel) */}
      {showPassportModal && (
        <div className="fixed inset-0 bg-brand-blue/90 backdrop-blur-md z-50 flex items-center justify-center sm:p-4">
          <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl sm:max-w-md shadow-2xl flex flex-col animate-slide-in relative overflow-hidden">
            {/* Sticky Header inside Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 sm:p-6 flex items-center justify-between z-20 shadow-sm">
               <div className="flex flex-col">
                 <h2 className="text-xl font-extrabold text-brand-blue uppercase">Criar Passaporte</h2>
                 <p className="text-xs text-gray-500 font-medium">Preencha seus dados oficiais</p>
               </div>
               <button
                onClick={() => setShowPassportModal(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors font-bold text-lg shrink-0"
              >
                ✕
              </button>
            </div>
            
            {/* Horizontal Scrollable Form Content */}
            <div className="flex-1 relative bg-gray-50">
              <Suspense fallback={<div className="h-full flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"/></div>}>
                <PassportForm onSubmit={handleSubmit} />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Splash Screen */}
      {showSplash && passportData && (
        <Suspense fallback={<div className="fixed inset-0 bg-brand-blue/90 z-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" /></div>}>
          <PassportSplash data={passportData} onClose={() => setShowSplash(false)} />
        </Suspense>
      )}
    </div>
  );
}

export default memo(Home);
