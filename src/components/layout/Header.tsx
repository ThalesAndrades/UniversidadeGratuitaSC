import { memo } from 'react';
import logo from '@/assets/logo-programa.png';

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Universidade Gratuita SC" className="h-12 w-12" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">Universidade Gratuita</h1>
            <p className="text-xs text-gray-600">Santa Catarina</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white text-sm font-semibold">
          Sistema ACAFE
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
export { Header };
