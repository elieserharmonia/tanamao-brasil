import { supabase } from './supabase';
import { storageService } from './storageService';
import { 
  Profile, Professional, Category, Cidade as City, Review, ProfessionalPhoto, Subscription,
  UserRole, AuditLog, LeadBalance, LeadEventType, Payment
} from '../types';

export interface FinancialMetrics {
  mrr: number;
  arr: number;
  active_subscriptions: number;
  average_ticket: number;
  churn_rate: number;
  free_to_paid_ratio: number;
  ltv: number;
}

export const supabaseService = {
  // --- AUTH ---
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return profile as Profile | null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async signUp(email: string, password: string, fullName: string, role: UserRole = 'client') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role
        }
      }
    });

    if (error) throw error;
    return data.user;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data.user;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // --- DATA FETCHING ---
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data as Category[];
  },

  async getCities() {
    const { data, error } = await supabase
      .from('cidades')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data as City[];
  },

  async searchProfessionals(params: { categoryId?: string; cityId?: string; query?: string }) {
    try {
      let queryBuilder = supabase
        .from('professionals')
        .select(`
          *,
          categories:professional_categories (
            category:categories (*)
          )
        `)
        .eq('active', true);

      if (params.categoryId) {
        const { data: proIds } = await supabase
          .from('professional_categories')
          .select('professional_id')
          .eq('category_id', params.categoryId);
        
        if (proIds) {
          queryBuilder = queryBuilder.in('id', proIds.map(i => i.professional_id));
        }
      }

      if (params.cityId) {
        const { data: cityData } = await supabase
          .from('cidades')
          .select('nome')
          .eq('id', params.cityId)
          .single();

        if (cityData) {
          queryBuilder = queryBuilder.eq('city', cityData.nome);
        }
      }

      if (params.query) {
        queryBuilder = queryBuilder.or(`full_name.ilike.%${params.query}%,bio.ilike.%${params.query}%`);
      }

      const { data, error } = await queryBuilder;
      if (error) throw error;

      // Ranking Score Logic (Sprint 3 Specs):
      // Premium +100 | Destaque +50 | Verificado +30 | Avaliações +20 | Portfólio +10 | Ativo +5
      return (data || []).map(p => {
        let score = 0;
        if (p.plan_type === 'premium') score += 100;
        else if (p.plan_type === 'featured') score += 50;
        
        if (p.verified) score += 30;
        if ((p.rating_count || 0) > 0) score += 20;
        if ((p.portfolio_count || (p.photos?.length || 0)) > 0) score += 10;
        if (p.active) score += 5;
        
        return { ...p, ranking_score: score };
      }).sort((a, b) => (b.ranking_score || 0) - (a.ranking_score || 0));
    } catch (error) {
      console.error('Error searching professionals:', error);
      throw error;
    }
  },

  async getProfessionalById(id: string) {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select(`
          *,
          categories:professional_categories (
            category:categories (*)
          ),
          photos:professional_photos (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Update views_count directly (soft-audit-like)
      try {
        await supabase.rpc('increment_professional_views', { pro_id: id });
      } catch (err) {
        // Fallback or ignore if RPC not setup
      }
      
      const reviews = await this.getReviewsByProfessional(id);
      return { ...data, reviews };
    } catch (error) {
      console.error('Error getting professional by ID:', error);
      throw error;
    }
  },

  async getReviewsByProfessional(professionalId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          client:profiles (*)
        `)
        .eq('professional_id', professionalId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01' || error.message.includes('not found')) {
            return [];
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.warn('Could not fetch reviews:', error);
      return [];
    }
  },

  // --- LEADS & ANALYTICS ---
  async trackEvent(professionalId: string, eventType: LeadEventType, clientId?: string, metadata: any = {}) {
    try {
      await supabase
        .from('lead_events')
        .insert({
          professional_id: professionalId,
          client_id: clientId,
          event_type: eventType,
          metadata: { ...metadata, timestamp: new Date().toISOString() }
        });
      
      if (eventType === 'WHATSAPP_CLICK') {
        await supabase.rpc('increment_professional_clicks', { pro_id: professionalId });
      } else if (eventType === 'PROFILE_VIEW') {
        await supabase.rpc('increment_professional_views', { pro_id: professionalId });
      }
    } catch (err) {
      console.warn('Event tracking failed:', err);
    }
  },

  async trackLead(professionalId: string) {
    return this.trackEvent(professionalId, 'WHATSAPP_CLICK');
  },

  async trackPageView(professionalId: string) {
    return this.trackEvent(professionalId, 'PROFILE_VIEW');
  },

  async trackPortfolioView(professionalId: string) {
    return this.trackEvent(professionalId, 'PORTFOLIO_VIEW');
  },

  async getAnalytics(professionalId: string, range: 'today' | '7d' | '30d' | 'all' = '30d') {
    try {
      let query = supabase.from('lead_events').select('*').eq('professional_id', professionalId);
      
      const now = new Date();
      if (range === 'today') {
        const today = new Date(now.setHours(0,0,0,0)).toISOString();
        query = query.gte('created_at', today);
      } else if (range === '7d') {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7)).toISOString();
        query = query.gte('created_at', sevenDaysAgo);
      } else if (range === '30d') {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30)).toISOString();
        query = query.gte('created_at', thirtyDaysAgo);
      }

      const { data, error } = await query;
      if (error) throw error;

      return {
        total: data.filter(e => e.event_type === 'WHATSAPP_CLICK').length,
        period: data.length, 
        views: data.filter(e => e.event_type === 'PROFILE_VIEW').length,
        whatsapp: data.filter(e => e.event_type === 'WHATSAPP_CLICK').length,
        phones: data.filter(e => e.event_type === 'PHONE_CLICK').length,
        portfolio: data.filter(e => e.event_type === 'PORTFOLIO_VIEW').length,
        reviews: data.filter(e => e.event_type === 'REVIEW_CREATED').length,
        events: data
      };
    } catch (error) {
      console.error('Analytics failed:', error);
      return { views: 0, whatsapp: 0, phones: 0, portfolio: 0, reviews: 0, total: 0, period: 0, events: [] };
    }
  },

  async getLeadBalance(professionalId: string) {
    try {
      const { data, error } = await supabase
        .from('saldo_leads')
        .select('saldo')
        .eq('profissional_id', professionalId)
        .maybeSingle();
      
      if (error) throw error;
      return data?.saldo || 0;
    } catch (error) {
      console.error('Error getting lead balance:', error);
      return 0;
    }
  },

  async addLeadBalance(professionalId: string, amount: number) {
    try {
      const currentBalance = await this.getLeadBalance(professionalId);
      const { error } = await supabase
        .from('saldo_leads')
        .upsert({
          profissional_id: professionalId,
          saldo: currentBalance + amount,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error adding lead balance:', error);
      throw error;
    }
  },

  // --- SUBSCRIPTIONS & PLANS ---
  async getSubscription(professionalId: string) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('profissional_id', professionalId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return data as Subscription | null;
    } catch (error) {
      console.error('Error getting subscription:', error);
      return null;
    }
  },

  async getProfessionalPlan(professionalId: string): Promise<string> {
    const subscription = await this.getSubscription(professionalId);
    if (!subscription) return 'free';
    return subscription.plano || 'free';
  },

  // --- PROFESSIONAL MANAGEMENT ---
  async registerProfessional(id: string, data: Partial<Professional>, categoryIds: string[]) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. Update Profile Role
      await supabase.from('profiles').update({ role: 'professional' }).eq('id', id);

      // 2. Create Professional Record
      const { error: proError } = await supabase
        .from('professionals')
        .upsert({
          id,
          user_id: id,
          ...data,
          plan_type: 'free',
          active: true,
          updated_at: new Date().toISOString()
        });

      if (proError) throw proError;

      // 3. Link Categories
      if (categoryIds.length > 0) {
        const links = categoryIds.map(catId => ({
          professional_id: id,
          category_id: catId
        }));
        await supabase.from('professional_categories').insert(links);
      }

      // 4. Audit Log
      await this.createAuditLog({
        actor_id: user?.id || id,
        table_name: 'professionals',
        record_id: id,
        action: 'REGISTER',
        new_data: { ...data, role: 'professional' }
      });
    } catch (error) {
      console.error('Error registering professional:', error);
      throw error;
    }
  },

  async updateProfessional(id: string, fullName: string, data: Partial<Professional>, categoryIds: string[]) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: oldPro } = await supabase.from('professionals').select('*').eq('id', id).single();

      // 1. Update Profile
      await supabase.from('profiles').update({ full_name: fullName }).eq('id', id);

      // 2. Update Professional
      const { error: proError } = await supabase
        .from('professionals')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (proError) throw proError;

      // 3. Sync Categories
      await supabase.from('professional_categories').delete().eq('professional_id', id);
      if (categoryIds.length > 0) {
        const links = categoryIds.map(catId => ({
          professional_id: id,
          category_id: catId
        }));
        await supabase.from('professional_categories').insert(links);
      }

      // 4. Audit Log
      await this.createAuditLog({
        actor_id: user?.id || id,
        table_name: 'professionals',
        record_id: id,
        action: 'UPDATE',
        old_data: oldPro,
        new_data: data
      });
    } catch (error) {
      console.error('Error updating professional:', error);
      throw error;
    }
  },

  // --- STORAGE & ASSETS ---
  async updateAvatar(userId: string, file: File) {
    try {
      const { publicUrl } = await storageService.uploadFile('avatars', userId, file);
      
      await Promise.all([
        supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId),
        supabase.from('professionals').update({ avatar_url: publicUrl }).eq('id', userId)
      ]);

      await this.createAuditLog({
        actor_id: userId,
        table_name: 'profiles',
        record_id: userId,
        action: 'UPLOAD_AVATAR',
        new_data: { avatar_url: publicUrl }
      });
      
      return publicUrl;
    } catch (error) {
      console.error('Update avatar failed:', error);
      throw error;
    }
  },

  async addPhoto(professionalId: string, file: File) {
    try {
      const { publicUrl } = await storageService.uploadFile('portfolios', professionalId, file);
      
      const { data, error } = await supabase
        .from('professional_photos')
        .insert({
          professional_id: professionalId,
          photo_url: publicUrl
        })
        .select()
        .single();
      
      if (error) throw error;

      await this.createAuditLog({
        actor_id: professionalId,
        table_name: 'professional_photos',
        record_id: data.id,
        action: 'UPLOAD_PORTFOLIO',
        new_data: { photo_url: publicUrl }
      });

      return publicUrl;
    } catch (error) {
      console.error('Add photo failed:', error);
      throw error;
    }
  },

  async addDocument(professionalId: string, file: File, name: string) {
    try {
      const { publicUrl } = await storageService.uploadFile('documents', professionalId, file);
      
      const { data, error } = await supabase
        .from('professional_documents')
        .insert({
          professional_id: professionalId,
          document_url: publicUrl,
          name
        })
        .select()
        .single();
      
      if (error) throw error;

      await this.createAuditLog({
        actor_id: professionalId,
        table_name: 'professional_documents',
        record_id: data.id,
        action: 'UPLOAD_DOCUMENT',
        new_data: { name, document_url: publicUrl }
      });

      return publicUrl;
    } catch (error) {
      console.error('Add document failed:', error);
      throw error;
    }
  },

  async getProfessionalDocuments(professionalId: string) {
    const { data, error } = await supabase
      .from('professional_documents')
      .select('*')
      .eq('professional_id', professionalId);
    
    if (error) {
       if (error.code === '42P01') return []; // Table may not exist yet
       throw error;
    }
    return data;
  },

  async deleteDocument(professionalId: string, docId: string, docUrl: string) {
    try {
      await supabase.from('professional_documents').delete().eq('id', docId);
      
      const urlParts = docUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${professionalId}/${fileName}`;
      await storageService.deleteFile('documents', filePath);

      await this.createAuditLog({
        actor_id: professionalId,
        table_name: 'professional_documents',
        record_id: docId,
        action: 'DELETE_DOCUMENT'
      });
    } catch (error) {
      console.error('Delete document failed:', error);
      throw error;
    }
  },

  async deletePhoto(professionalId: string, photoId: string, photoUrl: string) {
    try {
      // 1. Remove from DB
      const { error: dbError } = await supabase
        .from('professional_photos')
        .delete()
        .eq('id', photoId);
      
      if (dbError) throw dbError;

      // 2. Remove from Storage
      // Extraction of path from URL is tricky if not stored separately
      // For now, we assume simple path structure or we'd need to store filePath in DB
      // Assuming storage service removal by full URL or derived path
      const urlParts = photoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${professionalId}/${fileName}`;
      
      await storageService.deleteFile('portfolios', filePath);

      await this.createAuditLog({
        actor_id: professionalId,
        table_name: 'professional_photos',
        record_id: photoId,
        action: 'DELETE_PORTFOLIO'
      });
    } catch (error) {
      console.error('Delete photo failed:', error);
      throw error;
    }
  },

  async getPhotosCount(professionalId: string): Promise<number> {
    const { count, error } = await supabase
      .from('professional_photos')
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', professionalId);
    
    if (error) throw error;
    return count || 0;
  },

  async submitReview(data: Partial<Review>) {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({ ...data, is_approved: true });
      
      if (error) {
        if (error.code === '42P01') {
          console.warn('Reviews table logic bypassed (Table missing).');
          return;
        }
        throw error;
      }
    } catch (error) {
      console.warn('Review submission soft-fail:', error);
    }
  },

  async createAuditLog(log: AuditLog) {
    try {
      const { error } = await supabase.from('audit_logs').insert(log);
      if (error) console.warn('Audit fail:', error);
    } catch (err) {
      console.warn('Audit exception:', err);
    }
  },

  // --- PAYMENTS ---
  // --- PAYMENTS & SUBSCRIPTIONS ---
  async getPaymentsHistory(professionalId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createSubscription(data: Partial<Subscription>) {
    try {
      const { data: sub, error } = await supabase
        .from('subscriptions')
        .insert({
          ...data,
          status: 'active',
          inicio: new Date().toISOString(),
          fim: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;

      await Promise.all([
        supabase.from('professionals').update({ plan_type: data.plano }).eq('user_id', data.profissional_id!),
        this.createAuditLog({
          actor_id: data.profissional_id!,
          table_name: 'subscriptions',
          record_id: sub.id,
          action: 'PLAN_UPGRADE',
          new_data: sub
        })
      ]);

      return sub;
    } catch (error) {
      console.error('Create subscription failed:', error);
      throw error;
    }
  },

  async getFinancialMetrics(): Promise<FinancialMetrics> {
    try {
      const [{ data: subs }, { data: allPros }] = await Promise.all([
        supabase.from('subscriptions').select('*').eq('status', 'active'),
        supabase.from('professionals').select('id, plan_type')
      ]);
      
      const mrr = (subs || []).reduce((acc, sub) => acc + (sub.valor || 0), 0);
      const activeCount = subs?.length || 0;
      const totalPros = allPros?.length || 1;
      const paidPros = allPros?.filter(p => p.plan_type !== 'free').length || 0;
      
      const averageTicket = activeCount > 0 ? mrr / activeCount : 0;
      const churnRate = 2.4; // Simulated
      
      return {
        mrr,
        arr: mrr * 12,
        active_subscriptions: activeCount,
        average_ticket: averageTicket,
        churn_rate: churnRate,
        free_to_paid_ratio: paidPros / totalPros,
        ltv: averageTicket * (100 / churnRate) // Simple LTV formula: ARPU / Churn
      };
    } catch (error) {
      console.error('Get financial metrics failed:', error);
      throw error;
    }
  },

  async trackPayment(payment: Partial<Payment>) {
    try {
      const { error } = await supabase.from('payments').insert(payment);
      if (error) throw error;
      
      await this.createAuditLog({
        actor_id: payment.professional_id!,
        table_name: 'payments',
        record_id: payment.mercado_pago_id!,
        action: 'PAYMENT_RECORDED',
        new_data: payment
      });
    } catch (error) {
      console.error('Payment tracking failed:', error);
    }
  }
};
