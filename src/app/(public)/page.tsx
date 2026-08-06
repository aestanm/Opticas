import Link from "next/link";
import { Eye, Sparkles, Glasses, GraduationCap, Users, MapPin, Clock, CalendarCheck } from "lucide-react";
import { BRAND, BUSINESS_HOURS, WHATSAPP_URL } from "@/lib/brand";
import { BrandArcs } from "@/components/public/BrandArcs";
import { StatRing } from "@/components/public/StatRing";
import { ChecklistCard } from "@/components/public/ChecklistCard";

const VALUE_PROPS = [
  {
    icon: Eye,
    title: "Tecnología avanzada",
    description: "Equipos modernos para diagnósticos precisos de tu salud visual.",
  },
  {
    icon: Sparkles,
    title: "Asesoría personalizada",
    description: "Acompañamiento para cada mirada, desde el examen hasta la elección de tus lentes.",
  },
  {
    icon: Glasses,
    title: "Diseño y precisión",
    description: "Monturas y lentes seleccionados con criterio óptico y de estilo.",
  },
];

const SERVICES_PREVIEW = [
  {
    icon: Eye,
    title: "Exámenes visuales",
    description: "Revisión completa para detectar problemas de visión a tiempo.",
  },
  {
    icon: GraduationCap,
    title: "Salud visual infantil",
    description: "El 80% del aprendizaje entra por los ojos: cuidamos la visión de los más pequeños.",
  },
  {
    icon: Glasses,
    title: "Monturas y lentes",
    description: "Lentes formulados, de protección y filtro UV, con diseño y precisión.",
  },
];

const CHILD_WARNING_SIGNS = [
  "Perder concentración",
  "Tener bajo rendimiento escolar",
  "Confundir letras o números",
  "Sentir cansancio visual o dolores de cabeza",
  "Desmotivarse en el estudio",
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-navy">
        <BrandArcs />
        <div className="container relative flex flex-col items-center gap-6 py-20 text-center text-white md:py-28">
          <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-teal-light">
            Óptica Guillén · {BRAND.city}
          </span>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
            {BRAND.tagline}
          </h1>
          <p className="max-w-xl text-lg text-slate-200">
            Tecnología avanzada en salud visual, asesoría personalizada para cada mirada
            y lentes con diseño y precisión.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-teal px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-dark"
            >
              Agenda tu cita
            </a>
            <Link
              href="/servicios"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Conoce nuestros servicios
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal-dark">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-brand-navy">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-brand-navy">Servicios destacados</h2>
            <p className="mt-2 text-slate-600">Cuidamos tu visión en cada etapa de la vida.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {SERVICES_PREVIEW.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy/5 text-brand-navy">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-brand-navy">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/servicios"
              className="text-sm font-semibold text-brand-teal-dark hover:underline"
            >
              Ver todos los servicios →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-16">
        <div className="container grid items-center gap-10 md:grid-cols-2">
          <div className="text-white">
            <h2 className="text-3xl font-bold">Cuando un niño no ve bien puede:</h2>
            <p className="mt-3 text-slate-300">
              Ver bien es clave para aprender. La lectura, la escritura, la atención y la
              comprensión dependen en gran parte de una buena salud visual.
            </p>
          </div>
          <ChecklistCard items={CHILD_WARNING_SIGNS} />
        </div>
      </section>

      <section className="container py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-brand-navy">Ojo al dato</h2>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          <StatRing percentage={80} label="del aprendizaje en los niños entra por los ojos." />
          <StatRing
            percentage={30}
            label="de la población mundial tiene miopía, y la cifra sigue en aumento."
            color="#173A56"
          />
          <div className="flex flex-col items-center">
            <div className="flex h-[140px] w-[140px] items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal-dark">
              <CalendarCheck size={48} />
            </div>
            <p className="mt-4 max-w-[12rem] text-center text-sm text-slate-600">
              1 vez al año: la frecuencia recomendada para tu revisión visual.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-teal">
        <BrandArcs color="#0D9488" />
        <div className="container relative flex flex-col items-center gap-6 py-16 text-center text-white">
          <Users size={32} />
          <h2 className="text-3xl font-bold">Cuidar tu visión hoy es ver mejor mañana</h2>
          <div className="flex flex-col items-center gap-2 text-sm sm:flex-row sm:gap-6">
            <span className="inline-flex items-center gap-2">
              <MapPin size={18} /> {BRAND.address}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock size={18} /> {BUSINESS_HOURS[0].hours} (Lun - Vie)
            </span>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-teal-dark transition-colors hover:bg-slate-100"
          >
            Agenda tu cita · {BRAND.phoneDisplay}
          </a>
        </div>
      </section>
    </>
  );
}
