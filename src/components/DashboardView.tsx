import React from 'react';
import { 
  Sparkles, Award, Star, User, Camera, CreditCard, LayoutDashboard, 
  CheckCircle, Plus, Trash2, ShieldAlert, PhoneCall, Save, ShoppingBag, Clock,
  TrendingUp, Globe
} from 'lucide-react';
import { dbService } from '../db/dbStorage';
import { supabaseService } from '../lib/supabaseService';
import { SEED_CATEGORIES, SEED_CITIES, SEED_PLANS } from '../db/seedData';
import { Profile, Professional, ProfessionalPhoto, Subscription, Plan, PlanLevel, Cidade as City, Category } from '../types';

interface DashboardViewProps {
  currentUser: Profile;
  onNavigate: (view: string, params?: any) => void;
  onLogout: () => void;
  viewParams?: any;
}

export default function DashboardView({ currentUser, onNavigate, onLogout, viewParams }: DashboardViewProps) {
  const [activeTab, setActiveTab] = React.useState<'stats' | 'edit_profile' | 'portfolio' | 'billing' | 'documents'>('stats');
  const [loading, setLoading] = React.useState(true);

  // Core records loaded
  const [pro, setPro] = React.useState<any | null>(null);
  const [photos, setPhotos] = React.useState<any[]>([]);
  const [documents, setDocuments] = React.useState<any[]>([]);
  const [subscription, setSubscription] = React.useState<any | null>(null);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [cities, setCities] = React.useState<City[]>([]);
  const [analytics, setAnalytics] = React.useState<any>({ total: 0, period: 0, views: 0, whatsapp: 0, phones: 0 });
  const [leadBalance, setLeadBalance] = React.useState<number>(0);

  // Profile Editor states
  const [fullName, setFullName] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [cityId, setCityId] = React.useState('');
  const [selectedCats, setSelectedCats] = React.useState<string[]>([]);
  const [editorSuccess, setEditorSuccess] = React.useState(false);

  // Portfolio photo adder state
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [docFile, setDocFile] = React.useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = React.useState(false);
  const [portfolioError, setPortfolioError] = React.useState('');

  // Sub/Billing/Checkout states
  const [selectedPlanId, setSelectedPlanId] = React.useState('');
  const [paymentLoading, setPaymentLoading] = React.useState(false);
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState('');

  // Load state
  const reloadData = async () => {
    setLoading(true);
    try {
      const [professional, cats, cits, analyticsData, balance, docs] = await Promise.all([
        supabaseService.getProfessionalById(currentUser.id),
        supabaseService.getCategories(),
        supabaseService.getCities(),
        supabaseService.getAnalytics(currentUser.id, '7d'), // Last 7 days
        supabaseService.getLeadBalance(currentUser.id),
        supabaseService.getProfessionalDocuments(currentUser.id)
      ]);

      setCategories(cats);
      setCities(cits);
      setAnalytics(analyticsData);
      setLeadBalance(typeof balance === 'number' ? balance : balance?.saldo || 0);
      setDocuments(docs || []);

      if (professional) {
        setPro(professional);
        setPhotos(professional.photos || []);
        
        // Editor values prefills
        setFullName(currentUser.full_name);
        setBio(professional.bio || '');
        setWhatsapp(professional.whatsapp || '');
        setAddress(professional.address || ''); // address field mapped conceptually
        
        // Find city id by name/state
        const cityObj = cits.find(c => c.nome === professional.city && c.estado === professional.state);
        setCityId(cityObj?.id || '');

        setSelectedCats(professional.categories?.map((c: any) => c.category.id) || []);
      }
    } catch (err) {
      console.warn('Erro ao carregar dados do profissional:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    reloadData();
  }, [currentUser.id]);

  React.useEffect(() => {
    if (viewParams) {
      if (viewParams.tab) {
        setActiveTab(viewParams.tab);
      }
      if (viewParams.paymentStatus) {
        if (viewParams.paymentStatus === 'success') {
          setPaymentSuccess(true);
          setPaymentError('');
          setTimeout(() => setPaymentSuccess(false), 5000);
        } else if (viewParams.paymentStatus === 'failure') {
          setPaymentError('O pagamento não pôde ser processado ou foi recusado pela sua operadora de cartão de crédito.');
        } else if (viewParams.paymentStatus === 'pending') {
          setPaymentError('Seu pagamento do Mercado Pago encontra-se sob análise pendente.');
        }
      }
    }
  }, [viewParams]);

  if (loading) {
    return (
      <div className="bg-[#0D0D0D] text-white min-h-screen py-20 flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-[3px] border-brand-yellow/10 border-t-brand-yellow rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 animate-pulse">Sincronizando Dashboard</p>
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="bg-[#0D0D0D] text-white min-h-screen py-20 text-center font-sans">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Dados não localizados.</p>
        <button onClick={() => onLogout()} className="mt-8 px-10 py-4 bg-brand-yellow text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">
          Sair do Sistema
        </button>
      </div>
    );
  }

  // Calculate photograph constraints
  const activePlan = SEED_PLANS.find(p => {
    if (pro.plan_type === 'premium') return p.id === 'plan-premium';
    if (pro.plan_type === 'featured') return p.id === 'plan-featured';
    return p.id === 'plan-free';
  }) || SEED_PLANS[0];

  // Map category checkbox togglers
  const handleCategoryToggle = (catId: string) => {
    if (selectedCats.includes(catId)) {
      setSelectedCats(selectedCats.filter(id => id !== catId));
    } else {
      setSelectedCats([...selectedCats, catId]);
    }
  };

  // Save profile and professional updates
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditorSuccess(false);

    if (fullName.trim().length === 0 || bio.trim().length === 0 || whatsapp.trim().length === 0 || !cityId) {
      alert('Favor preencher os dados obrigatórios.');
      return;
    }

    if (selectedCats.length === 0) {
      alert('Selecione ao menos uma especialidade.');
      return;
    }

    try {
      const selectedCity = cities.find(c => c.id === cityId);
      
      // Update avatar if a new one was selected
      if (avatarFile) {
        await supabaseService.updateAvatar(pro.id, avatarFile);
        setAvatarFile(null);
      }

      await supabaseService.updateProfessional(
        pro.id,
        fullName,
        {
          bio,
          whatsapp,
          city: selectedCity?.nome || '',
          state: selectedCity?.estado || ''
        },
        selectedCats
      );

      // 4. Audit Log
      await supabaseService.createAuditLog({
        actor_id: currentUser.id,
        table_name: 'professionals',
        record_id: pro.id,
        action: 'UPDATE_PROFILE',
        new_data: { 
          full_name: fullName, 
          bio, 
          whatsapp, 
          city_id: cityId,
          timestamp: new Date().toISOString()
        }
      });

      setEditorSuccess(true);
      reloadData();
      setTimeout(() => setEditorSuccess(false), 2000);
    } catch (err: any) {
      alert('Erro ao salvar: ' + err.message);
    }
  };

  // Upload portfolio photo
  const handlePhotoUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPortfolioError('');

    if (!selectedFile) {
      setPortfolioError('Selecione um arquivo para upload.');
      return;
    }

    // Restrict max photos constraints (Based on Active Plan)
    if (photos.length >= activePlan.photos_limit) {
      setPortfolioError(`Limite de ${activePlan.photos_limit} fotos para seu plano.`);
      return;
    }

    setUploadLoading(true);
    try {
      await supabaseService.addPhoto(pro.id, selectedFile);
      
      // Phase 2: Audit Photo Upload
      await supabaseService.createAuditLog({
        actor_id: currentUser.id,
        table_name: 'professional_photos',
        record_id: pro.id,
        action: 'UPLOAD_PHOTO',
        new_data: { filename: selectedFile.name, timestamp: new Date().toISOString() }
      });

      setSelectedFile(null);
      // Reset input manually
      const fileInput = document.getElementById('portfolio-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      reloadData();
    } catch (err: any) {
      setPortfolioError('Erro no upload: ' + err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  // Delete portfolio photograph
  const handleDeletePhoto = async (photoId: string, photoUrl: string) => {
    if (confirm('Deseja realmente excluir esta imagem do seu portfólio?')) {
      try {
        await supabaseService.deletePhoto(pro.id, photoId, photoUrl);
        reloadData();
      } catch (err: any) {
        alert('Erro ao excluir foto: ' + err.message);
      }
    }
  };

  // Upload certificate/document
  const handleDocUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile) return;

    setUploadLoading(true);
    try {
      const docName = prompt('Nome do certificado/documento:', docFile.name) || docFile.name;
      await supabaseService.addDocument(pro.id, docFile, docName);
      setDocFile(null);
      reloadData();
    } catch (err: any) {
      alert('Erro no upload do documento: ' + err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteDoc = async (docId: string, docUrl: string) => {
    if (confirm('Deseja realmente excluir este certificado?')) {
      try {
        await supabaseService.deleteDocument(pro.id, docId, docUrl);
        reloadData();
      } catch (err: any) {
        alert('Erro ao excluir documento: ' + err.message);
      }
    }
  };

  // Checkout com Mercado Pago Checkout Pro (Produção + Sandbox Simulado)
  const handleUpgradeCheckout = async (planId: string) => {
    setSelectedPlanId(planId);
    setPaymentLoading(true);
    setPaymentSuccess(false);
    setPaymentError('');

    try {
      const response = await fetch('/api/payment/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          professionalId: pro.id,
          email: currentUser.email,
          fullName: currentUser.full_name
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao criar preferência de faturamento no backend.');
      }

      const data = await response.json();
      
      if (data.initPoint) {
        // Redireciona o usuário para o Mercado Pago Checkout Pro
        window.location.href = data.initPoint;
      } else {
        alert('Erro: Link de pagamento não foi retornado pelo servidor.');
        setPaymentLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      alert('Erro de conexão ao gateway: ' + err.message);
      setPaymentLoading(false);
    }
  };

  // Cancelar assinatura com devolução ao Plano Gratuito
  const handleCancelActiveSubscription = async () => {
    if (!confirm('Deseja realmente cancelar sua assinatura atual? Seus limites de fotos serão reduzidos imediatamente ao Plano Gratuito.')) {
      return;
    }

    setPaymentLoading(true);
    try {
      // Phase 2: Real API Cancel
      const response = await fetch('/api/payment/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professionalId: pro.id })
      });

      if (response.ok) {
        await supabaseService.createAuditLog({
          actor_id: currentUser.id,
          table_name: 'subscriptions',
          record_id: pro.id,
          action: 'CANCEL_SUBSCRIPTION',
          new_data: { timestamp: new Date().toISOString() }
        });

        alert('Sua assinatura foi cancelada com absoluto sucesso. Retornando ao Plano Gratuito.');
        await reloadData();
      } else {
        alert('O gateway retornou um erro ao tentar cancelar.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de rede ao cancelar assinatura.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Renovar ou prolongar assinatura faturada (+30 dias)
  const handleRenewActiveSubscription = async () => {
    if (!subscription) return;
    if (!confirm('Deseja realmente solicitar a renovação da sua assinatura ativa? Isso prolongará sua vigência premium em +30 dias.')) {
      return;
    }

    setPaymentLoading(true);
    try {
      const response = await fetch('/api/payment/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professionalId: pro.id, planId: subscription.plan_id })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.subscription) {
          // Phase 2: Audit Renewal
          await supabaseService.createAuditLog({
            actor_id: currentUser.id,
            table_name: 'subscriptions',
            record_id: pro.id,
            action: 'RENEW_SUBSCRIPTION',
            new_data: { plan_id: subscription.plan_id, timestamp: new Date().toISOString() }
          });
          
          alert('Renovação faturada realizada com absoluto sucesso! Vigência profissional estendida por mais 30 dias.');
          await reloadData();
        }
      } else {
        alert('Ocorreu um erro no servidor ao processar a renovação.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de rede ao processar renovação.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen py-12 font-sans text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome row headers and badge levels */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-12 mb-12 gap-8">
          <div className="space-y-1">
            <span className="text-[10px] font-black font-display text-brand-yellow uppercase tracking-[0.4em] block opacity-80 italic">Central do Profissional</span>
            <h1 className="text-4xl font-display font-black tracking-tighter uppercase italic">Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4 bg-[#121212] p-4 rounded-[28px] border border-white/5 pr-6">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center border border-white/5">
              <Award className={`w-6 h-6 ${pro.plan_type === 'premium' ? 'text-brand-yellow' : 'text-slate-600'}`} />
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">Status da Conta</span>
              <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${pro.plan_type === 'premium' ? 'text-brand-yellow' : 'text-white'}`}>
                Plano {pro.plan_type === 'premium' ? 'Premium' : pro.plan_type === 'featured' ? 'Destaque' : 'Gratuito'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* TAB DRIVERS SIDEBAR */}
          <nav className="flex flex-col space-y-3 bg-[#121212] p-6 rounded-[40px] border border-white/5 h-fit shadow-2xl">
            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'stats' ? 'bg-brand-yellow text-black' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              <span>Visão Geral</span>
            </button>

            <button
              onClick={() => setActiveTab('edit_profile')}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'edit_profile' ? 'bg-brand-yellow text-black' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <User className="w-5 h-5 shrink-0" />
              <span>Meu Perfil</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'portfolio' ? 'bg-brand-yellow text-black' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <Camera className="w-5 h-5 shrink-0" />
              <span>Portfólio</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'documents' ? 'bg-brand-yellow text-black' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>Certificados</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'billing' ? 'bg-brand-yellow text-black' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <CreditCard className="w-5 h-5 shrink-0" />
              <span>Planos</span>
            </button>

            <div className="pt-6 mt-6 border-t border-white/5">
              <button
                onClick={() => onNavigate('profile', { id: pro.id })}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all"
              >
                Ver Perfil Público
              </button>
            </div>
          </nav>

          {/* DYNAMIC CONTEXT CONTAINER AREA */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* TAB CONTENT: VISÃO GERAL */}
            {activeTab === 'stats' && (
              <div className="space-y-12">
                <div className="bg-[#121212] border border-white/5 p-10 rounded-[40px] relative overflow-hidden shadow-2xl">
                  {/* Decorative faint layout */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-yellow/5 rounded-full blur-[100px] pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Sparkles className="w-5 h-5 text-brand-yellow" />
                        <h2 className="text-3xl font-display font-black tracking-tight text-white italic uppercase">{currentUser.full_name.split(' ')[0]}</h2>
                      </div>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xl">
                        Mantenha seu portfólio sempre atualizado. O Brasil encontra aqui os melhores profissionais de cada região.
                      </p>
                    </div>
                    <div className="bg-black/40 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl group hover:border-brand-yellow/30 transition-all cursor-default">
                      <div className="flex items-center space-x-3 mb-2">
                        <ShoppingBag className="w-4 h-4 text-brand-yellow" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Saldo de Leads</span>
                      </div>
                      <span className="text-4xl font-display font-black text-white">{leadBalance}</span>
                      <span className="text-[10px] block text-brand-yellow font-black uppercase mt-1">CRÉDITOS ATIVOS</span>
                    </div>

                    <div className="bg-black/40 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl group hover:border-brand-yellow/30 transition-all cursor-default">
                      <div className="flex items-center space-x-3 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Score de Ranking</span>
                      </div>
                      <span className="text-4xl font-display font-black text-white">#{(99 - Math.min(98, Math.floor((pro.rating_avg * 10) + (pro.click_count * 0.5) + (pro.plan_type === 'premium' ? 50 : pro.plan_type === 'featured' ? 25 : 0))))}</span>
                      <span className="text-[10px] block text-brand-yellow font-black uppercase mt-1">NA SUA CIDADE</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Stats boxes standard count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="p-8 bg-[#121212] rounded-[32px] border border-white/5 flex flex-col justify-between group hover:border-brand-yellow/30 transition-all">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 text-slate-400 rounded-2xl flex items-center justify-center mb-6">
                      <Globe className="w-6 h-6 text-brand-yellow" />
                    </div>
                    <div>
                      <span className="block text-4xl font-display font-black text-white">{analytics.views || 0}</span>
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Visualizações (Perfil)</span>
                    </div>
                  </div>

                  <div className="p-8 bg-[#121212] rounded-[32px] border border-white/5 flex flex-col justify-between group hover:border-brand-yellow/30 transition-all">
                    <div className="w-12 h-12 bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow rounded-2xl flex items-center justify-center mb-6">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-4xl font-display font-black text-white">{analytics.whatsapp || 0}</span>
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Contatos (Últ. 7 dias)</span>
                    </div>
                  </div>

                  <div className="p-8 bg-[#121212] rounded-[32px] border border-white/5 flex flex-col justify-between group hover:border-brand-yellow/30 transition-all">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 text-slate-400 rounded-2xl flex items-center justify-center mb-6">
                      <Star className="w-6 h-6 fill-brand-yellow" />
                    </div>
                    <div>
                      <span className="block text-4xl font-display font-black text-white">{pro.rating_avg.toFixed(1)}</span>
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Avaliação Média</span>
                    </div>
                  </div>

                  <div className="p-8 bg-[#121212] rounded-[32px] border border-white/5 flex flex-col justify-between group hover:border-brand-yellow/30 transition-all">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 text-slate-400 rounded-2xl flex items-center justify-center mb-6">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-4xl font-display font-black text-white">{photos.length}</span>
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Fotos (Limite {activePlan.photos_limit})</span>
                    </div>
                  </div>
                </div>

                {/* Info status reports */}
                <div className="bg-[#121212] border border-white/5 rounded-[40px] p-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-yellow mb-8 block opacity-80">Segurança & Qualidade</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        Nossa plataforma preza pela legitimidade dos serviços. Profissionais com dados incorretos ou denúncias de má conduta são suspensos sem aviso prévio.
                      </p>
                    </div>
                    <div className="bg-black border border-white/10 rounded-3xl p-8 flex flex-col justify-center space-y-4">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Status de Verificação</span>
                      <div className="flex items-center space-x-3 text-brand-yellow font-black text-xs uppercase tracking-widest">
                        <CheckCircle className="w-5 h-5 fill-brand-yellow/10" />
                        <span>Perfil Aprovado & Público</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: EDIT PROFILE */}
            {activeTab === 'edit_profile' && (
              <form onSubmit={handleSaveProfile} className="bg-[#121212] border border-white/5 rounded-[40px] p-10 sm:p-12 space-y-10">
                <div className="space-y-2">
                  <h2 className="text-2xl font-display font-black uppercase italic tracking-tight">Dados de Atendimento</h2>
                  <p className="text-slate-500 text-sm font-medium">Mantenha seus contatos e biografia sempre corretos.</p>
                </div>

                {editorSuccess && (
                  <div className="p-6 bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow font-black text-center rounded-[24px] text-[10px] uppercase tracking-[0.2em] flex items-center justify-center space-x-3 animate-fade-in shadow-2xl">
                    <CheckCircle className="w-5 h-5" />
                    <span>Perfil Atualizado com Sucesso</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  
                  {/* Avatar Upload */}
                  <div className="sm:col-span-2 flex items-center space-x-6 bg-black/40 p-6 rounded-[32px] border border-white/5">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-[32px] bg-[#121212] border border-white/10 overflow-hidden shadow-2xl">
                        {avatarFile ? (
                          <img src={URL.createObjectURL(avatarFile)} className="w-full h-full object-cover" />
                        ) : pro.avatar_url ? (
                          <img src={pro.avatar_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-700">
                            <User className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-yellow rounded-2xl flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 transition-all border-4 border-black">
                        <Camera className="w-5 h-5 text-black" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Foto de Perfil</span>
                      <p className="text-[11px] text-slate-600 font-medium">Recomendado: Quadrada, min 500x500px</p>
                      {avatarFile && (
                        <span className="text-[9px] font-black text-brand-yellow uppercase tracking-widest block mt-2">Pendente: {avatarFile.name}</span>
                      )}
                    </div>
                  </div>

                  {/* Full name input */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Nome Público</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Carlos Eletricista"
                      className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-2xl px-5 py-4 text-xs font-bold text-white transition-all shadow-inner"
                      required
                    />
                  </div>

                  {/* Whatsapp */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">WhatsApp Comercial</label>
                    <input 
                      type="text" 
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                      placeholder="11988887777"
                      className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-2xl px-5 py-4 text-xs font-bold text-white font-mono"
                      required
                    />
                  </div>

                  {/* City Select */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Cidade Base</label>
                    <select
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-2xl px-5 py-4 text-xs font-bold text-white appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Selecione...</option>
                      {cities.map(c => (
                        <option key={c.id} value={c.id}>{c.nome} - {c.estado}</option>
                      ))}
                    </select>
                  </div>

                  {/* Address */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Região / Bairro</label>
                    <input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Vila Mariana e arredores..."
                      className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-2xl px-5 py-4 text-xs font-bold text-white"
                    />
                  </div>

                </div>

                {/* Categories checkbox toggles */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Especialidades</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map(cat => {
                      const active = selectedCats.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategoryToggle(cat.id)}
                          className={`flex items-center justify-between text-left px-5 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-brand-yellow/10 border-brand-yellow text-brand-yellow shadow-inner' : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                          <span>{cat.nome}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Biography Bio input */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Sua Biografia Profissional</label>
                  <textarea 
                    rows={6}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Descreva suas qualificações..."
                    className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-[28px] p-5 text-sm font-medium text-slate-300 leading-relaxed"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="h-14 px-10 bg-brand-yellow text-black font-display font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-brand-yellow/10 transition-all hover:scale-105"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            )}

            {/* TAB CONTENT: DOCUMENTS / CERTIFICATES */}
            {activeTab === 'documents' && (
              <div className="space-y-12 text-left">
                <form onSubmit={handleDocUploadSubmit} className="bg-[#121212] border border-white/5 p-10 rounded-[40px] space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-black uppercase italic tracking-tight">Certificados e Selos</h3>
                    <p className="text-slate-500 text-sm font-medium">Aumente sua credibilidade enviando seus certificados (PDF, JPG, PNG).</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input 
                        id="document-upload"
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label 
                        htmlFor="document-upload"
                        className="flex items-center justify-between w-full bg-black border border-white/10 hover:border-brand-yellow/50 outline-none rounded-2xl px-6 py-4 text-xs font-bold text-slate-400 cursor-pointer transition-all shadow-inner"
                      >
                        <span className="truncate">{docFile ? docFile.name : 'Selecionar Certificado...'}</span>
                        <CheckCircle className="w-5 h-5 text-slate-600" />
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={uploadLoading || !docFile}
                      className="h-14 px-10 bg-brand-yellow text-black font-display font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-brand-yellow/10 transition-all hover:scale-105 shrink-0 flex items-center space-x-3 disabled:opacity-50"
                    >
                      {uploadLoading ? (
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                      <span>{uploadLoading ? 'Enviando...' : 'Adicionar'}</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-yellow mb-4 block opacity-80">Seus Documentos</h3>
                  
                  {documents.length === 0 ? (
                    <div className="p-16 text-center rounded-[40px] border border-dashed border-white/10 bg-white/5">
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600 italic">Sua lista de documentos está vazia.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {documents.map(doc => (
                        <div key={doc.id} className="p-6 bg-[#121212] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-brand-yellow/30 transition-all">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                              <Award className="w-6 h-6 text-brand-yellow" />
                            </div>
                            <div className="text-left">
                              <span className="block text-xs font-black text-white uppercase italic truncate max-w-[150px]">{doc.name}</span>
                              <a href={doc.document_url} target="_blank" rel="noreferrer" className="text-[9px] text-brand-yellow font-black uppercase tracking-widest hover:underline">Ver Documento</a>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteDoc(doc.id, doc.document_url)}
                            className="w-10 h-10 bg-white/5 hover:bg-red-600 text-slate-500 hover:text-white rounded-xl transition-all flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PORTFOLIO */}
            {activeTab === 'portfolio' && (
              <div className="space-y-12 text-left">
                
                {/* Photo uploader input */}
                <form onSubmit={handlePhotoUploadSubmit} className="bg-[#121212] border border-white/5 p-10 rounded-[40px] space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-black uppercase italic tracking-tight">Nova Foto</h3>
                    <p className="text-slate-500 text-sm font-medium">Fotos aumentam em até 3x a sua conversão.</p>
                  </div>

                  {portfolioError && (
                    <div className="p-4 bg-red-955 border border-red-500/20 rounded-xl text-[10px] font-black text-red-500 uppercase tracking-widest text-center shadow-inner">
                      ⚡ Alerta: {portfolioError}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input 
                        id="portfolio-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label 
                        htmlFor="portfolio-upload"
                        className="flex items-center justify-between w-full bg-black border border-white/10 hover:border-brand-yellow/50 outline-none rounded-2xl px-6 py-4 text-xs font-bold text-slate-400 cursor-pointer transition-all shadow-inner"
                      >
                        <span className="truncate">{selectedFile ? selectedFile.name : 'Selecionar Arquivo de Imagem...'}</span>
                        <Camera className="w-5 h-5 text-slate-600" />
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={uploadLoading || !selectedFile}
                      className="h-14 px-10 bg-brand-yellow text-black font-display font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-brand-yellow/10 transition-all hover:scale-105 shrink-0 flex items-center space-x-3 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                    >
                      {uploadLoading ? (
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                      <span>{uploadLoading ? 'Enviando...' : 'Adicionar'}</span>
                    </button>
                  </div>

                  <div className="bg-black p-5 rounded-[24px] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 italic">Espaço disponível na galeria</span>
                    </div>
                    <span className="text-[10px] font-black text-brand-yellow uppercase tracking-widest">{photos.length} / {activePlan.photos_limit}</span>
                  </div>
                </form>

                {/* Photo Gallery lists with delete triggers */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-yellow mb-4 block opacity-80">Trabalhos Publicados</h3>
                  
                  {photos.length === 0 ? (
                    <div className="p-16 text-center rounded-[40px] border border-dashed border-white/10 bg-white/5">
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600 italic">Sua galeria está vazia.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                      {photos.map(photo => (
                        <div key={photo.id} className="relative group bg-[#121212] border border-white/5 rounded-[32px] overflow-hidden aspect-video shadow-2xl">
                          <img 
                            src={photo.photo_url} 
                            alt="Portfólio" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="flex items-center justify-between">
                              <span className="px-3 py-1 bg-brand-yellow text-black text-[9px] font-black uppercase tracking-widest rounded-full">Ativa</span>
                              <button
                                type="button"
                                onClick={() => handleDeletePhoto(photo.id, photo.photo_url)}
                                className="w-10 h-10 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all flex items-center justify-center hover:scale-110 shadow-xl"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT: BILLING & UPGRADES */}
            {activeTab === 'billing' && (
              <div className="space-y-12 text-left">
                
                {/* Simulated/Real payment progress */}
                {paymentLoading && (
                  <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center font-sans text-center">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="w-16 h-16 border-[4px] border-brand-yellow/10 border-t-brand-yellow rounded-full animate-spin" />
                      <div className="space-y-2">
                        <span className="block font-black text-xs text-brand-yellow uppercase tracking-[0.4em] animate-pulse">CHECKOUT SEGURO</span>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Conectando ao gateway de faturamento...</p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentSuccess && (
                  <div className="p-8 bg-brand-yellow/10 border border-brand-yellow/20 rounded-[32px] flex items-center space-x-6 animate-fade-in shadow-2xl">
                    <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center text-black">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-yellow">Pagamento Confirmado</h4>
                      <p className="text-slate-400 text-xs font-medium">Sua conta foi atualizada com sucesso. Aproveite os benefícios premium!</p>
                    </div>
                  </div>
                )}

                {paymentError && (
                  <div className="p-8 bg-red-600/10 border border-red-500/20 rounded-[32px] flex items-center space-x-6 shadow-2xl">
                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500">Falha no Pagamento</h4>
                      <p className="text-slate-400 text-xs font-medium">{paymentError}</p>
                    </div>
                  </div>
                )}

                {/* Plans catalogs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                  {SEED_PLANS.map(plan => {
                    const isCurrentPlan = (
                      (plan.id === 'plan-premium' && pro.plan_type === 'premium') ||
                      (plan.id === 'plan-featured' && pro.plan_type === 'featured') ||
                      (plan.id === 'plan-free' && pro.plan_type === 'free')
                    );

                    return (
                      <div 
                        key={plan.id}
                        className={`rounded-[40px] p-10 border flex flex-col justify-between shadow-2xl transition-all relative overflow-hidden ${
                          isCurrentPlan 
                          ? 'border-brand-yellow bg-brand-yellow/5' 
                          : 'border-white/5 bg-[#121212] hover:border-white/10 hover:scale-[1.02]'
                        }`}
                      >
                        {/* Golden overlay on Premium */}
                        {plan.id === 'plan-premium' && (
                          <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Sparkles className="w-20 h-20 text-brand-yellow" />
                          </div>
                        )}

                        <div className="space-y-8 relative z-10">
                          <div className="text-left space-y-2">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isCurrentPlan ? 'text-brand-yellow' : 'text-slate-500'}`}>
                              {plan.name}
                            </h4>
                            <div className="flex items-baseline space-x-1">
                              <span className="text-xs font-black text-slate-500">R$</span>
                              <span className="text-4xl font-display font-black text-white italic tracking-tighter">
                                {plan.price.toFixed(0)}
                              </span>
                              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">/MÊS</span>
                            </div>
                          </div>

                          <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-slate-500 border-t border-white/5 pt-8">
                            <li className="flex items-start space-x-3">
                              <CheckCircle className={`w-4 h-4 shrink-0 transition-colors ${isCurrentPlan ? 'text-brand-yellow' : 'text-slate-700'}`} />
                              <span>{plan.photos_limit} Fotos no Portfólio</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <CheckCircle className={`w-4 h-4 shrink-0 transition-colors ${isCurrentPlan ? 'text-brand-yellow' : 'text-slate-700'}`} />
                              <span>{plan.has_badge ? 'Selo Verificado' : 'Anúncio Simples'}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <CheckCircle className={`w-4 h-4 shrink-0 transition-colors ${isCurrentPlan ? 'text-brand-yellow' : 'text-slate-700'}`} />
                              <span>Prioridade Nível {plan.priority_level}</span>
                            </li>
                          </ul>
                        </div>

                        <div className="pt-10 relative z-10">
                          {isCurrentPlan ? (
                            <div className="h-14 w-full bg-brand-yellow/5 border border-brand-yellow/10 text-brand-yellow/50 rounded-2xl flex items-center justify-center font-black text-[9px] uppercase tracking-[0.2em] italic">
                              PLANO ATUAL
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleUpgradeCheckout(plan.id)}
                              disabled={paymentLoading}
                              className={`h-14 w-full rounded-2xl shadow-2xl transition-all hover:scale-105 font-display font-black text-[10px] uppercase tracking-[0.2em] ${
                                plan.id === 'plan-premium' 
                                ? 'bg-brand-yellow text-black' 
                                : 'bg-white/5 text-white border border-white/10'
                              }`}
                            >
                              {paymentLoading && selectedPlanId === plan.id ? 'Aguarde...' : 'ASSINAR AGORA'}
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Expiration warning note & Active subscription management panel */}
                {subscription && subscription.status === 'active' && (
                  <div className="bg-[#121212] border border-white/5 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-black rounded-[24px] border border-white/10 flex items-center justify-center">
                        <Clock className="w-8 h-8 text-brand-yellow" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Próxima Cobrança</span>
                        <span className="block text-sm font-black text-white italic">
                          {new Date(subscription.expires_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={handleRenewActiveSubscription}
                        className="h-12 px-6 bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all rounded-xl"
                        disabled={paymentLoading}
                      >
                        RENOVAR AGORA
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelActiveSubscription}
                        className="h-12 px-6 bg-red-600/10 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-600/20 transition-all rounded-xl"
                        disabled={paymentLoading}
                      >
                        CANCELAR
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
