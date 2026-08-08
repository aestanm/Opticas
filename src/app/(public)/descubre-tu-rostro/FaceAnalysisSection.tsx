"use client";

import { FaceAnalysisExperience } from "@/modules/face-analysis";
import { WHATSAPP_URL } from "@/lib/brand";

export function FaceAnalysisSection() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
      <FaceAnalysisExperience>
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-600">
            ¿Quieres que te ayudemos a elegir la montura ideal en persona?
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-teal px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-dark"
          >
            Agenda tu cita
          </a>
        </div>
      </FaceAnalysisExperience>
    </div>
  );
}
