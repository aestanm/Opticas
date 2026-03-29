/**
 * Página de pacientes
 * Listado y creación de pacientes
 */

"use client";

import { useState } from "react";
import { CreatePatientForm, PatientList } from "@/modules/patients";

const TENANT_ID = "test-tenant"; // Esto debería venir del contexto/sesión

export default function PatientsPage() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pacientes</h1>
        <p className="text-muted-foreground mt-2">
          Gestión de pacientes del sistema
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
          Crear Paciente
        </button>
      </div>

      {/* Content */}
      {activeTab === "list" && <PatientList tenantId={TENANT_ID} />}
      {activeTab === "create" && (
        <CreatePatientForm
          tenantId={TENANT_ID}
          onSuccess={() => setActiveTab("list")}
        />
      )}
    </div>
  );
}
