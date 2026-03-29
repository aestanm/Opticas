/**
 * Hook para gestionar citas
 * Proporciona funciones para crear, obtener, actualizar y listar citas
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppointmentService } from "@/services/appointment.service";
import { Appointment } from "@/types";

const APPOINTMENTS_QUERY_KEY = ["appointments"];

export function useAppointments(tenantId: string) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, tenantId],
    queryFn: () => AppointmentService.getAllAppointments(tenantId),
  });
}

export function usePatientAppointments(patientId: string) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, "patient", patientId],
    queryFn: () => AppointmentService.getPatientAppointments(patientId),
    enabled: !!patientId,
  });
}

export function useDoctorAppointmentsByDate(
  doctorId: string,
  date: string
) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, "doctor", doctorId, date],
    queryFn: () => AppointmentService.getDoctorAppointmentsByDate(doctorId, date),
    enabled: !!doctorId && !!date,
  });
}

export function useBranchAppointmentsByDate(
  branchId: string,
  date: string
) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, "branch", branchId, date],
    queryFn: () => AppointmentService.getBranchAppointmentsByDate(branchId, date),
    enabled: !!branchId && !!date,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointment: Parameters<typeof AppointmentService.createAppointment>[0]) =>
      AppointmentService.createAppointment(appointment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [...APPOINTMENTS_QUERY_KEY, data.tenant_id],
      });
      queryClient.invalidateQueries({
        queryKey: [...APPOINTMENTS_QUERY_KEY, "patient", data.patient_id],
      });
      queryClient.invalidateQueries({
        queryKey: [...APPOINTMENTS_QUERY_KEY, "branch", data.branch_id, data.scheduled_date],
      });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, updates }: { appointmentId: string; updates: Partial<Appointment> }) =>
      AppointmentService.updateAppointment(appointmentId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => AppointmentService.cancelAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}

export function useAppointmentsByDateRange(
  tenantId: string,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, tenantId, startDate, endDate],
    queryFn: () =>
      AppointmentService.getAppointmentsByDateRange(tenantId, startDate, endDate),
    enabled: !!tenantId && !!startDate && !!endDate,
  });
}
