/**
 * Tipos del módulo de pacientes
 */

export interface CreatePatientFormData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth: string;
  is_minor: boolean;
  identification_number?: string;
}

export interface CreateGuardianFormData {
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  relationship: string;
}

export const RELATIONSHIPS = [
  { value: "padre", label: "Padre" },
  { value: "madre", label: "Madre" },
  { value: "abuelo", label: "Abuelo" },
  { value: "abuela", label: "Abuela" },
  { value: "tutor", label: "Tutor Legal" },
  { value: "otro", label: "Otro" },
];
