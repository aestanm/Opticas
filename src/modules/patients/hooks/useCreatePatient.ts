/**
 * Hook para crear pacientes
 * Maneja la lógica de creación de pacientes adultos y menores con validación
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PatientService } from "../services/patients.service";
import { PatientFormData, GuardianFormData } from "../types";

const PATIENTS_QUERY_KEY = ["patients"];

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PatientFormData) => {
      const DOCUMENT_TYPE_MAP: Record<string, number> = {
        cc: 1,
        ti: 2,
        ce: 3,
        pasaporte: 4,
      };
      const documentTypeId = DOCUMENT_TYPE_MAP[data.document_type_id] || 1;

      // Crear el paciente primero
      const patient = await PatientService.createPatient({
        full_name: data.full_name,
        phone: data.phone,
        document_type_id: documentTypeId,
        document_number: data.document_number,
        birth_date: data.birth_date,
        is_minor: data.is_minor ?? false,
      });

      // Si es menor y tiene guardianes, crearlos
      if (data.is_minor && data.guardians && data.guardians.length > 0) {
        const guardianPromises = data.guardians.map((guardian: GuardianFormData) => {
          const guardianDocumentTypeId = DOCUMENT_TYPE_MAP[guardian.document_type_id] || 1;
          return PatientService.createGuardian({
            patient_id: patient.id,
            full_name: guardian.full_name,
            document_type_id: guardianDocumentTypeId,
            document_number: guardian.document_number,
            phone: guardian.phone,
            relationship: guardian.relationship,
          });
        });

        await Promise.all(guardianPromises);
      }

      return patient;
    },
    onSuccess: () => {
      // Invalidar queries para refrescar la lista de pacientes
      queryClient.invalidateQueries({
        queryKey: PATIENTS_QUERY_KEY,
      });
    },
  });
}