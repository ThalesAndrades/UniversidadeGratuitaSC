import { useState, lazy, Suspense, memo } from 'react';
import { PassportFormData } from '@/lib/validations';
import { ArrowRight, CheckCircle2, GraduationCap, Clock, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/layout/Header';
import logo from '@/assets/logo-programa.png';

// Lazy load components
const PassportSplash = lazy(() => import('@/components/features/PassportSplash').then(module => ({ default: module.PassportSplash })));
const PassportForm = lazy(() => import('@/components/forms/PassportForm').then(module => ({ default: module.PassportForm })));
const UniversitiesSection = lazy(() => import('@/components/features/UniversitiesSection'));
const CoursesSection = lazy(() => import('@/components/features/CoursesSection'));

function Home() {
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [passportData, setPassportData] = useState<PassportFormData | null>(null);

  const handleSubmit = async (data: PassportFormData) => {
    setPassportData(data);
    setShowPassportModal(false);
    setShowSplash(true);
    toast.success('Passaporte criado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-brand-teal selection:text-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-brand-light to-white pt-20 pb-24 overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal/10 text-brand-teal rounded-full font-bold text-sm mb-4 animate-fade-in border border-brand-teal/20">
                <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                Inscrições Abertas 2024
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-blue tracking-tight leading-tight">
                O Governo de Santa Catarina <br/>
                <span className="text-brand-teal">paga as suas mensalidades.</span>
              </h2>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                O maior programa estadual de formação superior do Brasil. Apoio para quem quer estar em uma universidade presencial, mas tem dificuldade para pagar.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setShowPassportModal(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-brand-teal hover:bg-teal-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Criar Passaporte Virtual
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a 
                  href="#universidades"
                  className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-brand-blue text-brand-blue hover:bg-brand-light rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center"
                >
                  Ver Instituições
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Info Highlights Section */}
        <section className="py-16 bg-brand-blue text-white relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-14 h-14 bg-brand-teal rounded-full flex items-center justify-center mb-2">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-extrabold text-brand-accent">70 mil</h3>
                <p className="text-blue-100 font-medium">Vagas garantidas até o ano de 2026 em todo o estado.</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-14 h-14 bg-brand-teal rounded-full flex items-center justify-center mb-2">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">Presencial &<br/>Comunitária</h3>
                <p className="text-blue-100 font-medium">Contempla universidades e centros universitários do Sistema ACAFE.</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-14 h-14 bg-brand-teal rounded-full flex items-center justify-center mb-2">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">Retorno à<br/>Sociedade</h3>
                <p className="text-blue-100 font-medium">Os alunos retribuem com 20 horas de trabalho na sua área por mês estudado.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Universities Section */}
        <section id="universidades" className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-blue mb-4">
                Instituições Cadastradas
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Conheça as universidades e centros universitários que fazem parte do programa Universidade Gratuita em Santa Catarina.
              </p>
            </div>
            
            <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"/></div>}>
              <UniversitiesSection />
            </Suspense>
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
             <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-blue mb-4">
                Cursos Disponíveis
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Explore as diversas áreas de conhecimento oferecidas pelas instituições credenciadas.
              </p>
            </div>
            <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"/></div>}>
              <CoursesSection />
            </Suspense>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-blue py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <img src={logo} alt="Universidade Gratuita" className="h-16 w-16 mx-auto mb-6 brightness-0 invert opacity-90" />
          <p className="text-blue-200 font-medium mb-2">Governo do Estado de Santa Catarina</p>
          <p className="text-blue-400 text-sm">Programa Universidade Gratuita • Sistema ACAFE</p>
        </div>
      </footer>

      {/* Passport Modal */}
      {showPassportModal && (
        <div className="fixed inset-0 bg-brand-blue/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl animate-slide-in relative">
            <button
              onClick={() => setShowPassportModal(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors z-10"
            >
              ✕
            </button>
            <div className="p-8 md:p-10">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-brand-blue mb-2">Criar Passaporte Virtual</h2>
                <p className="text-gray-600">Preencha seus dados para gerar seu documento de identificação estudantil.</p>
              </div>
              <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"/></div>}>
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
