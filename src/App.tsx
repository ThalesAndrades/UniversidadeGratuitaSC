import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Lazy load para reduzir bundle inicial
const Home = lazy(() => import('@/pages/Home'));

// Loading screen minimalista
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-foreground text-center">
        <div className="w-16 h-16 border-4 border-foreground/30 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
        <p className="text-lg font-semibold">Carregando...</p>
      </div>
    </div>
  );
}

function App() {
  const [version, setVersion] = useState<'v1' | 'v2'>('v1');

  useEffect(() => {
    if (version === 'v2') {
      document.documentElement.classList.add('theme-v2');
      document.documentElement.classList.add('dark'); // To apply any shadcn dark mode defaults
    } else {
      document.documentElement.classList.remove('theme-v2');
      document.documentElement.classList.remove('dark');
    }
  }, [version]);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" />
      
      {/* Discreet Version Toggles */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-20 hover:opacity-100 transition-opacity z-[9999] bg-background/50 backdrop-blur-md p-1.5 rounded-full border border-border">
        <button 
          onClick={() => setVersion('v1')} 
          className={`text-[11px] px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider font-semibold ${version === 'v1' ? 'bg-foreground text-background shadow-md' : 'text-foreground/70 hover:text-foreground'}`}
        >
          Versão 1
        </button>
        <button 
          onClick={() => setVersion('v2')} 
          className={`text-[11px] px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider font-semibold ${version === 'v2' ? 'bg-foreground text-background shadow-md' : 'text-foreground/70 hover:text-foreground'}`}
        >
          Versão 2
        </button>
      </div>
    </BrowserRouter>
  );
}

export default App;
