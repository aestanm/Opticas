/**
 * Página de citas
 * Gestión de citas agendadas
 */

"use client";

import { useState } from "react";
import { CreateAppointmentForm, AppointmentList } from "@/modules/appointments";

const TENANT_ID = "test-tenant"; // Esto debería venir del contexto/sesión
const BRANCH_ID = "test-branch"; // Esto debería venir del contexto/sesión

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Citas</h1>
        <p className="text-muted-foreground mt-2">
          Gestión de citas agendadas
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-border">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "list"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Listado
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "create"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Agendar Cita
        </button>
      </div>

      {/* Content */}
      {activeTab === "list" && <AppointmentList tenantId={TENANT_ID} />}
      {activeTab === "create" && (
        <CreateAppointmentForm
          tenantId={TENANT_ID}
          branchId={BRANCH_ID}
          onSuccess={() => setActiveTab("list")}
        />
      )}
    </div>
  );
}
