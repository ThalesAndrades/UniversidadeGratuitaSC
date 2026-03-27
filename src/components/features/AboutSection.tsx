import { GraduationCap, Users, Award, BookOpen, CheckCircle2, Heart } from 'lucide-react';
import { memo } from 'react';

const BENEFITS = [
  {
    icon: GraduationCap,
    title: 'Educação Gratuita de Qualidade',
    description: 'Acesso a cursos de graduação sem custos de mensalidade em universidades de excelência reconhecidas pelo MEC.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Users,
    title: 'Rede ACAFE',
    description: 'Faça parte do sistema que conecta as melhores universidades comunitárias de Santa Catarina, com infraestrutura completa.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Award,
    title: 'Reconhecimento Nacional',
    description: 'Diplomas reconhecidos nacionalmente com padrão de qualidade certificado pelo Ministério da Educação.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: BookOpen,
    title: 'Variedade de Cursos',
    description: 'Mais de 50 opções de cursos em diversas áreas do conhecimento: Exatas, Humanas, Saúde e Tecnologia.',
    color: 'from-violet-500 to-violet-600',
  },
  {
    icon: Heart,
    title: 'Apoio ao Estudante',
    description: 'Suporte completo durante toda a jornada universitária, com orientação acadêmica e profissional.',
    color: 'from-pink-500 to-pink-600',
  },
];

const REQUIREMENTS = [
  'Ser residente de Santa Catarina',
  'Ter concluído ou estar concluindo o ensino médio',
  'Não possuir diploma de graduação',
  'Comprovar situação socioeconômica conforme critérios do programa',
];

function AboutSection() {
  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Transforme seu futuro através da educação
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          O Programa Universidade Gratuita de Santa Catarina é uma iniciativa que democratiza o acesso 
          à educação superior, oferecendo oportunidades reais de crescimento pessoal e profissional.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BENEFITS.map((benefit, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${benefit.color} mb-4`}>
              <benefit.icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h4>
            <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
          </div>
        ))}
      </div>

      {/* Requirements */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 sm:p-8">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Requisitos para Participar
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {REQUIREMENTS.map((req, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">{req}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <h4 className="text-2xl font-bold mb-3">Pronto para começar?</h4>
        <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
          Crie seu passaporte virtual agora e dê o primeiro passo rumo ao seu diploma universitário.
        </p>
        <p className="text-sm text-purple-200">
          O processo é rápido, simples e 100% digital
        </p>
      </div>
    </div>
  );
}

export default memo(AboutSection);
