import { lazy, Suspense } from 'react';
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

// Apply V2 dark theme permanently at document level
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
