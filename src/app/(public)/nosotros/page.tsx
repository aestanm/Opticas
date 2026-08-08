import { Eye, Sparkles, Glasses } from "lucide-react";
import { TEAM } from "@/lib/brand";
import { BrandArcs } from "@/components/public/BrandArcs";

const VALUES = [
  {
    icon: Eye,
    title: "Tecnología avanzada",
    description: "Invertimos en equipos modernos para diagnósticos visuales precisos.",
  },
  {
    icon: Sparkles,
    title: "Asesoría personalizada",
    description: "Cada mirada es distinta: te acompañamos en todo el proceso, no solo en la venta.",
  },
  {
    icon: Glasses,
    title: "Diseño y precisión",
    description: "Lentes y monturas elegidos con criterio óptico y de estilo.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-navy py-10 text-center text-white">
        <BrandArcs />
        <div className="container relative">
          <h1 className="text-4xl font-bold">Sobre nosotros</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-200">
            Somos Óptica Guillén, un equipo dedicado a la salud visual en Cali.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {TEAM.map((member) => (
            <div key={member.name} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.photo}
                alt={`${member.name} — ${member.role}`}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-brand-navy">Nuestro compromiso</h2>
          <p className="mt-4 text-slate-600">
            En Óptica Guillén creemos que ver bien es clave para aprender, trabajar y disfrutar
            cada día. Por eso combinamos tecnología avanzada en salud visual con asesoría
            personalizada, para que cada persona que nos visita salga con la solución visual
            que realmente necesita.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-slate-100 p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal-dark">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-brand-navy">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
