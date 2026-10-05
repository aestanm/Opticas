/**
 * Página principal del dashboard
 */

"use client";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Bienvenido al sistema de gestión óptica
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card: Total Pacientes */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Pacientes
              </p>
              <p className="text-2xl font-bold text-foreground mt-2">-</p>
            </div>
            <div className="text-4xl text-muted-foreground opacity-20">👥</div>
          </div>
        </div>

        {/* Card: Citas Hoy */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Citas Hoy
              </p>
              <p className="text-2xl font-bold text-foreground mt-2">-</p>
            </div>
            <div className="text-4xl text-muted-foreground opacity-20">📅</div>
          </div>
        </div>

        {/* Card: Pendientes */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Citas Pendientes
              </p>
              <p className="text-2xl font-bold text-foreground mt-2">-</p>
            </div>
            <div className="text-4xl text-muted-foreground opacity-20">⏳</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Próximas Acciones
        </h2>
        <ul className="space-y-3">
          <li className="flex items-center space-x-3 text-sm text-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
            <span>Crear nuevo paciente</span>
          </li>
          <li className="flex items-center space-x-3 text-sm text-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
            <span>Agendar cita</span>
          </li>
          <li className="flex items-center space-x-3 text-sm text-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
            <span>Registrar prescripción</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
