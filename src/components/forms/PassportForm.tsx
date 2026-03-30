import { useState, useRef, useCallback, useMemo, memo } from 'react';
import { toast } from 'sonner';
import { Camera, Upload, ChevronRight, ChevronLeft, CheckCircle2, Loader2, ImagePlus } from 'lucide-react';
import { passportSchema, type PassportFormData } from '@/lib/validations';
import { formatPhone, generateYears, getDaysInMonth } from '@/lib/utils';
import { compressImage } from '@/lib/imageOptimization';
import { UNIVERSITIES } from '@/constants/universities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface PassportFormProps {
  onSubmit: (data: PassportFormData) => void;
}

const TOTAL_STEPS = 4;
const STEP_LABELS = ['Foto', 'Dados', 'Contato', 'Curso'];

function validateStep(step: number, data: FormState): Record<string, string> {
  const errs: Record<string, string> = {};

  if (step === 1) {
    if (!data.photo || !data.photo.startsWith('data:image/'))
      errs.photo = 'Foto é obrigatória';
  }

  if (step === 2) {
    if (!data.firstName || data.firstName.trim().length < 2)
      errs.firstName = 'Nome deve ter pelo menos 2 caracteres';
    if (!data.lastName || data.lastName.trim().length < 2)
      errs.lastName = 'Sobrenome deve ter pelo menos 2 caracteres';
    if (!data.birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(data.birthDate)) {
      errs.birthDate = 'Selecione dia, mês e ano';
    } else {
      const [y, m, d] = data.birthDate.split('-').map(Number);
      const today = new Date();
      const age = today.getFullYear() - y -
        (today < new Date(today.getFullYear(), m - 1, d) ? 1 : 0);
      if (age < 16) errs.birthDate = 'Você deve ter no mínimo 16 anos para se inscrever';
      else if (age > 100) errs.birthDate = 'Data de nascimento inválida';
    }
  }

  if (step === 3) {
    const phone = data.phone.trim();
    const email = data.email.trim();
    if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(phone))
      errs.phone = 'Formato inválido. Ex: (48) 99999-9999';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'E-mail inválido';
  }

  if (step === 4) {
    if (!data.university) errs.university = 'Selecione uma instituição';
    if (!data.course) errs.course = 'Selecione um curso';
  }

  return errs;
}

interface FormState {
  photo: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  university: string;
  course: string;
  consent: boolean;
}

const EMPTY_FORM: FormState = {
  photo: '', firstName: '', lastName: '', birthDate: '',
  phone: '', email: '', university: '', course: '',
  consent: true,
};

