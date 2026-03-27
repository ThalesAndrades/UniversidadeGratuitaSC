import { Cpu, Heart, Briefcase, FlaskConical, Palette, Scale, Search } from 'lucide-react';
import { memo, useState, useMemo } from 'react';
import { UNIVERSITIES } from '@/constants/universities';

const AREA_ICONS = {
  'Tecnologia': Cpu,
  'Saúde': Heart,
  'Negócios': Briefcase,
  'Exatas': FlaskConical,
  'Humanas': Palette,
  'Direito': Scale,
};

function CoursesSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  // Agregar todos os cursos únicos
  const allCourses = useMemo(() => {
    const coursesSet = new Set<string>();
    UNIVERSITIES.forEach(uni => {
      uni.courses.forEach(course => coursesSet.add(course));
    });
    return Array.from(coursesSet).sort();
  }, []);

  // Categorizar cursos por área
  const categorizedCourses = useMemo(() => {
    const categories: Record<string, string[]> = {
      'Tecnologia': [],
      'Saúde': [],
      'Negócios': [],
      'Exatas': [],
      'Humanas': [],
      'Direito': [],
      'Outros': [],
    };

    allCourses.forEach(course => {
      const lower = course.toLowerCase();
      if (lower.includes('engenharia') || lower.includes('computação') || lower.includes('sistemas') || lower.includes('tecnologia')) {
        categories['Tecnologia'].push(course);
      } else if (lower.includes('medicina') || lower.includes('enfermagem') || lower.includes('saúde') || lower.includes('farmácia')) {
        categories['Saúde'].push(course);
      } else if (lower.includes('administração') || lower.includes('contábeis') || lower.includes('economia') || lower.includes('gestão')) {
        categories['Negócios'].push(course);
      } else if (lower.includes('matemática') || lower.includes('física') || lower.includes('química') || lower.includes('biologia')) {
        categories['Exatas'].push(course);
      } else if (lower.includes('direito') || lower.includes('jurídica')) {
        categories['Direito'].push(course);
      } else if (lower.includes('letras') || lower.includes('pedagogia') || lower.includes('história') || lower.includes('psicologia')) {
        categories['Humanas'].push(course);
      } else {
        categories['Outros'].push(course);
      }
    });

    return categories;
  }, [allCourses]);

  const filteredCourses = useMemo(() => {
    let courses = selectedArea 
      ? categorizedCourses[selectedArea] || []
      : allCourses;

    if (searchTerm) {
      courses = courses.filter(course => 
        course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return courses;
  }, [allCourses, categorizedCourses, selectedArea, searchTerm]);

  const areas = Object.keys(categorizedCourses).filter(area => 
    categorizedCourses[area].length > 0
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Explore as Opções de Cursos
        </h3>
        <p className="text-lg text-gray-600">
          Mais de {allCourses.length} cursos disponíveis em diversas áreas do conhecimento
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 transition-colors"
        />
      </div>

      {/* Area Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedArea(null)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            selectedArea === null
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas as Áreas
        </button>
        {areas.map(area => {
          const Icon = AREA_ICONS[area as keyof typeof AREA_ICONS] || Palette;
          return (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                selectedArea === area
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {area}
              <span className="text-xs opacity-75">
                ({categorizedCourses[area].length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
        {filteredCourses.map((course) => (
          <div
            key={course}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-all hover:scale-[1.02] border border-gray-200 hover:border-purple-300"
          >
            <p className="font-semibold text-gray-900 text-sm leading-snug">
              {course}
            </p>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Nenhum curso encontrado para "{searchTerm}"
          </p>
        </div>
      )}

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-700">
          💡 <strong>Dica:</strong> A disponibilidade de cursos pode variar por universidade. 
          Selecione sua universidade ao criar o passaporte para ver as opções específicas.
        </p>
      </div>
    </div>
  );
}

export default memo(CoursesSection);
