import { memo } from 'react';
import { Shield } from 'lucide-react';

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* SC Flag Colors indicator */}
          <div className="flex h-10 w-10 overflow-hidden rounded-full border border-gray-200 shadow-sm">
            <div className="w-1/3 h-full bg-brand-green"></div>
            <div className="w-1/3 h-full bg-white flex items-center justify-center">
              <Shield className="w-3 h-3 text-brand-accent" />
            </div>
            <div className="w-1/3 h-full bg-brand-accent"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs sm:text-sm font-black text-black leading-tight tracking-tight uppercase">Governo de</h1>
            <p className="text-sm sm:text-base font-black text-black uppercase tracking-tight leading-none">Santa Catarina</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full border border-gray-200 uppercase tracking-widest">
          Secretaria da Educação
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
export { Header };
