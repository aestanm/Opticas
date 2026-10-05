/**
 * Header del sitio público
 * Navegación entre secciones + CTA de agendar cita por WhatsApp
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { AppointmentButton } from "./AppointmentButton";
import { NAV_LINKS } from "@/lib/brand";

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="container grid h-24 grid-cols-2 items-center md:grid-cols-3">
        <Logo imgHeight={92} className="justify-self-start" />

        <nav className="col-span-1 hidden items-center gap-8 justify-self-center md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-slate-600 transition-colors hover:text-brand-teal-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          <AppointmentButton className="hidden rounded-full bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-dark md:inline-flex">Agenda tu cita</AppointmentButton>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Abrir menú"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <nav className="container flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <AppointmentButton className="mt-2 rounded-full bg-brand-teal px-5 py-2.5 text-center text-sm font-semibold text-white">Agenda tu cita</AppointmentButton>
          </nav>
        </div>
      )}
    </header>
  );
}
