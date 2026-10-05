import { AtSign, MapPin, Phone, Instagram, Facebook, Music2, Clock } from "lucide-react";
import { AppointmentButton } from "@/components/public/AppointmentButton";
import type { Metadata } from "next";
import { BRAND, BUSINESS_HOURS, WHATSAPP_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contacto y citas en Cali",
  description: `Agenda tu cita en ${BRAND.address}. Escríbenos por WhatsApp al ${BRAND.phoneDisplay}.`,
};

export default function ContactoPage() {
  return (
    <>
      <section className="bg-brand-navy py-16 text-center text-white">
        <div className="container">
          <h1 className="text-4xl font-bold">Contacto</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-200">
            Escríbenos o visítanos en {BRAND.city}. Estaremos felices de atenderte.
          </p>
        </div>
      </section>

      <section className="container grid gap-10 py-16 md:grid-cols-2">
        <div className="space-y-8">
          <div className="flex gap-4">
            <MapPin className="mt-1 shrink-0 text-brand-teal-dark" size={22} />
            <div>
              <h3 className="font-semibold text-brand-navy">Dirección</h3>
              <p className="mt-1 text-sm text-slate-600">{BRAND.address}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Phone className="mt-1 shrink-0 text-brand-teal-dark" size={22} />
            <div>
              <h3 className="font-semibold text-brand-navy">Teléfono / WhatsApp</h3>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-slate-600 hover:text-brand-teal-dark"
              >
                {BRAND.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <Clock className="mt-1 shrink-0 text-brand-teal-dark" size={22} />
            <div>
              <h3 className="font-semibold text-brand-navy">Horarios de atención</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {BUSINESS_HOURS.map(({ day, hours }) => (
                  <li key={day} className="flex justify-between gap-6 sm:w-64">
                    <span>{day}</span>
                    <span className="font-medium text-brand-navy">{hours}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-slate-400">Te recomendamos agendar cita previa antes de asistir.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <AtSign className="mt-1 shrink-0 text-brand-teal-dark" size={22} />
            <div>
              <h3 className="font-semibold text-brand-navy">Síguenos en</h3>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1 text-sm text-slate-600 hover:text-brand-teal-dark"
              >
                <Instagram size={14} /> {BRAND.instagramHandle.replace("@", "")}
              </a>
              <a
                href={BRAND.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1 text-sm text-slate-600 hover:text-brand-teal-dark"
              >
                <Facebook size={14} /> Óptica Guillén Cali
              </a>
              <a
                href={BRAND.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1 text-sm text-slate-600 hover:text-brand-teal-dark"
              >
                <Music2 size={14} /> TikTok {BRAND.tiktokHandle}
              </a>
            </div>
          </div>

          <AppointmentButton className="inline-flex rounded-full bg-brand-teal px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-dark">Agenda tu cita por WhatsApp</AppointmentButton>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
          <iframe
            title="Ubicación de Óptica Guillén"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(BRAND.address)}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 360 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
