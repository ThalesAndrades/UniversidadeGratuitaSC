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
          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all text-lg shadow-sm"
        />
      </div>

      {/* Area Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSelectedArea(null)}
          className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
            selectedArea === null
              ? 'bg-brand-teal text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
                selectedArea === area
                  ? 'bg-brand-teal text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {area}
              <span className="text-[10px] opacity-75">
                ({categorizedCourses[area].length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-brand-teal/20 scrollbar-track-transparent">
        {filteredCourses.map((course) => (
          <div
            key={course}
            className="bg-white rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-brand-teal/30 group flex items-center"
          >
            <div className="w-2 h-2 rounded-full bg-brand-teal/50 group-hover:bg-brand-teal mr-3 transition-colors" />
            <p className="font-bold text-brand-blue group-hover:text-brand-teal text-sm leading-snug transition-colors">
              {course}
            </p>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg font-medium">
            Nenhum curso encontrado para "{searchTerm}"
          </p>
        </div>
      )}

      <div className="bg-brand-light border border-brand-teal/20 rounded-xl p-5 text-center">
        <p className="text-sm text-brand-blue font-medium">
          <span className="text-brand-teal font-bold mr-2">💡 Dica:</span> A disponibilidade de cursos pode variar por universidade. 
          Selecione sua universidade ao criar o passaporte para ver as opções específicas.
        </p>
      </div>
    </div>
  );
}

export default memo(CoursesSection);
