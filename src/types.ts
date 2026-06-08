// TáNaMão Brasil - Definições de Tipos TypeScript (Espelhadas no PostgreSQL/Supabase Schema)

export type UserRole = 'client' | 'professional' | 'admin';
export type PlanLevel = 'free' | 'featured' | 'premium';
export type SubscriptionStatus = 'pending' | 'active' | 'inactive' | 'expired';
export type ReportReason = 'fake_phone' | 'abuse' | 'fraud' | 'inappropriate_content' | 'other';
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  nome: string;
  slug: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface Cidade {
  id: string;
  nome: string;
  estado: string;
  slug: string;
}

export interface Professional {
  id: string;
  user_id: string;
  full_name: string;
  slug: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  bio: string;
  avatar_url?: string;
  plan_type: string;
  rating_avg: number;
  rating_count: number;
  click_count: number;
  views_count: number;
  ranking_score: number;
  verified: boolean;
  active: boolean;
  is_company?: boolean;
  created_at: string;
  updated_at: string;
}

export type LeadEventType = 'PROFILE_VIEW' | 'WHATSAPP_CLICK' | 'PHONE_CLICK' | 'PORTFOLIO_VIEW' | 'REVIEW_CREATED';

export interface LeadEvent {
  id: string;
  professional_id: string;
  client_id?: string;
  event_type: LeadEventType;
  metadata?: any;
  created_at: string;
}

export interface Payment {
  id: string;
  professional_id: string;
  subscription_id: string;
  mercado_pago_id: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled' | 'refunded';
  payment_method: string;
  created_at: string;
}

export interface ProfessionalCategory {
  professional_id: string;
  category_id: string;
}

export interface ProfessionalPhoto {
  id: string;
  professional_id: string;
  photo_url: string;
  created_at: string;
}

export interface Review {
  id: string;
  professional_id: string;
  client_id: string;
  rating: number; // 1 to 5
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  reported_by: string;
  professional_id: string;
  review_id?: string | null;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  photos_limit: number;
  has_badge: boolean;
  priority_level: number; // 0: Free, 1: Featured, 2: Premium
  created_at: string;
}

export interface Subscription {
  id: string;
  profissional_id: string;
  plano: string;
  status: string;
  mercado_pago_id?: string;
  plan_id?: string; // Kept for UI compatibility if needed
  expires_at?: string; // Kept for UI compatibility
  valor: number;
  inicio: string;
  fim: string;
  created_at: string;
  updated_at: string;
  external_reference?: string;
  payment_method?: string;
  webhook_payload?: any;
}

export interface LeadBalance {
  id: string;
  profissional_id: string;
  saldo: number;
  updated_at: string;
}

export interface AuditLog {
  id?: string;
  actor_id: string;
  table_name: string;
  record_id: string;
  action: string;
  old_data?: any;
  new_data?: any;
  created_at?: string;
}
