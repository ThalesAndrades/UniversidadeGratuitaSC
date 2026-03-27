import { MapPin, Users, Award } from 'lucide-react';
import { memo } from 'react';
import { UNIVERSITIES } from '@/constants/universities';

function UniversitiesSection() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Instituições de Excelência
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Conheça as universidades participantes do Sistema ACAFE que fazem parte do programa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {UNIVERSITIES.map((university) => (
          <div
            key={university.id}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all hover:scale-[1.02] border-2 border-transparent hover:border-purple-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {university.name}
                </h4>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{university.city}</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-full p-3">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">
                  {university.courses.length} cursos disponíveis
                </span>
              </div>

              {/* Sample courses preview */}
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Alguns cursos oferecidos:
                </p>
                <div className="flex flex-wrap gap-2">
                  {university.courses.slice(0, 3).map((course) => (
                    <span
                      key={course}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                    >
                      {course}
                    </span>
                  ))}
                  {university.courses.length > 3 && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      +{university.courses.length - 3} mais
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 text-center">
        <p className="text-gray-700">
          <strong className="text-purple-700">Sistema ACAFE:</strong> Associação Catarinense 
          das Fundações Educacionais, garantindo qualidade e reconhecimento em todo o estado.
        </p>
      </div>
    </div>
  );
}

export default memo(UniversitiesSection);
