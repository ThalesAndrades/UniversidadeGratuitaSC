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
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
          <CheckCircle2 className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Passaporte Criado!</h2>
          <p className="text-green-50">Seu passaporte virtual foi gerado com sucesso</p>
        </div>

        {/* Passport Card */}
        <div ref={passportRef} className="p-8 bg-white">
          <div className="border-4 border-purple-600 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="Logo" className="h-16 w-16 bg-white rounded-full p-2" />
                  <div>
                    <h3 className="text-xl font-bold">Universidade Gratuita SC</h3>
                    <p className="text-sm text-purple-100">Sistema ACAFE</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <img
                    src={data.photo}
                    alt="Foto do estudante"
                    className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Nome Completo</p>
                    <p className="text-xl font-bold text-gray-900">
                      {data.firstName} {data.lastName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Data Nasc.</p>
                      <p className="text-sm font-semibold text-gray-800">{formatDate(data.birthDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Telefone</p>
                      <p className="text-sm font-semibold text-gray-800">{data.phone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="text-sm font-semibold text-gray-800">{data.email}</p>
                  </div>
                </div>
              </div>

              {/* University and Course */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Instituição</p>
                  <p className="text-base font-bold text-gray-900">{university?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Curso</p>
                  <p className="text-base font-bold text-purple-700">{data.course}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center">
                  Passaporte válido em toda rede ACAFE • Documento não-oficial
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleDownloadPDF}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Download className="w-5 h-5 mr-2" />
            Baixar PDF
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
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
