/**
 * Servicio de Citas
 * Maneja todas las operaciones relacionadas con citas
 */

import { supabase } from "@/lib/supabase";
import { Appointment } from "@/types";

export class AppointmentService {
  /**
   * Obtiene todas las citas de un tenant
   */
  static async getAllAppointments(tenantId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("scheduled_date", { ascending: true })
      .order("scheduled_time", { ascending: true });

    if (error) {
      throw new Error(`Error al obtener citas: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Obtiene citas de un paciente
   */
  static async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("patient_id", patientId)
      .order("scheduled_date", { ascending: false });

    if (error) {
      throw new Error(`Error al obtener citas del paciente: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Obtiene citas de un doctor en una fecha específica
   */
  static async getDoctorAppointmentsByDate(
    doctorId: string,
    date: string
  ): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("doctor_id", doctorId)
      .eq("scheduled_date", date)
      .order("scheduled_time", { ascending: true });

    if (error) {
      throw new Error(
        `Error al obtener citas del doctor: ${error.message}`
      );
    }

    return data || [];
  }

  /**
   * Obtiene citas de una rama en una fecha específica
   */
  static async getBranchAppointmentsByDate(
    branchId: string,
    date: string
  ): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("branch_id", branchId)
      .eq("scheduled_date", date)
      .order("scheduled_time", { ascending: true });

    if (error) {
      throw new Error(
        `Error al obtener citas de la rama: ${error.message}`
      );
    }

    return data || [];
  }

  /**
   * Obtiene una cita por ID
   */
  static async getAppointmentById(appointmentId: string): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Error al obtener cita: ${error.message}`);
    }

    return data || null;
  }

  /**
   * Crea una nueva cita
   */
  static async createAppointment(appointment: {
    tenant_id: string;
    branch_id: string;
    patient_id: string;
    doctor_id: string;
    scheduled_date: string;
    scheduled_time: string;
    status: string;
    notes?: string;
  }): Promise<Appointment> {
    const { data, error } = await supabase
      .from("appointments")
      .insert([appointment])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear cita: ${error.message}`);
    }

    return data;
  }

  /**
   * Actualiza una cita
   */
  static async updateAppointment(
    appointmentId: string,
    updates: Partial<Appointment>
  ): Promise<Appointment> {
    const { data, error } = await supabase
      .from("appointments")
      .update(updates)
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar cita: ${error.message}`);
    }

    return data;
  }

  /**
   * Cancela una cita
   */
  static async cancelAppointment(appointmentId: string): Promise<Appointment> {
    return this.updateAppointment(appointmentId, { status: "cancelled" });
  }

  /**
   * Obtiene citas dentro de un rango de fechas
   */
  static async getAppointmentsByDateRange(
    tenantId: string,
    startDate: string,
    endDate: string
  ): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("tenant_id", tenantId)
      .gte("scheduled_date", startDate)
      .lte("scheduled_date", endDate)
      .order("scheduled_date", { ascending: true });

    if (error) {
      throw new Error(
        `Error al obtener citas por rango: ${error.message}`
      );
    }

    return data || [];
  }
}
