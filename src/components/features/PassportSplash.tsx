import { useRef, useCallback, useMemo, useState, memo } from 'react';
import { Download, X, CheckCircle2, Share2 } from 'lucide-react';
import QRCode from '@/components/features/QRCode';
import acafeLogoWhite from '@/assets/acafe-logo-white.png';
import acafeSymbol from '@/assets/acafe-symbol.png';
import type { PassportFormData } from '@/lib/validations';
import { formatDate } from '@/lib/utils';
import { UNIVERSITIES } from '@/constants/universities';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PassportSplashProps {
  data: PassportFormData;
  onClose: () => void;
}

// Gera número de passaporte determinístico baseado nos dados do usuário
function generatePassportNumber(data: PassportFormData): string {
  const year = new Date().getFullYear();
  const seed = (data.firstName + data.lastName + data.email + data.birthDate)
    .split('')
    .reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0);
  const num = String(seed % 1000000).padStart(6, '0');
  return `SC${year}${num}`;
}

function PassportSplash({ data, onClose }: PassportSplashProps) {
  const passportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const university = UNIVERSITIES.find((u) => u.id === data.university);
  const passportNumber = useMemo(() => generatePassportNumber(data), [data]);
  const issueDate = useMemo(() => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  }, []);

  const qrValue = useMemo(
    () => `https://passaporteacafe.app/?passaporte=${encodeURIComponent(data.email)}&id=${passportNumber}`,
    [passportNumber, data.email]
  );

  const handleDownloadPDF = useCallback(async () => {
    if (!passportRef.current) return;
    setIsDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const isCoarsePointer =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const scale = Math.min(isCoarsePointer ? 2 : 3, Math.max(1.5, dpr));

      const canvas = await html2canvas(passportRef.current, {
        scale,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      let imgWidth = pageWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }

      const xOffset = Math.max(0, (pageWidth - imgWidth) / 2);
      const yOffset = Math.max(0, (pageHeight - imgHeight) / 2);
      const imgData = canvas.toDataURL('image/jpeg', 0.92);

      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save(`passaporte-universitario-${data.firstName.toLowerCase()}-${data.lastName.toLowerCase()}.pdf`);
      canvas.width = 0;
      canvas.height = 0;
    } catch {
      toast.error('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  }, [data.firstName, data.lastName]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu Passaporte Acafe',
          text: `${data.firstName} ${data.lastName} — ${university?.name} | Passaporte Acafe`,
        });
      } catch {
        // Usuário cancelou
      }
    }
  }, [data.firstName, data.lastName, university]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-none sm:backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#272B20] rounded-2xl max-w-lg w-full max-h-[95vh] overflow-hidden shadow-2xl animate-slide-in border border-[#8FBE3F]/20 flex flex-col">

        {/* Success Header */}
        <div className="relative p-5 sm:p-6 text-center flex-shrink-0">
          {/* Glow ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="w-48 h-48 rounded-full bg-[#8FBE3F]/5 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#8FBE3F]/15 mb-3 ring-2 ring-[#8FBE3F]/30 relative">
              <img src={acafeSymbol} alt="ACAFE" className="h-[36px] w-auto" draggable={false} />
              <CheckCircle2 className="w-4 h-4 text-[#8FBE3F] absolute -bottom-1 -right-1 bg-[#272B20] rounded-full" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Passaporte Gerado!
            </h2>
            <p className="text-sm text-white/50 mt-1">Seu documento está pronto para download</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors touch-manipulation active:scale-95"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable passport area */}
        <div className="overflow-y-auto flex-1 px-3 sm:px-4 pb-3">
          {/* ── PASSPORT DOCUMENT (capturado pelo html2canvas) ── */}
          <div
            ref={passportRef}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              fontFamily: "'Arial', 'Helvetica', sans-serif",
            }}
          >
            {/* Document Header */}
            <div style={{ backgroundColor: '#272B20', padding: '20px 24px 16px', position: 'relative' }}>
              {/* decorative top stripe */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #8FBE3F 0%, #63842C 50%, #8FBE3F 100%)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Brand infinity logomark */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  backgroundColor: 'rgba(143,190,63,0.15)', border: '1.5px solid rgba(143,190,63,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <img src={acafeLogoWhite} alt="ACAFE" className="h-[30px] w-auto" draggable={false} />
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#8FBE3F', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    ACAFE · Santa Catarina
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', letterSpacing: '1px', textTransform: 'uppercase', lineHeight: '1.1' }}>
                    Passaporte Acafe
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>
                    Passaporte Estudantil · Rede ACAFE
                  </div>
                </div>
              </div>
            </div>

            {/* Passport Number Banner */}
            <div style={{ backgroundColor: '#8FBE3F', padding: '6px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', fontWeight: '800', color: '#272B20', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Nº {passportNumber}
              </span>
              <span style={{ fontSize: '9px', fontWeight: '700', color: '#272B20', letterSpacing: '1px' }}>
                Emissão: {issueDate}
              </span>
            </div>

            {/* Main Content */}
            <div style={{ backgroundColor: '#f8faf8', padding: '20px 24px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                {/* Photo */}
                <div style={{ flexShrink: 0 }}>
                  <div style={{
                    width: '96px', height: '116px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '3px solid #8FBE3F',
                    backgroundColor: '#e5e7e5',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}>
                    <img
                      src={data.photo}
                      alt="Foto do estudante"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      crossOrigin="anonymous"
                    />
                  </div>
                  {/* Photo label */}
                  <div style={{ marginTop: '4px', textAlign: 'center', fontSize: '7px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '700' }}>
                    Titular
                  </div>
                </div>

                {/* Info Fields */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '8px', color: '#8FBE3F', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', backgroundColor: '#272B20', display: 'inline-block', padding: '1px 6px', borderRadius: '3px', marginBottom: '3px' }}>
                      Nome do Estudante
                    </div>
                    <div style={{ fontSize: '17px', fontWeight: '900', color: '#272B20', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: '1.1' }}>
                      {data.firstName} {data.lastName}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '7px 10px', borderRadius: '6px', borderLeft: '3px solid #8FBE3F' }}>
                      <div style={{ fontSize: '7px', color: '#888', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '2px' }}>Nascimento</div>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: '#272B20' }}>{formatDate(data.birthDate)}</div>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: '7px 10px', borderRadius: '6px', borderLeft: '3px solid #8FBE3F' }}>
                      <div style={{ fontSize: '7px', color: '#888', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '2px' }}>Telefone</div>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: '#272B20' }}>{data.phone}</div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '7px 10px', borderRadius: '6px', borderLeft: '3px solid #272B20' }}>
                    <div style={{ fontSize: '7px', color: '#888', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '2px' }}>E-mail</div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.email}</div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ margin: '16px 0', borderTop: '2px dashed #d4e8d4' }} />

              {/* University & Course */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#272B20', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '7px', color: '#8FBE3F', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Instituição</div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#ffffff', lineHeight: '1.3', textTransform: 'uppercase' }}>{university?.name.split(' - ')[0] || university?.name}</div>
                </div>
                <div style={{ backgroundColor: '#272B20', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '7px', color: '#8FBE3F', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Curso</div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#ffffff', lineHeight: '1.3', textTransform: 'uppercase' }}>{data.course}</div>
                </div>
              </div>

              {/* QR Code Section */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '2px solid #e0ece0', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flexShrink: 0, padding: '8px', backgroundColor: '#fff', borderRadius: '8px', border: '2px solid #8FBE3F', boxShadow: '0 2px 8px rgba(143,190,63,0.2)' }}>
                  <QRCode
                    value={qrValue}
                    size={100}
                    bgColor="#ffffff"
                    fgColor="#272B20"
                    level="M"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '8px', color: '#8FBE3F', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px', backgroundColor: '#272B20', display: 'inline-block', padding: '2px 6px', borderRadius: '3px' }}>
                    Código de Validação
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '900', color: '#272B20', letterSpacing: '1px', marginBottom: '4px', fontFamily: 'monospace' }}>
                    {passportNumber}
                  </div>
                  <div style={{ fontSize: '9px', color: '#666', lineHeight: '1.4' }}>
                    Escaneie para acessar este passaporte
                  </div>
                </div>
              </div>
            </div>

            {/* Document Footer */}
            <div style={{ backgroundColor: '#272B20', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Passaporte Estudantil · ACAFE
              </span>
              <span style={{ fontSize: '8px', color: '#8FBE3F', letterSpacing: '1px', fontWeight: '700' }}>
                passaporteacafe.app
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 p-3 sm:p-4 border-t border-white/10 flex gap-2 sm:gap-3">
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex-1 bg-[#8FBE3F] hover:bg-[#8FBE3F]/90 text-[#272B20] font-black uppercase tracking-wide h-12 sm:h-14 text-sm sm:text-base shadow-[0_4px_20px_rgba(143,190,63,0.35)] hover:shadow-[0_6px_28px_rgba(143,190,63,0.5)] transition-all touch-manipulation disabled:opacity-60"
          >
            {isDownloading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Gerando...
              </span>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" strokeWidth={3} />
                Baixar PDF
              </>
            )}
          </Button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button
              onClick={handleShare}
              variant="outline"
              className="h-12 sm:h-14 px-4 border-white/20 text-white hover:bg-white/10 touch-manipulation"
              aria-label="Compartilhar"
            >
              <Share2 className="w-4 h-4" strokeWidth={2.5} />
            </Button>
          )}

          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-white/20 text-white/70 hover:bg-white/10 hover:text-white font-bold uppercase tracking-wide h-12 sm:h-14 text-sm touch-manipulation"
          >
            <X className="w-4 h-4 mr-2" strokeWidth={2.5} />
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(PassportSplash);
export { PassportSplash };
