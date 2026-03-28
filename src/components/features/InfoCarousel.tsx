import { GraduationCap, Users, Award, BookOpen } from 'lucide-react';
import { useRef, useState, useEffect, useCallback, memo } from 'react';

const INFO_CARDS = [
  {
    icon: GraduationCap,
    title: 'Educação Gratuita',
    description: 'Acesso a cursos de graduação sem custos de mensalidade em universidades de excelência.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: Users,
    title: 'Rede ACAFE',
    description: 'Faça parte do sistema que conecta as melhores universidades comunitárias de Santa Catarina.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: Award,
    title: 'Reconhecimento MEC',
    description: 'Diplomas reconhecidos nacionalmente com padrão de qualidade certificado pelo Ministério da Educação.',
    color: 'from-indigo-500 to-indigo-700',
  },
  {
    icon: BookOpen,
    title: 'Variedade de Cursos',
    description: 'Mais de 50 opções de cursos em diversas áreas do conhecimento para você escolher.',
    color: 'from-violet-500 to-violet-700',
  },
];

function InfoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <div className="relative py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Por que fazer parte?
        </h2>
        
        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4"
          >
            {INFO_CARDS.map((card, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[85vw] sm:w-[400px] snap-center"
              >
                <div className={`h-full bg-gradient-to-br ${card.color} rounded-2xl p-8 text-white shadow-xl transform hover:scale-105 transition-transform duration-300`}>
                  <card.icon className="w-16 h-16 mb-6 opacity-90" />
                  <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                  <p className="text-white/90 text-lg leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(InfoCarousel);
export { InfoCarousel };
