import React from 'react';
import { 
  Search, Menu, X, User, LogOut, ShieldAlert, MapPin, ChevronDown 
} from 'lucide-react';
import { Profile } from '../types';
import { LogoHorizontal } from './brand/Logo';

interface HeaderProps {
  currentUser: Profile | null;
  onNavigate: (view: string, params?: any) => void;
  onLogout: () => void;
  currentView: string;
}

export default function Header({ currentUser, onNavigate, onLogout, currentView }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      isScrolled ? 'bg-brand-yellow shadow-xl py-2' : 'bg-brand-yellow py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col space-y-4">
          
          {/* Top Row: Brand, Search, Actions */}
          <div className="flex items-center justify-between gap-8">
            {/* Logo Brand */}
            <button 
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} 
              className="flex items-center shrink-0 group transition-all"
            >
              <LogoHorizontal className="h-10 sm:h-12" variant="light" />
            </button>

            {/* Desktop Center Search (ML Style) */}
            <div className="hidden lg:flex flex-1 max-w-2xl relative group">
              <input 
                type="text" 
                placeholder="Busque por serviços ou profissionais..." 
                className="w-full h-12 pl-4 pr-12 bg-white rounded-lg shadow-sm border-none outline-none text-slate-800 font-medium placeholder:text-slate-400 focus:ring-2 ring-black/5"
              />
              <button className="absolute right-0 top-0 h-full w-12 flex items-center justify-center border-l border-slate-100 text-slate-400 hover:text-black transition-colors">
                <Search className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Desktop Auth/CTA */}
            <div className="hidden md:flex items-center space-x-6">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => onNavigate('dashboard')}
                    className="flex items-center space-x-3 bg-black/5 hover:bg-black/10 px-3 py-2 rounded-xl border border-black/5 transition-all text-black"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white overflow-hidden flex items-center justify-center ring-2 ring-white/50">
                      {currentUser.avatar_url ? (
                        <img src={currentUser.avatar_url} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-4 h-4 text-black" />
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Olá, {currentUser.full_name.split(' ')[0]}</span>
                  </button>
                  <button 
                  onClick={onLogout}
                  className="p-3 text-black/40 hover:text-black transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onNavigate('auth', { mode: 'login' })}
                    className="h-11 px-6 text-[10px] font-black text-black uppercase tracking-widest hover:bg-black/5 rounded-xl transition-all"
                  >
                    Entrar
                  </button>
                  <button 
                    onClick={() => onNavigate('para-profissionais')}
                    className="h-11 px-8 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg"
                  >
                    Sou Profissional
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center space-x-3">
               {currentUser && currentUser.role === 'admin' && (
                <button 
                  onClick={() => onNavigate('admin')}
                  className="p-2 rounded-lg border border-red-500/30 bg-white/20 text-red-600"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-black"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Bottom Row: Utilities */}
          <div className="hidden sm:flex items-center justify-between text-black/70 text-[10px] font-black uppercase tracking-widest italic">
            <div className="flex items-center space-x-8">
              <button className="flex items-center space-x-2 hover:text-black transition-colors group">
                <MapPin className="w-3.5 h-3.5 text-black group-hover:scale-110 transition-transform" />
                <span>📍 Enviar para Sorocaba 18000-000</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="flex items-center space-x-6 text-[9px] text-black">
                <button onClick={() => onNavigate('search', { categoryId: 'cat-eletricista' })} className="hover:underline">Eletricistas</button>
                <button onClick={() => onNavigate('search', { categoryId: 'cat-encanador' })} className="hover:underline">Encanadores</button>
                <button onClick={() => onNavigate('search', { categoryId: 'cat-diarista' })} className="hover:underline">Diaristas</button>
                <button onClick={() => onNavigate('search', { categoryId: 'cat-montador' })} className="hover:underline">Montadores</button>
                <button onClick={() => onNavigate('planos')} className="hover:underline text-black font-black">Planos Elite</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/5 bg-brand-yellow px-4 pt-2 pb-6 space-y-3 shadow-2xl">
          <button 
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-4 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-black hover:bg-black/5"
          >
            Início
          </button>
          <button 
            onClick={() => { onNavigate('search'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-4 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-black hover:bg-black/5"
          >
            Buscar Profissionais
          </button>
          <button 
            onClick={() => { onNavigate('para-profissionais'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-4 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-black hover:bg-black/5"
          >
            Sou Profissional
          </button>
          <button 
            onClick={() => { onNavigate('planos'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-4 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-black hover:bg-black/5"
          >
            Planos
          </button>

          {!currentUser && (
             <button 
                onClick={() => { onNavigate('auth', { mode: 'login' }); setMobileMenuOpen(false); }}
                className="w-full h-14 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
              >
                Entrar / Cadastrar
              </button>
          )}

          {currentUser && (
            <button 
              onClick={() => { onLogout(); setMobileMenuOpen(false); }}
              className="w-full h-14 border border-black/10 text-black text-[10px] font-black uppercase tracking-widest rounded-xl"
            >
              Sair da Conta
            </button>
          )}
        </div>
      )}
    </header>
  );
}
