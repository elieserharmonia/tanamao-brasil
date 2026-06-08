import React from 'react';
import { 
  Rocket, ShieldCheck, Zap, TrendingUp, Users, 
  MessageSquare, Star, CheckCircle, ArrowRight,
  Target, Globe, Sparkles
} from 'lucide-react';

interface ParaProfissionaisViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function ParaProfissionaisView({ onNavigate }: ParaProfissionaisViewProps) {
  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen font-sans overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 border-b border-white/5 bg-gradient-to-b from-[#121212] to-[#0D0D0D]">
        {/* Aesthetic background glows */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
          <div className="inline-flex items-center space-x-3 bg-brand-yellow/10 px-6 py-2 rounded-full border border-brand-yellow/20 text-[10px] font-black tracking-[0.3em] text-brand-yellow uppercase italic">
            <Rocket className="w-4 h-4" />
            <span>Multiplique seus atendimentos</span>
          </div>

          <h1 className="text-5xl sm:text-8xl font-display font-black tracking-tighter text-white leading-[0.85] uppercase italic max-w-5xl mx-auto">
            SUA CARREIRA <br />
            MERECE <span className="text-brand-yellow">VISIBILIDADE</span>.
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed font-medium">
            O TáNaMão Brasil é o marketplace que mais cresce no país. Conectamos profissionais qualificados a milhares de clientes todos os dias.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <button
              onClick={() => onNavigate('auth', { mode: 'register' })}
              className="w-full sm:w-auto h-16 px-12 bg-brand-yellow text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-brand-yellow/20 italic flex items-center justify-center space-x-3"
            >
              <span>INICIAR CADASTRO GRÁTIS</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('planos')}
              className="w-full sm:w-auto h-16 px-12 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all italic"
            >
              VER PLANOS DE ELITE
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Bento Grid */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter">POR QUE SER UM <span className="text-brand-yellow">PARCEIRO</span>?</h2>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">A ferramenta definitiva para profissionais do futuro.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Benefit 1 */}
            <div className="p-10 bg-[#121212] border border-white/5 rounded-[40px] space-y-6 group hover:border-brand-yellow/30 transition-all">
              <div className="w-16 h-16 bg-brand-yellow/10 rounded-2xl flex items-center justify-center border border-brand-yellow/20 text-brand-yellow">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest">MILHARES DE CLIENTES</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Temos tráfego qualificado buscando exatamente o que você oferece. Não perca mais tempo prospectando.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="p-10 bg-[#121212] border border-white/5 rounded-[40px] space-y-6 group hover:border-brand-yellow/30 transition-all">
              <div className="w-16 h-16 bg-brand-yellow/10 rounded-2xl flex items-center justify-center border border-brand-yellow/20 text-brand-yellow">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest">FOCO NO RESULTADO</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Nosso ranking prioriza os melhores profissionais. Trabalhe bem, receba avaliações e apareça no topo.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="p-10 bg-[#121212] border border-white/5 rounded-[40px] space-y-6 group hover:border-brand-yellow/30 transition-all">
              <div className="w-16 h-16 bg-brand-yellow/10 rounded-2xl flex items-center justify-center border border-brand-yellow/20 text-brand-yellow">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest">PRESENÇA NACIONAL</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Esteja onde o Brasil encontra. Tenha um mini-site profissional dentro da maior plataforma de serviços do país.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive FAQ / How it Works */}
      <section className="py-32 border-b border-white/5 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter">O QUE VOCÊ <span className="text-brand-yellow">PRECISA SABER</span></h2>
          </div>

          <div className="space-y-6">
            {[
              { q: 'Quanto custa para anunciar?', a: 'Você pode começar com nosso Plano Gratuito e ter até 3 fotos no portfólio. Para maior visibilidade, oferecemos planos Destaque e Premium.' },
              { q: 'Como recebo o contato dos clientes?', a: 'Os clientes entram em contato diretamente pelo seu WhatsApp. Nós não intermediamos a negociação e não cobramos porcentagem sobre seus serviços.' },
              { q: 'Como funcionam as avaliações?', a: 'Ao concluir um serviço, peça para seu cliente avaliar seu perfil. Perfis com melhores notas sobem automaticamente no nosso ranking de busca.' },
              { q: 'Posso cancelar minha assinatura?', a: 'Sim, você tem total liberdade. Nossos planos são mensais e podem ser cancelados a qualquer momento pelo seu painel profissional.' }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-[#121212] border border-white/5 rounded-[32px] space-y-4">
                <h4 className="text-sm font-black text-brand-yellow uppercase tracking-widest flex items-center space-x-3">
                  <Zap className="w-4 h-4 fill-brand-yellow" />
                  <span>{item.q}</span>
                </h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-yellow/5 animate-pulse pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-10">
          <h2 className="text-4xl sm:text-6xl font-display font-black text-white italic uppercase tracking-tighter">PRONTO PARA O <span className="text-brand-yellow">PRÓXIMO NÍVEL?</span></h2>
          <p className="max-w-xl mx-auto text-slate-500 text-sm font-medium">Junte-se a milhares de profissionais que já estão transformando suas carreiras com o TáNaMão Brasil.</p>
          <button
            onClick={() => onNavigate('auth', { mode: 'register' })}
            className="h-16 px-16 bg-brand-yellow text-black font-black text-sm uppercase tracking-[0.3em] rounded-2xl hover:scale-110 transition-all shadow-2xl shadow-brand-yellow/30 italic"
          >
            QUERO COMEÇAR AGORA
          </button>
        </div>
      </section>

    </div>
  );
}
