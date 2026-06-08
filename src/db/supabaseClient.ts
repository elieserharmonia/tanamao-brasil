// TáNaMão Brasil - Cliente Supabase com Segurança e Inicialização Preguiçosa
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

/**
 * Retorna o cliente Supabase padrão (lado do cliente / público)
 */
export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  // Em navegadores, podemos acessar os dados do ambiente via import.meta.env, 
  // e no Node.js corporativo através do process.env
  const supabaseUrl = typeof window !== 'undefined'
    ? (((import.meta as any).env?.VITE_SUPABASE_URL) || '')
    : (process.env.SUPABASE_URL || '');
    
  const supabaseAnonKey = typeof window !== 'undefined'
    ? (((import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || '')
    : (process.env.SUPABASE_ANON_KEY || '');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '⚠️ Supabase URL ou Anon Key não configurados. Usando armazenamento local em cache por padrão.'
    );
    return null;
  }

  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseClient;
  } catch (error) {
    console.error('Falha ao instanciar o cliente do Supabase:', error);
    return null;
  }
}

/**
 * Retorna o cliente administrativo Supabase (com bypass de RLS no servidor)
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (typeof window !== 'undefined') {
    throw new Error('O cliente Admin do Supabase (Service Role) só pode ser executado no servidor backend!');
  }

  if (supabaseAdminClient) return supabaseAdminClient;

  const supabaseUrl = process.env.SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn(
      '⚠️ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausente. Os endpoints do servidor usarão simulações sincronizadas.'
    );
    return null;
  }

  try {
    supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
    return supabaseAdminClient;
  } catch (error) {
    console.error('Falha ao inicializar o administrador do Supabase:', error);
    return null;
  }
}
