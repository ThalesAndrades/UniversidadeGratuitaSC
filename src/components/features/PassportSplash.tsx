import { useRef, useCallback, memo } from 'react';
import { CheckCircle2, Download, X } from 'lucide-react';
import QRCode from '@/components/features/QRCode';
import { PassportFormData } from '@/lib/validations';
import { formatDate } from '@/lib/utils';
import { UNIVERSITIES } from '@/constants/universities';
import { Button } from '@/components/ui/button';
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
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-background rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-in border border-border">
        {/* Success Header */}
        <div className="bg-card p-6 sm:p-8 text-foreground text-center border-b border-border">
          <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 animate-bounce stroke-[3px] text-primary" />
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-1 sm:mb-2">Passaporte Criado!</h2>
          <p className="font-bold tracking-wide opacity-90 text-muted-foreground text-sm sm:text-base">Seu passaporte virtual foi gerado com sucesso</p>
        </div>

        {/* Passport Card */}
        <div className="p-8 bg-muted overflow-y-auto max-h-[60vh]">
          <div className="border-4 border-foreground rounded-2xl overflow-hidden bg-card shadow-2xl relative max-w-full">
            
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <div className="w-64 h-64 bg-brand-green" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
            </div>

            {/* Card Header (Official Program Logo Style) */}
            <div className="bg-card p-6 text-foreground border-b-8 border-primary relative z-10 flex flex-col items-center">
              <div className="flex flex-col items-center relative w-full max-w-[280px] mx-auto">
                 {/* Stylized Graduation Cap */}
                 <div className="relative w-20 h-16 flex flex-col items-center mb-1">
                    <div className="w-16 h-3 bg-primary rounded-sm absolute top-0 z-0"></div>
                    <div className="w-20 h-10 bg-primary absolute top-2 z-10" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
                    <div className="w-12 h-5 bg-primary absolute top-8 z-0 rounded-b-xl border-b-4 border-black/20"></div>
                    <div className="w-2 h-7 bg-primary absolute right-2 top-5 z-20" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}></div>
                 </div>
                 
                 <h3 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight leading-none mt-1 text-center">
                   Universidade<br/>
                   <span className="text-2xl sm:text-3xl">Gratuita</span>
                 </h3>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8 relative z-10">
              <div className="flex flex-col sm:flex-row gap-8 items-start w-full">
                {/* Photo */}
                <div className="flex-shrink-0 relative mx-auto sm:mx-0">
                  <div className="absolute -inset-1 bg-primary rounded-xl transform rotate-3"></div>
                  <img
                    src={data.photo}
                    alt="Foto do estudante"
                    className="w-36 h-36 rounded-xl object-cover border-4 border-background shadow-md bg-background relative z-10"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4 w-full min-w-0">
                  <div className="bg-muted/50 p-3 rounded-lg border-l-4 border-primary flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Nome Completo</p>
                      <p className="text-xl font-black text-foreground uppercase tracking-tight break-words">
                        {data.firstName} {data.lastName}
                      </p>
                    </div>
                    {/* QR Code Validation */}
                    <div className="flex-shrink-0 bg-white p-1 rounded-md shadow-sm border border-border">
                      <QRCode 
                        value={`https://universidade-gratuita-sc.vercel.app/validate?id=${btoa(data.email).substring(0, 10).toUpperCase()}`}
                        size={64}
                        bgColor="#ffffff"
                        fgColor="#000000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-3 rounded-lg border-l-4 border-border">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Data Nasc.</p>
                      <p className="text-sm font-black text-foreground">{formatDate(data.birthDate)}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg border-l-4 border-border">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Telefone</p>
                      <p className="text-sm font-black text-foreground">{data.phone}</p>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg border-l-4 border-border">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Email</p>
                    <p className="text-sm font-black text-foreground truncate">{data.email}</p>
                  </div>
                </div>
              </div>

              {/* University and Course */}
              <div className="mt-8 pt-6 border-t-2 border-border space-y-4">
                <div className="bg-brand-teal/10 p-4 rounded-xl border border-brand-teal/30 overflow-hidden">
                  <p className="text-[10px] text-brand-teal font-black uppercase tracking-widest mb-1">Instituição de Ensino</p>
                  <p className="text-lg font-black text-foreground uppercase tracking-tight break-words">{university?.name}</p>
                </div>
                <div className="bg-brand-green/10 p-4 rounded-xl border border-brand-green/30 overflow-hidden">
                  <p className="text-[10px] text-brand-green font-black uppercase tracking-widest mb-1">Curso Escolhido</p>
                  <p className="text-lg font-black text-foreground uppercase tracking-tight break-words">{data.course}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex flex-col items-center bg-muted/30 py-4 rounded-lg border border-border">
                <p className="text-xs text-foreground font-black uppercase tracking-widest mb-1">
                  Governo de Santa Catarina
                </p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  Documento Estudantil
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 sm:p-6 bg-card flex flex-col sm:flex-row gap-3 sm:gap-4 border-t border-border">
          <Button
            onClick={handleDownloadPDF}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-wide py-4 sm:py-6 text-base sm:text-lg shadow-[0_8px_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_12px_25px_hsl(var(--primary)/0.6)] hover:-translate-y-1 transition-all duration-300 border-b-[5px] border-black/30 active:translate-y-0 active:border-b-0 active:mt-[5px] mb-1"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2 stroke-[3px]" />
            Baixar PDF
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1 border-2 border-border text-foreground hover:bg-muted font-black uppercase tracking-wide py-4 sm:py-6 text-base sm:text-lg transition-all border-b-[5px] active:translate-y-0 active:border-b-2 active:mt-[3px] mb-1">
            <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2 stroke-[3px]" />
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(PassportSplash);
export { PassportSplash };
