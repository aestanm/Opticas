/**
 * Listado de pacientes
 * Muestra todos los pacientes registrados con opciones de búsqueda
 */

"use client";

import { useState } from "react";
import { usePatients, useSearchPatients } from "@/hooks/usePatients";
import { Input } from "@/components/Input";
import { Card, CardBody, CardHeader } from "@/components/Card";
import { LoadingSpinner, EmptyState } from "@/components/LoadingAndStates";
import { formatDate } from "@/lib/validators";
import { Patient } from "@/types";

interface PatientListProps {
  tenantId: string;
  onSelectPatient?: (patient: Patient) => void;
}

export function PatientList({
  tenantId,
  onSelectPatient,
}: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: allPatients, isLoading: isLoadingAll } = usePatients(tenantId);
  const { data: searchResults, isLoading: isSearching } = useSearchPatients(
    tenantId,
    searchTerm
  );

  const patients = searchTerm ? searchResults : allPatients;
  const isLoading = searchTerm ? isSearching : isLoadingAll;

  return (
    <div className="space-y-4">
      <Card title="Pacientes" description="Listado de todos los pacientes registrados">
        <CardHeader>
          <Input
            placeholder="Buscar pacientes por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
        </CardHeader>

        <CardBody>
          {isLoading ? (
            <LoadingSpinner />
          ) : !patients || patients.length === 0 ? (
            <EmptyState
              title="Sin pacientes"
              description={searchTerm ? "No se encontraron pacientes" : "Aún no hay pacientes registrados"}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Teléfono
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      F. Nacimiento
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {patient.first_name} {patient.last_name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {patient.email || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {patient.phone || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatDate(patient.date_of_birth)}
                      </td>
                      <td className="px-4 py-3">
                        {patient.is_minor ? (
                          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                            Menor
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Adulto
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onSelectPatient?.(patient)}
                          className="text-sm text-primary hover:underline"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
