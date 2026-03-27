import { z } from 'zod';

export const passportSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  lastName: z
    .string()
    .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
    .max(50, 'Sobrenome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Sobrenome deve conter apenas letras'),
  birthDate: z
    .string()
    .min(1, 'Data de nascimento é obrigatória')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 16 && age <= 100;
    }, 'Idade deve estar entre 16 e 100 anos'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(14, 'Telefone incompleto')
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Formato de telefone inválido'),
  university: z.string().min(1, 'Selecione uma universidade'),
  course: z.string().min(1, 'Selecione um curso'),
  photo: z.string().min(1, 'Foto é obrigatória'),
});

export type PassportFormData = z.infer<typeof passportSchema>;
