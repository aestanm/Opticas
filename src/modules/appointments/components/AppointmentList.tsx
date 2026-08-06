/**
 * Listado de citas
 * Muestra citas por fecha con opciones de filtrado
 */

"use client";

import { useState } from "react";
import { useAppointmentsByDateRange } from "@/hooks/useAppointments";
import { Input } from "@/components/Input";
import { Card, CardBody, CardHeader } from "@/components/Card";
import { LoadingSpinner, EmptyState } from "@/components/LoadingAndStates";
import { formatDate, formatTime } from "@/lib/validators";
import { Appointment } from "@/types";
import { APPOINTMENT_STATUSES } from "../types";

interface AppointmentListProps {
  tenantId: string;
}

export function AppointmentList({ tenantId }: AppointmentListProps) {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  const { data: appointments = [], isLoading } = useAppointmentsByDateRange(
    tenantId,
    startDate,
    endDate
  );

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string }> = {
      pending: { bg: "bg-yellow-50", text: "text-yellow-800" },
      confirmed: { bg: "bg-green-50", text: "text-green-800" },
      completed: { bg: "bg-blue-50", text: "text-blue-800" },
      cancelled: { bg: "bg-red-50", text: "text-red-800" },
    };

    const style = statusMap[status] || statusMap.pending;
    const label = APPOINTMENT_STATUSES.find((s) => s.value === status)?.label || status;

    return (
      <span
        className={`inline-flex items-center rounded-full ${style.bg} px-2.5 py-0.5 text-xs font-medium ${style.text}`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <Card title="Citas" description="Listado de citas agendadas">
        <CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Desde"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.currentTarget.value)}
            />
            <Input
              label="Hasta"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.currentTarget.value)}
            />
          </div>
        </CardHeader>

        <CardBody>
          {isLoading ? (
            <LoadingSpinner />
          ) : !appointments || appointments.length === 0 ? (
            <EmptyState
              title="Sin citas"
              description="No hay citas agendadas en este rango de fechas"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Paciente
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Doctor
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Hora
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
                  {appointments.map((appointment: Appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {appointment.patient_id}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {appointment.doctor_id}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatDate(appointment.scheduled_date)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatTime(appointment.scheduled_time)}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-sm text-primary hover:underline">
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
