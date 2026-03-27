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
          <CheckCircle2 className="w-20 h-20 mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-extrabold mb-2">Passaporte Criado!</h2>
          <p className="text-teal-50 font-medium">Seu passaporte virtual foi gerado com sucesso</p>
        </div>

        {/* Passport Card */}
        <div ref={passportRef} className="p-8 bg-white">
          <div className="border-4 border-brand-blue rounded-2xl overflow-hidden bg-brand-light">
            {/* Card Header */}
            <div className="bg-brand-blue p-6 text-white border-b-4 border-brand-accent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white rounded-xl p-2 shadow-sm">
                    <img src={logo} alt="Logo" className="h-14 w-14 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold uppercase tracking-wide">Universidade Gratuita SC</h3>
                    <p className="text-sm text-brand-accent font-bold tracking-widest">SISTEMA ACAFE</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <img
                    src={data.photo}
                    alt="Foto do estudante"
                    className="w-36 h-36 rounded-xl object-cover border-4 border-white shadow-md bg-white"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4 w-full">
                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-brand-teal font-bold uppercase tracking-widest mb-1">Nome Completo</p>
                    <p className="text-xl font-extrabold text-brand-blue uppercase">
                      {data.firstName} {data.lastName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-[10px] text-brand-teal font-bold uppercase tracking-widest mb-1">Data Nasc.</p>
                      <p className="text-sm font-bold text-gray-800">{formatDate(data.birthDate)}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-[10px] text-brand-teal font-bold uppercase tracking-widest mb-1">Telefone</p>
                      <p className="text-sm font-bold text-gray-800">{data.phone}</p>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-brand-teal font-bold uppercase tracking-widest mb-1">Email</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{data.email}</p>
                  </div>
                </div>
              </div>

              {/* University and Course */}
              <div className="mt-8 pt-6 border-t-2 border-brand-teal/20 space-y-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] text-brand-teal font-bold uppercase tracking-widest mb-1">Instituição de Ensino</p>
                  <p className="text-lg font-extrabold text-brand-blue uppercase">{university?.name}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] text-brand-teal font-bold uppercase tracking-widest mb-1">Curso Escolhido</p>
                  <p className="text-lg font-extrabold text-brand-teal uppercase">{data.course}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center bg-white py-3 rounded-lg border border-dashed border-gray-300">
                <p className="text-xs text-brand-blue font-bold uppercase tracking-widest">
                  Documento de Identificação Estudantil • Não-oficial
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 flex flex-col sm:flex-row gap-4 border-t border-gray-100">
          <Button
            onClick={handleDownloadPDF}
            className="flex-1 bg-brand-teal hover:bg-teal-500 text-white font-bold py-6 text-lg shadow-md"
          >
            <Download className="w-5 h-5 mr-2" />
            Baixar PDF
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1 border-2 border-gray-200 text-gray-600 hover:bg-gray-100 font-bold py-6 text-lg">
            <X className="w-5 h-5 mr-2" />
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(PassportSplash);
export { PassportSplash };
