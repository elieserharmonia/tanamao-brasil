import React from 'react';
import { 
  CheckCircle, Sparkles, Award, Zap, ArrowRight,
  TrendingUp, Camera, ShieldCheck
} from 'lucide-react';
import { SEED_PLANS } from '../db/seedData';

interface PlanosViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function PlanosView({ onNavigate }: PlanosViewProps) {
  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen font-sans overflow-hidden">
      
      {/* Header Heading */}
      <section className="relative pt-24 pb-20 border-b border-white/5 bg-gradient-to-b from-[#121212] to-[#0D0D0D]">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center space-x-3 bg-brand-yellow/10 px-6 py-2 rounded-full border border-brand-yellow/20 text-[10px] font-black tracking-[0.3em] text-brand-yellow uppercase italic">
            <TrendingUp className="w-4 h-4" />
            <span>Investimento de Alto Retorno</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tighter text-white uppercase italic max-w-4xl mx-auto leading-none">
            PLANOS QUE <span className="text-brand-yellow">IMPULSIONAM</span> SEU NEGÓCIO.
          </h1>

          <p className="max-w-xl mx-auto text-slate-400 text-sm font-medium leading-relaxed">
            Escolha como você quer ser visto por milhares de clientes. Do gratuito ao Elite Premium, temos o plano ideal para sua fase.
          </p>
        </div>
      </section>

      {/* Pricing Grid Grid */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {SEED_PLANS.map((plan, idx) => {
              const isPremium = plan.id === 'plan-premium';
              const isFeatured = plan.id === 'plan-featured';
              
              return (
                <div 
                  key={plan.id}
                  className={`relative flex flex-col justify-between p-12 rounded-[48px] border transition-all duration-500 hover:scale-[1.02] shadow-2xl ${
                    isPremium 
                    ? 'bg-[#1A1A1A] border-brand-yellow shadow-brand-yellow/5' 
                    : 'bg-[#121212] border-white/5'
                  }`}
                >
                  {isPremium && (
                    <div className="absolute top-8 right-8">
                      <Sparkles className="w-8 h-8 text-brand-yellow animate-pulse" />
                    </div>
                  )}

                  <div className="space-y-10">
                    <div className="space-y-4">
                      <span className={`text-[10px] font-black uppercase tracking-[0.4em] italic ${isPremium ? 'text-brand-yellow' : 'text-slate-500'}`}>
                        {plan.name}
                      </span>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-black text-slate-500">R$</span>
                        <span className="text-6xl font-display font-black text-white italic tracking-tighter">{plan.price}</span>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">/MÊS</span>
                      </div>
                    </div>

                    <div className="space-y-6 pt-10 border-t border-white/5">
                      {[
                        { icon: Camera, text: `${plan.photos_limit} Fotos no Portfólio` },
                        { icon: ShieldCheck, text: plan.has_badge ? 'Selo Verificado Prime' : 'Perfil Básico' },
                        { icon: TrendingUp, text: `Prioridade Nível ${plan.priority_level}` },
                        { icon: Zap, text: isPremium ? 'Destaque Total na Home' : 'Listagem Padrão' }
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <feature.icon className={`w-5 h-5 shrink-0 ${isPremium ? 'text-brand-yellow' : 'text-slate-700'}`} />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-16">
                    <button
                      onClick={() => onNavigate('auth', { mode: 'register', planId: plan.id })}
                      className={`w-full h-16 rounded-2xl font-display font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 shadow-xl ${
                        isPremium 
                        ? 'bg-brand-yellow text-black hover:bg-white hover:text-black italic' 
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 italic'
                      }`}
                    >
                      <span>CONTRATAR AGORA</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* Comparison Detail row Table */}
      <section className="py-24 border-t border-white/5 bg-[#080808]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.4em] text-center mb-16 italic">TABELA COMPARATIVA</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-4 px-8 text-[9px] font-black uppercase tracking-widest text-slate-600 mb-4">
              <div className="col-span-1 italic">Recurso</div>
              <div className="text-center font-display">Grátis</div>
              <div className="text-center font-display">Destaque</div>
              <div className="text-center font-display text-brand-yellow">Premium</div>
            </div>

            {[
              { label: 'Limite de Fotos', values: ['3', '10', '30'] },
              { label: 'Página Mini-site', values: ['Sim', 'Sim', 'Personalizada'] },
              { label: 'Exposição na Busca', values: ['Baixa', 'Média', 'Alta'] },
              { label: 'Selo de Confiança', values: ['Não', 'Sim', 'Prime Gold'] },
              { label: 'Suporte Prioritário', values: ['Self-service', 'WhatsApp', 'VIP 24h'] }
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-4 px-8 py-6 bg-[#121212] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 group hover:border-brand-yellow/30 transition-all">
                <div className="col-span-1 text-white">{row.label}</div>
                <div className="text-center">{row.values[0]}</div>
                <div className="text-center">{row.values[1]}</div>
                <div className="text-center text-brand-yellow">{row.values[2]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Conversion footer section Row */}
      <section className="py-32 text-center space-y-10">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter">PRONTO PARA CRESCER?</h2>
          <p className="text-slate-500 text-sm font-medium">Cadastre-se hoje e comece a receber propostas de novos clientes em minutos.</p>
          <button
            onClick={() => onNavigate('auth', { mode: 'register' })}
            className="h-16 px-16 bg-brand-yellow text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:scale-110 transition-all italic shadow-2xl shadow-brand-yellow/20"
          >
            QUERO ME CADASTRAR
          </button>
        </div>
      </section>

    </div>
  );
}