function PassportForm({ onSubmit }: PassportFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormState) => (value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const buildBirthDate = (day: number | null, month: number | null, year: number | null): string => {
    if (!day || !month || !year) return '';
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleNext = useCallback((overrideStep?: number) => {
    const step = overrideStep ?? currentStep;

    // Snapshot atual do form + data calculada
    const snapshot = { ...form };
    if (step === 2) {
      snapshot.birthDate = buildBirthDate(selectedDay, selectedMonth, selectedYear);
    }

    const errs = validateStep(step, snapshot);
    setStepErrors(errs);

    if (Object.keys(errs).length === 0) {
      if (step === 2) {
        setForm(prev => ({ ...prev, birthDate: snapshot.birthDate }));
      }
      if (step < TOTAL_STEPS) {
        setCurrentStep(step + 1);
      }
    }
  }, [currentStep, form, selectedDay, selectedMonth, selectedYear]);

  const handlePrev = useCallback(() => {
    setStepErrors({});
    setCurrentStep(prev => Math.max(1, prev - 1));
  }, []);

  const handleFinalSubmit = useCallback(() => {
    const step = 4;
    const errs = validateStep(step, form);
    setStepErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const parsed = passportSchema.parse(form);
      onSubmit(parsed);
    } catch {
      toast.error('Dados inválidos. Verifique o formulário.');
    }
  }, [form, onSubmit]);

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('Arquivo muito grande. Máximo 10MB.'); return; }

    setIsUploading(true);
    try {
      const compressed = await compressImage(file, 0.5, 800);
      setForm(prev => ({ ...prev, photo: compressed }));
      setTimeout(() => {
        setStepErrors({});
        setCurrentStep(2);
      }, 400);
    } catch {
      toast.error('Erro ao processar imagem. Tente outra foto.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, []);

  const currentDays = useMemo(() => getDaysInMonth(selectedMonth || 1, selectedYear || 2000), [selectedMonth, selectedYear]);
  const years = useMemo(() => generateYears(), []);
  const months = useMemo(() => [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ], []);
  const selectedUniversityData = useMemo(() => UNIVERSITIES.find(u => u.id === selectedUniversity), [selectedUniversity]);

  const err = (field: string) => stepErrors[field];

  return (
    <div className="flex flex-col h-full bg-background">

      {/* Progress */}
      <div className="px-5 py-3 bg-card border-b border-border shrink-0">
        <div
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label={`Passo ${currentStep} de ${TOTAL_STEPS}: ${STEP_LABELS[currentStep - 1]}`}
          className="flex items-center justify-between relative"
        >
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-border z-0" />
          <div
            className="absolute top-4 left-4 h-0.5 bg-primary z-0 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
          />
          {STEP_LABELS.map((label, i) => {
            const step = i + 1;
            const done = step < currentStep;
            const active = step === currentStep;
            return (
              <div key={step} className="relative z-10 flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                  done ? 'bg-primary border-primary text-primary-foreground' :
                  active ? 'bg-background border-primary text-primary ring-2 ring-primary/30' :
                  'bg-background border-border text-muted-foreground'
                }`}>
                  {done ? <CheckCircle2 className="w-4 h-4" /> : step}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide ${active ? 'text-primary' : 'text-muted-foreground/60'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">

        {/* Apenas o step ativo é renderizado */}
        <div key={currentStep} aria-live="polite" aria-atomic="false" className="flex-1 overflow-y-auto animate-fade-in">

          {/* ── STEP 1: Foto ── */}
          {currentStep === 1 && (
            <div className="flex flex-col items-center justify-center gap-5 p-6 min-h-full">
              <div className="text-center">
                <h3 className="text-lg font-black text-foreground uppercase tracking-wide">Sua Foto</h3>
                <p className="text-xs text-muted-foreground mt-1">Uma foto clara do seu rosto</p>
              </div>

              <button
                type="button"
                onClick={() => !isUploading && fileInputRef.current?.click()}
                disabled={isUploading}
                className={`relative w-44 h-44 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all duration-300 touch-manipulation select-none ${
                  isUploading ? 'border-primary/50 cursor-wait' :
                  err('photo') ? 'border-destructive' :
                  form.photo ? 'border-primary shadow-[0_0_32px_hsl(var(--primary)/0.3)]' :
                  'border-dashed border-border hover:border-primary/60 active:border-primary'
                } bg-card`}
                aria-label="Selecionar foto"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3 text-primary">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <span className="text-xs font-bold uppercase">Processando…</span>
                  </div>
                ) : form.photo ? (
                  <>
                    <img src={form.photo} alt="Sua foto" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 active:opacity-100 transition-opacity gap-2">
                      <Camera className="w-9 h-9 text-white" />
                      <span className="text-white text-xs font-bold uppercase">Trocar</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <div className="bg-background border-2 border-border p-4 rounded-full">
                      <ImagePlus className="w-9 h-9" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">Toque para adicionar</span>
                  </div>
                )}
              </button>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" aria-hidden="true" />

              {form.photo && !isUploading && (
                <p className="text-xs text-primary font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Foto adicionada — avançando…
                </p>
              )}
              {err('photo') && <p className="text-destructive text-xs font-bold bg-destructive/10 px-4 py-2 rounded-lg">{err('photo')}</p>}
            </div>
          )}

          {/* ── STEP 2: Dados pessoais ── */}
          {currentStep === 2 && (
            <div className="flex flex-col justify-center gap-4 p-6 min-h-full">
              <div className="text-center mb-1">
                <h3 className="text-lg font-black text-foreground uppercase tracking-wide">Seus Dados</h3>
                <p className="text-xs text-muted-foreground mt-1">Nome completo e data de nascimento</p>
              </div>
              <div>
                <Label htmlFor="firstName" className="text-xs font-black text-muted-foreground uppercase tracking-widest">Nome *</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={e => set('firstName')(e.target.value)}
                  placeholder="Ex: João"
                  autoComplete="given-name"
                  autoCapitalize="words"
                  className={`mt-1 h-12 text-base border-2 focus-visible:ring-0 focus-visible:border-primary bg-card rounded-xl ${err('firstName') ? 'border-destructive' : 'border-border'}`}
                />
                {err('firstName') && <p className="text-destructive text-xs mt-1 font-semibold">{err('firstName')}</p>}
              </div>

              <div>
                <Label htmlFor="lastName" className="text-xs font-black text-muted-foreground uppercase tracking-widest">Sobrenome *</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={e => set('lastName')(e.target.value)}
                  placeholder="Ex: da Silva"
                  autoComplete="family-name"
                  autoCapitalize="words"
                  className={`mt-1 h-12 text-base border-2 focus-visible:ring-0 focus-visible:border-primary bg-card rounded-xl ${err('lastName') ? 'border-destructive' : 'border-border'}`}
                />
                {err('lastName') && <p className="text-destructive text-xs mt-1 font-semibold">{err('lastName')}</p>}
              </div>

              <div>
                <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Data de Nascimento *</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <Select
                    value={selectedDay ? String(selectedDay) : undefined}
                    onValueChange={(v) => setSelectedDay(parseInt(v))}
                  >
                    <SelectTrigger className="h-12 border-2 border-border focus:ring-0 focus:border-primary bg-card rounded-xl font-semibold text-sm">
                      <SelectValue placeholder="Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentDays.map(d => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedMonth ? String(selectedMonth) : undefined}
                    onValueChange={(v) => setSelectedMonth(parseInt(v))}
                  >
                    <SelectTrigger className="h-12 border-2 border-border focus:ring-0 focus:border-primary bg-card rounded-xl font-semibold text-sm">
                      <SelectValue placeholder="Mês" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedYear ? String(selectedYear) : undefined}
                    onValueChange={(v) => setSelectedYear(parseInt(v))}
                  >
                    <SelectTrigger className="h-12 border-2 border-border focus:ring-0 focus:border-primary bg-card rounded-xl font-semibold text-sm">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {(!selectedDay || !selectedMonth || !selectedYear) && (
                  <p className="text-muted-foreground text-xs mt-1.5 font-medium">Selecione dia, mês e ano.</p>
                )}
                {err('birthDate') && <p className="text-destructive text-xs mt-1.5 font-semibold">{err('birthDate')}</p>}
              </div>
            </div>
          )}

          {/* ── STEP 3: Contato ── */}
          {currentStep === 3 && (
            <div className="flex flex-col justify-center gap-5 p-6 min-h-full">
              <div className="text-center mb-1">
                <h3 className="text-lg font-black text-foreground uppercase tracking-wide">Contato</h3>
                <p className="text-xs text-muted-foreground mt-1">WhatsApp e e-mail para comunicação</p>
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs font-black text-muted-foreground uppercase tracking-widest">WhatsApp *</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={e => set('phone')(formatPhone(e.target.value))}
                  placeholder="(48) 99999-9999"
                  maxLength={15}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  aria-required="true"
                  aria-describedby={err('phone') ? 'phone-error' : undefined}
                  className={`mt-1 h-12 text-base border-2 focus-visible:ring-0 focus-visible:border-primary bg-card rounded-xl font-semibold ${err('phone') ? 'border-destructive' : 'border-border'}`}
                />
                {err('phone') && <p className="text-destructive text-xs mt-1.5 font-semibold">{err('phone')}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-xs font-black text-muted-foreground uppercase tracking-widest">E-mail *</Label>
                <Input
                  id="email"
                  value={form.email}
                  onChange={e => set('email')(e.target.value)}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  placeholder="aluno@email.com"
                  className={`mt-1 h-12 text-base border-2 focus-visible:ring-0 focus-visible:border-primary bg-card rounded-xl ${err('email') ? 'border-destructive' : 'border-border'}`}
                />
                {err('email') && <p className="text-destructive text-xs mt-1.5 font-semibold">{err('email')}</p>}
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/15 px-4 py-3">
                <Checkbox
                  id="consent"
                  checked={form.consent}
                  onCheckedChange={(v) => setForm(prev => ({ ...prev, consent: v === true }))}
                  className="mt-0.5"
                />
                <Label htmlFor="consent" className="text-xs leading-relaxed text-muted-foreground font-semibold cursor-pointer select-none">
                  Aceito receber comunicações sobre o Programa Universidade Gratuita e o passaporte estudantil.
                </Label>
              </div>
            </div>
          )}

          {/* ── STEP 4: Universidade e Curso ── */}
          {currentStep === 4 && (
            <div className="flex flex-col justify-center gap-5 p-6 min-h-full">
              <div className="text-center mb-1">
                <h3 className="text-lg font-black text-foreground uppercase tracking-wide">Instituição</h3>
                <p className="text-xs text-muted-foreground mt-1">Universidade e curso desejados</p>
              </div>
              <div>
                <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Instituição ACAFE *</Label>
                <Select
                  value={form.university || undefined}
                  onValueChange={(v) => {
                    setSelectedUniversity(v);
                    setForm(prev => ({ ...prev, university: v, course: '' }));
                  }}
                >
                  <SelectTrigger className="mt-1 h-12 border-2 border-border focus:ring-0 focus:border-primary bg-card rounded-xl font-semibold text-sm text-left">
                    <SelectValue placeholder="Selecione a universidade" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[260px]">
                    {UNIVERSITIES.map(u => (
                      <SelectItem key={u.id} value={u.id} className="py-2.5 font-semibold text-sm">{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {err('university') && <p className="text-destructive text-xs mt-1.5 font-semibold">{err('university')}</p>}
              </div>

              {selectedUniversityData ? (
                <div className="animate-fade-in">
                  <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Curso Desejado *</Label>
                  <Select
                    key={selectedUniversity}
                    value={form.course || undefined}
                    onValueChange={(v) => setForm(prev => ({ ...prev, course: v }))}
                  >
                    <SelectTrigger className="mt-1 h-12 border-2 border-border focus:ring-0 focus:border-primary bg-card rounded-xl font-semibold text-sm">
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {selectedUniversityData.courses.map(c => (
                        <SelectItem key={c} value={c} className="py-2.5 font-semibold text-sm">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {err('course') && <p className="text-destructive text-xs mt-1.5 font-semibold">{err('course')}</p>}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl border border-border/50">
                  <div className="w-2 h-2 rounded-full bg-primary/50 shrink-0" />
                  <p className="text-xs text-muted-foreground font-medium">Selecione a instituição para ver os cursos.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rodapé de navegação */}
        <div className="px-4 py-3 bg-card border-t border-border shrink-0 flex gap-2">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="h-12 w-12 rounded-xl border-2 border-border text-foreground bg-transparent hover:bg-muted active:scale-95 shrink-0 touch-manipulation select-none flex items-center justify-center"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={() => handleNext()}
              className="flex-1 h-12 bg-primary hover:bg-primary/90 active:opacity-80 text-primary-foreground font-black uppercase tracking-wider rounded-xl shadow-[0_4px_16px_hsl(var(--primary)/0.4)] transition-opacity duration-100 touch-manipulation select-none flex items-center justify-center gap-2"
            >
              Avançar
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="flex-1 h-12 bg-primary hover:bg-primary/90 active:opacity-80 text-primary-foreground font-black uppercase tracking-wider rounded-xl shadow-[0_4px_16px_hsl(var(--primary)/0.4)] transition-opacity duration-100 touch-manipulation select-none flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 shrink-0" />
              Gerar Passaporte
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(PassportForm);
export { PassportForm };
