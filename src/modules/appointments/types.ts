/**
 * Tipos del módulo de citas
 */

export interface CreateAppointmentFormData {
  patient_id: string;
  doctor_id: string;
  scheduled_date: string;
  scheduled_time: string;
  notes?: string;
}

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export const APPOINTMENT_STATUSES: { value: AppointmentStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmada" },
  { value: "completed", label: "Completada" },
  { value: "cancelled", label: "Cancelada" },
];
