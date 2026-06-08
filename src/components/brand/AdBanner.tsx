import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AdBannerProps {
  className?: string;
  type?: 'horizontal' | 'large' | 'sidebar';
}

export const AdBanner = ({ className = "", type = 'horizontal' }: AdBannerProps) => {
  return (
    <div className={`relative overflow-hidden group cursor-pointer transition-all ${className}`}>
      {/* Background with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow/10 via-[#1A1A1A] to-brand-yellow/10 group-hover:from-brand-yellow/20 transition-all duration-700" />
      <div className="absolute -inset-1 bg-brand-yellow/20 blur opacity-0 group-hover:opacity-100 transition duration-500" />
      
      <div className="relative border border-white/5 group-hover:border-brand-yellow/30 rounded-[24px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center shadow-lg shadow-brand-yellow/20 shrink-0">
            <Rocket className="w-8 h-8 text-black animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Sparkles className="w-4 h-4 text-brand-yellow" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-yellow italic">Espaço Publicitário</span>
            </div>
            <h3 className="text-xl font-display font-black text-white italic uppercase tracking-tighter">ANUNCIE SUA MARCA AQUI</h3>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">Sua empresa em destaque para milhares de clientes todos os dias.</p>
          </div>
        </div>

        <button className="h-12 px-8 bg-white/5 border border-white/10 group-hover:bg-brand-yellow group-hover:text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center space-x-3 italic">
          <span>Quero Anunciar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const Rocket = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2s-7 10-13.05 13z" />
    <path d="M9 15c-1.87 2.62-4.13 4.13-5 5-2-1-2-4-2-4 0-2 4-5 4-5 1.5 0 3 .5 3 4z" />
  </svg>
);
