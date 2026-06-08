import React from 'react';
import { Award, ShieldCheck, Users, Globe } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="pt-24 pb-20 animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 space-y-20">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-display font-black uppercase italic tracking-tighter leading-none">
            Transformando o jeito que o <span className="text-brand-yellow">Brasil</span> contrata.
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            O TáNaMão Brasil nasceu para conectar quem precisa de serviços com quem sabe fazer, de forma justa, rápida e segura.
          </p>
        </div>

        {/* Vision/Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-[#121212] border border-white/5 p-10 rounded-[40px] space-y-4">
            <h3 className="text-2xl font-display font-black uppercase italic text-brand-yellow">Nossa Missão</h3>
            <p className="text-slate-400 leading-relaxed">
              Empoderar trabalhadores autônomos brasileiros através da tecnologia, 
              proporcionando visibilidade digital e oportunidades reais de crescimento financeiro.
            </p>
          </div>
          <div className="bg-[#121212] border border-white/5 p-10 rounded-[40px] space-y-4">
            <h3 className="text-2xl font-display font-black uppercase italic text-brand-yellow">Nossa Visão</h3>
            <p className="text-slate-400 leading-relaxed">
              Ser a maior e mais confiável rede de serviços profissionais do país, 
              sendo referência em qualidade, transparência e impacto social.
            </p>
          </div>
        </div>

        {/* Numbers/Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Cidades', value: '250+', icon: Globe },
            { label: 'Profissionais', value: '15k+', icon: Users },
            { label: 'Avaliações', value: '50k+', icon: ShieldCheck },
            { label: 'Categorias', value: '120+', icon: Award },
          ].map((stat, i) => (
            <div key={i} className="p-8 bg-white/5 rounded-3xl text-center space-y-2 border border-white/5">
              <stat.icon className="w-5 h-5 text-brand-yellow mx-auto opacity-50" />
              <span className="block text-3xl font-display font-black">{stat.value}</span>
              <span className="block text-[9px] font-black uppercase tracking-widest text-slate-500 italic">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Culture */}
        <div className="space-y-10">
          <h2 className="text-3xl font-display font-black uppercase italic text-center">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Transparência', desc: 'Preços e avaliações reais sem letras miúdas.' },
              { title: 'Qualidade', desc: 'Curadoria de profissionais comprometidos com a excelência.' },
              { title: 'Rapidez', desc: 'A solução que você precisa, onde e quando precisar.' },
            ].map((v, i) => (
              <div key={i} className="space-y-3">
                <div className="w-10 h-10 bg-brand-yellow text-black font-black flex items-center justify-center rounded-full italic">0{i+1}</div>
                <h4 className="text-lg font-black uppercase italic">{v.title}</h4>
                <p className="text-slate-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
