/**
 * Servicio local del módulo de pacientes
 * Proporciona acceso a las operaciones de pacientes
 */

import { PatientService as GlobalPatientService } from "@/services/patient.service";
import { Patient, Guardian } from "@/types";

export class PatientService {
  /**
   * Crea un nuevo paciente
   */
  static async createPatient(patient: {
    full_name: string;
    phone?: string;
    document_type_id: number;
    document_number: string;
    birth_date?: string;
    is_minor: boolean;
  }): Promise<Patient> {
    return GlobalPatientService.createPatient(patient);
  }

  /**
   * Crea un nuevo tutor para un paciente menor
   */
  static async createGuardian(guardian: {
    patient_id: string;
    full_name: string;
    document_type_id: number;
    document_number: string;
    phone: string;
    relationship: string;
  }): Promise<Guardian> {
    return GlobalPatientService.createGuardian(guardian);
  }

  /**
   * Obtiene los tutores de un paciente menor
   */
  static async getGuardians(patientId: string): Promise<Guardian[]> {
    return GlobalPatientService.getGuardians(patientId);
  }
}