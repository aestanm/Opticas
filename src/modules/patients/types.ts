/**
 * Tipos del módulo de pacientes
 */

// Tipos para formularios y validación
export interface PatientFormData {
  full_name: string;
  phone?: string;
  document_type_id: string;
  document_number: string;
  birth_date?: string;
  is_minor?: boolean;
  guardians?: GuardianFormData[];
}

export interface GuardianFormData {
  full_name: string;
  document_type_id: string;
  document_number: string;
  phone: string;
  relationship: string;
}

// Tipos para entidades (mapean a la base de datos)
export interface Patient {
  id: string;
  tenant_id: string;
  full_name: string;
  document_type_id: string;
  document_number: string;
  birth_date?: string;
  is_minor: boolean;
  created_at: string;
  updated_at: string;
}

export interface Guardian {
  id: string;
  tenant_id: string;
  patient_id: string;
  full_name: string;
  document_type_id: string;
  document_number: string;
  phone: string;
  relationship: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentType {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

// Constantes para relaciones de guardianes
export const RELATIONSHIPS = [
  { value: "padre", label: "Padre" },
  { value: "madre", label: "Madre" },
  { value: "abuelo", label: "Abuelo" },
  { value: "abuela", label: "Abuela" },
  { value: "tutor", label: "Tutor Legal" },
  { value: "otro", label: "Otro" },
];
