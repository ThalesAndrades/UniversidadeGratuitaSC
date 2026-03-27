import { useState, useRef, useCallback, useMemo, memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Upload, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { passportSchema, PassportFormData } from '@/lib/validations';
import { formatPhone, generateYears, getDaysInMonth } from '@/lib/utils';
import { compressImage } from '@/lib/imageOptimization';
import { UNIVERSITIES } from '@/constants/universities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PassportFormProps {
  onSubmit: (data: PassportFormData) => void;
}

const TOTAL_STEPS = 4;

function PassportForm({ onSubmit }: PassportFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 20);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

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

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue('phone', formatted, { shouldValidate: true });
  }, [setValue]);

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 10MB.');
        return;
      }
      
      try {
        const compressed = await compressImage(file, 0.5, 800);
        setPhotoPreview(compressed);
        setValue('photo', compressed, { shouldValidate: true });
        
        // Auto advance after photo upload if it's the current step
        if (currentStep === 1) {
          setTimeout(() => handleNext(), 500);
        }
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
        alert('Erro ao processar imagem. Tente novamente.');
      }
    }
  }, [setValue, currentStep]);

  const handleDateChange = useCallback((day: number, month: number, year: number) => {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setValue('birthDate', date, { shouldValidate: true });
  }, [setValue]);

  const currentDays = useMemo(() => getDaysInMonth(selectedMonth, selectedYear), [selectedMonth, selectedYear]);
  const years = useMemo(() => generateYears(), []);
  const months = useMemo(() => [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ], []);

  const selectedUniversityData = useMemo(() => 
    UNIVERSITIES.find(u => u.id === selectedUniversity),
    [selectedUniversity]
  );

  const validateStep = async (step: number) => {
    let fieldsToValidate: any[] = [];
    switch (step) {
      case 1:
        fieldsToValidate = ['photo'];
        break;
      case 2:
        fieldsToValidate = ['firstName', 'lastName', 'birthDate'];
        break;
      case 3:
        fieldsToValidate = ['email', 'phone'];
        break;
      case 4:
        fieldsToValidate = ['university', 'course'];
        break;
    }
    
    const isStepValid = await trigger(fieldsToValidate);
    return isStepValid;
  };

  const handleNext = async () => {
    const isStepValid = await validateStep(currentStep);
    if (isStepValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Scroll smoothly when step changes
  useEffect(() => {
    if (formContainerRef.current) {
      const stepWidth = formContainerRef.current.clientWidth;
      formContainerRef.current.scrollTo({
        left: (currentStep - 1) * stepWidth,
        behavior: 'smooth'
      });
    }
  }, [currentStep]);

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Progress Bar */}
      <div className="px-6 py-4 bg-card border-b border-border z-10 sticky top-0 shadow-sm">
        <div className="flex justify-between mb-2 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
          ></div>
          
          {[1, 2, 3, 4].map((step) => (
            <div 
              key={step} 
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${
                step < currentStep 
                  ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_10px_hsl(var(--primary)/0.5)]' 
                  : step === currentStep 
                    ? 'bg-background border-primary text-primary ring-4 ring-primary/30 shadow-[0_0_15px_hsl(var(--primary)/0.3)]'
                    : 'bg-background border-border text-muted-foreground'
              }`}
            >
              {step < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step}
            </div>
          ))}
        </div>
        <div className="text-center mt-2">
          <p className="text-xs font-bold text-foreground uppercase tracking-widest">
            {currentStep === 1 && "Sua Foto"}
            {currentStep === 2 && "Dados Pessoais"}
            {currentStep === 3 && "Contato"}
            {currentStep === 4 && "Instituição"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col h-[calc(100vh-280px)] sm:h-[450px]">
        {/* Horizontal Scroll Container */}
        <div 
          ref={formContainerRef}
          className="flex-1 flex overflow-hidden snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* STEP 1: Photo */}
          <div className="min-w-full w-full flex-shrink-0 snap-center p-6 flex flex-col items-center justify-center space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-black text-foreground uppercase">Foto Oficial</h3>
              <p className="text-sm text-muted-foreground">Adicione uma foto clara do seu rosto</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-48 h-48 rounded-full border-4 flex items-center justify-center cursor-pointer transition-all overflow-hidden bg-card shadow-inner group ${
                  errors.photo ? 'border-destructive' : photoPreview ? 'border-primary shadow-[0_0_30px_hsl(var(--primary)/0.4)]' : 'border-dashed border-border hover:border-primary/50'
                }`}
              >
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-10 h-10 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
                    <div className="bg-background border border-border p-4 rounded-full shadow-sm group-hover:border-primary/50 transition-colors">
                      <Camera className="w-10 h-10" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider">Tocar para abrir</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              {errors.photo && (
                <p className="text-brand-accent text-sm mt-4 font-bold bg-destructive/10 px-4 py-2 rounded-lg">{errors.photo.message}</p>
              )}
            </div>
          </div>

          {/* STEP 2: Personal Info */}
          <div className="min-w-full w-full flex-shrink-0 snap-center p-6 flex flex-col justify-center space-y-5">
            <div>
              <Label htmlFor="firstName" className="text-xs font-bold text-foreground uppercase tracking-widest ml-1 opacity-80">Nome *</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="Ex: João"
                className="mt-1 h-14 text-lg border-2 border-border focus-visible:ring-0 focus-visible:border-primary bg-background rounded-xl shadow-sm hover:border-primary/50 transition-colors"
              />
              {errors.firstName && <p className="text-destructive text-xs mt-1 font-bold ml-1">{errors.firstName.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="lastName" className="text-xs font-bold text-foreground uppercase tracking-widest ml-1 opacity-80">Sobrenome *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="Ex: da Silva"
                className="mt-1 h-14 text-lg border-2 border-border focus-visible:ring-0 focus-visible:border-primary bg-background rounded-xl shadow-sm hover:border-primary/50 transition-colors"
              />
              {errors.lastName && <p className="text-destructive text-xs mt-1 font-bold ml-1">{errors.lastName.message}</p>}
            </div>

            <div>
              <Label className="text-xs font-bold text-foreground uppercase tracking-widest ml-1 opacity-80">Nascimento *</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <Select onValueChange={(value) => handleDateChange(parseInt(value), selectedMonth, selectedYear)}>
                  <SelectTrigger className="h-14 border-2 border-border focus:ring-0 focus:border-primary bg-background rounded-xl font-bold shadow-sm hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentDays.map((day) => (<SelectItem key={day} value={String(day)} className="focus:bg-primary/20">{day}</SelectItem>))}
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => {
                  const month = parseInt(value);
                  setSelectedMonth(month);
                  handleDateChange(1, month, selectedYear);
                }}>
                  <SelectTrigger className="h-14 border-2 border-border focus:ring-0 focus:border-primary bg-background rounded-xl font-bold shadow-sm hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (<SelectItem key={index} value={String(index + 1)} className="focus:bg-primary/20">{month.substring(0, 3)}</SelectItem>))}
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => {
                  const year = parseInt(value);
                  setSelectedYear(year);
                  handleDateChange(1, selectedMonth, year);
                }}>
                  <SelectTrigger className="h-14 border-2 border-border focus:ring-0 focus:border-primary bg-background rounded-xl font-bold shadow-sm hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (<SelectItem key={year} value={String(year)} className="focus:bg-primary/20">{year}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              {errors.birthDate && <p className="text-destructive text-xs mt-1 font-bold">{errors.birthDate.message}</p>}
            </div>
          </div>

          {/* STEP 3: Contact */}
          <div className="min-w-full w-full flex-shrink-0 snap-center p-6 flex flex-col justify-center space-y-6">
            <div>
              <Label htmlFor="phone" className="text-xs font-bold text-foreground uppercase tracking-widest ml-1 opacity-80">WhatsApp *</Label>
              <Input
                id="phone"
                value={phoneValue}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                maxLength={15}
                type="tel"
                className="mt-1 h-14 text-lg border-2 border-border focus-visible:ring-0 focus-visible:border-primary bg-background rounded-xl font-bold shadow-sm hover:border-primary/50 transition-colors"
              />
              {errors.phone && <p className="text-destructive text-xs mt-1 font-bold ml-1">{errors.phone.message}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-xs font-bold text-foreground uppercase tracking-widest ml-1 opacity-80">E-mail Oficial *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="aluno@email.com"
                className="mt-1 h-14 text-lg border-2 border-border focus-visible:ring-0 focus-visible:border-primary bg-background rounded-xl font-bold shadow-sm hover:border-primary/50 transition-colors"
              />
              {errors.email && <p className="text-destructive text-xs mt-1 font-bold ml-1">{errors.email.message}</p>}
            </div>
          </div>

          {/* STEP 4: University & Course */}
          <div className="min-w-full w-full flex-shrink-0 snap-center p-6 flex flex-col justify-center space-y-6">
            <div>
              <Label htmlFor="university" className="text-xs font-bold text-foreground uppercase tracking-widest ml-1 opacity-80">Instituição ACAFE *</Label>
              <Select onValueChange={(value) => {
                setSelectedUniversity(value);
                setValue('university', value, { shouldValidate: true });
                setValue('course', '');
              }}>
                <SelectTrigger className="mt-1 h-14 border-2 border-border focus:ring-0 focus:border-primary bg-background rounded-xl font-bold text-left whitespace-normal leading-tight shadow-sm hover:border-primary/50 transition-colors">
                  <SelectValue placeholder="Selecione a universidade" />
                </SelectTrigger>
                <SelectContent className="max-h-[250px]">
                  {UNIVERSITIES.map((university) => (
                    <SelectItem key={university.id} value={university.id} className="py-3 font-bold border-b border-border last:border-0 focus:bg-primary/20">
                      {university.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.university && <p className="text-destructive text-xs mt-1 font-bold ml-1">{errors.university.message}</p>}
            </div>

            {selectedUniversityData && (
              <div className="animate-fade-in">
                <Label htmlFor="course" className="text-xs font-bold text-foreground uppercase tracking-widest ml-1 opacity-80">Curso Desejado *</Label>
                <Select onValueChange={(value) => setValue('course', value, { shouldValidate: true })}>
                  <SelectTrigger className="mt-1 h-14 border-2 border-border focus:ring-0 focus:border-primary bg-background rounded-xl font-bold shadow-sm hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {selectedUniversityData.courses.map((course) => (
                      <SelectItem key={course} value={course} className="py-3 font-bold focus:bg-primary/20">
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.course && <p className="text-destructive text-xs mt-1 font-bold ml-1">{errors.course.message}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="p-4 bg-card border-t border-border flex gap-3 z-10 sticky bottom-0 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={handlePrev}
              variant="outline"
              className="h-14 w-14 rounded-xl border-2 border-border text-foreground hover:bg-muted flex-shrink-0 border-b-[4px] active:translate-y-0 active:border-b-2 active:mt-[2px]"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}
          
          {currentStep < TOTAL_STEPS ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-black uppercase tracking-widest rounded-xl shadow-[0_8px_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_12px_25px_hsl(var(--primary)/0.6)] hover:-translate-y-1 transition-all duration-300 border-b-[5px] border-black/30 active:translate-y-0 active:border-b-0 active:mt-[5px] mb-1"
            >
              Avançar
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isValid}
              className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-black uppercase tracking-widest rounded-xl shadow-[0_8px_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_12px_25px_hsl(var(--primary)/0.6)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:shadow-none border-b-[5px] border-black/30 active:translate-y-0 active:border-b-0 active:mt-[5px] mb-1"
            >
              <Upload className="w-5 h-5 mr-2 stroke-[3px]" />
              Gerar Oficial
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default memo(PassportForm);
export { PassportForm };
