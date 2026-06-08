import React from 'react';
import * as Icons from 'lucide-react';
import { SEED_CATEGORIES, SEED_CITIES } from '../db/seedData';
import { supabaseService } from '../lib/supabaseService';
import { Category, Cidade as City } from '../types';
import SEO from './SEO';
import { AdBanner } from './brand/AdBanner';

interface HomeViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedCity, setSelectedCity] = React.useState('');
  const [selectedSearchText, setSelectedSearchText] = React.useState('');
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [cities, setCities] = React.useState<City[]>([]);
  const [stats, setStats] = React.useState({ totalPros: 10450, totalClicks: 128450 });

  React.useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [cats, cits] = await Promise.all([
          supabaseService.getCategories(),
          supabaseService.getCities()
        ]);
        setCategories(cats);
        setCities(cits);
      } catch (err) {
        console.warn('Metadata load failed, falling back to seeds:', err);
        setCategories(SEED_CATEGORIES);
        setCities(SEED_CITIES);
      }
    };
    loadMetadata();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('search', {
      categoryId: selectedCategory,
      cityId: selectedCity,
      query: selectedSearchText
    });
  };

  const getIcon = (name: string, className?: string) => {
    const Component = (Icons as any)[name];
    const actualClass = className || "w-6 h-6 text-brand-yellow group-hover:scale-110 transition-transform";
    if (Component) return <Component className={actualClass} />;
    return <Icons.HelpCircle className={actualClass} />;
  };

  const displayCategories = categories.length > 0 ? categories : SEED_CATEGORIES;
  const displayCities = cities.length > 0 ? cities : SEED_CITIES;

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen pt-40 sm:pt-48 selection:bg-brand-yellow selection:text-black">
      <SEO 
        title="TáNaMão Brasil | O Brasil encontra aqui."
        description="O maior marketplace de serviços do Brasil. Encontre eletricistas, encanadores, pintores e muito mais em sua cidade."
      />
      
      {/* Background decoration */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-brand-yellow pointer-events-none -z-10" />

      {/* Horizontal Category Menu (ML Style) */}
      <section className="bg-brand-yellow border-t border-black/5 pb-8">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-12 py-4">
            {displayCategories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => onNavigate('search', { categoryId: cat.id })}
                className="flex flex-col items-center space-y-3 shrink-0 group transition-all"
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border border-black/10 group-hover:bg-[#0D0D0D] group-hover:scale-110 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:shadow-lg">
                   {getIcon(cat.image_url || 'Hammer', "w-6 h-6 text-[#0D0D0D] group-hover:text-[#FFD100] transition-colors")}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-black/60 group-hover:text-black transition-colors">{cat.nome.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Target/Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-32 border-b border-white/5 bg-gradient-to-b from-[#121212] to-[#0D0D0D]">
        
        {/* Aesthetic background glows */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand-yellow/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col items-center text-center space-y-8 mb-20">
            <div className="inline-flex items-center space-x-3 bg-brand-yellow/10 px-6 py-2 rounded-full border border-brand-yellow/20 text-[10px] font-black tracking-[0.3em] text-brand-yellow uppercase italic text-center">
              <Icons.ShieldCheck className="w-4 h-4" />
              <span>Plataforma Oficial Segura</span>
            </div>

            <h1 className="text-5xl sm:text-9xl font-display font-black tracking-tighter text-white leading-[0.85] uppercase italic max-w-6xl text-center">
              ENCONTRE PROFISSIONAIS <br />
              <span className="text-brand-yellow">CONFIÁVEIS</span>.
            </h1>

            <p className="max-w-2xl text-lg sm:text-xl text-slate-400 leading-relaxed font-medium">
              Eletricistas, encanadores, diaristas, pintores, montadores e centenas de serviços. O Brasil encontra aqui.
            </p>
          </div>

          <AdBanner className="max-w-5xl mx-auto mb-16" />

          {/* Atendimento Imediato Section */}
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-red-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Ao Vivo</span>
                </div>
                <h3 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter leading-none">
                  ATENDIMENTO <span className="text-brand-yellow">IMEDIATO</span>
                </h3>
              </div>
              <button className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors italic group">
                Ver todos os online <Icons.ArrowRight className="inline w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Ricardo Silva', cat: 'Eletricista', img: 'https://i.pravatar.cc/150?u=1' },
                { name: 'Sueli Mendes', cat: 'Diarista', img: 'https://i.pravatar.cc/150?u=2' },
                { name: 'Pedro Pintura', cat: 'Pintor', img: 'https://i.pravatar.cc/150?u=3' },
                { name: 'Marcos Marc.', cat: 'Marceneiro', img: 'https://i.pravatar.cc/150?u=4' }
              ].map((p, i) => (
                <div key={i} className="bg-[#121212] border border-white/5 p-6 rounded-[32px] group hover:border-brand-yellow/30 transition-all cursor-pointer">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 overflow-hidden border border-white/10 group-hover:border-brand-yellow/50 transition-colors">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase italic">{p.name}</h4>
                      <span className="text-[8px] font-black text-brand-yellow uppercase tracking-widest">{p.cat}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">DISPONÍVEL AGORA</span>
                    <Icons.Zap className="w-3.5 h-3.5 text-brand-yellow fill-brand-yellow" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mercado Livre Style Smart Search Bar */}
          <div className="max-w-5xl mx-auto">
            <form 
              onSubmit={handleSearchSubmit}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-yellow/50 to-orange-500/50 rounded-[40px] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1A1A1A] rounded-[32px] p-4 sm:p-6 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-4">
                
                {/* O que você precisa? */}
                <div className="flex-1 w-full relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-yellow pointer-events-none">
                    <Icons.Search className="w-5 h-5" />
                  </div>
                  <input 
                    type="text"
                    value={selectedSearchText}
                    onChange={(e) => setSelectedSearchText(e.target.value)}
                    placeholder="O que você precisa hoje?"
                    className="w-full h-16 pl-14 pr-6 bg-white/5 rounded-2xl text-white font-bold placeholder:text-slate-600 outline-none focus:ring-2 ring-brand-yellow/50 transition-all"
                  />
                  
                  {/* Autocomplete Suggestions */}
                  {selectedSearchText.length > 2 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
                      {displayCategories
                        .filter(c => c.nome.toLowerCase().includes(selectedSearchText.toLowerCase()))
                        .slice(0, 5)
                        .map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setSelectedSearchText(cat.nome);
                              onNavigate('search', { categoryId: cat.id });
                            }}
                            className="w-full h-14 px-6 flex items-center space-x-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                          >
                            <Icons.Search className="w-4 h-4 text-brand-yellow opacity-50" />
                            <span className="font-bold text-sm tracking-tight">{cat.nome}</span>
                            <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-auto">Categoria</span>
                          </button>
                        ))
                      }
                      {/* Plus some city matches */}
                      {displayCities
                        .filter(c => c.nome.toLowerCase().includes(selectedSearchText.toLowerCase()))
                        .slice(0, 3)
                        .map(city => (
                          <button
                            key={city.id}
                            type="button"
                            onClick={() => {
                              setSelectedSearchText(city.nome);
                              onNavigate('search', { cityId: city.id });
                            }}
                            className="w-full h-14 px-6 flex items-center space-x-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                          >
                            <Icons.MapPin className="w-4 h-4 text-brand-yellow opacity-50" />
                            <span className="font-bold text-sm tracking-tight">{city.nome} - {city.estado}</span>
                            <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-auto">Cidade</span>
                          </button>
                        ))
                      }
                    </div>
                  )}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                    <span className="hidden sm:block text-[9px] font-black text-slate-700 uppercase tracking-widest">Ex: Eletricista</span>
                  </div>
                </div>

                {/* Localização (Opcional na home para simplicidade rápida) */}
                <div className="w-full md:w-64 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-yellow pointer-events-none">
                    <Icons.MapPin className="w-5 h-5" />
                  </div>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full h-16 pl-14 pr-6 bg-white/5 rounded-2xl text-white font-bold appearance-none outline-none focus:ring-2 ring-brand-yellow/50 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-[#0D0D0D]">Onde?</option>
                    {displayCities.map(city => (
                      <option key={city.id} value={city.id} className="bg-[#0D0D0D]">{city.nome}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto h-16 px-12 bg-brand-yellow text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-brand-yellow/20 italic"
                >
                  BUSCAR
                </button>
              </div>
            </form>
            
            {/* Quick Suggestions */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['Eletricista', 'Encanador', 'Diarista', 'Pintor', 'Montador'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => { setSelectedSearchText(tag); onNavigate('search', { query: tag }); }}
                  className="px-6 py-2 bg-white/5 hover:bg-brand-yellow/10 border border-white/5 hover:border-brand-yellow/50 rounded-full text-[10px] font-black text-slate-500 hover:text-brand-yellow transition-all uppercase tracking-widest"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            
            {/* Para Clientes */}
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-brand-yellow text-[10px] font-black uppercase tracking-[0.4em] italic">Para Clientes</span>
                <h2 className="text-4xl font-display font-black text-white italic uppercase tracking-tighter leading-none">
                  PESQUISE, <br />
                  COMPARE E <span className="text-brand-yellow">CONTRATE</span>.
                </h2>
              </div>
              
              <div className="space-y-10">
                {[
                  { step: '01', title: 'PESQUISE', text: 'Encontre profissionais qualificados em sua região usando nossa busca inteligente.' },
                  { step: '02', title: 'COMPARE', text: 'Analise portfólios reais, avaliações de outros clientes e preços.' },
                  { step: '03', title: 'CONTRATE', text: 'Fale direto pelo WhatsApp do profissional. Sem intermediários, sem taxas.' }
                ].map((item, i) => (
                  <div key={i} className="flex space-x-6 group">
                    <span className="text-3xl font-display font-black text-white/10 group-hover:text-brand-yellow transition-colors italic">{item.step}</span>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Para Profissionais */}
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-brand-yellow text-[10px] font-black uppercase tracking-[0.4em] italic">Para Profissionais</span>
                <h2 className="text-4xl font-display font-black text-white italic uppercase tracking-tighter leading-none">
                  CADASTRE-SE E <br />
                  <span className="text-brand-yellow">RECEBA</span> CLIENTES.
                </h2>
              </div>
              
              <div className="space-y-10">
                {[
                  { step: '01', title: 'CADASTRE-SE', text: 'Crie sua conta profissional em menos de 2 minutos de forma gratuita.' },
                  { step: '02', title: 'MONTE SEU PERFIL', text: 'Adicione fotos de seus melhores trabalhos e seu contato de trabalho.' },
                  { step: '03', title: 'RECEBA CLIENTES', text: 'Apareça para milhares de pessoas que buscam seus serviços todos os dias.' }
                ].map((item, i) => (
                  <div key={i} className="flex space-x-6 group">
                    <span className="text-3xl font-display font-black text-white/10 group-hover:text-brand-yellow transition-colors italic">{item.step}</span>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Safe SEO/Badge metrics row */}
          <div className="max-w-4xl mx-auto mt-24 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center border-t border-white/5 pt-16">
            <div className="group">
              <span className="block text-5xl font-display font-black text-brand-yellow group-hover:scale-110 transition-transform tracking-tighter">+{stats.totalPros.toLocaleString('pt-BR')}</span>
              <span className="text-[10px] text-slate-500 font-black tracking-[0.3em] uppercase mt-2 block">Parceiros</span>
            </div>
            <div className="group">
              <span className="block text-5xl font-display font-black text-white group-hover:text-brand-yellow transition-colors tracking-tighter">100%</span>
              <span className="text-[10px] text-slate-500 font-black tracking-[0.3em] uppercase mt-2 block">Direto no Zap</span>
            </div>
            <div className="group">
              <span className="block text-5xl font-display font-black text-white group-hover:text-brand-yellow transition-colors tracking-tighter">+{stats.totalClicks.toLocaleString('pt-BR')}</span>
              <span className="text-[10px] text-slate-500 font-black tracking-[0.3em] uppercase mt-2 block">Interações</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Categories */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl sm:text-7xl font-display font-black tracking-tighter text-white italic uppercase">
            BUSCA POR <span className="text-brand-yellow">ESPECIALIDADE</span>
          </h2>
          <div className="w-24 h-1 bg-brand-yellow mx-auto" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayCategories.map(cat => {
            return (
              <div 
                key={cat.id}
                onClick={() => onNavigate('search', { categoryId: cat.id })}
                className="group relative overflow-hidden bg-[#121212] p-8 rounded-3xl border border-white/5 hover:border-brand-yellow cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-yellow/10"
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-yellow transition-colors duration-500">
                  {getIcon(cat.image_url || 'Hammer', "w-7 h-7 text-brand-yellow group-hover:text-black transition-colors")}
                </div>
                
                <h3 className="text-xl font-display font-black text-white mb-2 leading-none uppercase italic">
                  {cat.nome}
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-2">
                  {cat.description}
                </p>

                <div className="mt-8 flex items-center text-brand-yellow text-[10px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Ver Profissionais</span>
                  <Icons.ArrowUpRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner Informational of Direct Freedom */}
        <div className="mt-20 bg-[#121212] border border-white/5 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-brand-yellow/5 blur-3xl rounded-full" />
          <div className="space-y-4 max-w-2xl text-center md:text-left relative z-10">
            <h3 className="text-2xl sm:text-3xl font-display font-black italic uppercase tracking-tighter text-white">
              VOCÊ É UM PRESTADOR DE SERVIÇOS?
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Crie seu perfil profissional no TáNaMão Brasil agora! Adicione fotos reais do seu portfólio, insira seu WhatsApp de trabalho e apareça hoje para milhares de clientes locais.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto">
            <button 
              onClick={() => onNavigate('para-profissionais')}
              className="w-full md:w-auto h-16 px-10 rounded-2xl bg-brand-yellow text-black text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl shadow-brand-yellow/10 hover:scale-105 transition-all italic"
            >
              <span>SEJA UM PARCEIRO</span>
              <Icons.Plus className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

      </section>

      {/* Safety Section: why choose TáNaMão */}
      <section className="bg-slate-900/50 py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-sans font-black tracking-tight mb-2">
              A melhor e mais honesta engrenagem do país
            </h2>
            <p className="text-sm text-slate-400">
              Diferente de outras plataformas, nosso foco está na democratização do trabalho autônomo nacional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
              <div className="p-3 bg-red-950/50 text-red-400 border border-red-500/20 rounded-2xl mb-4">
                <Icons.Lock className="w-6 h-6 text-red-400" />
              </div>
              <h4 className="text-base font-bold text-slate-100 mb-2">Sem Taxas Ocultas</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Você não gasta créditos para responder contatos residenciais e nem cede 20% do seu trabalho suado para plataformas intermediárias. Seu dinheiro vai 100% para seu bolso!
              </p>
            </div>

            <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
              <div className="p-3 bg-emerald-950/50 text-emerald-400 border border-emerald-500/20 rounded-2xl mb-4">
                <Icons.Award className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-base font-bold text-slate-100 mb-2">Hierarquia e Reputação</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nossos rankings valorizam a qualificação real e a transparência. Profissionais com excelentes avaliações de clientes ganham destaques naturais na busca geolocalizada.
              </p>
            </div>

            <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
              <div className="p-3 bg-yellow-950/40 text-yellow-400 border border-yellow-500/20 rounded-2xl mb-4">
                <Icons.Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              <h4 className="text-base font-bold text-slate-100 mb-2">Fotos e Provas de Trabalho</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Não contrate apenas na sorte. Visualize os álbuns de fotos e portfólios organizados de serviços já executados por cada prestador em sua cidade, garantindo precisão.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
