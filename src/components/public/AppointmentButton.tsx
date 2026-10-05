"use client";

/**
 * Botón "Agenda tu cita" con formulario previo.
 * Al confirmar, abre WhatsApp con los datos del paciente ya escritos en el mensaje.
 * No guarda nada: los datos solo llegan al chat de la óptica.
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { buildAppointmentMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

const SERVICE_OPTIONS = [
  "Examen visual",
  "Salud visual infantil",
  "Monturas y lentes formulados",
  "Lentes de contacto",
  "Lentes de protección",
  "Gafas de sol con filtro UV",
  "Mantenimiento de monturas",
  "No estoy seguro",
];

const TIME_SLOTS = ["Mañana", "Tarde", "Cualquier hora"];

const schema = z.object({
  name: z.string().trim().min(3, "Escribe tu nombre completo").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s-]{7,15}$/, "Ingresa un teléfono válido, solo números"),
  service: z.string().min(1, "Selecciona un servicio"),
  date: z.string().optional(),
  timeSlot: z.string().optional(),
  reason: z.string().trim().max(300, "Máximo 300 caracteres").optional(),
  consent: z.boolean().refine((value) => value, "Debes aceptar para continuar"),
});

type FormValues = z.infer<typeof schema>;

function todayIso(): string {
  return new Date().toLocaleDateString("en-CA");
}

interface AppointmentButtonProps {
  className?: string;
  children: React.ReactNode;
}

export function AppointmentButton({ className, children }: AppointmentButtonProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", service: "", date: "", timeSlot: "", reason: "", consent: false },
  });

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const onSubmit = (values: FormValues) => {
    const message = buildAppointmentMessage({
      name: values.name,
      phone: values.phone.replace(/[\s-]/g, ""),
      service: values.service,
      date: values.date || undefined,
      timeSlot: values.timeSlot || undefined,
      reason: values.reason || undefined,
    });
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    setOpen(false);
    reset();
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-brand-navy/60 p-0 sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-title"
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:max-w-md sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="appointment-title" className="text-xl font-bold text-brand-navy">
                  Agenda tu cita
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Completa tus datos y se abrirá WhatsApp con tu solicitud lista para enviar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:text-slate-600"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <label htmlFor="appt-name" className="text-sm font-medium text-slate-700">
                  Nombre completo *
                </label>
                <input id="appt-name" autoComplete="name" className={inputClass} {...register("name")} />
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="appt-phone" className="text-sm font-medium text-slate-700">
                  Teléfono / WhatsApp *
                </label>
                <input
                  id="appt-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="316 232 5372"
                  className={inputClass}
                  {...register("phone")}
                />
                {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
              </div>

              <div>
                <label htmlFor="appt-service" className="text-sm font-medium text-slate-700">
                  Servicio *
                </label>
                <select id="appt-service" className={inputClass} {...register("service")}>
                  <option value="">Selecciona una opción</option>
                  {SERVICE_OPTIONS.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                {errors.service && <p className={errorClass}>{errors.service.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="appt-date" className="text-sm font-medium text-slate-700">
                    Fecha preferida
                  </label>
                  <input
                    id="appt-date"
                    type="date"
                    min={todayIso()}
                    className={inputClass}
                    {...register("date")}
                  />
                </div>
                <div>
                  <label htmlFor="appt-time" className="text-sm font-medium text-slate-700">
                    Horario
                  </label>
                  <select id="appt-time" className={inputClass} {...register("timeSlot")}>
                    <option value="">Sin preferencia</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="appt-reason" className="text-sm font-medium text-slate-700">
                  Motivo de la consulta <span className="text-slate-400">(opcional)</span>
                </label>
                <textarea
                  id="appt-reason"
                  rows={2}
                  placeholder="Ej: control anual, cambio de lentes"
                  className={inputClass}
                  {...register("reason")}
                />
                {errors.reason && <p className={errorClass}>{errors.reason.message}</p>}
              </div>

              <label className="flex gap-3 text-xs text-slate-600">
                <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-brand-teal" {...register("consent")} />
                <span>
                  Acepto que Óptica Guillén use mis datos únicamente para gestionar mi cita. *
                </span>
              </label>
              {errors.consent && <p className={errorClass}>{errors.consent.message}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-brand-teal px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-dark disabled:opacity-60"
              >
                Confirmar y enviar por WhatsApp
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
