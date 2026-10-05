import { Eye, GraduationCap, Glasses, Sun, ShieldCheck, Contact, MoonStar, Sparkles, Droplets, Wrench } from "lucide-react";
import { AppointmentButton } from "@/components/public/AppointmentButton";
import type { Metadata } from "next";
import { BrandArcs } from "@/components/public/BrandArcs";

export const metadata: Metadata = {
  title: "Servicios de salud visual en Cali",
  description:
    "Exámenes visuales, salud visual infantil, lentes formulados, lentes de contacto, lentes de protección y gafas de sol en Cali.",
};

const SERVICES = [
  {
    icon: Eye,
    title: "Exámenes visuales",
    description:
      "Evaluamos el desarrollo visual y detectamos problemas a tiempo, con tecnología avanzada y asesoría personalizada.",
  },
  {
    icon: GraduationCap,
    title: "Salud visual infantil",
    description:
      "Ver bien es clave para aprender: revisamos la visión de los niños para evitar bajo rendimiento escolar y dificultades de aprendizaje.",
  },
  {
    icon: Glasses,
    title: "Monturas y lentes formulados",
    description: "Lentes con diseño y precisión, seleccionados para cada fórmula y estilo de vida.",
  },
  {
    icon: Contact,
    title: "Lentes de contacto",
    description: "Adaptación y asesoría en el uso y cuidado adecuado de tus lentes de contacto.",
  },
  {
    icon: ShieldCheck,
    title: "Lentes de protección",
    description:
      "Lentes sin aumento diseñados para proteger tu visión durante largas jornadas frente a pantallas.",
  },
  {
    icon: Sun,
    title: "Gafas de sol con filtro UV",
    description: "Protege tu mirada del sol con lentes que filtran la radiación UV.",
  },
  {
    icon: Wrench,
    title: "Mantenimiento de monturas",
    description: "Servicio técnico de reparación y ajuste para que tus monturas sigan cómodas y en buen estado.",
  },
];

const CARE_TIPS = [
  {
    icon: ShieldCheck,
    title: "Usa lentes de protección",
    description: "No tienen aumento y están diseñados para proteger tu visión en jornadas digitales largas.",
  },
  {
    icon: MoonStar,
    title: "No duermas con tus lentes de contacto",
    description: "Dale a tus ojos el descanso que necesitan para mantenerse sanos.",
  },
  {
    icon: Sparkles,
    title: "Limpia bien tus gafas",
    description: "Usa el paño adecuado, nunca tu camiseta: evitas rayones y prolongas su vida útil.",
  },
  {
    icon: Droplets,
    title: "Protege tu mirada del sol",
    description: "Gafas con filtro UV y lágrimas artificiales cuando lo necesites.",
  },
];

export default function ServiciosPage() {
  return (
    <>
      <section className="bg-brand-navy py-16 text-center text-white">
        <div className="container">
          <h1 className="text-4xl font-bold">Nuestros servicios</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-200">
            Tecnología avanzada en salud visual y asesoría personalizada para cada mirada.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, description }) => (
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
            <h2 className="text-3xl font-bold text-brand-navy">Consejos para el cuidado de tus lentes</h2>
            <p className="mt-2 text-slate-600">Pequeños hábitos que protegen tu salud visual todos los días.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {CARE_TIPS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal-dark">
                  <Icon size={22} />
                </span>
                <div>
                  <h3 className="font-semibold text-brand-navy">{title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-navy">
        <BrandArcs />
        <div className="container relative flex flex-col items-center gap-4 py-16 text-center text-white">
          <h2 className="text-2xl font-bold">¿Listo para cuidar tu salud visual?</h2>
          <AppointmentButton className="rounded-full bg-brand-teal px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-dark">Agenda tu cita</AppointmentButton>
        </div>
      </section>
    </>
  );
}
