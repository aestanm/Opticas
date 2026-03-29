/**
 * Layout del dashboard
 * Contiene navegación y estructura base para páginas autenticadas
 */

"use client";

import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground">Ópticas</h2>
          <p className="text-sm text-muted-foreground">Sistema de Gestión</p>
        </div>

        <nav className="space-y-2 px-4">
          <a
            href="/dashboard"
            className="block rounded-md px-4 py-2 text-sm font-medium hover:bg-muted text-foreground"
          >
            Dashboard
          </a>
          <a
            href="/dashboard/patients"
            className="block rounded-md px-4 py-2 text-sm font-medium hover:bg-muted text-foreground"
          >
            Pacientes
          </a>
          <a
            href="/dashboard/appointments"
            className="block rounded-md px-4 py-2 text-sm font-medium hover:bg-muted text-foreground"
          >
            Citas
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
