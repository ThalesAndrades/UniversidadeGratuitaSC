import { Users, Award, Building } from 'lucide-react';
import { memo } from 'react';
import { UNIVERSITIES } from '@/constants/universities';

function UniversitiesSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {UNIVERSITIES.map((university) => (
          <div
            key={university.id}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-brand-blue group-hover:text-brand-teal transition-colors line-clamp-2 min-h-[3.5rem]">
                  {university.name}
                </h4>
              </div>
              <div className="bg-brand-light rounded-full p-2.5 shrink-0 ml-3">
                <Building className="w-5 h-5 text-brand-teal" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4 text-brand-teal" />
                <span className="font-semibold text-sm">
                  {university.courses.length} cursos destacados
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Áreas em Destaque:
                </p>
                <div className="flex flex-wrap gap-2">
                  {university.courses.slice(0, 3).map((course) => (
                    <span
                      key={course}
                      className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md shadow-sm"
                    >
                      {course}
                    </span>
                  ))}
                  {university.courses.length > 3 && (
                    <span className="text-xs bg-brand-light text-brand-teal font-semibold px-2.5 py-1 rounded-md">
                      +{university.courses.length - 3} mais
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-brand-blue rounded-2xl p-8 text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="relative z-10">
          <Award className="w-10 h-10 text-brand-accent mx-auto mb-4" />
          <h4 className="text-xl font-bold text-white mb-2">Garantia de Qualidade</h4>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Todas as instituições são credenciadas no <strong className="text-white">Sistema ACAFE</strong> (Associação Catarinense das Fundações Educacionais), garantindo excelência e reconhecimento em todo o estado.
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(UniversitiesSection);
