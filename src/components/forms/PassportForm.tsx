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
    <div className="flex flex-col h-full bg-white relative">
      {/* Progress Bar */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 z-10 sticky top-0">
        <div className="flex justify-between mb-2 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-brand-teal -translate-y-1/2 rounded-full z-0 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
          ></div>
          
          {[1, 2, 3, 4].map((step) => (
            <div 
              key={step} 
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${
                step < currentStep 
                  ? 'bg-brand-teal border-brand-teal text-white' 
                  : step === currentStep 
                    ? 'bg-white border-brand-teal text-brand-teal shadow-[0_0_0_4px_rgba(15,209,195,0.2)]'
                    : 'bg-white border-gray-200 text-gray-400'
              }`}
            >
              {step < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step}
            </div>
          ))}
        </div>
        <div className="text-center mt-2">
          <p className="text-xs font-bold text-brand-blue uppercase tracking-widest">
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
              <h3 className="text-xl font-black text-brand-blue uppercase">Foto Oficial</h3>
              <p className="text-sm text-gray-500">Adicione uma foto clara do seu rosto</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-48 h-48 rounded-full border-4 flex items-center justify-center cursor-pointer transition-all overflow-hidden bg-gray-50 shadow-inner group ${
                  errors.photo ? 'border-brand-accent' : photoPreview ? 'border-brand-teal shadow-[0_0_20px_rgba(15,209,195,0.3)]' : 'border-dashed border-gray-300 hover:border-brand-teal'
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
                  <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-brand-teal transition-colors">
                    <div className="bg-white p-4 rounded-full shadow-sm">
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
                <p className="text-brand-accent text-sm mt-4 font-bold bg-red-50 px-4 py-2 rounded-lg">{errors.photo.message}</p>
              )}
            </div>
          </div>

          {/* STEP 2: Personal Info */}
          <div className="min-w-full w-full flex-shrink-0 snap-center p-6 flex flex-col justify-center space-y-5">
            <div>
              <Label htmlFor="firstName" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nome *</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="Ex: João"
                className="mt-1 h-14 text-lg border-2 focus-visible:ring-0 focus-visible:border-brand-teal bg-gray-50 rounded-xl"
              />
              {errors.firstName && <p className="text-brand-accent text-xs mt-1 font-bold">{errors.firstName.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="lastName" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sobrenome *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="Ex: da Silva"
                className="mt-1 h-14 text-lg border-2 focus-visible:ring-0 focus-visible:border-brand-teal bg-gray-50 rounded-xl"
              />
              {errors.lastName && <p className="text-brand-accent text-xs mt-1 font-bold">{errors.lastName.message}</p>}
            </div>

            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nascimento *</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <Select onValueChange={(value) => handleDateChange(parseInt(value), selectedMonth, selectedYear)}>
                  <SelectTrigger className="h-14 border-2 focus:ring-0 focus:border-brand-teal bg-gray-50 rounded-xl font-bold">
                    <SelectValue placeholder="Dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentDays.map((day) => (<SelectItem key={day} value={String(day)}>{day}</SelectItem>))}
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => {
                  const month = parseInt(value);
                  setSelectedMonth(month);
                  handleDateChange(1, month, selectedYear);
                }}>
                  <SelectTrigger className="h-14 border-2 focus:ring-0 focus:border-brand-teal bg-gray-50 rounded-xl font-bold">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (<SelectItem key={index} value={String(index + 1)}>{month.substring(0, 3)}</SelectItem>))}
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => {
                  const year = parseInt(value);
                  setSelectedYear(year);
                  handleDateChange(1, selectedMonth, year);
                }}>
                  <SelectTrigger className="h-14 border-2 focus:ring-0 focus:border-brand-teal bg-gray-50 rounded-xl font-bold">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (<SelectItem key={year} value={String(year)}>{year}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              {errors.birthDate && <p className="text-brand-accent text-xs mt-1 font-bold">{errors.birthDate.message}</p>}
            </div>
          </div>

          {/* STEP 3: Contact */}
          <div className="min-w-full w-full flex-shrink-0 snap-center p-6 flex flex-col justify-center space-y-6">
            <div>
              <Label htmlFor="phone" className="text-xs font-bold text-gray-500 uppercase tracking-widest">WhatsApp *</Label>
              <Input
                id="phone"
                value={phoneValue}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                maxLength={15}
                type="tel"
                className="mt-1 h-14 text-lg border-2 focus-visible:ring-0 focus-visible:border-brand-teal bg-gray-50 rounded-xl font-bold"
              />
              {errors.phone && <p className="text-brand-accent text-xs mt-1 font-bold">{errors.phone.message}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-widest">E-mail Oficial *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="aluno@email.com"
                className="mt-1 h-14 text-lg border-2 focus-visible:ring-0 focus-visible:border-brand-teal bg-gray-50 rounded-xl font-bold"
              />
              {errors.email && <p className="text-brand-accent text-xs mt-1 font-bold">{errors.email.message}</p>}
            </div>
          </div>

          {/* STEP 4: University & Course */}
          <div className="min-w-full w-full flex-shrink-0 snap-center p-6 flex flex-col justify-center space-y-6">
            <div>
              <Label htmlFor="university" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Instituição ACAFE *</Label>
              <Select onValueChange={(value) => {
                setSelectedUniversity(value);
                setValue('university', value, { shouldValidate: true });
                setValue('course', '');
              }}>
                <SelectTrigger className="mt-1 h-14 border-2 focus:ring-0 focus:border-brand-teal bg-gray-50 rounded-xl font-bold text-left whitespace-normal leading-tight">
                  <SelectValue placeholder="Selecione a universidade" />
                </SelectTrigger>
                <SelectContent className="max-h-[250px]">
                  {UNIVERSITIES.map((university) => (
                    <SelectItem key={university.id} value={university.id} className="py-3 font-bold border-b border-gray-100 last:border-0">
                      {university.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.university && <p className="text-brand-accent text-xs mt-1 font-bold">{errors.university.message}</p>}
            </div>

            {selectedUniversityData && (
              <div className="animate-fade-in">
                <Label htmlFor="course" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Curso Desejado *</Label>
                <Select onValueChange={(value) => setValue('course', value, { shouldValidate: true })}>
                  <SelectTrigger className="mt-1 h-14 border-2 focus:ring-0 focus:border-brand-teal bg-gray-50 rounded-xl font-bold">
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {selectedUniversityData.courses.map((course) => (
                      <SelectItem key={course} value={course} className="py-3 font-bold">
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.course && <p className="text-brand-accent text-xs mt-1 font-bold">{errors.course.message}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="p-4 bg-white border-t border-gray-100 flex gap-3 z-10 sticky bottom-0">
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={handlePrev}
              variant="outline"
              className="h-14 w-14 rounded-xl border-2 border-gray-200 text-gray-600 flex-shrink-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}
          
          {currentStep < TOTAL_STEPS ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 h-14 bg-brand-blue hover:bg-blue-900 text-white text-lg font-black uppercase tracking-widest rounded-xl shadow-lg transition-all"
            >
              Avançar
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isValid}
              className="flex-1 h-14 bg-brand-accent hover:bg-red-700 text-white text-lg font-black uppercase tracking-widest rounded-xl shadow-[0_8px_20px_rgba(227,6,19,0.3)] transition-all disabled:opacity-50 disabled:shadow-none"
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
