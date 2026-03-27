import { useState, lazy, Suspense, memo } from 'react';
import { Header } from '@/components/layout/Header';
import { InfoCarousel } from '@/components/features/InfoCarousel';
import { PassportForm } from '@/components/forms/PassportForm';
import { PassportFormData } from '@/lib/validations';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Lazy load do splash (só carrega quando necessário)
const PassportSplash = lazy(() => import('@/components/features/PassportSplash').then(module => ({ default: module.PassportSplash })));

function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [passportData, setPassportData] = useState<PassportFormData | null>(null);

  const handleSubmit = async (data: PassportFormData) => {
    console.log('Dados do passaporte:', data);
    
    // TODO: Enviar para backend quando disponível
    // await api.post('/passports', data);
    
    setPassportData(data);
    setShowSplash(true);
    toast.success('Passaporte criado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Bem-vindo ao Programa</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Seu Futuro Começa Aqui
          </h1>
          <p className="text-xl sm:text-2xl text-purple-100 mb-8 leading-relaxed">
            Crie seu passaporte virtual e tenha acesso à educação superior gratuita em Santa Catarina
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              ✓ Totalmente Gratuito
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              ✓ Mais de 50 Cursos
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              ✓ Certificado pelo MEC
            </div>
          </div>
        </div>
      </section>

      {/* Info Carousel */}
      <InfoCarousel />

      {/* Form Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Crie seu Passaporte Virtual
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Preencha seus dados para gerar seu passaporte e começar sua jornada universitária
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-3xl p-6 sm:p-12 shadow-xl">
            <PassportForm onSubmit={handleSubmit} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 mb-2">
            Programa Universidade Gratuita de Santa Catarina
          </p>
          <p className="text-sm text-gray-500">
            Sistema ACAFE - Associação Catarinense das Fundações Educacionais
          </p>
        </div>
      </footer>

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
