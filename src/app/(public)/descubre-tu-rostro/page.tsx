import type { Metadata } from "next";
import { Camera, ScanFace, Sparkles } from "lucide-react";
import { FaceAnalysisSection } from "./FaceAnalysisSection";

export const metadata: Metadata = {
  description:
    "Usa tu cámara para descubrir la forma de tu rostro y qué tipo de montura te favorece más.",
};

const STEPS = [
  {
    icon: Camera,
    title: "Activa tu cámara",
    description: "Ubica tu rostro dentro del óvalo guía; te avisamos si debes acercarte o alejarte.",
  },
  {
    icon: ScanFace,
    title: "Analizamos tu rostro",
    description: "El análisis ocurre en tu navegador: tu foto nunca se guarda ni se envía a ningún servidor.",
  },
  {
    icon: Sparkles,
    title: "Recibe tu recomendación",
    description: "Te mostramos qué tipos de montura favorecen más la forma de tu rostro.",
  },
];

export default function DescubreTuRostroPage() {
  return (
    <>
      <section className="bg-brand-navy py-16 text-center text-white">
        <div className="container">
          <h1 className="text-4xl font-bold">Descubre tu rostro</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-200">
            Usa tu cámara para descubrir la forma de tu rostro y qué tipo de montura te favorece más.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, description }) => (
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

      <section className="bg-slate-50 py-16">
        <div className="container">
          <FaceAnalysisSection />
        </div>
      </section>
    </>
  );
}
