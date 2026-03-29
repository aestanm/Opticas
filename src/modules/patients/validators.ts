/**
 * Validadores para el módulo de pacientes
 */

import { z } from "zod";
import { isMinor, phoneSchema } from "@/lib/validators";

export const createPatientSchema = z.object({
  first_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  last_name: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede exceder 100 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z
    .string()
    .refine((phone) => !phone || /^\+?[\d\s\-()]{10,}$/.test(phone), {
      message: "Teléfono inválido",
    })
    .optional()
    .or(z.literal("")),
  date_of_birth: z.string().refine(
    (date) => {
      const d = new Date(date);
      return !isNaN(d.getTime());
    },
    { message: "Fecha de nacimiento inválida" }
  ),
  identification_number: z.string().optional().or(z.literal("")),
});

export const createGuardianSchema = z.object({
  first_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  last_name: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede exceder 100 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z
    .string()
    .refine(/^\+?[\d\s\-()]{10,}$/, "Teléfono requerido y válido"),
  relationship: z
    .enum(["padre", "madre", "abuelo", "abuela", "tutor", "otro"])
    .refine((rel) => !!rel, "Parentesco requerido"),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type CreateGuardianInput = z.infer<typeof createGuardianSchema>;
