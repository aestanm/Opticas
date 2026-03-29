/**
 * Servicio de Pacientes
 * Maneja todas las operaciones relacionadas con pacientes
 */

import { supabase } from "@/lib/supabase";
import { Patient, Guardian } from "@/types";

export class PatientService {
  /**
   * Obtiene todos los pacientes del tenant actual
   */
  static async getAllPatients(tenantId: string): Promise<Patient[]> {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error al obtener pacientes: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Obtiene un paciente por ID
   */
  static async getPatientById(patientId: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Error al obtener paciente: ${error.message}`);
    }

    return data || null;
  }

  /**
   * Crea un nuevo paciente
   */
  static async createPatient(patient: {
    tenant_id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    date_of_birth: string;
    is_minor: boolean;
    identification_number?: string;
  }): Promise<Patient> {
    const { data, error } = await supabase
      .from("patients")
      .insert([patient])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear paciente: ${error.message}`);
    }

    return data;
  }

  /**
   * Actualiza un paciente
   */
  static async updatePatient(
    patientId: string,
    updates: Partial<Patient>
  ): Promise<Patient> {
    const { data, error } = await supabase
      .from("patients")
      .update(updates)
      .eq("id", patientId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar paciente: ${error.message}`);
    }

    return data;
  }

  /**
   * Elimina un paciente (soft delete si es necesario)
   */
  static async deletePatient(patientId: string): Promise<void> {
    const { error } = await supabase
      .from("patients")
      .delete()
      .eq("id", patientId);

    if (error) {
      throw new Error(`Error al eliminar paciente: ${error.message}`);
    }
  }

  /**
   * Busca pacientes por nombre
   */
  static async searchPatients(
    tenantId: string,
    searchTerm: string
  ): Promise<Patient[]> {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("tenant_id", tenantId)
      .or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
      )
      .limit(20);

    if (error) {
      throw new Error(`Error al buscar pacientes: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Obtiene los tutores de un paciente menor
   */
  static async getGuardians(patientId: string): Promise<Guardian[]> {
    const { data, error } = await supabase
      .from("guardians")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error al obtener tutores: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Crea un nuevo tutor para un paciente menor
   */
  static async createGuardian(guardian: {
    tenant_id: string;
    patient_id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone: string;
    relationship: string;
  }): Promise<Guardian> {
    const { data, error } = await supabase
      .from("guardians")
      .insert([guardian])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear tutor: ${error.message}`);
    }

    return data;
  }

  /**
   * Actualiza un tutor
   */
  static async updateGuardian(
    guardianId: string,
    updates: Partial<Guardian>
  ): Promise<Guardian> {
    const { data, error } = await supabase
      .from("guardians")
      .update(updates)
      .eq("id", guardianId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar tutor: ${error.message}`);
    }

    return data;
  }

  /**
   * Elimina un tutor
   */
  static async deleteGuardian(guardianId: string): Promise<void> {
    const { error } = await supabase
      .from("guardians")
      .delete()
      .eq("id", guardianId);

    if (error) {
      throw new Error(`Error al eliminar tutor: ${error.message}`);
    }
  }
}
