import React from 'react';
import { Hammer, ShieldCheck, Heart, MapPin, Sparkles } from 'lucide-react';
import { SEED_CATEGORIES, SEED_CITIES } from '../db/seedData';
import { LogoHorizontal } from './brand/Logo';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#0D0D0D] text-slate-500 border-t border-white/5 pt-24 pb-12 font-sans relative overflow-hidden">
      
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-yellow/5 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Segment: Brand & Declarations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          <div className="space-y-8">
            <LogoHorizontal className="h-12" />
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              O Brasil encontra aqui. A maior rede de conexão direta entre profissionais autônomos e clientes. 
              Sem pagar comissão, sem burocracia, 100% liberdade para o seu negócio.
            </p>
            <div className="pt-4 flex items-center space-x-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
              <ShieldCheck className="w-4 h-4 text-brand-yellow" />
              <span>Conexão Segura Direct Zap</span>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">
              Especialidades
            </h4>
            <ul className="space-y-4 text-sm font-semibold">
              {SEED_CATEGORIES.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => onNavigate('search', { categoryId: cat.id })}
                    className="hover:text-brand-yellow transition-colors text-left"
                  >
                    {cat.nome}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">
              Institucional
            </h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li>
                <button 
                  onClick={() => onNavigate('sobre')}
                  className="hover:text-brand-yellow transition-colors text-left"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('como-funciona')}
                  className="hover:text-brand-yellow transition-colors text-left"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contato')}
                  className="hover:text-brand-yellow transition-colors text-left"
                >
                  Contato
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('termos')}
                  className="hover:text-brand-yellow transition-colors text-left"
                >
                  Termos de Uso
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('privacidade')}
                  className="hover:text-brand-yellow transition-colors text-left"
                >
                  Privacidade
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">
              Negócios
            </h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li>
                <button 
                  onClick={() => onNavigate('para-profissionais')}
                  className="hover:text-brand-yellow transition-colors text-left"
                >
                  Para Profissionais
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('planos')}
                  className="hover:text-brand-yellow transition-colors text-left"
                >
                  Planos e Preços
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('auth', { mode: 'login' })}
                  className="hover:text-brand-yellow transition-colors text-left"
                >
                  Acesso Profissional
                </button>
              </li>
            </ul>
            <div className="pt-8">
              <div className="bg-brand-yellow/10 rounded-2xl p-6 border border-brand-yellow/20 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-yellow">
                  Elite Premium
                </p>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-widest italic font-black">
                  Seu negócio no topo das buscas hoje.
                </p>
                <button 
                  onClick={() => onNavigate('planos')}
                  className="w-full h-12 rounded-xl bg-brand-yellow text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-all"
                >
                  Ver Planos
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Mid segment: Content disclaimer */}
        <div className="border-t border-white/5 py-12 text-[10px] text-slate-500 leading-relaxed font-medium space-y-4 max-w-4xl">
          <p className="uppercase tracking-widest text-slate-400 font-black mb-2">Aviso Legal</p>
          <p>
            O TáNaMão Brasil é uma plataforma de busca e anúncios de profissionais autônomos. Toda contratação, negociação de valores, garantias e prazos são de responsabilidade exclusiva entre as partes. Não retemos pagamentos e não cobramos comissões sobre os serviços executados.
          </p>
        </div>

        {/* Bottom Segment */}
        <div className="border-t border-white/5 pt-12 flex flex-col sm:flex-row items-center justify-between text-[11px] font-black tracking-widest uppercase text-slate-600">
          <div>
            &copy; {new Date().getFullYear()} TáNaMão Brasil. Todos os direitos reservados.
          </div>
          <div className="flex items-center space-x-2 mt-6 sm:mt-0">
            <span>Orgulhosamente Brasileiro</span>
            <div className="w-4 h-4 bg-brand-yellow rounded-sm" />
          </div>
        </div>
      </div>
    </footer>
  );
}
