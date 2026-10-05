import { BRAND } from "@/lib/brand";

export interface AppointmentRequest {
  name: string;
  phone: string;
  service: string;
  date?: string;
  timeSlot?: string;
  reason?: string;
}

// Convierte "2026-10-15" en "15/10/2026" para que se lea bien en el chat
function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

export function buildAppointmentMessage(request: AppointmentRequest): string {
  const lines = [
    `Hola! Quiero agendar una cita en ${BRAND.name}.`,
    "",
    `*Nombre:* ${request.name}`,
    `*Teléfono:* ${request.phone}`,
    `*Servicio:* ${request.service}`,
    `*Fecha preferida:* ${request.date ? formatDate(request.date) : "Sin preferencia"}`,
    `*Horario:* ${request.timeSlot || "Sin preferencia"}`,
  ];

  if (request.reason) {
    lines.push(`*Motivo:* ${request.reason}`);
  }

  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
