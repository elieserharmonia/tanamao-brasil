import React from 'react';
import { 
  ShieldAlert, UserCheck, Star, Trash2, CheckCircle, XCircle, Users, MessageSquare, 
  Flag, Award, Sparkles, MapPin, Search, Mail, ExternalLink, Calendar, Loader2, ArrowUpRight,
  TrendingUp, DollarSign, TrendingDown, Briefcase, Activity
} from 'lucide-react';
import { supabaseService, FinancialMetrics } from '../lib/supabaseService';
import { supabase } from '../lib/supabase';
import { Profile, Professional, Review, Report, ReportStatus, ReportReason } from '../types';

interface AdminViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function AdminView({ onNavigate }: AdminViewProps) {
  const [activeTab, setActiveTab] = React.useState<'professionals' | 'reviews' | 'reports' | 'analytics' | 'finance'>('professionals');
  
  // Lists
  const [pros, setPros] = React.useState<Professional[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [reports, setReports] = React.useState<Report[]>([]);
  const [financials, setFinancials] = React.useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Search filter inside admin panel
  const [adminSearch, setAdminSearch] = React.useState('');
  const [proFilter, setProFilter] = React.useState<'all' | 'individual' | 'company'>('all');

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch core data
      const [
        { data: prosData },
        { data: reviewsData },
        { data: reportsData },
        financialMetrics
      ] = await Promise.all([
        supabase.from('professionals').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select(`*, client:profiles(*), professional:professionals(*)`).order('created_at', { ascending: false }),
        supabase.from('reports').select(`*, reporter:profiles(*), professional:professionals(*)`).order('created_at', { ascending: false }),
        supabaseService.getFinancialMetrics()
      ]);

      setPros(prosData || []);
      setReviews(reviewsData || []);
      setReports(reportsData || []);
      setFinancials(financialMetrics);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  // Filter lists based on search and type
  const filteredPros = pros.filter(pro => {
    const matchesSearch = pro.full_name.toLowerCase().includes(adminSearch.toLowerCase()) || 
           pro.email?.toLowerCase().includes(adminSearch.toLowerCase());
    const matchesType = proFilter === 'all' || 
          (proFilter === 'individual' && !pro.is_company) || 
          (proFilter === 'company' && pro.is_company);
    return matchesSearch && matchesType;
  });

  // Toggles professional active state
  const handleToggleProApproval = async (proId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('professionals').update({ active: !currentStatus }).eq('id', proId);
      if (error) throw error;
      loadData();
    } catch (err: any) {
      alert('Erro ao atualizar: ' + err.message);
    }
  };

