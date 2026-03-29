/**
 * Validadores para el módulo de citas
 */

import { z } from "zod";

export const createAppointmentSchema = z.object({
  patient_id: z.string().min(1, "Paciente requerido"),
  doctor_id: z.string().min(1, "Doctor requerido"),
  scheduled_date: z.string().refine(
    (date) => {
      const d = new Date(date);
      return !isNaN(d.getTime()) && d >= new Date();
    },
    { message: "Fecha debe ser en el futuro" }
  ),
  scheduled_time: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida (formato HH:MM)"),
  notes: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
