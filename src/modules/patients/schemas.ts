/**
 * Esquemas de validación para el módulo de pacientes
 * Utiliza Zod para validación de formularios y datos
 */

import { z } from "zod";
import { isMinor } from "@/lib/validators";

// Esquema para paciente adulto
export const adultPatientSchema = z.object({
  full_name: z
    .string()
    .min(2, "El nombre completo debe tener al menos 2 caracteres")
    .max(200, "El nombre completo no puede exceder 200 caracteres"),
  document_type_id: z
    .string()
    .min(1, "El tipo de documento es requerido"),
  document_number: z
    .string()
    .min(1, "El número de documento es requerido")
    .max(50, "El número de documento no puede exceder 50 caracteres"),
  birth_date: z
    .string()
    .optional()
    .refine(
      (date) => !date || !isNaN(new Date(date).getTime()),
      { message: "Fecha de nacimiento inválida" }
    ),
});

// Esquema para paciente menor
export const minorPatientSchema = adultPatientSchema.extend({
  // Los mismos campos que adulto, pero requerirá guardianes
});

// Esquema para guardian
export const guardianSchema = z.object({
  full_name: z
    .string()
    .min(2, "El nombre completo debe tener al menos 2 caracteres")
    .max(200, "El nombre completo no puede exceder 200 caracteres"),
  document_type_id: z
    .string()
    .min(1, "El tipo de documento es requerido"),
  document_number: z
    .string()
    .min(1, "El número de documento es requerido")
    .max(50, "El número de documento no puede exceder 50 caracteres"),
  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .refine(
      (phone) => /^\+?[\d\s\-()]{10,}$/.test(phone),
      { message: "Teléfono inválido" }
    ),
  relationship: z
    .enum(["padre", "madre", "abuelo", "abuela", "tutor", "otro"])
    .refine((rel) => !!rel, "El parentesco es requerido"),
});

// Esquema para formulario de paciente (con validación condicional)
export const patientFormSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "El nombre completo es requerido")
      .max(200, "El nombre completo no puede exceder 200 caracteres"),
    document_type_id: z
      .string()
      .min(1, "El tipo de documento es requerido"),
    document_number: z
      .string()
      .trim()
      .min(1, "El número de documento es requerido")
      .max(50, "El número de documento no puede exceder 50 caracteres"),
    birth_date: z
      .string()
      .optional()
      .refine(
        (date) => !date || !isNaN(new Date(date).getTime()),
        { message: "Fecha de nacimiento inválida" }
      ),
is_minor: z.boolean().optional(),
  guardians: z.array(guardianSchema).optional(),
})
.refine(
  (data) => {
    const minor = data.birth_date ? isMinor(data.birth_date) : false;
    if (minor) {
        return data.guardians && data.guardians.length > 0;
      }
      return true;
    },
    {
      message: "Los pacientes menores deben tener al menos un tutor registrado",
      path: ["guardians"],
    }
  );

// Tipos inferidos de los esquemas
export type AdultPatientInput = z.infer<typeof adultPatientSchema>;
export type MinorPatientInput = z.infer<typeof minorPatientSchema>;
export type GuardianInput = z.infer<typeof guardianSchema>;
export type PatientFormData = z.infer<typeof patientFormSchema>;