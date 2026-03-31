import { useState, useRef, lazy, Suspense, memo, useEffect, useCallback } from 'react';
import type { PassportFormData } from '@/lib/validations';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { OverlapSquares, BracketCorner, AcafeConstellation, AcafeLockup, AcafeOfficialLogo, ScStateSeal } from '@/components/features/BrandElements';
import univGratuitaLogo from '@/assets/universidade-gratuita-logo.png';
import sedLogo from '@/assets/sed-logo.png';
import heroPassport from '@/assets/hero-passport.png';

const Header = lazy(() => import('@/components/layout/Header').then(m => ({ default: m.Header })));
const UniversityLogos = lazy(() => import('@/components/features/UniversityLogos'));
const NetworkConstellation = lazy(() => import('@/components/features/NetworkConstellation'));
const PassportSplash = lazy(() => import('@/components/features/PassportSplash').then(m => ({ default: m.PassportSplash })));
const PassportForm = lazy(() => import('@/components/forms/PassportForm').then(m => ({ default: m.PassportForm })));

const RATE_LIMIT_TIME = 10000;

async function saveLead(data: PassportFormData): Promise<{ ok: boolean; error?: string }> {
  try {
    const url = new URL('/api/leads.php', window.location.origin).toString();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate,
        university: data.university,
        course: data.course,
        photo: data.photo,
        consent: !!data.consent,
        ts: Math.floor(Date.now() / 1000),
        hp: '',
      }),
    });
    if (res.status === 429) {
      return { ok: false, error: 'rate_limit' };
    }
    if (res.status === 409) {
      return { ok: false, error: 'duplicate_email' };
    }
    if (res.status === 413) {
      return { ok: false, error: 'payload_too_large' };
    }
    if (res.status >= 500) {
      return { ok: false, error: 'server_error' };
    }
    return { ok: res.ok };
  } catch {
    return { ok: false, error: 'network' };
  }
}

const ACCESS_ERRORS: Record<string, string> = {
  'Passaporte não encontrado. Verifique o email e data de nascimento.':
    'Nenhum passaporte encontrado com esses dados. Verifique se o email e a data de nascimento estão corretos.',
  'Email inválido.': 'O formato do email informado não é válido.',
  'Formato de data inválido.': 'A data de nascimento informada não é válida.',
  'Email e data de nascimento são obrigatórios.': 'Preencha o email e a data de nascimento.',
  'Erro interno.': 'Ocorreu um erro no servidor. Tente novamente em alguns instantes.',
};

async function fetchPassport(email: string, birthDate: string): Promise<{ ok: boolean; passport?: PassportFormData; error?: string }> {
  try {
    const url = new URL('/api/passport.php', window.location.origin).toString();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, birthDate }),
    });
    if (res.status === 429) {
      return { ok: false, error: 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.' };
    }
    const body = await res.json().catch(() => ({ ok: false }));
    if (!res.ok || !body.ok) {
      const raw = body.error || '';
      const friendly = ACCESS_ERRORS[raw] || raw || 'Passaporte não encontrado. Verifique seus dados e tente novamente.';
      return { ok: false, error: friendly };
    }
    return { ok: true, passport: body.passport as PassportFormData };
  } catch {
    return { ok: false, error: 'Sem conexão com o servidor. Verifique sua internet e tente novamente.' };
  }
}

/* ── Shadow system ─────────────────────────────────────────────────────────── */
const S = {
  card:     '0 1px 3px rgba(0,0,0,0.3), 0 6px 20px rgba(0,0,0,0.28), 0 20px 60px rgba(0,0,0,0.35)',
  header:   'inset 0 -1px 0 rgba(255,255,255,0.05)',
  section:  'inset 0 1px 0 rgba(255,255,255,0.03)',
  footer:   'inset 0 1px 4px rgba(0,0,0,0.18)',
  cta:      '0 2px 8px rgba(143,190,63,0.4), 0 8px 28px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)',
  ctaHover: '0 4px 14px rgba(143,190,63,0.5), 0 12px 36px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.22)',
  sedChip:  '0 1px 3px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
  modal:    '0 0 0 1px rgba(255,255,255,0.05), 0 24px 80px rgba(0,0,0,0.7)',
  tagline:  '0 2px 8px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.04)',
} as const;

