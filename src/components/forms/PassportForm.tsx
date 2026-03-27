import { useState, useRef, useCallback, useMemo, memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Upload } from 'lucide-react';
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

function PassportForm({ onSubmit }: PassportFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 20);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PassportFormData>({
    resolver: zodResolver(passportSchema),
  });

  const phoneValue = watch('phone') || '';

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue('phone', formatted);
  }, [setValue]);

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 10MB.');
        return;
      }
      
      try {
        // Comprimir imagem para melhor performance
        const compressed = await compressImage(file, 0.5, 800);
        setPhotoPreview(compressed);
        setValue('photo', compressed);
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
        alert('Erro ao processar imagem. Tente novamente.');
      }
    }
  }, [setValue]);

  const handleDateChange = useCallback((day: number, month: number, year: number) => {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setValue('birthDate', date);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      {/* Photo Upload */}
      <div className="flex flex-col items-center">
        <Label className="text-lg font-semibold mb-4">Foto de Perfil *</Label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative w-40 h-40 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden bg-gray-50"
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Camera className="w-12 h-12" />
              <span className="text-sm">Adicionar foto</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
        {errors.photo && (
          <p className="text-destructive text-sm mt-2">{errors.photo.message}</p>
        )}
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Nome *</Label>
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="Seu nome"
            className="mt-1"
          />
          {errors.firstName && (
            <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Sobrenome *</Label>
          <Input
            id="lastName"
            {...register('lastName')}
            placeholder="Seu sobrenome"
            className="mt-1"
          />
          {errors.lastName && (
            <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Birth Date */}
      <div>
        <Label>Data de Nascimento *</Label>
        <div className="grid grid-cols-3 gap-3 mt-1">
          <Select
            onValueChange={(value) => {
              handleDateChange(parseInt(value), selectedMonth, selectedYear);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Dia" />
            </SelectTrigger>
            <SelectContent>
              {currentDays.map((day) => (
                <SelectItem key={day} value={String(day)}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              const month = parseInt(value);
              setSelectedMonth(month);
              handleDateChange(1, month, selectedYear);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={String(index + 1)}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              const year = parseInt(value);
              setSelectedYear(year);
              handleDateChange(1, selectedMonth, year);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors.birthDate && (
          <p className="text-destructive text-sm mt-1">{errors.birthDate.message}</p>
        )}
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="seu@email.com"
            className="mt-1"
          />
          {errors.email && (
            <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            value={phoneValue}
            onChange={handlePhoneChange}
            placeholder="(00) 00000-0000"
            maxLength={15}
            className="mt-1"
          />
          {errors.phone && (
            <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* University */}
      <div>
        <Label htmlFor="university">Universidade *</Label>
        <Select
          onValueChange={(value) => {
            setSelectedUniversity(value);
            setValue('university', value);
            setValue('course', '');
          }}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione sua universidade" />
          </SelectTrigger>
          <SelectContent>
            {UNIVERSITIES.map((university) => (
              <SelectItem key={university.id} value={university.id}>
                {university.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.university && (
          <p className="text-destructive text-sm mt-1">{errors.university.message}</p>
        )}
      </div>

      {/* Course */}
      {selectedUniversityData && (
        <div>
          <Label htmlFor="course">Curso *</Label>
          <Select onValueChange={(value) => setValue('course', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione seu curso" />
            </SelectTrigger>
            <SelectContent>
              {selectedUniversityData.courses.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.course && (
            <p className="text-destructive text-sm mt-1">{errors.course.message}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg font-semibold"
      >
        <Upload className="w-5 h-5 mr-2" />
        Criar Passaporte Virtual
      </Button>
    </form>
  );
}

export default memo(PassportForm);
export { PassportForm };
