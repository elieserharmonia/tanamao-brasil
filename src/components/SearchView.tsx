import React from 'react';
import { Search, MapPin, Star, Award, Zap, Sparkles, SlidersHorizontal, ChevronRight, X, PhoneCall } from 'lucide-react';
import { SEED_CATEGORIES, SEED_CITIES } from '../db/seedData';
import { dbService } from '../db/dbStorage';
import { supabaseService } from '../lib/supabaseService';
import { Professional, Profile, Category, Cidade as City } from '../types';
import { AdBanner } from './brand/AdBanner';
import SEO from './SEO';

interface SearchViewProps {
  initialCategoryId?: string;
  initialCityId?: string;
  initialQuery?: string;
  onNavigate: (view: string, params?: any) => void;
}

export default function SearchView({ initialCategoryId = '', initialCityId = '', initialQuery = '', onNavigate }: SearchViewProps) {
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategoryId);
  const [selectedCity, setSelectedCity] = React.useState(initialCityId);
  const [selectedQuery, setSelectedQuery] = React.useState(initialQuery);
  const [ratingFilter, setRatingFilter] = React.useState<number | null>(null);
  const [planFilter, setPlanFilter] = React.useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const [professionals, setProfessionals] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [cities, setCities] = React.useState<City[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Sync state on property change
  React.useEffect(() => {
    if (initialCategoryId) setSelectedCategory(initialCategoryId);
    if (initialCityId) setSelectedCity(initialCityId);
    if (initialQuery) setSelectedQuery(initialQuery);
  }, [initialCategoryId, initialCityId, initialQuery]);

  // Load Categories and Cities
  React.useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [cats, cits] = await Promise.all([
          supabaseService.getCategories(),
          supabaseService.getCities()
        ]);
        setCategories(cats);
        setCities(cits);
      } catch (e) {
        console.error('Error loading search metadata:', e);
      }
    };
    loadMetadata();
  }, []);

  // Fetch Professionals when filters change
  React.useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const results = await supabaseService.searchProfessionals({
          categoryId: selectedCategory,
          cityId: selectedCity,
          query: selectedQuery
        });
        setProfessionals(results || []);
      } catch (e) {
        console.error('Error searching professionals:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [selectedCategory, selectedCity, selectedQuery, ratingFilter, planFilter]);

  const processedList = React.useMemo(() => {
    let list = [...professionals];
    
    if (ratingFilter !== null) {
      list = list.filter(p => p.rating_avg >= ratingFilter);
    }
    
    if (planFilter !== null) {
      list = list.filter(p => p.plan_type === planFilter);
    }
    
    return list;
  }, [professionals, ratingFilter, planFilter]);

  const getCategoryNames = (pro: any): string[] => {
    if (!pro.categories) return [];
    return pro.categories.map((c: any) => c.category.nome);
  };

  const getCityNameStr = (pro: any): string => {
    if (pro.city && pro.state) return `${pro.city} - ${pro.state}`;
    return '...';
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedCity('');
    setSelectedQuery('');
    setRatingFilter(null);
    setPlanFilter(null);
  };

  const getDynamicTitle = () => {
    const cat = categories.find(c => c.id === selectedCategory)?.nome || selectedQuery || 'Profissionais';
    const city = cities.find(c => c.id === selectedCity)?.nome || 'Brasil';
    return `${cat} em ${city} | TáNaMão Brasil`;
  };

  const getDynamicDesc = () => {
    const cat = categories.find(c => c.id === selectedCategory)?.nome || selectedQuery || 'profissionais e empresas';
    const city = cities.find(c => c.id === selectedCity)?.nome || 'Brasil';
    return `Encontre os melhores ${cat.toLowerCase()} em ${city}. Compare perfis, veja avaliações e contrate agora pelo WhatsApp.`;
  };

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen py-16">
      <SEO 
        title={getDynamicTitle()}
        description={getDynamicDesc()}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search header text */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter mb-4 text-white">
            ENCONTRE O SEU <span className="text-brand-yellow">ESPECIALISTA</span>
          </h1>
          <p className="text-base text-slate-400 font-medium max-w-2xl">
            Acesso direto aos melhores prestadores do Brasil. Sem intermediários, sem taxas, direto no WhatsApp. 
          </p>
        </div>

        {/* Filters and List block */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT DESKTOP SIDEBAR - FILTERS */}
          <aside className="hidden lg:block bg-[#121212] border border-white/5 rounded-[32px] p-8 h-fit sticky top-24 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <span className="font-display font-black text-xs uppercase tracking-[0.2em] text-brand-yellow">Filtros</span>
              <button 
                onClick={clearAllFilters}
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
              >
                Limpar
              </button>
            </div>

            <div className="space-y-8">
              {/* Text Search selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">O que você busca?</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={selectedQuery}
                    onChange={(e) => setSelectedQuery(e.target.value)}
                    placeholder="Ex: Pintor, Reparos..."
                    className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none placeholder:text-slate-700 transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-700 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Category selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Especialidade</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none appearance-none transition-all"
                >
                  <option value="">Todas as especialidades</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
              </div>

              {/* City selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Cidade Base</label>
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-black border border-white/10 focus:border-brand-yellow/50 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none appearance-none transition-all"
                >
                  <option value="">Brasil Inteiro</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.nome} - {city.estado}</option>
                  ))}
                </select>
              </div>

              {/* Plan Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block font-sans">Nível do Prestador</label>
                <div className="space-y-1.5 text-xs">
                  <button 
                    onClick={() => setPlanFilter(planFilter === 'premium' ? null : 'premium')}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-colors flex items-center justify-between ${planFilter === 'premium' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    <span>Premium TáNaMão</span>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  </button>
                  <button 
                    onClick={() => setPlanFilter(planFilter === 'featured' ? null : 'featured')}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-colors flex items-center justify-between ${planFilter === 'featured' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    <span>Destaques</span>
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block font-sans">Avaliações Mínimas</label>
                <div className="flex flex-col space-y-1 text-xs">
                  {[5, 4, 3].map(stars => (
                    <button
                      key={stars}
                      onClick={() => setRatingFilter(ratingFilter === stars ? null : stars)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-left transition-colors ${ratingFilter === stars ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200 border border-transparent'}`}
                    >
                      <div className="flex items-center text-yellow-500 space-x-0.5">
                        {Array.from({ length: stars }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      <span className="text-[11px] font-medium font-mono">{stars}.0 ou mais</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT SIDE: RESULTS LIST */}
          <section className="lg:col-span-3 space-y-6">
            
            {/* Mobile Filtering Bar */}
            <div className="flex lg:hidden items-center justify-between bg-slate-900 border border-slate-805 p-4 rounded-2xl mb-4">
              <span className="text-sm font-semibold">{processedList.length} profissionais listados</span>
              <button 
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-xs text-slate-200 font-bold rounded-lg"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Alternar Filtros</span>
              </button>
            </div>

            {/* General dynamic info header */}
            <div className="hidden lg:flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>
                Mostrando <strong className="text-slate-200">{processedList.length}</strong> profissionais para os critérios informados
              </span>
              {(selectedCategory || selectedCity || ratingFilter || planFilter) && (
                <span className="flex items-center space-x-2 text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span>Busca filtrada ativa</span>
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-xs font-mono text-slate-500 animate-pulse">Sincronizando profissionais qualificados...</p>
              </div>
            ) : processedList.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-900 p-12 text-center rounded-3xl space-y-4">
                <Search className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold">Nenhum profissional localizado</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Não encontramos profissionais cadastrados sob filtros de categoria, estrelas ou município selecionado. Experimente ampliar sua localização ou limpar filtros de restrição.
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="px-4 py-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs rounded-xl transition-all"
                >
                  Limpar Critérios e Buscar Todos
                </button>
              </div>
            ) : (
              <div className="space-y-4.5">
                {processedList.map(pro => {
                  const p = pro;
                  const isPremium = pro.plan_type === 'premium';
                  const isFeatured = pro.plan_type === 'featured';

                  return (
                    <div 
                      key={pro.id}
                      onClick={() => onNavigate('profile', { id: pro.id })}
                      className={`group relative bg-slate-900 rounded-2xl border transition-all duration-300 hover:scale-[1.01] shadow-lg cursor-pointer overflow-hidden ${
                        isPremium 
                        ? 'border-yellow-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-yellow-950/20 hover:border-yellow-400/80 shadow-yellow-950/15' 
                        : isFeatured 
                        ? 'border-emerald-600/30 hover:border-emerald-500 shadow-emerald-950/10' 
                        : 'border-slate-905 hover:border-slate-800'
                      }`}
                    >
                      {/* Premium decoration line tag */}
                      {isPremium && (
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-500 to-amber-400 animate-pulse" />
                      )}

                      <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start">
                        
                        {/* Left avatar block and badge levels */}
                        <div className="relative">
                          <img 
                            src={p.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                            alt={p.full_name} 
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-slate-800 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Rating Floating under avatar */}
                          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-black flex items-center space-x-1 shadow-md">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span>{Number(pro.rating_avg || 0).toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Middle textual attributes */}
                        <div className="flex-1 space-y-2.5 text-left">
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-sans font-extrabold text-lg leading-tight group-hover:text-emerald-300 transition-colors">
                              {p.full_name}
                            </h3>

                            {/* Plan Pill */}
                            {isPremium && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-[10px] font-bold text-yellow-300 uppercase font-mono tracking-wider">
                                <Sparkles className="w-3 h-3 text-yellow-400" />
                                <span>Premium TáNaMão</span>
                              </span>
                            )}
                            {isFeatured && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase font-mono tracking-wider">
                                <Award className="w-3 h-3 text-emerald-400" />
                                <span>Destaque</span>
                              </span>
                            )}
                          </div>

                          {/* Address & Categories Row */}
                          <div className="flex flex-wrap items-center text-xs gap-x-4 gap-y-1.5 text-slate-400">
                            <span className="flex items-center space-x-1.5 text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-slate-500" />
                              <span>{getCityNameStr(pro)}</span>
                            </span>
                            <span className="h-3 w-[1px] bg-slate-800 hidden sm:inline" />
                            <span className="text-slate-400 line-clamp-1">
                              <strong>Especialidades:</strong> {getCategoryNames(pro).join(', ')}
                            </span>
                          </div>

                          {/* Snippet of bio */}
                          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl line-clamp-2">
                            {pro.bio}
                          </p>

                          {/* Stat counter / quick feedback */}
                          <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-500">
                            <span>⭐ {pro.rating_count || 0} {pro.rating_count === 1 ? 'Avaliação Real' : 'Avaliações Reais'}</span>
                            <span>•</span>
                            <span>📞 {pro.click_count || 0} acessos ao WhatsApp</span>
                          </div>

                        </div>

                        {/* Right side interactive button and action tag */}
                        <div className="self-stretch flex sm:flex-col justify-end items-end pt-3 sm:pt-0 sm:border-l sm:border-slate-800/60 sm:pl-5">
                          <button 
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-805 text-xs text-emerald-400 font-bold flex items-center justify-center space-x-2 transition-all hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 group-hover:scale-[1.03]"
                          >
                            <span>Ver Detalhes</span>
                            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>

      </div>

      {/* MOBILE DRILL-DOWN FILTERS DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          
          <div className="relative w-full max-w-sm bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto h-full text-white">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <span className="font-bold text-sm tracking-wide text-yellow-400 uppercase font-mono">Filtros</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 px-2.5 bg-slate-850 hover:bg-slate-800 text-xs rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Category selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block font-sans">Especialidade</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs font-semibold text-white outline-none"
                  >
                    <option value="">Todas as especialidades</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>

                {/* City selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block font-sans">Cidade / Município</label>
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs font-semibold text-white outline-none"
                  >
                    <option value="">Todas as cidades</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.nome} - {city.estado}</option>
                    ))}
                  </select>
                </div>

                {/* Plan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Nível do Prestador</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button 
                      onClick={() => setPlanFilter(planFilter === 'premium' ? null : 'premium')}
                      className={`text-[10px] text-center p-2 rounded-lg border transition-colors ${planFilter === 'premium' ? 'bg-yellow-500/15 border-yellow-500 text-yellow-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                      Premium
                    </button>
                    <button 
                      onClick={() => setPlanFilter(planFilter === 'featured' ? null : 'featured')}
                      className={`text-[10px] text-center p-2 rounded-lg border transition-colors ${planFilter === 'featured' ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                      Destaque
                    </button>
                  </div>
                </div>

                {/* Stars */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Avaliação Mínima</label>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    {[5, 4, 3].map(stars => (
                      <button 
                        key={stars}
                        onClick={() => setRatingFilter(ratingFilter === stars ? null : stars)}
                        className={`p-2 rounded-lg border text-center transition-colors ${ratingFilter === stars ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                      >
                        ⭐ {stars}.0+
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-slate-800">
              <button 
                onClick={clearAllFilters}
                className="py-2.5 text-center text-xs text-slate-400 bg-slate-800 rounded-xl"
              >
                Limpar
              </button>
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="py-2.5 text-center text-xs font-bold text-slate-950 bg-emerald-400 rounded-xl"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