  // Safe deletion of suspicious profiles
  const handleDeleteProProfile = async (proId: string) => {
    if (confirm('Atenção: Você tem certeza de que deseja deletar permanentemente este perfil?')) {
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', proId);
        if (error) throw error;
        loadData();
      } catch (err: any) {
        alert('Erro ao deletar: ' + err.message);
      }
    }
  };

  // Review approved/unapproved toggler
  const handleToggleReviewApproval = async (reviewId: string, approved: boolean) => {
    try {
      const { error } = await supabase.from('reviews').update({ is_approved: approved }).eq('id', reviewId);
      if (error) throw error;
      loadData();
    } catch (err: any) {
      alert('Erro ao moderar review: ' + err.message);
    }
  };

  // Deletar avaliações falsas
  const handleDeleteReview = async (reviewId: string) => {
    if (confirm('Excluir esta avaliação permanentemente?')) {
      try {
        const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
        if (error) throw error;
        loadData();
      } catch (err: any) {
        alert('Erro ao excluir review: ' + err.message);
      }
    }
  };

  // Set Report Ticket status
  const handleSetReportStatus = async (reportId: string, status: ReportStatus) => {
    try {
      const { error } = await supabase.from('reports').update({ status }).eq('id', reportId);
      if (error) throw error;
      loadData();
    } catch (err: any) {
      alert('Erro ao atualizar chamado: ' + err.message);
    }
  };

  // Tradutor de denúncias
  const translateReason = (reason: ReportReason): string => {
    switch (reason) {
      case 'fake_phone': return 'WhatsApp Falso';
      case 'abuse': return 'Abuso de Linguagem';
      case 'fraud': return 'Suposta Fraude';
      case 'inappropriate_content': return 'Fotos Inapropriadas';
      default: return 'Outra Irregularidade';
    }
  };

  const stats = {
    totalPros: pros.length,
    totalReviews: reviews.length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    totalClicks: pros.reduce((acc, p) => acc + (p.click_count || 0), 0),
    totalViews: pros.reduce((acc, p) => acc + (p.views_count || 0), 0),
  };

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen py-16 font-sans text-left selection:bg-brand-yellow selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-12 mb-12 gap-8">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-brand-yellow rounded-[24px] flex items-center justify-center shadow-2xl shadow-brand-yellow/20">
              <ShieldAlert className="w-8 h-8 text-black" />
            </div>
            <div>
              <span className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.4em] block mb-2">Visão de Auditoria</span>
              <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic">Painel Admin</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-xl">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Acesso Moderador Nível 3</span>
          </div>
        </div>

        {/* Counts indicators bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-8 bg-[#121212] rounded-[40px] border border-white/5 flex flex-col justify-between group hover:border-brand-yellow/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-slate-700 group-hover:text-brand-yellow transition-colors" />
              <ArrowUpRight className="w-4 h-4 text-slate-800" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Profissionais</span>
              <span className="block text-4xl font-display font-black italic">{stats.totalPros}</span>
            </div>
          </div>

          <div className="p-8 bg-[#121212] rounded-[40px] border border-white/5 flex flex-col justify-between group hover:border-brand-yellow/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="w-8 h-8 text-slate-700 group-hover:text-brand-yellow transition-colors" />
              <ArrowUpRight className="w-4 h-4 text-slate-800" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Avaliações</span>
              <span className="block text-4xl font-display font-black italic">{stats.totalReviews}</span>
            </div>
          </div>

          <div className="p-8 bg-[#121212] rounded-[40px] border border-white/5 flex flex-col justify-between group hover:border-brand-yellow/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <Flag className="w-8 h-8 text-slate-700 group-hover:text-red-500 transition-colors" />
              <ArrowUpRight className="w-4 h-4 text-slate-800" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Denúncias</span>
              <span className="block text-4xl font-display font-black italic text-red-500">{stats.pendingReports}</span>
            </div>
          </div>

          <div className="p-8 bg-[#121212] rounded-[40px] border border-white/5 flex flex-col justify-between group hover:border-brand-yellow/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <Sparkles className="w-8 h-8 text-slate-700 group-hover:text-brand-yellow transition-colors" />
              <ArrowUpRight className="w-4 h-4 text-slate-800" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Leads</span>
              <span className="block text-4xl font-display font-black italic">{stats.totalClicks}</span>
            </div>
          </div>
        </div>

        {/* Tab triggers */}
        <div className="flex flex-wrap border-b border-white/5 mb-12 gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'professionals', label: `Profissionais`, count: pros.length },
            { id: 'reviews', label: `Avaliações`, count: reviews.length },
            { id: 'reports', label: `Chamados`, count: reports.length },
            { id: 'finance', label: `Financeiro`, count: null },
            { id: 'analytics', label: `Estatísticas`, count: null }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setAdminSearch(''); }}
              className={`py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative shrink-0 ${activeTab === tab.id ? 'text-brand-yellow italic' : 'text-slate-500 hover:text-white'}`}
            >
              <span>{tab.label} {tab.count !== null && `(${tab.count})`}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-yellow rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <Loader2 className="w-12 h-12 text-brand-yellow animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 animate-pulse">Sincronizando Banco de Dados...</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* TAB 1: PROFESSIONALS CRUD */}
            {activeTab === 'professionals' && (
              <div className="space-y-8">
                
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search Input filter bar in admin */}
                  <div className="bg-[#121212] border border-white/5 rounded-[32px] p-2 flex items-center shadow-inner flex-1">
                    <div className="bg-black/50 rounded-[24px] flex items-center flex-1 px-8 py-5">
                      <Search className="w-5 h-5 text-slate-600 mr-4" />
                      <input 
                        type="text" 
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                        placeholder="Pesquisar por nome ou e-mail..."
                        className="bg-transparent text-sm font-bold w-full focus:outline-none placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Segment Filter */}
                  <div className="flex bg-[#121212] p-2 rounded-[32px] border border-white/5">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'individual', label: 'Autônomos' },
                      { id: 'company', label: 'Empresas' }
                    ].map(type => (
                      <button
                        key={type.id}
                        onClick={() => setProFilter(type.id as any)}
                        className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${proFilter === type.id ? 'bg-brand-yellow text-black' : 'text-slate-500 hover:text-white'}`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#121212] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-black/40 text-slate-500 font-black uppercase tracking-widest text-[9px] border-b border-white/5">
                          <th className="p-8">Trabalhador</th>
                          <th className="p-8">Localidade</th>
                          <th className="p-8">Nível de Plano</th>
                          <th className="p-8">Analytics</th>
                          <th className="p-8 text-center">Status</th>
                          <th className="p-8 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredPros.map(pro => (
                          <tr key={pro.id} className="hover:bg-white/5 transition-all group">
                            <td className="p-8">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-[18px] bg-black border border-white/10 overflow-hidden group-hover:scale-110 transition-all">
                                  <img 
                                    src={pro.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-black text-white block italic text-sm">{pro.full_name}</span>
                                    {pro.is_company && (
                                      <span className="bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-blue-500/20">CNPJ</span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest block mt-1">{pro.email || 'Email indisponível'}</span>
                                </div>
                              </div>
                            </td>
                            
                            <td className="p-8">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {pro.city} - {pro.state}
                              </span>
                            </td>

                            <td className="p-8">
                              <div className="flex items-center space-x-2">
                                {pro.plan_type === 'premium' ? (
                                  <span className="bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic">
                                    Premium
                                  </span>
                                ) : (
                                  <span className="bg-white/5 border border-white/10 text-slate-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                    {pro.plan_type}
                                  </span>
                                )}
                                {pro.verified && (
                                  <UserCheck className="w-4 h-4 text-brand-yellow" title="Verificado" />
                                )}
                              </div>
                            </td>

                            <td className="p-8">
                              <div className="flex flex-col space-y-1">
                                <span className="text-[10px] font-bold text-white">⭐ {pro.rating_avg.toFixed(1)}</span>
                                <span className="text-[9px] text-slate-600 uppercase font-black">📞 {pro.click_count || 0} CLIQUES</span>
                              </div>
                            </td>

                            <td className="p-8 text-center">
                              {pro.active ? (
                                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                              ) : (
                                <span className="inline-flex h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                              )}
                            </td>

                            <td className="p-8">
                              <div className="flex items-center justify-end space-x-3">
                                <button
                                  onClick={() => handleToggleProApproval(pro.id, pro.active)}
                                  className={`p-3 rounded-xl border transition-all ${pro.active ? 'bg-red-950/20 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-black hover:border-red-500' : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-black hover:border-emerald-500'}`}
                                >
                                  {pro.active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                </button>
                                <button 
                                  onClick={() => onNavigate('profile', { id: pro.id })}
                                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-brand-yellow/50 transition-all"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProProfile(pro.id)}
                                  className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {reviews.map(rev => (
                    <div key={rev.id} className="bg-[#121212] border border-white/5 rounded-[40px] p-10 flex flex-col md:flex-row items-start justify-between gap-8 group">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Avaliação do Profissional</span>
                          <span className="h-1 w-1 bg-slate-800 rounded-full" />
                          <span className="text-brand-yellow font-black italic text-xs uppercase">{(rev as any).professional?.full_name}</span>
                        </div>
                        <p className="text-xl font-display font-black text-white italic leading-tight uppercase group-hover:text-brand-yellow transition-colors">"{rev.comment}"</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex text-yellow-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-brand-yellow text-brand-yellow' : 'text-slate-800'}`} />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Enviado por {(rev as any).client?.full_name}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 w-full md:w-auto">
                        <button
                          onClick={() => handleToggleReviewApproval(rev.id, !rev.is_approved)}
                          className={`flex-1 md:flex-none h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${rev.is_approved ? 'bg-red-950/20 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-black' : 'bg-emerald-600 text-black hover:scale-105'}`}
                        >
                          {rev.is_approved ? 'REMOVER' : 'APROVAR'}
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="h-14 w-14 flex items-center justify-center bg-white/5 border border-white/10 text-slate-500 rounded-2xl hover:text-white transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                {reports.map(rep => (
                  <div key={rep.id} className="bg-[#121212] border border-white/5 rounded-[40px] p-10 space-y-8 animate-fade-in">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-650 rounded-2xl flex items-center justify-center text-black">
                          <Flag className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{translateReason(rep.reason)}</span>
                          <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">Reportado por {(rep as any).reporter?.full_name}</h4>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${rep.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                        {rep.status}
                      </div>
                    </div>

                    <div className="bg-black/50 p-8 rounded-[32px] border border-white/5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-700 block mb-3">Detalhamento dos fatos</span>
                      <p className="text-slate-300 text-sm font-medium leading-relaxed italic">"{rep.details}"</p>
                    </div>

                    <div className="flex items-center justify-between items-center pt-4 border-t border-white/5">
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Contra:</span>
                        <span className="text-[11px] font-black uppercase text-brand-yellow tracking-widest">{(rep as any).professional?.full_name}</span>
                      </div>
                      {rep.status === 'pending' && (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleSetReportStatus(rep.id, 'resolved')}
                            className="h-12 px-8 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-2xl shadow-red-600/10 hover:scale-105 transition-all"
                          >
                            RESOLVER
                          </button>
                          <button
                            onClick={() => handleSetReportStatus(rep.id, 'dismissed')}
                            className="h-12 px-8 bg-white/5 border border-white/10 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:text-white transition-all"
                          >
                            ARQUIVAR
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: FINANCEIRO */}
            {activeTab === 'finance' && financials && (
              <div className="space-y-12 animate-fade-in">
                {/* SaaS Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-8 bg-[#121212] rounded-[40px] border border-white/5 flex flex-col justify-between group hover:border-brand-yellow/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="w-8 h-8 text-emerald-500" />
                      <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">+12.5%</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">MRR (Recorrência Mensal)</span>
                      <span className="block text-4xl font-display font-black italic">R$ {financials.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="p-8 bg-[#121212] rounded-[40px] border border-white/5 flex flex-col justify-between group hover:border-brand-yellow/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <DollarSign className="w-8 h-8 text-brand-yellow" />
                      <ArrowUpRight className="w-4 h-4 text-slate-800" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">ARR (Receita Anual)</span>
                      <span className="block text-4xl font-display font-black italic">R$ {financials.arr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="p-8 bg-[#121212] rounded-[40px] border border-white/5 flex flex-col justify-between group hover:border-brand-yellow/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingDown className="w-8 h-8 text-red-500 opacity-50" />
                      <span className="text-[9px] font-black uppercase text-slate-600">Alvo: {'<'} 5%</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Churn Rate (Simulado)</span>
                      <span className="block text-4xl font-display font-black italic text-red-500/50">{financials.churn_rate}%</span>
                    </div>
                  </div>

                  <div className="p-8 bg-[#121212] rounded-[40px] border border-white/5 flex flex-col justify-between group hover:border-brand-yellow/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <Activity className="w-8 h-8 text-slate-700" />
                      <span className="text-[9px] font-black uppercase text-slate-600 italic">Conversão</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Free to Paid</span>
                      <span className="block text-4xl font-display font-black italic">{(financials.free_to_paid_ratio * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Second Metrics Row: Subs count */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-10 bg-[#121212] border border-white/5 rounded-[40px] flex items-center justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 block">Assinaturas Ativas</span>
                      <span className="text-5xl font-display font-black italic">{financials.active_subscriptions}</span>
                    </div>
                    <Briefcase className="w-12 h-12 text-slate-800" />
                  </div>

                  <div className="p-10 bg-[#121212] border border-white/5 rounded-[40px] flex items-center justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 block">Ticket Médio</span>
                      <span className="text-5xl font-display font-black italic text-emerald-500">R$ {financials.average_ticket.toFixed(2)}</span>
                    </div>
                    <DollarSign className="w-12 h-12 text-slate-800" />
                  </div>

                  <div className="p-10 bg-brand-yellow border border-black/10 rounded-[40px] flex items-center justify-between text-black">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block">LTV (Lifetime Value)</span>
                      <span className="text-5xl font-display font-black italic">R$ {financials.ltv.toFixed(0)}</span>
                    </div>
                    <TrendingUp className="w-12 h-12 opacity-30" />
                  </div>
                </div>

                {/* Subscriptions Table */}
                <div className="bg-[#121212] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-yellow italic">Últimas Transações & Assinaturas</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-black/40 text-slate-500 font-black uppercase tracking-widest text-[9px] border-b border-white/5">
                          <th className="p-8">Assinante</th>
                          <th className="p-8">Plano</th>
                          <th className="p-8">Valor</th>
                          <th className="p-8">Status</th>
                          <th className="p-8 text-right">Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {pros.filter(p => p.plan_type !== 'free').slice(0, 10).map(pro => (
                          <tr key={pro.id} className="hover:bg-white/5 transition-all">
                            <td className="p-8">
                               <div className="flex items-center space-x-4">
                                 <img src={pro.avatar_url} className="w-8 h-8 rounded-lg object-cover border border-white/5" alt={pro.full_name} referrerPolicy="no-referrer" />
                                 <span className="font-black italic text-white">{pro.full_name}</span>
                               </div>
                            </td>
                            <td className="p-8">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic ${pro.plan_type === 'premium' ? 'bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                                {pro.plan_type}
                              </span>
                            </td>
                            <td className="p-8 font-mono text-slate-400">
                              R$ {pro.plan_type === 'premium' ? '39,90' : '19,90'}
                            </td>
                            <td className="p-8">
                              <div className="flex items-center space-x-2">
                                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest italic tracking-widest">Active</span>
                              </div>
                            </td>
                            <td className="p-8 text-right text-slate-600 font-black italic">
                              {pro.created_at ? new Date(pro.created_at).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {/* TAB 5: ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-12 animate-fade-in">
                {/* Real-time stats grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-[#121212] p-10 rounded-[40px] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Taxa de Conversão</span>
                      <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                    </div>
                    <h3 className="text-5xl font-display font-black italic">
                      {stats.totalViews > 0 ? ((stats.totalClicks / stats.totalViews) * 100).toFixed(1) : 0}%
                    </h3>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Pessoas que entram em contato</p>
                  </div>

                  <div className="bg-[#121212] p-10 rounded-[40px] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Satisfação Média</span>
                      <Star className="w-5 h-5 text-brand-yellow" />
                    </div>
                    <h3 className="text-5xl font-display font-black italic">
                      {(pros.reduce((acc, p) => acc + (p.rating_avg || 0), 0) / (pros.length || 1)).toFixed(2)}
                    </h3>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Base de 5 estrelas</p>
                  </div>

                  <div className="bg-brand-yellow p-10 rounded-[40px] border border-black/10 space-y-4 text-black">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Faturamento Previsto</span>
                      <Sparkles className="w-5 h-5 fill-black" />
                    </div>
                    <h3 className="text-5xl font-display font-black italic">
                      R$ {(pros.filter(p => p.plan_type === 'premium').length * 49.90 + pros.filter(p => p.plan_type === 'featured').length * 29.90).toFixed(2)}
                    </h3>
                    <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Baseado nos planos ativos</p>
                  </div>
                </div>

                {/* Ranking Real */}
                <div className="bg-[#121212] border border-white/5 rounded-[40px] overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-yellow italic">Top Profissionais (Score de Relevância)</h3>
                    <Award className="w-6 h-6 text-brand-yellow" />
                  </div>
                  <div className="divide-y divide-white/5">
                    {pros
                      .map(p => ({
                        ...p,
                        score: (p.rating_avg * 20) + (p.click_count * 5) + (p.plan_type === 'premium' ? 1000 : p.plan_type === 'featured' ? 500 : 0)
                      }))
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 5)
                      .map((p, idx) => (
                        <div key={p.id} className="p-8 flex items-center justify-between hover:bg-white/5 transition-all">
                          <div className="flex items-center space-x-6">
                            <span className="text-4xl font-display font-black italic text-slate-800">#{idx + 1}</span>
                            <div className="flex items-center space-x-4">
                              <img src={p.avatar_url} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt={p.full_name} referrerPolicy="no-referrer" />
                              <div>
                                <span className="block font-black text-white italic uppercase tracking-tight">{p.full_name}</span>
                                <span className="block text-[9px] text-slate-600 font-black uppercase tracking-widest">{p.city} - {p.state}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-2xl font-display font-black italic text-brand-yellow">{(p.score / 100).toFixed(1)} PONTOS</span>
                            <span className="block text-[10px] text-slate-600 font-black uppercase tracking-widest">{p.plan_type} Partner</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
