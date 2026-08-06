/**
 * Footer del sitio público
 * Datos de contacto, horarios y enlaces de navegación
 */

import Link from "next/link";
import { Logo } from "./Logo";
import { BRAND, BUSINESS_HOURS, NAV_LINKS, WHATSAPP_URL } from "@/lib/brand";

export function PublicFooter() {
  return (
    <footer className="bg-brand-navy text-slate-200">
      <div className="container grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Logo variant="light" />
          <p className="mt-4 max-w-xs text-sm text-slate-300">
            {BRAND.tagline}. Tecnología avanzada, asesoría personalizada y lentes con
            diseño y precisión en {BRAND.city}.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-teal-light">
            Navegación
          </h3>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-300 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-teal-light">
            Contacto
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>{BRAND.address}</li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {BRAND.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {BRAND.instagramHandle}
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm text-slate-300">
            {BUSINESS_HOURS[0].day} - {BUSINESS_HOURS[4].day}: {BUSINESS_HOURS[0].hours}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="container text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {BRAND.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