function AccessPassportModal({ onClose, onSuccess, initialEmail = '' }: { onClose: () => void; onSuccess: (data: PassportFormData) => void; initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAccess = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Informe o email que você usou ao criar o passaporte.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('O formato do email não é válido. Ex: nome@email.com');
      return;
    }
    if (!birthDate) {
      setError('Informe sua data de nascimento para verificação.');
      return;
    }

    setLoading(true);
    const result = await fetchPassport(trimmedEmail, birthDate);
    setLoading(false);
    if (result.ok && result.passport) {
      onSuccess(result.passport);
    } else {
      setError(result.error || 'Não foi possível recuperar o passaporte.');
    }
  }, [email, birthDate, onSuccess]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-background/95 backdrop-blur-none sm:backdrop-blur-xl z-50 flex items-end sm:items-center justify-center sm:p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-card w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl flex flex-col border-0 sm:border sm:border-border/50 animate-slide-in overflow-hidden"
        style={{ boxShadow: S.modal }}
      >
        {/* Header */}
        <div
          className="border-b border-border px-5 py-4 flex items-center justify-between shrink-0"
          style={{ background: 'linear-gradient(180deg, hsl(82,14%,19%) 0%, hsl(82,14%,17%) 100%)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <AcafeConstellation size={16} color="#8FBE3F" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground uppercase tracking-tight">Meu Passaporte</h2>
              <p className="text-[11px] text-muted-foreground/60 font-medium mt-0.5">Recupere seu passaporte cadastrado</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-11 h-11 rounded-full border border-border bg-background hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive text-muted-foreground flex items-center justify-center transition-all duration-200 shrink-0 active:scale-95 touch-manipulation"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAccess} className="p-5 sm:p-6 flex flex-col gap-4">
          <p className="text-xs text-muted-foreground/50 leading-relaxed -mt-1">
            Informe o email e a data de nascimento que você usou ao gerar o passaporte.
          </p>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="access-email" className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em]">
              Email cadastrado
            </label>
            <input
              id="access-email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              inputMode="email"
              enterKeyHint="next"
              placeholder="seu@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              className="w-full h-11 px-3.5 rounded-lg border border-border/60 bg-background/50 text-foreground text-sm placeholder:text-muted-foreground/25 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="access-birthdate" className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em]">
              Data de nascimento
            </label>
            <input
              id="access-birthdate"
              type="date"
              required
              enterKeyHint="done"
              value={birthDate}
              onChange={e => { setBirthDate(e.target.value); setError(''); }}
              className="w-full h-11 px-3.5 rounded-lg border border-border/60 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-lg px-3.5 py-2.5 bg-red-500/8 border border-red-500/15">
              <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-xs text-red-400/90 font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-black text-sm text-primary-foreground uppercase tracking-wide select-none touch-manipulation
                       flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #8FBE3F 0%, #6FA030 100%)',
              boxShadow: '0 2px 8px rgba(143,190,63,0.3)',
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Buscando...
              </span>
            ) : (
              'Acessar Passaporte'
            )}
          </button>

          <p className="text-[10px] text-muted-foreground/30 text-center leading-relaxed">
            Ainda não tem passaporte?{' '}
            <button type="button" onClick={onClose} className="text-primary/60 hover:text-primary font-bold underline underline-offset-2 transition-colors">
              Gere o seu gratuitamente
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

