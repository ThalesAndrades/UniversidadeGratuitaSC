import { memo } from 'react';
import logo from '@/assets/logo-programa.png';

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-teal/20 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Universidade Gratuita SC" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-extrabold text-brand-blue leading-tight tracking-tight uppercase">Universidade Gratuita</h1>
            <p className="text-[10px] sm:text-xs font-semibold text-brand-teal uppercase tracking-widest">Santa Catarina</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-5 py-2 bg-brand-light text-brand-teal text-xs font-bold rounded-full border border-brand-teal/30">
          SISTEMA ACAFE
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
export { Header };
