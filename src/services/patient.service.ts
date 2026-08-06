/**
 * Servicio de Pacientes
 * Maneja todas las operaciones relacionadas con pacientes
 */

import { supabase } from "@/lib/supabase";
import { Patient, Guardian } from "@/types";

interface CreatePatientPayload {
  full_name: string;
  phone?: string;
  document_type_id: number;
  document_number: string;
  birth_date?: string;
  is_minor: boolean;
}

interface CreateGuardianPayload {
  patient_id: string;
  full_name: string;
  document_type_id: number;
  document_number: string;
  phone: string;
  relationship: string;
}

export class PatientService {
  /**
   * Obtiene todos los pacientes con info de perfil
   */
  static async getAllPatients(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from("patients")
      .select("*, profile:profiles(full_name,phone)")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error al obtener pacientes: ${error.message}`);
    }

    const rows = (data as Array<Patient & { profile?: { full_name: string; phone?: string } }>) || [];
    return rows.map((patient) => ({
      ...patient,
      profile: patient.profile,
    }));
  }

  /**
   * Busca pacientes por nombre o documento
   */
  static async searchPatients(searchTerm: string): Promise<Patient[]> {
    const { data, error } = await supabase
      .from("patients")
      .select("*, profile:profiles(full_name,phone)")
      .or(`profile.full_name.ilike.%${searchTerm}%,document_number.ilike.%${searchTerm}%`)
      .limit(50);

    if (error) {
      throw new Error(`Error al buscar pacientes: ${error.message}`);
    }

    const rows = (data as Array<Patient & { profile?: { full_name: string; phone?: string } }>) || [];
    return rows.map((patient) => ({ ...patient, profile: patient.profile }));
  }

  /**
   * Obtiene un paciente por ID con perfil
   */
  static async getPatientById(patientId: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from("patients")
      .select("*, profile:profiles(full_name,phone)")
      .eq("id", patientId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Error al obtener paciente: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return { ...data, profile: (data as any).profile };
  }

  /**
   * Crea perfil de usuario (en tabla profiles)
   */
  private static async createProfile(full_name: string, phone?: string) {
    const { data, error } = await supabase
      .from("profiles")
      .insert([{ full_name, phone }])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear perfil: ${error.message}`);
    }

    return data;
  }

  /**
   * Crea paciente (profiles + patients)
   */
  static async createPatient(payload: CreatePatientPayload): Promise<Patient> {
    const profile = await this.createProfile(payload.full_name, payload.phone);

    const { data, error } = await supabase
      .from("patients")
      .insert([
        {
          profile_id: profile.id,
          document_type_id: payload.document_type_id,
          document_number: payload.document_number,
          birth_date: payload.birth_date || null,
          is_minor: payload.is_minor,
        },
      ])
      .select("*, profile:profiles(full_name,phone)")
      .single();

    if (error) {
      throw new Error(`Error al crear paciente: ${error.message}`);
    }

    return { ...(data as any), profile: (data as any).profile };
  }

  /**
   * Obtiene tutores asociados a un paciente
   */
  static async getGuardians(patientId: string): Promise<Guardian[]> {
    const { data, error } = await supabase
      .from("patient_guardians")
      .select("guardian:guardians(*)")
      .eq("patient_id", patientId);

    if (error) {
      throw new Error(`Error al obtener tutores: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
      ...item.guardian,
      id: item.guardian.id,
      document_type_id: item.guardian.document_type_id,
      document_number: item.guardian.document_number,
      full_name: item.guardian.full_name,
      phone: item.guardian.phone,
    }));
  }

  /**
   * Crea tutor y relación patient_guardians
   */
  static async createGuardian(payload: CreateGuardianPayload): Promise<Guardian> {
    const { data: guardianData, error: guardianError } = await supabase
      .from("guardians")
      .insert([
        {
          full_name: payload.full_name,
          document_type_id: payload.document_type_id,
          document_number: payload.document_number,
          phone: payload.phone,
        },
      ])
      .select()
      .single();

    if (guardianError) {
      throw new Error(`Error al crear tutor: ${guardianError.message}`);
    }

    const { error: joinError } = await supabase
      .from("patient_guardians")
      .insert([
        {
          patient_id: payload.patient_id,
          guardian_id: guardianData.id,
          relationship: payload.relationship,
          is_primary: true,
        },
      ]);

    if (joinError) {
      throw new Error(`Error al vincular tutor con paciente: ${joinError.message}`);
    }

    return guardianData as Guardian;
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
      .select("*, profile:profiles(full_name,phone)")
      .single();

    if (error) {
      throw new Error(`Error al actualizar paciente: ${error.message}`);
    }

    return { ...(data as any), profile: (data as any).profile };
  }

  /**
   * Elimina un paciente
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
   * Actualiza un tutor
   */
  static async updateGuardian(guardianId: string, updates: Partial<Guardian>): Promise<Guardian> {
    const { data, error } = await supabase
      .from("guardians")
      .update(updates)
      .eq("id", guardianId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar tutor: ${error.message}`);
    }

    return data as Guardian;
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

