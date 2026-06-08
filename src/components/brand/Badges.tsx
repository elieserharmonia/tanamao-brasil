import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Crown, 
  Star 
} from 'lucide-react';

interface BadgeProps {
  type: 'free' | 'featured' | 'premium' | 'verified';
  className?: string;
  showText?: boolean;
}

export const Badge = ({ type, className = '', showText = true }: BadgeProps) => {
  const configs = {
    free: {
      color: 'bg-slate-800 text-slate-400 border-slate-700',
      icon: null,
      text: 'Básico'
    },
    featured: {
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      icon: <Award className="w-3.5 h-3.5" />,
      text: 'Destaque'
    },
    premium: {
      color: 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20',
      icon: <Crown className="w-3.5 h-3.5" />,
      text: 'Premium Elite'
    },
    verified: {
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      text: 'Verificado'
    }
  };

  const config = configs[type];

  return (
    <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest italic shadow-sm hover:scale-105 transition-transform ${config.color} ${className}`}>
      {config.icon}
      {showText && <span>{config.text}</span>}
    </div>
  );
};

export const PlanBadge = ({ plan }: { plan: string }) => {
  if (plan === 'premium') return <Badge type="premium" />;
  if (plan === 'featured') return <Badge type="featured" />;
  return <Badge type="free" />;
};
