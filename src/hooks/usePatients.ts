/**
 * Hook para gestionar pacientes
 * Proporciona funciones para crear, obtener, actualizar y eliminar pacientes
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PatientService } from "@/services/patient.service";
import { Patient, Guardian } from "@/types";

const PATIENTS_QUERY_KEY = ["patients"];

export function usePatients(tenantId: string) {
  return useQuery({
    queryKey: [...PATIENTS_QUERY_KEY, tenantId],
    queryFn: () => PatientService.getAllPatients(tenantId),
  });
}

export function usePatient(patientId: string) {
  return useQuery({
    queryKey: [...PATIENTS_QUERY_KEY, patientId],
    queryFn: () => PatientService.getPatientById(patientId),
    enabled: !!patientId,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patient: Parameters<typeof PatientService.createPatient>[0]) =>
      PatientService.createPatient(patient),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...PATIENTS_QUERY_KEY, variables.tenant_id],
      });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId, updates }: { patientId: string; updates: Partial<Patient> }) =>
      PatientService.updatePatient(patientId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [...PATIENTS_QUERY_KEY, data.id],
      });
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientId: string) => PatientService.deletePatient(patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
    },
  });
}

export function useSearchPatients(tenantId: string, searchTerm: string) {
  return useQuery({
    queryKey: [...PATIENTS_QUERY_KEY, "search", tenantId, searchTerm],
    queryFn: () => PatientService.searchPatients(tenantId, searchTerm),
    enabled: !!searchTerm && searchTerm.length > 1,
  });
}

export function useGuardians(patientId: string) {
  return useQuery({
    queryKey: [...PATIENTS_QUERY_KEY, patientId, "guardians"],
    queryFn: () => PatientService.getGuardians(patientId),
    enabled: !!patientId,
  });
}

export function useCreateGuardian() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (guardian: Parameters<typeof PatientService.createGuardian>[0]) =>
      PatientService.createGuardian(guardian),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...PATIENTS_QUERY_KEY, variables.patient_id, "guardians"],
      });
    },
  });
}

export function useUpdateGuardian() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ guardianId, updates }: { guardianId: string; updates: Partial<Guardian> }) =>
      PatientService.updateGuardian(guardianId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
    },
  });
}

export function useDeleteGuardian() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (guardianId: string) => PatientService.deleteGuardian(guardianId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
    },
  });
}
