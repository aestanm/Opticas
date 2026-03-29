/**
 * Servicio de Autenticación
 * Maneja login, logout y obtención de usuario actual
 */

import { supabase } from "@/lib/supabase";
import { User } from "@/types";

export class AuthService {
  /**
   * Realiza login con email y contraseña
   */
  static async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Realiza logout
   */
  static async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Obtiene el usuario actual
   */
  static async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || "",
      created_at: user.created_at || "",
      updated_at: user.updated_at || "",
    };
  }

  /**
   * Obtiene la sesión actual
   */
  static async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    return session;
  }

  /**
   * Se subscribe a cambios de autenticación
   */
  static onAuthStateChange(
    callback: (event: string | null, session: any) => void
  ) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);

    return subscription;
  }
}
