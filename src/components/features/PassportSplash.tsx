import { useRef, useCallback, memo } from 'react';
import { CheckCircle2, Download, X } from 'lucide-react';
import { PassportFormData } from '@/lib/validations';
import { formatDate } from '@/lib/utils';
import { UNIVERSITIES } from '@/constants/universities';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo-programa.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PassportSplashProps {
  data: PassportFormData;
  onClose: () => void;
}

function PassportSplash({ data, onClose }: PassportSplashProps) {
  const passportRef = useRef<HTMLDivElement>(null);

  const university = UNIVERSITIES.find((u) => u.id === data.university);

  const handleDownloadPDF = useCallback(async () => {
    if (!passportRef.current) return;

    try {
      const canvas = await html2canvas(passportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`passaporte-${data.firstName}-${data.lastName}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  }, [data.firstName, data.lastName]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in">
        {/* Success Header */}
        <div className="bg-brand-teal p-8 text-white text-center">
          <CheckCircle2 className="w-20 h-20 mx-auto mb-4 animate-bounce stroke-[3px]" />
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Passaporte Criado!</h2>
          <p className="text-teal-50 font-bold tracking-wide">Seu passaporte virtual foi gerado com sucesso</p>
        </div>

        {/* Passport Card */}
        <div ref={passportRef} className="p-8 bg-gray-100">
          <div className="border-4 border-gray-900 rounded-2xl overflow-hidden bg-white shadow-2xl relative">
            
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <div className="w-64 h-64 bg-brand-green" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
            </div>

            {/* Card Header (Official Program Logo Style) */}
            <div className="bg-white p-6 text-black border-b-8 border-brand-accent relative z-10 flex flex-col items-center">
              <div className="flex flex-col items-center relative">
                 {/* Stylized Graduation Cap */}
                 <div className="relative w-20 h-16 flex flex-col items-center mb-1">
                    <div className="w-16 h-3 bg-brand-accent rounded-sm absolute top-0 z-0"></div>
                    <div className="w-20 h-10 bg-brand-green absolute top-2 z-10" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
                    <div className="w-12 h-5 bg-brand-green absolute top-8 z-0 rounded-b-xl border-b-4 border-black/20"></div>
                    <div className="w-2 h-7 bg-brand-accent absolute right-2 top-5 z-20" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}></div>
                 </div>
                 
                 <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight leading-none mt-1 text-center">
                   Universidade<br/>
                   <span className="text-2xl sm:text-3xl">Gratuita</span>
                 </h3>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8 relative z-10">
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                {/* Photo */}
                <div className="flex-shrink-0 relative">
                  <div className="absolute -inset-1 bg-brand-accent rounded-xl transform rotate-3"></div>
                  <img
                    src={data.photo}
                    alt="Foto do estudante"
                    className="w-36 h-36 rounded-xl object-cover border-4 border-white shadow-md bg-white relative z-10"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4 w-full">
                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-brand-green">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Nome Completo</p>
                    <p className="text-xl font-black text-black uppercase tracking-tight">
                      {data.firstName} {data.lastName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Data Nasc.</p>
                      <p className="text-sm font-black text-gray-800">{formatDate(data.birthDate)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Telefone</p>
                      <p className="text-sm font-black text-gray-800">{data.phone}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Email</p>
                    <p className="text-sm font-black text-gray-800 truncate">{data.email}</p>
                  </div>
                </div>
              </div>

              {/* University and Course */}
              <div className="mt-8 pt-6 border-t-2 border-gray-200 space-y-4">
                <div className="bg-brand-teal/10 p-4 rounded-xl border border-brand-teal/30">
                  <p className="text-[10px] text-brand-teal font-black uppercase tracking-widest mb-1">Instituição de Ensino</p>
                  <p className="text-lg font-black text-black uppercase tracking-tight">{university?.name}</p>
                </div>
                <div className="bg-brand-green/10 p-4 rounded-xl border border-brand-green/30">
                  <p className="text-[10px] text-brand-green font-black uppercase tracking-widest mb-1">Curso Escolhido</p>
                  <p className="text-lg font-black text-black uppercase tracking-tight">{data.course}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex flex-col items-center bg-gray-50 py-4 rounded-lg border border-gray-200">
                <p className="text-xs text-black font-black uppercase tracking-widest mb-1">
                  Governo de Santa Catarina
                </p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Documento Estudantil
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-white flex flex-col sm:flex-row gap-4 border-t border-gray-200">
          <Button
            onClick={handleDownloadPDF}
            className="flex-1 bg-brand-accent hover:bg-red-700 text-white font-black uppercase tracking-wide py-6 text-lg shadow-md"
          >
            <Download className="w-5 h-5 mr-2 stroke-[3px]" />
            Baixar PDF
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-black uppercase tracking-wide py-6 text-lg">
            <X className="w-5 h-5 mr-2 stroke-[3px]" />
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(PassportSplash);
export { PassportSplash };
