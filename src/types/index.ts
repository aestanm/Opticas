/**
 * Tipos base de la aplicación
 * Definen las entidades principales de la base de datos
 */

// Entidades de usuario y roles
export type User = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type UserRole = "admin" | "secretary" | "doctor" | "patient";

export type UserRoleRecord = {
  id: string;
  user_id: string;
  role: UserRole;
  branch_id: string;
  created_at: string;
};

// Entidades de negocio
export type Tenant = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type Branch = {
  id: string;
  tenant_id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

export type Patient = {
  id: string;
  tenant_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth: string;
  is_minor: boolean;
  identification_number?: string;
  created_at: string;
  updated_at: string;
};

export type Guardian = {
  id: string;
  tenant_id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  relationship: string; // "padre", "madre", "tutor", etc.
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  tenant_id: string;
  branch_id: string;
  patient_id: string;
  doctor_id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type MedicalRecord = {
  id: string;
  tenant_id: string;
  patient_id: string;
  doctor_id: string;
  visit_date: string;
  diagnosis?: string;
  treatment?: string;
  created_at: string;
  updated_at: string;
};

export type Prescription = {
  id: string;
  tenant_id: string;
  medical_record_id: string;
  left_eye_sphere?: number;
  left_eye_cylinder?: number;
  left_eye_axis?: number;
  right_eye_sphere?: number;
  right_eye_cylinder?: number;
  right_eye_axis?: number;
  additional_notes?: string;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  tenant_id: string;
  branch_id: string;
  patient_id: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  description: string;
  total_amount?: number;
  created_at: string;
  updated_at: string;
};

// Tipos para respuestas y operaciones
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};
