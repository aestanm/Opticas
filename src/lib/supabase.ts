/**
 * Configuración del cliente de Supabase
 * Inicializa la conexión con Supabase usando el SDK de JavaScript
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Las variables de ambiente NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY no están configuradas"
  );
}

/**
 * Cliente de Supabase para operaciones cliente
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Obtiene la sesión actual del usuario autenticado
 */
export async function getAuthSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Obtiene el usuario actual autenticado
 */
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
