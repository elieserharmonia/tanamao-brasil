import React from 'react';
import { 
  Star, MapPin, Send, MessageSquare, ShieldAlert, Sparkles, Award, PhoneCall, 
  ChevronLeft, ArrowUpRight, Camera, ThumbsUp, CheckCircle, Clock 
} from 'lucide-react';
import { dbService } from '../db/dbStorage';
import { supabaseService } from '../lib/supabaseService';
import { SEED_CATEGORIES, SEED_CITIES } from '../db/seedData';
import { Professional, Profile, Review, Report, ReportReason, ProfessionalPhoto } from '../types';
import SEO from './SEO';

interface ProfileDetailsViewProps {
  professionalId: string;
  currentUser: Profile | null;
  onNavigate: (view: string, params?: any) => void;
}

export default function ProfileDetailsView({ professionalId, currentUser, onNavigate }: ProfileDetailsViewProps) {
  const [activeTab, setActiveTab] = React.useState<'portfolio' | 'reviews'>('portfolio');
  const [loading, setLoading] = React.useState(true);
  
  // States for Review Form
  const [reviewRating, setReviewRating] = React.useState<number>(5);
  const [reviewComment, setReviewComment] = React.useState('');
  const [reviewSuccess, setReviewSuccess] = React.useState(false);
  const [reviewError, setReviewError] = React.useState('');

  // States for Report Form
  const [reportReason, setReportReason] = React.useState<ReportReason>('other');
  const [reportDetails, setReportDetails] = React.useState('');
  const [reportSuccess, setReportSuccess] = React.useState(false);
  const [reportModalOpen, setReportModalOpen] = React.useState(false);

  // Load state and profiles dynamically
  const [pro, setPro] = React.useState<any | null>(null);

  const handleTabChange = (tab: 'portfolio' | 'reviews') => {
    setActiveTab(tab);
    if (tab === 'portfolio' && pro) {
      supabaseService.trackPortfolioView(professionalId);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await supabaseService.getProfessionalById(professionalId);
      setPro(data);
      
      // Beta V1: Track specialized page view event
      if (data) {
        await supabaseService.trackPageView(professionalId);
      }
    } catch (e) {
      console.error('Error loading professional details:', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [professionalId]);

  if (loading) {
    return (
      <div className="bg-[#0D0D0D] text-white min-h-screen py-20 flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-[3px] border-brand-yellow/10 border-t-brand-yellow rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-yellow animate-pulse">Sincronizando Perfil...</p>
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="bg-[#0D0D0D] text-white min-h-screen py-20 text-center space-y-6">
        <p className="text-slate-500 font-medium">Profissional não cadastrado ou inativo.</p>
        <button 
          onClick={() => onNavigate('search')} 
          className="px-8 py-3 bg-brand-yellow rounded-xl text-black font-black text-xs uppercase tracking-widest transition-all hover:scale-105"
        >
          Voltar para as buscas
        </button>
      </div>
    );
  }

  const p = pro;
  if (!p) return null;

  const isPremium = pro.plan_type === 'premium';
  const isFeatured = pro.plan_type === 'featured';

  const categoryNames = pro.categories?.map((c: any) => c.category.nome) || [];
  const cityName = `${pro.city || ''} - ${pro.state || ''}`;

  // Increments click count and simulates loading WHATSAPP
  const handleWhatsAppClick = async () => {
    try {
      await supabaseService.trackLead(pro.id);
    } catch (e) {
      console.warn('Lead track failed:', e);
    }
    
    // Simulate opening WhatsApp link safely
    const customMessage = encodeURIComponent(`Olá, vi seu serviço de ${categoryNames[0] || 'profissional'} no TáNaMão Brasil e gostaria de solicitar um orçamento.`);
    const wpUrl = `https://api.whatsapp.com/send?phone=55${pro.whatsapp.replace(/\D/g, '')}&text=${customMessage}`;
    window.open(wpUrl, '_blank', 'noreferrer');
  };

  // Submit Review Form
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');

    if (!currentUser) {
      setReviewError('Você precisa fazer login para avaliar profissionais.');
      return;
    }

    if (currentUser.id === pro.id) {
      setReviewError('Profissionais não podem avaliar seus próprios perfis.');
      return;
    }

    if (reviewComment.trim().length < 10) {
      setReviewError('Sua avaliação deve conter um comentário de no mínimo 10 caracteres explicativos.');
      return;
    }

    try {
      await supabaseService.submitReview({
        professional_id: pro.id,
        client_id: currentUser.id,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewSuccess(true);
      setReviewComment('');
      loadData(); // reload avg/counts
    } catch (e: any) {
      setReviewError(e.message || 'Erro ao enviar avaliação.');
    }
  };

  // Submit Report Form
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert('Você precisa estar autenticado para registrar uma denúncia.');
      return;
    }

    if (reportDetails.trim().length === 0) {
      alert('Por favor, detalhe o comportamento inadequado observado.');
      return;
    }

    const newReport: Report = {
      id: 'rep_' + Math.random().toString(36).substr(2, 9),
      reported_by: currentUser.id,
      professional_id: pro.id,
      reason: reportReason,
      details: reportDetails,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    dbService.submitReport(newReport);
    setReportSuccess(true);
    setReportDetails('');
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSuccess(false);
    }, 2000);
  };

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen py-16 font-sans">
      <SEO 
        title={`${pro.full_name} | ${categoryNames[0] || 'Profissional'} em ${pro.city} | TáNaMão Brasil`}
        description={pro.bio?.substring(0, 160) || `Veja o perfil de ${pro.full_name}, ${categoryNames.join(', ')} em ${pro.city}. Avaliações Reais e Contato Direto.`}
        schema={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": pro.full_name,
          "description": pro.bio,
          "image": pro.avatar_url,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": pro.city,
            "addressRegion": pro.state,
            "addressCountry": "BR"
          },
          "aggregateRating": pro.rating_count > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": pro.rating_avg,
            "reviewCount": pro.rating_count
          } : undefined
        }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb row */}
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('search')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#121212] border border-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Voltar</span>
          </button>
          
          <button 
            onClick={() => setReportModalOpen(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-950/20 hover:bg-red-950/40 text-[10px] font-bold text-red-400 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Denunciar Conta</span>
          </button>
        </div>

        {/* Main profile header card */}
        <div className={`rounded-[40px] p-8 sm:p-12 border mb-12 shadow-2xl ${
          isPremium 
          ? 'border-brand-yellow/30 bg-gradient-to-br from-[#121212] via-[#121212] to-brand-yellow/[0.03] shadow-brand-yellow/5' 
          : 'border-white/5 bg-[#121212]'
        }`}>
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
            
            {/* Professional avatar & score badge */}
            <div className="relative shrink-0">
              <img 
                src={p.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=180'} 
                alt={p.full_name} 
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-[32px] border border-white/10 p-1.5 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black border border-white/10 text-[11px] font-black flex items-center space-x-1.5 shadow-2xl whitespace-nowrap">
                <Star className="w-3.5 h-3.5 text-brand-yellow fill-brand-yellow" />
                <span>{Number(pro.rating_avg || 0).toFixed(1)}</span>
              </div>
            </div>

            {/* Profile information details space */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter text-white italic uppercase">{p.full_name}</h1>
                  
      {pro.verified && (
                    <div className="flex items-center space-x-1.5 bg-brand-yellow/10 border border-brand-yellow/30 px-3 py-1.5 rounded-full text-brand-yellow">
                      <CheckCircle className="w-4 h-4 fill-brand-yellow/10" />
                      <span className="text-[10px] font-black uppercase tracking-widest italic">✓ Verificado</span>
                    </div>
                  )}

                  {isPremium && (
                    <span className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-brand-yellow text-black text-[9px] font-black uppercase tracking-widest italic shadow-xl shadow-brand-yellow/10">
                      <Sparkles className="w-4 h-4 fill-black" />
                      <span>PRIME PREMIUM</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <span className="flex items-center space-x-2 text-white italic">
                    <MapPin className="w-4 h-4 text-brand-yellow" />
                    <span>{cityName}</span>
                  </span>
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Score: {pro.ranking_score || 100}</span>
                  </div>
                </div>
              </div>

              {/* Badges / tag categories */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {categoryNames.map((catName, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-black border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-yellow">
                    {catName}
                  </span>
                ))}
              </div>
            </div>

            {/* Right block: CTA Direct connection */}
            <div className="shrink-0 pt-6 md:pt-4 w-full md:w-auto">
              <button 
                onClick={handleWhatsAppClick}
                className="group/wp relative w-full md:w-auto h-16 px-10 rounded-2xl bg-brand-yellow text-black font-display font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl shadow-brand-yellow/10 transition-all hover:scale-105"
              >
                <PhoneCall className="w-5 h-5 fill-black" />
                <span>CONTRATAR AGORA</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-center mt-4 space-x-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-pulse" />
                <span>Conexão Direta s/ Taxas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className="flex border-b border-white/5 mb-12 max-w-md">
          <button
            onClick={() => handleTabChange('portfolio')}
            className={`flex-1 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors ${activeTab === 'portfolio' ? 'text-brand-yellow' : 'text-slate-500 hover:text-white'}`}
          >
            <span>Trabalhos</span>
            {activeTab === 'portfolio' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-yellow" />
            )}
          </button>
          
          <button
            onClick={() => handleTabChange('reviews')}
            className={`flex-1 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors ${activeTab === 'reviews' ? 'text-brand-yellow' : 'text-slate-500 hover:text-white'}`}
          >
            <span>Depoimentos ({pro.reviews?.length || 0})</span>
            {activeTab === 'reviews' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-yellow" />
            )}
          </button>
        </div>

        {/* Dynamic tabs context render */}
        {activeTab === 'portfolio' ? (
          <div className="space-y-12 text-left">
            
            {/* Bio box */}
            <div className="bg-[#121212] p-8 sm:p-10 rounded-[32px] border border-white/5">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-yellow mb-4 block">Sobre o Prestador</h2>
              <p className="text-slate-400 text-base leading-relaxed whitespace-pre-wrap font-medium">{pro.bio}</p>
            </div>

            {/* Photo Gallery portfolio */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white flex items-center space-x-3">
                  <Camera className="w-5 h-5 text-brand-yellow" />
                  <span>Portfólio de Serviços</span>
                </h3>
              </div>

              {(!pro.photos || pro.photos.length === 0) ? (
                <div className="p-12 text-center bg-[#121212] border border-dashed border-white/10 rounded-[32px]">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600">Nenhuma foto enviada ainda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {pro.photos.map((photo: any) => (
                    <div key={photo.id} className="relative group overflow-hidden bg-[#121212] rounded-[32px] border border-white/5 aspect-square">
                      <img 
                        src={photo.photo_url} 
                        alt="Portfólio" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-end">
                        <div className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-[0.2em] text-brand-yellow">
                          <CheckCircle className="w-4 h-4" />
                          <span>Verificado</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="space-y-12 text-left">
            
            {/* Reviews compilation */}
            <div className="space-y-6">
              {(!pro.reviews || pro.reviews.length === 0) ? (
                <div className="p-12 text-center bg-[#121212] border border-dashed border-white/10 rounded-[32px]">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600">Ainda sem avaliações.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pro.reviews.map((rev: any) => {
                    const reviewer = rev.client;
                    return (
                      <div key={rev.id} className="p-8 bg-[#121212] rounded-[32px] border border-white/5 flex gap-6 items-start">
                        <img 
                          src={reviewer?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                          alt={reviewer?.full_name || 'Cliente'} 
                          className="w-12 h-12 rounded-2xl shrink-0 border border-white/10 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-white">{reviewer?.full_name || 'Cliente'}</span>
                            <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{new Date(rev.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center text-brand-yellow space-x-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-brand-yellow' : 'text-white/5'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            "{rev.comment}"
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Submission Form Review block */}
            <div className="bg-[#121212] p-10 rounded-[40px] border border-white/5 shadow-2xl">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-yellow mb-2">Avalie o Serviço</h3>
              <p className="text-sm text-slate-500 mb-8 font-medium">
                Sua nota ajuda a manter a qualidade da rede TáNaMão Brasil.
              </p>

              {reviewSuccess ? (
                <div className="p-10 bg-brand-yellow/5 border border-brand-yellow/20 rounded-[32px] text-center space-y-4">
                  <ThumbsUp className="w-10 h-10 text-brand-yellow mx-auto" />
                  <span className="block font-black text-xs uppercase tracking-widest text-brand-yellow">Depoimento Enviado</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-8">
                  {reviewError && (
                    <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest">
                      {reviewError}
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div className="space-y-3 text-left">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block">Sua Nota</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-2 transition-all hover:scale-110"
                        >
                          <Star 
                            className={`w-8 h-8 transition-all ${star <= reviewRating ? 'fill-brand-yellow text-brand-yellow' : 'text-white/10 hover:text-white/20'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block">Comentário Legítimo</label>
                    <textarea
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Fale sobre a pontualidade, simpatia e qualidade do serviço..."
                      className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-2xl p-4 text-sm text-white placeholder-slate-700 transition-all font-medium"
                    />
                  </div>

                  {/* Submission triggers */}
                  <div>
                    {currentUser ? (
                      <button
                        type="submit"
                        className="w-full sm:w-auto h-14 px-10 bg-brand-yellow text-black font-display font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-brand-yellow/10 transition-all hover:scale-105"
                      >
                        Enviar Avaliação
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onNavigate('auth', { mode: 'login' })}
                        className="w-full sm:w-auto h-14 px-10 bg-white/5 border border-white/10 text-slate-500 font-display font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all hover:text-white"
                      >
                        Login para Avaliar
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

          </div>
        )}

      </div>

      {/* REPORT CONTA MODAL DRAWER */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setReportModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-[#121212] border border-white/5 rounded-[40px] p-8 sm:p-10 text-white shadow-2xl z-10">
            <div className="flex items-center space-x-3 text-red-500 mb-6">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-black text-[10px] uppercase tracking-[0.3em]">Abrir Ocorrência</h3>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-8">
              Sua denúncia será avaliada imediatamente pela nossa junta de moderadores do TáNaMão Brasil.
            </p>

            {reportSuccess ? (
              <div className="p-8 bg-brand-yellow/5 border border-brand-yellow/10 rounded-[32px] text-center space-y-4">
                <CheckCircle className="w-8 h-8 text-brand-yellow mx-auto" />
                <span className="block font-black text-[10px] uppercase tracking-widest text-brand-yellow">Ocorrência registrada!</span>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-6">
                
                {/* Reason Select */}
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Motivo Principal</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value as ReportReason)}
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold text-white focus:border-brand-yellow/50 outline-none cursor-pointer appearance-none shadow-inner"
                  >
                    <option value="fake_phone">Número de WhatsApp Falso</option>
                    <option value="abuse">Assédio / Vocabulário inadequado</option>
                    <option value="fraud">Tentativa de Fraude / Golpe</option>
                    <option value="inappropriate_content">Fotos de portfólio impróprias</option>
                    <option value="other">Outro Comportamento Abusivo</option>
                  </select>
                </div>

                {/* Details text */}
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Informações Adicionais</label>
                  <textarea
                    rows={4}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Nos dê mais detalhes..."
                    className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-2xl p-4 text-xs font-medium text-slate-300 leading-relaxed shadow-inner"
                  />
                </div>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="h-14 font-black uppercase text-[10px] tracking-widest text-slate-500 bg-white/5 rounded-2xl transition-all hover:text-white"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    className="h-14 font-display font-black uppercase text-[10px] tracking-[0.2em] text-white bg-red-600 rounded-2xl shadow-xl shadow-red-600/10 transition-all hover:scale-105"
                  >
                    DENUNCIAR
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
