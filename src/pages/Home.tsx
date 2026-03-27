import { useState, lazy, Suspense, memo } from 'react';
import { PassportFormData } from '@/lib/validations';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';
import logo from '@/assets/logo-programa.png';

// Lazy load components
const PassportSplash = lazy(() => import('@/components/features/PassportSplash').then(module => ({ default: module.PassportSplash })));
const PassportForm = lazy(() => import('@/components/forms/PassportForm').then(module => ({ default: module.PassportForm })));
const AboutSection = lazy(() => import('@/components/features/AboutSection'));
const UniversitiesSection = lazy(() => import('@/components/features/UniversitiesSection'));
const CoursesSection = lazy(() => import('@/components/features/CoursesSection'));

type ModalType = 'about' | 'passport' | 'universities' | 'courses' | null;

function Home() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showSplash, setShowSplash] = useState(false);
  const [passportData, setPassportData] = useState<PassportFormData | null>(null);

  const handleSubmit = async (data: PassportFormData) => {
    console.log('Dados do passaporte:', data);
    
    // TODO: Enviar para backend quando disponível
    // await api.post('/passports', data);
    
    setPassportData(data);
    setActiveModal(null);
    setShowSplash(true);
    toast.success('Passaporte criado com sucesso!');
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 overflow-hidden">
      {/* Central Hub */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Logo Central */}
          <div className="relative z-10 bg-white rounded-full p-8 shadow-2xl animate-float">
            <img src={logo} alt="Universidade Gratuita SC" className="h-32 w-32 sm:h-40 sm:w-40" />
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
              <h1 className="text-white text-xl sm:text-2xl font-bold drop-shadow-lg">
                Universidade Gratuita SC
              </h1>
              <p className="text-purple-200 text-sm sm:text-base drop-shadow-md">
                Sistema ACAFE
              </p>
            </div>
          </div>

          {/* Arrow Buttons */}
          {/* Top - Sobre o Programa */}
          <button
            onClick={() => setActiveModal('about')}
            className="absolute -top-32 left-1/2 -translate-x-1/2 group"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 rounded-full p-4 shadow-lg group-hover:scale-110">
                <ArrowUp className="w-8 h-8 text-white" />
              </div>
              <span className="text-white font-semibold text-sm sm:text-base drop-shadow-lg whitespace-nowrap">
                Sobre o Programa
              </span>
            </div>
          </button>

          {/* Right - Criar Passaporte */}
          <button
            onClick={() => setActiveModal('passport')}
            className="absolute top-1/2 -translate-y-1/2 -right-40 sm:-right-48 group"
          >
            <div className="flex flex-row-reverse items-center gap-3">
              <div className="bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 rounded-full p-4 shadow-lg group-hover:scale-110">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <span className="text-white font-semibold text-sm sm:text-base drop-shadow-lg whitespace-nowrap">
                Criar Passaporte
              </span>
            </div>
          </button>

          {/* Bottom - Universidades */}
          <button
            onClick={() => setActiveModal('universities')}
            className="absolute -bottom-32 left-1/2 -translate-x-1/2 group"
          >
            <div className="flex flex-col-reverse items-center gap-2">
              <div className="bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 rounded-full p-4 shadow-lg group-hover:scale-110">
                <ArrowDown className="w-8 h-8 text-white" />
              </div>
              <span className="text-white font-semibold text-sm sm:text-base drop-shadow-lg whitespace-nowrap">
                Universidades
              </span>
            </div>
          </button>

          {/* Left - Cursos */}
          <button
            onClick={() => setActiveModal('courses')}
            className="absolute top-1/2 -translate-y-1/2 -left-40 sm:-left-48 group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 rounded-full p-4 shadow-lg group-hover:scale-110">
                <ArrowLeft className="w-8 h-8 text-white" />
              </div>
              <span className="text-white font-semibold text-sm sm:text-base drop-shadow-lg whitespace-nowrap">
                Cursos Disponíveis
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white">
                {activeModal === 'about' && 'Sobre o Programa'}
                {activeModal === 'passport' && 'Criar Passaporte Virtual'}
                {activeModal === 'universities' && 'Universidades Participantes'}
                {activeModal === 'courses' && 'Cursos Disponíveis'}
              </h2>
              <button
                onClick={closeModal}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8">
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
                </div>
              }>
                {activeModal === 'about' && <AboutSection />}
                {activeModal === 'passport' && <PassportForm onSubmit={handleSubmit} />}
                {activeModal === 'universities' && <UniversitiesSection />}
                {activeModal === 'courses' && <CoursesSection />}
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Splash Screen */}
      {showSplash && passportData && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        }>
          <PassportSplash data={passportData} onClose={() => setShowSplash(false)} />
        </Suspense>
      )}
    </div>
  );
}

export default memo(Home);
