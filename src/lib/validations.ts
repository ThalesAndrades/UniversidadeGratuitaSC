import { z } from 'zod';
import DOMPurify from 'dompurify';

// Função para sanitizar strings contra XSS
const sanitizeString = (val: string) => {
  if (typeof val !== 'string') return val;
  // Remove qualquer tag HTML/Script e espaços extras
  return DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] });
};

export const passportSchema = z.object({
  firstName: z
    .string()
    .transform(sanitizeString)
    .pipe(
      z.string()
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(50, 'Nome muito longo')
        .regex(/^[a-zA-ZÀ-ÿ\s']+$/, 'Nome deve conter apenas letras')
        .refine(val => !/<[^>]*>?/gm.test(val), 'Caracteres inválidos detectados')
    ),
  lastName: z
    .string()
    .transform(sanitizeString)
    .pipe(
      z.string()
        .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
        .max(50, 'Sobrenome muito longo')
        .regex(/^[a-zA-ZÀ-ÿ\s']+$/, 'Sobrenome deve conter apenas letras')
        .refine(val => !/<[^>]*>?/gm.test(val), 'Caracteres inválidos detectados')
    ),
  birthDate: z
    .string()
    .transform(sanitizeString)
    .pipe(
      z.string()
        .min(1, 'Data de nascimento é obrigatória')
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido')
        .refine((date) => {
          const birthDate = new Date(date);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          return age >= 16 && age <= 100;
        }, 'Idade deve estar entre 16 e 100 anos')
    ),
  email: z
    .string()
    .transform(sanitizeString)
    .pipe(
      z.string()
        .email('Email inválido')
        .max(100, 'Email muito longo')
    ),
  phone: z
    .string()
    .transform(sanitizeString)
    .pipe(
      z.string()
        .min(14, 'Telefone incompleto')
        .max(15, 'Telefone muito longo')
        .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Formato de telefone inválido')
    ),
  university: z
    .string()
    .transform(sanitizeString)
    .pipe(z.string().min(1, 'Selecione uma universidade').max(100)),
  course: z
    .string()
    .transform(sanitizeString)
    .pipe(z.string().min(1, 'Selecione um curso').max(100)),
  photo: z
    .string()
    .min(1, 'Foto é obrigatória')
    // Validar se a string base64 é realmente uma imagem e não um payload malicioso
    .refine(val => val.startsWith('data:image/'), 'Formato de imagem inválido')
    .refine(val => val.length < 5 * 1024 * 1024, 'Imagem muito grande após compressão'), // Max ~5MB em base64
});

export type PassportFormData = z.infer<typeof passportSchema>;
