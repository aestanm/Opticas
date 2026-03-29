/**
 * Funciones de validación reutilizables
 */

import { z } from "zod";

// Esquemas de validación
export const emailSchema = z.string().email("Email inválido");

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-()]{10,}$/, "Teléfono inválido");

export const dateSchema = z.string().refine(
  (date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  },
  { message: "Fecha inválida" }
);

export const patientNameSchema = z
  .string()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(100, "El nombre no puede exceder 100 caracteres");

// Función auxiliar para validar edad
export function isMinor(dateOfBirth: string): boolean {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age < 18;
}

// Función para formatear fechas
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("es-CO");
}

// Función para formatear hora
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
}

// Función para validar que no hay solapamiento de citas
export function hasTimeConflict(
  newStart: string,
  newEnd: string,
  existingStart: string,
  existingEnd: string
): boolean {
  const newStartTime = new Date(`2000-01-01 ${newStart}`).getTime();
  const newEndTime = new Date(`2000-01-01 ${newEnd}`).getTime();
  const existingStartTime = new Date(`2000-01-01 ${existingStart}`).getTime();
  const existingEndTime = new Date(`2000-01-01 ${existingEnd}`).getTime();

  return newStartTime < existingEndTime && newEndTime > existingStartTime;
}

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
