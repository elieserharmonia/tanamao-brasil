import React from 'react';
import { 
  Lock, Mail, User, Phone, MapPin, Hammer, ArrowRight, ArrowLeft, 
  CheckCircle, ShieldCheck, UserPlus, LogIn, ChevronRight, Sparkles 
} from 'lucide-react';
import { dbService } from '../db/dbStorage';
import { supabaseService } from '../lib/supabaseService';
import { SEED_CATEGORIES, SEED_CITIES } from '../db/seedData';
import { Profile, Cidade as City, Category } from '../types';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
  onAuthSuccess: (user: Profile) => void;
  onNavigate: (view: string, params?: any) => void;
}

export default function AuthView({ initialMode = 'login', onAuthSuccess, onNavigate }: AuthViewProps) {
  const [mode, setMode] = React.useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = React.useState(false);
  
  // Metadata states
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [cities, setCities] = React.useState<City[]>([]);
  
  // Registration flow type selector: 'client' | 'professional'
  const [registerType, setRegisterType] = React.useState<'client' | 'professional'>('professional');
  const [currentStep, setCurrentStep] = React.useState(1);
  const [tempUserId, setTempUserId] = React.useState<string | null>(null);

  // Form input field attributes
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  
  // Professional registration step 2 attributes
  const [bio, setBio] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [cityId, setCityId] = React.useState('');
  const [selectedCats, setSelectedCats] = React.useState<string[]>([]);

  // Feedback error blocks
  const [authError, setAuthError] = React.useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setBio('');
    setWhatsapp('');
    setAddress('');
    setCityId('');
    setSelectedCats([]);
    setAuthError('');
    setCurrentStep(1);
    setTempUserId(null);
  };

  React.useEffect(() => {
    resetForm();
    setMode(initialMode);
    
    // Load metadata
    const loadMetadata = async () => {
      try {
        const [cats, cits] = await Promise.all([
          supabaseService.getCategories(),
          supabaseService.getCities()
        ]);
        setCategories(cats);
        setCities(cits);
      } catch (err) {
        console.warn('Metadata load failed:', err);
      }
    };
    loadMetadata();
  }, [initialMode]);

  const handleCategoryToggle = (id: string) => {
    if (selectedCats.includes(id)) {
      setSelectedCats(selectedCats.filter(catId => catId !== id));
    } else {
      setSelectedCats([...selectedCats, id]);
    }
  };

  // Submit standard LOGIN
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    if (email.trim().length === 0 || password.trim().length === 0) {
      setAuthError('Preencha os campos obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      await supabaseService.signIn(email, password);
      const user = await supabaseService.getCurrentUser();
      if (user) {
        onAuthSuccess(user);
        if (user.role === 'professional') onNavigate('dashboard');
        else if (user.role === 'admin') onNavigate('admin');
        else onNavigate('home');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  // Submit multi-step Register flow
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    // Step validate checks
    if (currentStep === 1) {
      if (email.trim().length === 0 || fullName.trim().length === 0 || password.trim().length === 0) {
        setAuthError('Preencha os campos obrigatórios de conta.');
        setLoading(false);
        return;
      }
      
      try {
        const user = await supabaseService.signUp(email, password, fullName, registerType);
        if (user) {
          if (registerType === 'client') {
            const profile = await supabaseService.getCurrentUser();
            if (profile) onAuthSuccess(profile);
            onNavigate('home');
          } else {
            setTempUserId(user.id);
            setCurrentStep(2);
          }
        }
      } catch (err: any) {
        setAuthError(err.message || 'Erro ao criar conta.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (currentStep === 2) {
      if (bio.trim().length === 0 || whatsapp.trim().length === 0 || !cityId) {
        setAuthError('Preencha sua biografia técnica, WhatsApp e cidade.');
        setLoading(false);
        return;
      }
      setCurrentStep(3);
      setLoading(false);
      return;
    }

    if (currentStep === 3) {
      if (selectedCats.length === 0) {
        setAuthError('Selecione ao menos uma categoria de prestação.');
        setLoading(false);
        return;
      }

      if (!tempUserId) {
        setAuthError('Sessão expirada. Tente novamente.');
        setLoading(false);
        return;
      }

      try {
        const selectedCity = cities.find(c => c.id === cityId);

        await supabaseService.registerProfessional(tempUserId, {
          bio,
          whatsapp,
          city: selectedCity?.nome || '',
          state: selectedCity?.estado || ''
        }, selectedCats);
        
        const profile = await supabaseService.getCurrentUser();
        if (profile) onAuthSuccess(profile);
        onNavigate('dashboard');
      } catch (err: any) {
        setAuthError(err.message || 'Erro ao concluir cadastro profissional.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen py-20 flex flex-col items-center justify-center font-sans px-4 relative overflow-hidden">
      
      {/* Absolute glow balls */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-yellow/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#121212] border border-white/5 rounded-[40px] p-8 sm:p-12 shadow-2xl relative z-10 text-center space-y-8">
        
        {/* Brand identity header */}
        <div className="space-y-4 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-brand-yellow/10">
            <span className="text-black font-black text-3xl font-display">T</span>
          </div>
          <div>
            <h2 className="text-3xl font-display font-black tracking-tighter text-white uppercase italic">
              TáNaMão
            </h2>
            <span className="text-[10px] block text-brand-yellow font-display tracking-[0.4em] font-black uppercase -mt-2 opacity-90">
              Brasil
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            {mode === 'login' 
              ? 'Bem-vindo de volta. Acesse sua conta profissional e gerencie sua agenda.' 
              : 'Faça parte da maior rede de profissionais autônomos do Brasil.'
            }
          </p>
        </div>

        {authError && (
          <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest text-center">
            {authError}
          </div>
        )}

        {/* MODE: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-6 text-left">
            
            {/* Email input */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">E-mail</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@parceiro.com.br"
                  className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-white transition-all"
                  required
                />
                <Mail className="w-5 h-5 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Senha</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-white transition-all"
                  required
                />
                <Lock className="w-5 h-5 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`relative w-full h-14 bg-brand-yellow text-black font-display font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all hover:scale-105 overflow-hidden flex items-center justify-center ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
              <div className="flex items-center space-x-3">
                {loading ? (
                  <div className="w-5 h-5 border-[3px] border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>ENTRAR NA CONTA</span>
                  </>
                )}
              </div>
            </button>

            <div className="text-center pt-4">
              <button 
                type="button"
                onClick={() => setMode('register')}
                className="text-[11px] text-slate-500 font-black uppercase tracking-widest hover:text-brand-yellow transition-colors"
              >
                CRIAR NOVA CONTA GRATUITA
              </button>
            </div>
          </form>
        )}

        {/* MODE: REGISTER (MULTI-STEPPER) */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-6 text-left">
            
            {/* STEP 1: Role and initial specifications */}
            {currentStep === 1 && (
              <div className="space-y-8">
                
                {/* Selector level: client vs professional */}
                <div className="grid grid-cols-2 gap-4 pb-2">
                  <button
                    type="button"
                    onClick={() => { setRegisterType('professional'); setAuthError(''); }}
                    className={`group/btn relative py-6 rounded-[32px] border text-center transition-all ${registerType === 'professional' ? 'bg-brand-yellow/10 border-brand-yellow text-brand-yellow' : 'bg-black border-white/5 text-slate-500'}`}
                  >
                    <span className="block text-[11px] font-black uppercase tracking-widest">PRESTADOR</span>
                    <span className="text-[9px] font-black uppercase tracking-wider block mt-1 opacity-50">Atender Clientes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRegisterType('client'); setAuthError(''); }}
                    className={`group/btn relative py-6 rounded-[32px] border text-center transition-all ${registerType === 'client' ? 'bg-brand-yellow/10 border-brand-yellow text-brand-yellow' : 'bg-black border-white/5 text-slate-500'}`}
                  >
                    <span className="block text-[11px] font-black uppercase tracking-widest">CLIENTE</span>
                    <span className="text-[9px] font-black uppercase tracking-wider block mt-1 opacity-50">Contratar Serviços</span>
                  </button>
                </div>

                {/* Name */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Nome Completo</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Pedro Alvares"
                      className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-white shadow-inner"
                      required
                    />
                    <User className="w-5 h-5 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">E-mail</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contato@servico.com"
                      className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-white"
                      required
                    />
                    <Mail className="w-5 h-5 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Sua Senha</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-white font-mono"
                      required
                    />
                    <Lock className="w-5 h-5 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-14 bg-brand-yellow text-black font-display font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl shadow-brand-yellow/10"
                >
                  <span>{registerType === 'client' ? 'FINALIZAR' : 'PRÓXIMO PASSO'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            )}

            {/* STEP 2 (PROFESSIONALS ONLY): Bio, Phone, Address */}
            {currentStep === 2 && registerType === 'professional' && (
              <div className="space-y-8">
                
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow">
                  <UserPlus className="w-4 h-4" />
                  <span>Passo 2: Dados Profissionais</span>
                </div>

                {/* WhatsApp */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">WhatsApp (DDD + Número)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                      placeholder="11988887777"
                      className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-white font-mono"
                      required
                    />
                    <Phone className="w-5 h-5 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Base City */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Sua Cidade</label>
                  <div className="relative">
                    <select
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-white appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Selecione sua base...</option>
                      {cities.map(c => (
                        <option key={c.id} value={c.id}>{c.nome} - {c.estado}</option>
                      ))}
                    </select>
                    <MapPin className="w-5 h-5 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Bio text block */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Biografia Técnica Profissional</label>
                  <textarea 
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Experiência, especialidades e diferenciais..."
                    className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 outline-none rounded-[24px] p-4 text-xs font-medium text-slate-300 leading-relaxed"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="h-14 font-black uppercase text-[10px] tracking-widest text-slate-500 bg-white/5 rounded-2xl transition-all hover:text-white"
                  >
                    VOLTAR
                  </button>
                  <button
                    type="submit"
                    className="h-14 font-display font-black uppercase text-xs tracking-[0.2em] text-black bg-brand-yellow rounded-2xl shadow-xl shadow-brand-yellow/10 transition-all hover:scale-105"
                  >
                    CONTINUAR
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3 (PROFESSIONALS ONLY): Categories Selection checklist */}
            {currentStep === 3 && registerType === 'professional' && (
              <div className="space-y-8">
                
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow">
                  <UserPlus className="w-4 h-4" />
                  <span>Passo 3: Especialidades</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto p-4 bg-black border border-white/10 rounded-[32px] custom-scrollbar">
                    {categories.map(cat => {
                      const active = selectedCats.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategoryToggle(cat.id)}
                          className={`flex items-center justify-between text-left px-5 py-4 rounded-xl border transition-all ${active ? 'bg-brand-yellow/10 border-brand-yellow text-brand-yellow' : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                          <span className="text-[11px] font-black uppercase tracking-widest">{cat.nome}</span>
                          <CheckCircle className={`w-4 h-4 ${active ? 'opacity-100' : 'opacity-0'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="h-14 font-black uppercase text-[10px] tracking-widest text-slate-500 bg-white/5 rounded-2xl transition-all hover:text-white"
                  >
                    VOLTAR
                  </button>
                  <button
                    type="submit"
                    className="h-14 font-display font-black uppercase text-xs tracking-[0.2em] text-black bg-brand-yellow rounded-2xl shadow-2xl shadow-brand-yellow/10 transition-all hover:scale-105"
                  >
                    FINALIZAR
                  </button>
                </div>

              </div>
            )}

            <div className="text-center pt-8 border-t border-white/5">
              <button 
                type="button"
                onClick={() => setMode('login')}
                className="text-[11px] text-slate-500 font-black uppercase tracking-widest hover:text-brand-yellow transition-colors"
              >
                JÁ POSSUI CONTA? LOGIN
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
