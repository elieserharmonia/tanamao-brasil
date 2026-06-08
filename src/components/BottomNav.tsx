import React from 'react';
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react';

interface BottomNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export const BottomNav = ({ activeView, onNavigate }: BottomNavProps) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'search', label: 'Buscar', icon: Search },
    { id: 'para-profissionais', label: 'Publicar', icon: PlusCircle },
    { id: 'chat', label: 'Mensagens', icon: MessageCircle },
    { id: 'dashboard', label: 'Perfil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-black/80 backdrop-blur-2xl border-t border-white/5 px-4 h-20 flex items-center justify-between">
      {tabs.map((tab) => {
        const isActive = activeView === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className="flex flex-col items-center justify-center space-y-1 group relative flex-1"
          >
            {isActive && (
              <div className="absolute -top-10 w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-yellow/30 animate-in slide-in-from-bottom-2 duration-300">
                <Icon className="w-6 h-6 text-black" />
              </div>
            )}
            
            <Icon className={`w-5 h-5 transition-all ${isActive ? 'opacity-0 scale-0' : 'text-slate-500 group-hover:text-white'}`} />
            <span className={`text-[8px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-brand-yellow pt-6' : 'text-slate-700'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
