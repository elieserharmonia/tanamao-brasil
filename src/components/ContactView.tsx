import React from 'react';
import { Mail, MessageCircle, Phone, MapPin, Send } from 'lucide-react';

export default function ContactView() {
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="pt-24 pb-20 animate-fade-in">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Info Section */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-display font-black uppercase italic tracking-tighter leading-none">
                Fala com a gente.
              </h1>
              <p className="text-slate-400 text-lg font-medium">
                Dúvidas, sugestões ou suporte técnico? Nossa equipe está pronta para te ajudar a encontrar a melhor solução.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center space-x-6 group">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-brand-yellow/50 transition-all">
                  <Mail className="w-6 h-6 text-brand-yellow" />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 italic">E-mail Oficial</span>
                  <span className="text-xl font-bold">contato@tanamao.com.br</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 group">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-brand-yellow/50 transition-all">
                  <MessageCircle className="w-6 h-6 text-brand-yellow" />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 italic">WhatsApp Suporte</span>
                  <span className="text-xl font-bold">+55 (15) 99999-9999</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 group">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-brand-yellow/50 transition-all">
                  <MapPin className="w-6 h-6 text-brand-yellow" />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Sede Brasil</span>
                  <span className="text-xl font-bold">Av. Paulista, 1000 - São Paulo/SP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-[#121212] border border-white/5 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Send className="w-40 h-40" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-4">Como podemos te chamar?</label>
                <input 
                  required
                  type="text" 
                  placeholder="Seu nome completo"
                  className="w-full h-16 bg-black border border-white/10 rounded-2xl px-6 outline-none focus:border-brand-yellow/50 transition-all text-sm font-bold"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-4">Qual seu melhor e-mail?</label>
                <input 
                  required
                  type="email" 
                  placeholder="exemplo@email.com"
                  className="w-full h-16 bg-black border border-white/10 rounded-2xl px-6 outline-none focus:border-brand-yellow/50 transition-all text-sm font-bold"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic ml-4">O que aconteceu?</label>
                <textarea 
                  required
                  placeholder="Escreva sua mensagem aqui..."
                  rows={5}
                  className="w-full bg-black border border-white/10 rounded-2xl p-6 outline-none focus:border-brand-yellow/50 transition-all text-sm font-bold resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full h-16 bg-brand-yellow text-black font-display font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-brand-yellow/10 flex items-center justify-center space-x-3"
              >
                <span>Enviar Mensagem</span>
                <Send className="w-4 h-4" />
              </button>

              {sent && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-center text-xs font-bold animate-fade-in">
                  Mensagem enviada com sucesso! Retornaremos em breve.
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
