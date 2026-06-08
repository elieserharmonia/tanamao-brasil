// TáNaMão Brasil - Gerenciador de Banco de Dados Local Síncrono/Assíncrono (Supabase Bridge)
import { 
  Profile, Professional, Category, Cidade as City, Plan, Review, ProfessionalPhoto, Report, Subscription,
  UserRole, PlanLevel, SubscriptionStatus, ReportReason, ReportStatus
} from '../types';
import { 
  SEED_CATEGORIES, SEED_CITIES, SEED_PLANS, SEED_PROFILES, 
  SEED_PROFESSIONALS, SEED_PHOTOS, SEED_REVIEWS, SEED_PROFESSIONAL_CATEGORIES 
} from './seedData';

// Chaves para o LocalStorage
const K_PROFILES = 'tnm_profiles';
const K_PROFESSIONALS = 'tnm_professionals';
const K_CATEGORIES = 'tnm_categories';
const K_CITIES = 'tnm_cities';
const K_REVIEWS = 'tnm_reviews';
const K_PHOTOS = 'tnm_photos';
const K_REPORTS = 'tnm_reports';
const K_SUBSCRIPTIONS = 'tnm_subscriptions';
const K_PROF_CATS = 'tnm_prof_cats';
const K_CURRENT_USER = 'tnm_current_user';

