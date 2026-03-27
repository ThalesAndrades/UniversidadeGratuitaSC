import { useState, lazy, Suspense, memo } from 'react';
import { PassportFormData } from '@/lib/validations';
import { ArrowRight, QrCode, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/layout/Header';
import logo from '@/assets/logo-programa.png';

// Lazy load components
const PassportSplash = lazy(() => import('@/components/features/PassportSplash').then(module => ({ default: module.PassportSplash })));
const PassportForm = lazy(() => import('@/components/forms/PassportForm').then(module => ({ default: module.PassportForm })));

function Home() {
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [passportData, setPassportData] = useState<PassportFormData | null>(null);

  const handleSubmit = async (data: PassportFormData) => {
    setPassportData(data);
    setShowPassportModal(false);
    setShowSplash(true);
    toast.success('Passaporte gerado com sucesso!');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-brand-light text-gray-900 font-sans flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center relative mt-16 p-4">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-brand-teal/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-brand-blue/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-brand-teal/20 relative z-10 overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="bg-brand-blue p-6 sm:p-8 text-center border-b-4 border-brand-accent relative">
             <div className="absolute top-4 right-4 bg-brand-teal/20 p-2 rounded-lg">
                <QrCode className="w-6 h-6 text-brand-accent" />
             </div>
             <img src={logo} alt="Universidade Gratuita" className="h-16 sm:h-20 mx-auto mb-4 object-contain filter brightness-0 invert" />
             <h2 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-wide leading-tight">
               Passaporte Virtual
             </h2>
             <p className="text-brand-accent text-sm font-bold tracking-widest mt-1">SISTEMA ACAFE</p>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center items-center text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full font-bold text-xs border border-green-200 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4" />
              Acesso Oficial Verificado
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-blue leading-tight">
                Bem-vindo(a) ao<br />
                <span className="text-brand-teal">Universidade Gratuita</span>
              </h3>
              <p className="text-gray-600 text-sm sm:text-base font-medium max-w-sm mx-auto leading-relaxed">
                Gere seu documento de identificação estudantil digital de forma rápida e segura para acesso aos benefícios do programa.
              </p>
            </div>

            <button
              onClick={() => setShowPassportModal(true)}
              className="w-full max-w-xs px-6 py-4 mt-4 bg-brand-teal hover:bg-teal-600 active:bg-teal-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 uppercase tracking-wide"
            >
              Gerar Passaporte
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Card Footer */}
          <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
            <p className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Governo do Estado de Santa Catarina
            </p>
          </div>
        </div>
      </main>

      {/* Passport Modal (Optimized for Mobile/No-Scroll Feel) */}
      {showPassportModal && (
        <div className="fixed inset-0 bg-brand-blue/90 backdrop-blur-md z-50 flex items-center justify-center sm:p-4">
          <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl sm:max-w-2xl shadow-2xl flex flex-col animate-slide-in relative">
            {/* Sticky Header inside Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 sm:p-6 flex items-center justify-between z-10 sm:rounded-t-3xl shadow-sm">
               <div className="flex flex-col">
                 <h2 className="text-xl font-extrabold text-brand-blue uppercase">Seus Dados</h2>
                 <p className="text-xs text-gray-500 font-medium">Preencha para gerar o documento</p>
               </div>
               <button
                onClick={() => setShowPassportModal(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors font-bold text-lg shrink-0"
              >
                ✕
              </button>
            </div>
            
            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 sm:pb-6 custom-scrollbar">
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
