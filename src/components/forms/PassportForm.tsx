import { useState, useRef, useCallback, useMemo, memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Upload, ChevronRight, ChevronLeft, CheckCircle2, Loader2, ImagePlus } from 'lucide-react';
import { passportSchema, PassportFormData } from '@/lib/validations';
import { formatPhone, generateYears, getDaysInMonth } from '@/lib/utils';
import { compressImage } from '@/lib/imageOptimization';
import { UNIVERSITIES } from '@/constants/universities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface PassportFormProps {
  onSubmit: (data: PassportFormData) => void;
}

const TOTAL_STEPS = 4;
const STEP_LABELS = ['Foto', 'Dados', 'Contato', 'Curso'];

function PassportForm({ onSubmit }: PassportFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<PassportFormData>({
    resolver: zodResolver(passportSchema),
    mode: 'onChange',
  });

  const phoneValue = watch('phone') || '';
  const birthDateValue = watch('birthDate');

  // Sync date selects → form value
  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      if (dateStr !== birthDateValue) {
        setValue('birthDate', dateStr, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      }
    }
  }, [selectedDay, selectedMonth, selectedYear, setValue, birthDateValue]);

  const handleNext = useCallback(async () => {
    if (currentStep === 2 && selectedDay && selectedMonth && selectedYear) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      setValue('birthDate', dateStr, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }

    let fields: string[] = [];
    switch (currentStep) {
      case 1: fields = ['photo']; break;
      case 2: fields = ['firstName', 'lastName', 'birthDate']; break;
      case 3: fields = ['email', 'phone']; break;
      case 4: fields = ['university', 'course']; break;
    }

    const valid = await trigger(fields as any[]);
    if (valid && currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, trigger, setValue, selectedDay, selectedMonth, selectedYear]);

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 10MB.');
      return;
    }

    setIsUploading(true);
    try {
      const compressed = await compressImage(file, 0.5, 800);
      setPhotoPreview(compressed);
      setValue('photo', compressed, { shouldValidate: true });
      if (currentStep === 1) {
        setTimeout(() => handleNext(), 400);
      }
    } catch {
      alert('Erro ao processar imagem. Tente outra foto.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [setValue, currentStep, handleNext]);

  const handlePrev = useCallback(() => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  }, [currentStep]);

  const currentDays = useMemo(() => getDaysInMonth(selectedMonth || 1, selectedYear || 2000), [selectedMonth, selectedYear]);
  const years = useMemo(() => generateYears(), []);
  const months = useMemo(() => [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ], []);
  const selectedUniversityData = useMemo(() => UNIVERSITIES.find(u => u.id === selectedUniversity), [selectedUniversity]);
  const dateIncomplete = currentStep === 2 && (!selectedDay || !selectedMonth || !selectedYear);

  return (
    <div className="flex flex-col h-full bg-background">

      {/* Progress */}
      <div className="px-5 py-3 bg-card border-b border-border shrink-0">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-border z-0" />
          <div
            className="absolute top-4 left-4 h-0.5 bg-primary z-0 transition-all duration-500 ease-out"
            style={{ width: `calc(${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}% - 0px)` }}
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
                <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors ${active ? 'text-primary' : done ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">

        {/* Step content — only active step in DOM, no overflow-hidden issues */}
        <div key={currentStep} className="flex-1 overflow-y-auto animate-fade-in">

          {/* ── STEP 1: Photo ── */}
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
                className={`relative w-44 h-44 sm:w-48 sm:h-48 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all duration-300 touch-manipulation select-none ${
                  isUploading ? 'border-primary/50 cursor-wait' :
                  errors.photo ? 'border-destructive' :
                  photoPreview ? 'border-primary shadow-[0_0_32px_hsl(var(--primary)/0.35)]' :
                  'border-dashed border-border hover:border-primary/60 active:border-primary'
                } bg-card`}
                aria-label="Selecionar foto"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3 text-primary">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <span className="text-xs font-bold uppercase">Processando…</span>
                  </div>
                ) : photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Sua foto" className="w-full h-full object-cover" />
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

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                aria-hidden="true"
              />

              {photoPreview && !isUploading && (
                <p className="text-xs text-primary font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Foto adicionada — avançando…
                </p>
              )}
              {errors.photo && (
                <p className="text-destructive text-xs font-bold bg-destructive/10 px-4 py-2 rounded-lg">
                  {errors.photo.message}
                </p>
              )}
            </div>
          )}

          {/* ── STEP 2: Personal Info ── */}
          {currentStep === 2 && (
            <div className="flex flex-col justify-center gap-4 p-6 min-h-full">
              <div>
                <Label htmlFor="firstName" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nome *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="Ex: João"
                  autoComplete="given-name"
                  autoCapitalize="words"
                  className="mt-1 h-12 text-base border-2 border-border focus-visible:ring-0 focus-visible:border-primary bg-card rounded-xl"
                />
                {errors.firstName && <p className="text-destructive text-xs mt-1 font-semibold">{errors.firstName.message}</p>}
              </div>

              <div>
                <Label htmlFor="lastName" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sobrenome *</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  placeholder="Ex: da Silva"
                  autoComplete="family-name"
                  autoCapitalize="words"
                  className="mt-1 h-12 text-base border-2 border-border focus-visible:ring-0 focus-visible:border-primary bg-card rounded-xl"
                />
                {errors.lastName && <p className="text-destructive text-xs mt-1 font-semibold">{errors.lastName.message}</p>}
              </div>

              <div>
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Data de Nascimento *</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <Select onValueChange={(v) => setSelectedDay(parseInt(v))}>
                    <SelectTrigger className="h-12 border-2 border-border focus:ring-0 focus:border-primary bg-card rounded-xl font-semibold text-sm">
                      <SelectValue placeholder="Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentDays.map(d => (
                        <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(v) => setSelectedMonth(parseInt(v))}>
                    <SelectTrigger className="h-12 border-2 border-border focus:ring-0 focus:border-primary bg-card rounded-xl font-semibold text-sm">
                      <SelectValue placeholder="Mês" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m, i) => (
                        <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(v) => setSelectedYear(parseInt(v))}>
                    <SelectTrigger className="h-12 border-2 border-border focus:ring-0 focus:border-primary bg-card rounded-xl font-semibold text-sm">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(y => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {dateIncomplete && !errors.birthDate && (
                  <p className="text-muted-foreground text-xs mt-1.5 font-medium">Selecione dia, mês e ano.</p>
                )}
                {errors.birthDate && (
                  <p className="text-destructive text-xs mt-1.5 font-semibold">{errors.birthDate.message}</p>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: Contact ── */}
          {currentStep === 3 && (
            <div className="flex flex-col justify-center gap-5 p-6 min-h-full">
              <div>
                <Label htmlFor="phone" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">WhatsApp *</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  value={phoneValue}
                  onChange={(e) => setValue('phone', formatPhone(e.target.value), { shouldValidate: true })}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  className="mt-1 h-12 text-base border-2 border-border focus-visible:ring-0 focus-visible:border-primary bg-card rounded-xl font-semibold"
                />
                {errors.phone && <p className="text-destructive text-xs mt-1.5 font-semibold">{errors.phone.message}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  {...register('email')}
                  placeholder="aluno@email.com"
                  className="mt-1 h-12 text-base border-2 border-border focus-visible:ring-0 focus-visible:border-primary bg-card rounded-xl"
                />
                {errors.email && <p className="text-destructive text-xs mt-1.5 font-semibold">{errors.email.message}</p>}
              </div>
            </div>
          )}

          {/* ── STEP 4: University & Course ── */}
          {currentStep === 4 && (
            <div className="flex flex-col justify-center gap-5 p-6 min-h-full">
              <div>
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Instituição ACAFE *</Label>
                <Select onValueChange={(v) => {
                  setSelectedUniversity(v);
                  setValue('university', v, { shouldValidate: true });
                  setValue('course', '', { shouldValidate: false });
                }}>
                  <SelectTrigger className="mt-1 h-12 border-2 border-border focus:ring-0 focus:border-primary bg-card rounded-xl font-semibold text-sm text-left">
                    <SelectValue placeholder="Selecione a universidade" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[260px]">
                    {UNIVERSITIES.map(u => (
                      <SelectItem key={u.id} value={u.id} className="py-2.5 font-semibold text-sm">
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.university && <p className="text-destructive text-xs mt-1.5 font-semibold">{errors.university.message}</p>}
              </div>

              {selectedUniversityData ? (
                <div className="animate-fade-in">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Curso Desejado *</Label>
                  <Select onValueChange={(v) => setValue('course', v, { shouldValidate: true })}>
                    <SelectTrigger className="mt-1 h-12 border-2 border-border focus:ring-0 focus:border-primary bg-card rounded-xl font-semibold text-sm">
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {selectedUniversityData.courses.map(c => (
                        <SelectItem key={c} value={c} className="py-2.5 font-semibold text-sm">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.course && <p className="text-destructive text-xs mt-1.5 font-semibold">{errors.course.message}</p>}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl border border-border/50">
                  <div className="w-2 h-2 rounded-full bg-primary/50 shrink-0" />
                  <p className="text-xs text-muted-foreground font-medium">
                    Selecione a instituição para ver os cursos.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Footer — always in normal flow, never overlapped */}
        <div className="px-4 py-3 bg-card border-t border-border shrink-0 flex flex-col gap-2">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                type="button"
                onClick={handlePrev}
                variant="outline"
                className="h-12 w-12 rounded-xl border-2 border-border text-foreground hover:bg-muted active:scale-95 shrink-0 touch-manipulation select-none"
                aria-label="Voltar"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}

            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 h-12 bg-primary hover:bg-primary/90 active:scale-[0.97] active:opacity-90 text-primary-foreground font-black uppercase tracking-wider rounded-xl shadow-[0_4px_16px_hsl(var(--primary)/0.4)] transition-all duration-150 touch-manipulation select-none"
              >
                Avançar
                <ChevronRight className="w-4 h-4 ml-2 shrink-0" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isValid}
                className="flex-1 h-12 bg-primary hover:bg-primary/90 active:scale-[0.97] active:opacity-90 text-primary-foreground font-black uppercase tracking-wider rounded-xl shadow-[0_4px_16px_hsl(var(--primary)/0.4)] disabled:opacity-40 disabled:shadow-none disabled:pointer-events-none transition-all duration-150 touch-manipulation select-none"
              >
                <Upload className="w-4 h-4 mr-2 shrink-0" />
                Gerar Passaporte
              </Button>
            )}
          </div>

          {currentStep === TOTAL_STEPS && !isValid && selectedUniversityData && (
            <p className="text-center text-xs text-muted-foreground">
              Selecione o curso para continuar.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default memo(PassportForm);
export { PassportForm };