function Home() {
  const lastSubmitTimeRef = useRef(0);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [passportData, setPassportData] = useState<PassportFormData | null>(null);
  const [prefillEmail, setPrefillEmail] = useState('');

  // Detect ?passaporte= URL param from QR code scan
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('passaporte');
    if (emailParam) {
      setPrefillEmail(decodeURIComponent(emailParam));
      setShowAccessModal(true);
    }
    // Clean URL after reading params
    if (window.location.search || window.location.hash) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!showPassportModal && !showAccessModal) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPassportModal(false);
        setShowAccessModal(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showPassportModal, showAccessModal]);

  const handleAccessSuccess = useCallback((data: PassportFormData) => {
    setPassportData(data);
    setShowAccessModal(false);
    setShowSplash(true);
    toast.success('Passaporte recuperado com sucesso!');
  }, []);

  const handleSubmit = async (data: PassportFormData) => {
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < RATE_LIMIT_TIME) {
      toast.error('Aguarde alguns segundos antes de tentar novamente.');
      return;
    }
    lastSubmitTimeRef.current = now;

    try {
      if (!data.photo.startsWith('data:image/') || data.firstName.includes('<script>')) {
        throw new Error('Dados inválidos.');
      }

      const result = await saveLead(data);
      if (!result.ok) {
        if (result.error === 'rate_limit') {
          toast.error('Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.', { duration: 6000 });
          return;
        }
        if (result.error === 'duplicate_email') {
          toast.error('Este email já possui um passaporte cadastrado. Clique em "Acessar Meu Passaporte" para recuperá-lo.', { duration: 6000 });
          setShowPassportModal(false);
          return;
        }
        if (result.error === 'payload_too_large') {
          toast.error('A foto enviada é muito grande. Tente usar uma foto menor.', { duration: 5000 });
          return;
        }
        if (result.error === 'server_error') {
          toast.error('O servidor está temporariamente indisponível. Tente novamente em instantes.', { duration: 5000 });
          return;
        }
        // Network errors — still show passport (offline-friendly)
      }

      setPassportData(data);
      setShowPassportModal(false);
      setShowSplash(true);
      toast.success('Passaporte gerado com sucesso!');
    } catch {
      toast.error('Não foi possível gerar o passaporte. Verifique seus dados e tente novamente.', { duration: 5000 });
      setShowPassportModal(false);
    }
  };

  return (
    <div
      className="min-h-[100dvh] w-full bg-background text-foreground font-sans flex flex-col"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(143,190,63,0.035) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <Suspense fallback={<div className="h-16 w-full bg-card/50" />}>
        <Header />
      </Suspense>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-[18%] -right-[8%] w-[50vw] h-[50vw] max-w-[480px] max-h-[480px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(143,190,63,0.1) 0%, transparent 65%)', willChange: 'transform' }}
        />
        <div
          className="absolute -bottom-[12%] -left-[8%] w-[40vw] h-[40vw] max-w-[350px] max-h-[350px] rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(27,95,173,0.06) 0%, transparent 65%)', willChange: 'transform' }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-4 pt-[4.5rem] sm:pt-24 pb-8 relative z-10">
        {/* ── Animated network constellation ── */}
        <Suspense fallback={null}>
          <NetworkConstellation />
        </Suspense>

        <div className="w-full max-w-[22rem] sm:max-w-md relative z-10">

          {/* ═══════════════ CARD PRINCIPAL ═══════════════ */}
          <div
            className="bg-card rounded-2xl overflow-hidden relative"
            style={{
              boxShadow: S.card,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >

            {/* Bracket corners */}
            {([
              { pos: 'top-2.5 left-2.5',    rot: 0   },
              { pos: 'top-2.5 right-2.5',   rot: 90  },
              { pos: 'bottom-2.5 left-2.5', rot: 270 },
              { pos: 'bottom-2.5 right-2.5',rot: 180 },
            ] as const).map(({ pos, rot }) => (
              <BracketCorner key={rot} size={16} color="#8FBE3F" className={`absolute ${pos} opacity-20`} rotate={rot} />
            ))}

            {/* ── Card Header — Hero editorial ── */}
            <div
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(155deg, hsl(82,28%,24%) 0%, hsl(82,14%,13%) 55%, hsl(210,12%,12%) 100%)',
                boxShadow: S.header,
                minHeight: '10rem',
              }}
            >

              {/* ── Faixa holográfica superior — estilo passaporte/ingresso ── */}
              <div className="relative overflow-hidden" aria-hidden="true"
                style={{ height: '38px', background: 'linear-gradient(135deg, hsl(82,30%,18%) 0%, hsl(82,22%,22%) 25%, hsl(82,30%,18%) 50%, hsl(55,25%,20%) 75%, hsl(82,30%,18%) 100%)' }}
              >
                {/* Shimmer layers */}
                <div className="absolute inset-0" style={{
                  background: 'repeating-linear-gradient(105deg, transparent 0px, rgba(143,190,63,0.08) 2px, transparent 4px, transparent 12px)',
                }} />
                <div className="absolute inset-0" style={{
                  background: 'repeating-linear-gradient(75deg, transparent 0px, rgba(232,185,49,0.05) 1px, transparent 3px, transparent 16px)',
                }} />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(143,190,63,0.06) 20%, rgba(255,255,255,0.04) 40%, rgba(27,95,173,0.05) 60%, rgba(232,185,49,0.04) 80%, transparent 100%)',
                }} />
                {/* Subtle top shine */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(143,190,63,0.25) 30%, rgba(255,255,255,0.12) 50%, rgba(232,185,49,0.2) 70%, transparent)' }} />
                {/* Bottom separator */}
                <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(143,190,63,0.12) 30%, rgba(27,95,173,0.08) 70%, transparent)' }} />
                {/* Micro text — MRZ style */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0.15 }}>
                  <span style={{
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: '5.5px', fontWeight: 700, letterSpacing: '3px',
                    textTransform: 'uppercase', color: '#8FBE3F',
                    whiteSpace: 'nowrap',
                  }}>
                    P&lt;BRA&lt;ACAFE&lt;&lt;PASSAPORTE&lt;ESTUDANTIL&lt;&lt;SC&lt;&lt;2026&lt;&lt;&lt;FUNDACAO&lt;EDUCACIONAL&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                  </span>
                </div>
                {/* Second MRZ line */}
                <div className="absolute inset-0 flex items-end justify-center pb-[6px]" style={{ opacity: 0.1 }}>
                  <span style={{
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: '5px', fontWeight: 700, letterSpacing: '2.5px',
                    textTransform: 'uppercase', color: '#8FBE3F',
                    whiteSpace: 'nowrap',
                  }}>
                    SC00000&lt;&lt;0BRA&lt;&lt;REDE&lt;UNIVERSIDADES&lt;COMUNITARIAS&lt;&lt;SANTA&lt;CATARINA&lt;&lt;&lt;
                  </span>
                </div>
              </div>

              {/* Ambient light */}
              <div className="absolute -top-14 left-1/4 w-56 h-56 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(143,190,63,0.09) 0%, transparent 60%)' }} />

              {/* ── Hero passport image — crisp, right-aligned, prominent ── */}
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none"
                aria-hidden="true"
              >
                <img
                  src={heroPassport}
                  alt=""
                  className="w-[155px] sm:w-[175px] h-auto object-contain"
                  style={{
                    opacity: 0.38,
                    filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.6))',
                    maskImage: 'linear-gradient(to right, black 0%, black 55%, transparent 98%)',
                    WebkitMaskImage: 'linear-gradient(to right, black 0%, black 55%, transparent 98%)',
                  }}
                  draggable={false}
                  loading="eager"
                />
              </div>

              {/* ── Content — left column ── */}
              <div className="relative z-10 px-5 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-5 flex flex-col gap-3.5 max-w-[70%] sm:max-w-[65%]">

                {/* Eyebrow */}
                <p className="text-[7.5px] sm:text-[8.5px] text-muted-foreground/35 font-bold tracking-[0.25em] uppercase leading-none">
                  Associação Catarinense das Fundações Educacionais
                </p>

                {/* ACAFE logo */}
                <div style={{ filter: 'drop-shadow(0 2px 20px rgba(143,190,63,0.35))' }}>
                  <AcafeOfficialLogo size={80} color="#ffffff" />
                </div>

                {/* Title block */}
                <div>
                  <h2 className="text-[22px] sm:text-2xl font-black text-foreground uppercase tracking-tight leading-none">
                    Passaporte{' '}
                    <span className="text-primary">Acafe</span>
                  </h2>

                  <div className="flex gap-[3px] mt-2.5" aria-hidden="true">
                    <div className="h-[2.5px] w-9 rounded-full bg-[#8FBE3F]" />
                    <div className="h-[2.5px] w-5 rounded-full bg-[#1B5FAD]" />
                    <div className="h-[2.5px] w-3 rounded-full bg-[#E8B931]" />
                  </div>
                </div>

                {/* Subtitle chip */}
                <div className="flex">
                  <span
                    className="inline-flex items-center gap-1.5 text-[8px] sm:text-[9px] font-bold tracking-[0.12em] uppercase leading-none px-2.5 py-1.5 rounded-full"
                    style={{
                      background: 'rgba(143,190,63,0.08)',
                      border: '1px solid rgba(143,190,63,0.12)',
                      color: 'rgba(143,190,63,0.7)',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8FBE3F]/50" />
                    Passaporte Estudantil · Santa Catarina
                  </span>
                </div>
              </div>

              {/* Bottom edge highlight */}
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(143,190,63,0.15) 30%, rgba(27,95,173,0.1) 70%, transparent)' }} />
            </div>

            {/* ── Faixa universidades ── */}
            <div style={{ boxShadow: S.section }}>
              <a
                href="https://acafe.org.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 pt-3 pb-0.5 px-4 group transition-colors duration-200"
              >
                <div className="flex-1 h-px bg-border/20 group-hover:bg-primary/25 transition-colors" />
                <div className="flex items-center gap-1.5">
                  <AcafeLockup size={12} textClassName="tracking-[0.25em] text-primary/70 group-hover:text-primary transition-colors" />
                  <span className="text-[8px] font-semibold text-muted-foreground/30 uppercase tracking-wider group-hover:text-primary/55 transition-colors">
                    <span className="hidden sm:inline">· universidades associadas · </span>
                    <span className="inline-flex items-center gap-0.5">
                      acafe.org.br
                      <svg className="w-2 h-2 opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </span>
                  </span>
                </div>
                <div className="flex-1 h-px bg-border/20 group-hover:bg-primary/25 transition-colors" />
              </a>
              <Suspense fallback={<div className="h-14 animate-pulse bg-muted/10 rounded mx-4 my-2" />}>
                <UniversityLogos />
              </Suspense>
            </div>

            {/* ── Body / CTA ── */}
            <div
              className="px-5 py-5 sm:px-7 sm:py-6 flex flex-col items-center text-center gap-4"
              style={{ boxShadow: S.section }}
            >
              {/* Tagline */}
              <div
                className="w-full rounded-xl overflow-hidden"
                style={{ boxShadow: S.tagline }}
              >
                <img
                  src="./tagline.png"
                  alt="A gente ajuda a gente."
                  className="w-full h-auto select-none block"
                  draggable={false}
                  loading="eager"
                />
              </div>

              <p className="text-[13px] sm:text-sm text-muted-foreground/60 leading-relaxed w-full">
                Gere seu passaporte estudantil digital para as <strong className="text-muted-foreground/80 font-semibold">15 universidades comunitárias</strong> da rede ACAFE em Santa Catarina.
              </p>

              <button
                onClick={() => setShowPassportModal(true)}
                className="w-full py-3.5 sm:py-4 rounded-xl font-black text-base sm:text-lg
                           text-primary-foreground uppercase tracking-wide select-none touch-manipulation
                           flex items-center justify-center gap-2.5 cta-pulse group/cta
                           active:scale-[0.97] active:opacity-90 transition-all duration-200
                           hover:-translate-y-0.5 hover:brightness-110 hover:[animation-play-state:paused]"
                style={{
                  background: 'linear-gradient(135deg, #8FBE3F 0%, #6FA030 100%)',
                  boxShadow: S.cta,
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = S.ctaHover)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = S.cta)}
              >
                Gerar Passaporte
                <ArrowRight className="w-5 h-5 stroke-[3px] shrink-0 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
              </button>

              {/* Access existing passport — outline ghost */}
              <button
                onClick={() => setShowAccessModal(true)}
                className="w-full py-2.5 rounded-xl font-bold text-[11px] sm:text-xs
                           text-primary/50 uppercase tracking-[0.12em] select-none touch-manipulation
                           flex items-center justify-center gap-2 group/access
                           hover:text-primary/80 hover:bg-primary/5
                           active:scale-[0.97] transition-all duration-200"
                style={{
                  border: '1.5px solid rgba(143,190,63,0.15)',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(143,190,63,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(143,190,63,0.15)')}
              >
                <AcafeConstellation size={13} color="#8FBE3F" />
                Acessar Meu Passaporte
              </button>

              {/* Trust signal */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="text-[8px] text-muted-foreground/25 font-semibold uppercase tracking-widest">Gratuito</span>
                <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/20" />
                <span className="text-[8px] text-muted-foreground/25 font-semibold uppercase tracking-widest">Instantâneo</span>
                <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/20" />
                <span className="text-[8px] text-muted-foreground/25 font-semibold uppercase tracking-widest">Digital</span>
              </div>
            </div>

            {/* ── Rodapé institucional ── */}
            <div
              style={{
                boxShadow: S.footer,
                background: 'linear-gradient(180deg, hsl(82,13%,15%) 0%, hsl(82,13%,13%) 100%)',
              }}
            >
              <div className="grid grid-cols-3 divide-x divide-border/12">

                {/* Universidade Gratuita */}
                <div className="flex items-center justify-center py-3.5 px-2">
                  <img
                    src={univGratuitaLogo}
                    alt="Universidade Gratuita"
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain invert dark:invert-0 opacity-80 hover:opacity-100 transition-opacity duration-200"
                  />
                </div>

                {/* ACAFE */}
                <a
                  href="https://www.instagram.com/acafeoficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1 py-3.5 px-2 group hover:bg-primary/5 transition-colors duration-200 active:bg-primary/10"
                  aria-label="ACAFE no Instagram"
                >
                  <AcafeOfficialLogo size={56} color="hsl(var(--primary))" />
                  <span className="text-[7px] text-muted-foreground/30 group-hover:text-primary/55 transition-colors">
                    @acafeoficial
                  </span>
                </a>

                {/* SED */}
                <div className="flex items-center justify-center py-3.5 px-2">
                  <div
                    className="rounded-md p-1 sm:p-1.5"
                    style={{
                      backgroundColor: '#ffffff',
                      boxShadow: S.sedChip,
                    }}
                  >
                    <img
                      src={sedLogo}
                      alt="SED - Secretaria da Educação"
                      className="h-7 sm:h-9 w-auto object-contain"
                    />
                  </div>
                </div>

              </div>

              <div className="border-t border-border/8 py-2 px-4 text-center">
                <p className="text-[7.5px] sm:text-[8.5px] text-muted-foreground/25 uppercase tracking-[0.18em] leading-none">
                  ACAFE · Associação Catarinense das Fundações Educacionais
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Form Modal */}
      {showPassportModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="passport-modal-title"
          className="fixed inset-0 bg-background/95 backdrop-blur-none sm:backdrop-blur-xl z-50 flex flex-col sm:items-center sm:justify-center sm:p-4 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPassportModal(false); }}
        >
          <div
            className="bg-card w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:rounded-2xl sm:max-w-md flex flex-col border-0 sm:border sm:border-border/50 animate-slide-in overflow-hidden"
            style={{ boxShadow: S.modal }}
          >
            <div
              className="border-b border-border px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between shrink-0"
              style={{ background: 'linear-gradient(180deg, hsl(82,14%,19%) 0%, hsl(82,14%,17%) 100%)' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <AcafeConstellation size={18} color="#8FBE3F" />
                </div>
                <div>
                  <h2 id="passport-modal-title" className="text-base sm:text-lg font-black text-foreground uppercase tracking-tight">Passaporte Acafe</h2>
                  <p className="text-[11px] text-muted-foreground/60 font-medium mt-0.5">Preencha seus dados para gerar</p>
                </div>
              </div>
              <button
                onClick={() => setShowPassportModal(false)}
                aria-label="Fechar formulário"
                className="w-11 h-11 rounded-full border border-border bg-background hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive text-muted-foreground flex items-center justify-center transition-all duration-200 shrink-0 active:scale-95 touch-manipulation"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Suspense fallback={
                <div className="h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              }>
                <PassportForm onSubmit={handleSubmit} />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Access Modal */}
      {showAccessModal && (
        <AccessPassportModal
          onClose={() => { setShowAccessModal(false); setPrefillEmail(''); }}
          onSuccess={handleAccessSuccess}
          initialEmail={prefillEmail}
        />
      )}

      {/* Splash */}
      {showSplash && passportData && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <PassportSplash data={passportData} onClose={() => { setShowSplash(false); setPassportData(null); }} />
        </Suspense>
      )}
    </div>
  );
}

export default memo(Home);
