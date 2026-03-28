import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';

const Home = lazy(() => import('@/pages/Home'));

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
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Home />
      </Suspense>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