// Inicializa e seeds dados padrão caso o localStorage esteja zerado
export function initializeDB() {
  if (!localStorage.getItem(K_CATEGORIES)) {
    localStorage.setItem(K_CATEGORIES, JSON.stringify(SEED_CATEGORIES));
  }
  if (!localStorage.getItem(K_CITIES)) {
    localStorage.setItem(K_CITIES, JSON.stringify(SEED_CITIES));
  }
  if (!localStorage.getItem(K_PROFILES)) {
    localStorage.setItem(K_PROFILES, JSON.stringify(SEED_PROFILES));
  }
  if (!localStorage.getItem(K_PROFESSIONALS)) {
    localStorage.setItem(K_PROFESSIONALS, JSON.stringify(SEED_PROFESSIONALS));
  }
  if (!localStorage.getItem(K_PHOTOS)) {
    localStorage.setItem(K_PHOTOS, JSON.stringify(SEED_PHOTOS));
  }
  if (!localStorage.getItem(K_REVIEWS)) {
    localStorage.setItem(K_REVIEWS, JSON.stringify(SEED_REVIEWS));
  }
  if (!localStorage.getItem(K_PROF_CATS)) {
    localStorage.setItem(K_PROF_CATS, JSON.stringify(SEED_PROFESSIONAL_CATEGORIES));
  }
  if (!localStorage.getItem(K_REPORTS)) {
    localStorage.setItem(K_REPORTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(K_SUBSCRIPTIONS)) {
    // Semente de assinaturas ativas para roberto (Premium) e carlos (Featured)
    const subs: Subscription[] = [
      {
        id: 'sub-roberto',
        profissional_id: 'prof-roberto',
        plano: 'premium',
        status: 'active',
        mercado_pago_id: 'mp-990881',
        valor: 49.90,
        inicio: new Date().toISOString(),
        fim: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'sub-carlos',
        profissional_id: 'prof-carlos',
        plano: 'featured',
        status: 'active',
        mercado_pago_id: 'mp-771239',
        valor: 19.90,
        inicio: new Date().toISOString(),
        fim: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(K_SUBSCRIPTIONS, JSON.stringify(subs));
  }
}

// Helper genérico para ler
function readData<T>(key: string): T[] {
  initializeDB();
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// Helper genérico para salvar
function writeData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ============================================================================
// MÉTODOS DE CONSULTA E MUTACAO (MIMIC SUPABASE SDK)
// ============================================================================

export const dbService = {
  // --- AUTENTICAÇÃO E PERFIL ---
  getCurrentUser(): Profile | null {
    const userJson = localStorage.getItem(K_CURRENT_USER);
    if (!userJson) return null;
    return JSON.parse(userJson);
  },

  setCurrentUser(user: Profile | null): void {
    if (user) {
      localStorage.setItem(K_CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(K_CURRENT_USER);
    }
  },

  getProfiles(): Profile[] {
    return readData<Profile>(K_PROFILES);
  },

  saveProfile(profile: Profile): void {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === profile.id);
    if (index >= 0) {
      profiles[index] = { ...profiles[index], ...profile, updated_at: new Date().toISOString() };
    } else {
      profiles.push(profile);
    }
    writeData(K_PROFILES, profiles);

    // Se for o usuário conectado, atualiza a sessão local
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === profile.id) {
      this.setCurrentUser({ ...currentUser, ...profile });
    }
  },

  // --- CATEGORIAS ---
  getCategories(): Category[] {
    return readData<Category>(K_CATEGORIES);
  },

  addCategory(category: Category): void {
    const cats = this.getCategories();
    cats.push(category);
    writeData(K_CATEGORIES, cats);
  },

  // --- CIDADES ---
  getCities(): City[] {
    return readData<City>(K_CITIES);
  },

  // --- PROFISSIONAIS ---
  getProfessionals(): Professional[] {
    return readData<Professional>(K_PROFESSIONALS);
  },

  getProfessionalById(id: string): Professional | null {
    const pros = this.getProfessionals();
    return pros.find(p => p.id === id) || null;
  },

  saveProfessional(professional: Professional, categoryIds?: string[]): void {
    const pros = this.getProfessionals();
    const index = pros.findIndex(p => p.id === professional.id);
    const updated = { ...professional, updated_at: new Date().toISOString() };
    if (index >= 0) {
      pros[index] = { ...pros[index], ...updated };
    } else {
      pros.push(updated);
    }
    writeData(K_PROFESSIONALS, pros);

    // Se categorias forem enviadas, atualiza-as
    if (categoryIds) {
      let mapper = readData<{ professional_id: string; category_id: string }>(K_PROF_CATS);
      // Remove mapeamentos antigos
      mapper = mapper.filter(item => item.professional_id !== professional.id);
      // Insere novos
      categoryIds.forEach(catId => {
        mapper.push({ professional_id: professional.id, category_id: catId });
      });
      writeData(K_PROF_CATS, mapper);
    }
  },

  getProfessionalCategories(proId: string): string[] {
    const mapper = readData<{ professional_id: string; category_id: string }>(K_PROF_CATS);
    return mapper.filter(m => m.professional_id === proId).map(m => m.category_id);
  },

  incrementClickCount(proId: string): void {
    const pros = this.getProfessionals();
    const index = pros.findIndex(p => p.id === proId);
    if (index >= 0) {
      pros[index].click_count = (pros[index].click_count || 0) + 1;
      writeData(K_PROFESSIONALS, pros);
    }
  },

  // --- PORTFÓLIO (FOTOS) ---
  getPhotosByProfessional(proId: string): ProfessionalPhoto[] {
    const photos = readData<ProfessionalPhoto>(K_PHOTOS);
    return photos.filter(p => p.professional_id === proId);
  },

  getAllPhotos(): ProfessionalPhoto[] {
    return readData<ProfessionalPhoto>(K_PHOTOS);
  },

  uploadPhoto(photo: ProfessionalPhoto): void {
    const photos = readData<ProfessionalPhoto>(K_PHOTOS);
    photos.push(photo);
    writeData(K_PHOTOS, photos);
  },

  deletePhoto(photoId: string): void {
    let photos = readData<ProfessionalPhoto>(K_PHOTOS);
    photos = photos.filter(p => p.id !== photoId);
    writeData(K_PHOTOS, photos);
  },

  setPhotoStatus(photoId: string, approved: boolean): void {
    // No-op or keep for local audit if needed, but schema removed is_approved
    // const photos = readData<ProfessionalPhoto>(K_PHOTOS);
    // ...
  },

  // --- AVALIAÇÕES (REVIEWS) ---
  getReviewsByProfessional(proId: string): Review[] {
    const reviews = readData<Review>(K_REVIEWS);
    return reviews.filter(r => r.professional_id === proId && r.is_approved);
  },

  getAllReviews(): Review[] {
    return readData<Review>(K_REVIEWS);
  },

  submitReview(review: Review): void {
    const reviews = readData<Review>(K_REVIEWS);
    // Impede avaliações repetidas do mesmo cliente para o mesmo profissional
    const index = reviews.findIndex(r => r.client_id === review.client_id && r.professional_id === review.professional_id);
    if (index >= 0) {
      reviews[index] = review;
    } else {
      reviews.push(review);
    }
    writeData(K_REVIEWS, reviews);

    // Recalcula métricas do profissional (espelhando a trigger SQL)
    this.recalculateProfessionalRating(review.professional_id);
  },

  setReviewApproval(reviewId: string, approved: boolean): void {
    const reviews = readData<Review>(K_REVIEWS);
    const idx = reviews.findIndex(r => r.id === reviewId);
    if (idx >= 0) {
      reviews[idx].is_approved = approved;
      writeData(K_REVIEWS, reviews);
      this.recalculateProfessionalRating(reviews[idx].professional_id);
    }
  },

  deleteReview(reviewId: string): void {
    const reviews = readData<Review>(K_REVIEWS);
    const idx = reviews.findIndex(r => r.id === reviewId);
    if (idx >= 0) {
      reviews.splice(idx, 1);
      writeData(K_REVIEWS, reviews);
    }
  },

  recalculateProfessionalRating(proId: string): void {
    const reviews = this.getReviewsByProfessional(proId);
    const count = reviews.length;
    const avg = count > 0 
      ? parseFloat((reviews.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(2))
      : 0.00;

    const pros = this.getProfessionals();
    const proIdx = pros.findIndex(p => p.id === proId);
    if (proIdx >= 0) {
      pros[proIdx].rating_avg = avg;
      pros[proIdx].rating_count = count;
      writeData(K_PROFESSIONALS, pros);
    }
  },

  // --- DENÚNCIAS (REPORTS) ---
  submitReport(report: Report): void {
    const reports = readData<Report>(K_REPORTS);
    reports.push(report);
    writeData(K_REPORTS, reports);
  },

  getReports(): Report[] {
    return readData<Report>(K_REPORTS);
  },

  setReportStatus(reportId: string, status: ReportStatus): void {
    const reports = readData<Report>(K_REPORTS);
    const idx = reports.findIndex(r => r.id === reportId);
    if (idx >= 0) {
      reports[idx].status = status;
      reports[idx].updated_at = new Date().toISOString();
      writeData(K_REPORTS, reports);
    }
  },

  // --- ASSINATURAS E PLANOS ---
  getPlans(): Plan[] {
    return SEED_PLANS; // Leitura estática garantida
  },

  getSubscriptions(): Subscription[] {
    return readData<Subscription>(K_SUBSCRIPTIONS);
  },

  getActiveSubscription(proId: string): Subscription | null {
    const subs = this.getSubscriptions();
    const sub = subs.find(s => s.profissional_id === proId && s.status === 'active');
    if (!sub) return null;
    // Verifica se expirou
    if (new Date(sub.fim) < new Date()) {
      sub.status = 'expired';
      this.saveSubscription(sub);
      return null;
    }
    return sub;
  },

  saveSubscription(sub: Subscription): void {
    const subs = this.getSubscriptions();
    const idx = subs.findIndex(s => s.id === sub.id || (s.profissional_id === sub.profissional_id && s.status === 'active'));
    if (idx >= 0) {
      subs[idx] = { ...subs[idx], ...sub, updated_at: new Date().toISOString() };
    } else {
      subs.push(sub);
    }
    writeData(K_SUBSCRIPTIONS, subs);

    // Ao atualizar a assinatura, atualiza o plan_type no portfólio profissional correspondente!
    const level = sub.plano as PlanLevel;
    const pro = this.getProfessionalById(sub.profissional_id);
    if (pro) {
      pro.plan_type = level;
      this.saveProfessional(pro);
    }
  },

  // --- REGISTRO EXTRA ---
  registerProfessionalAccount(email: string, fullName: string, bio: string, whatsapp: string, address: string, cityId: string, categoryIds: string[]): Profile {
    const newId = 'prof_' + Math.random().toString(36).substr(2, 9);
    
    // Perfil
    const profile: Profile = {
      id: newId,
      email,
      full_name: fullName,
      avatar_url: `https://images.unsplash.com/photo-${['1507003211169-0a1dd7228f2d', '1500648767791-00dcc994a43e', '1573496359142-b8d87734a5a2', '1540569014015-19a7be504e3a'][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&q=80&w=150`,
      role: 'professional',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Profissional
    const professional: Professional = {
      id: newId,
      user_id: newId,
      full_name: fullName,
      slug: fullName.toLowerCase().replace(/ /g, '-'),
      phone: whatsapp,
      whatsapp,
      email,
      city: 'São Paulo', // Fallback for local DB
      state: 'SP',     // Fallback for local DB
      bio,
      plan_type: 'free',
      ranking_score: 0,
      rating_avg: 0,
      rating_count: 0,
      click_count: 0,
      views_count: 0,
      verified: false,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.saveProfile(profile);
    this.saveProfessional(professional, categoryIds);

    return profile;
  },

  registerClientAccount(email: string, fullName: string): Profile {
    const newId = 'cli_' + Math.random().toString(36).substr(2, 9);
    const profile: Profile = {
      id: newId,
      email,
      full_name: fullName,
      avatar_url: `https://images.unsplash.com/photo-${['1534528741775-53994a69daeb', '1535713875002-d1d0cf377fde', '1494790108377-be9c29b29330', '1560250097-0b93528c311a'][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&q=80&w=150`,
      role: 'client',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.saveProfile(profile);
    return profile;
  }
};
