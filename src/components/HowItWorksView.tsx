import React from 'react';
import { Search, MessageSquare, Star, ArrowRight } from 'lucide-react';

export default function HowItWorksView() {
  return (
    <div className="pt-24 pb-20 animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 space-y-24">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-display font-black uppercase italic tracking-tighter">
            Como <span className="text-brand-yellow">funciona</span>?
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto">
            Simples, direto e sem burocracia. Em menos de 1 minuto você encontra a solução para o seu problema.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {[
            {
              icon: Search,
              title: '1. Pesquise e Filtre',
              desc: 'Use nossa busca inteligente para encontrar profissionais por categoria e cidade. Nossa tecnologia de ranking coloca os melhores no topo.',
              label: 'LOCALIZE'
            },
            {
              icon: MessageSquare,
              title: '2. Contato Direto',
              desc: 'Sem intermediários. Clique no botão de WhatsApp para abrir uma conversa direta com o profissional e solicitar seu orçamento.',
              label: 'NEGOCIE'
            },
            {
              icon: Star,
              title: '3. Avalie e Recomende',
              desc: 'Após o serviço realizado, deixe seu depoimento no perfil do profissional. Isso ajuda a manter a qualidade da nossa comunidade.',
              label: 'FEEDBACK'
            }
          ].map((step, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-10 group">
              <div className="w-24 h-24 bg-[#121212] border border-white/5 rounded-[32px] flex items-center justify-center group-hover:border-brand-yellow/30 transition-all shrink-0">
                <step.icon className="w-10 h-10 text-brand-yellow" />
              </div>
              <div className="space-y-4 text-center md:text-left flex-grow">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 block italic">{step.label}</span>
                <h3 className="text-3xl font-display font-black uppercase italic tracking-tight">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-brand-yellow rounded-[48px] p-12 text-center space-y-8 shadow-2xl shadow-brand-yellow/10">
          <h2 className="text-4xl md:text-5xl font-display font-black text-black uppercase italic leading-none">
            Pronto para começar?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button className="h-16 px-10 bg-black text-white font-display font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center space-x-3 hover:scale-105 transition-all">
               <span>Buscar Profissional</span>
               <ArrowRight className="w-5 h-5" />
             </button>
             <button className="h-16 px-10 bg-transparent border-2 border-black/10 text-black font-display font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-black/5 transition-all">
               Sou Profissional
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
