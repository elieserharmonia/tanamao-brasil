import React from 'react';

export const LogoSymbol = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`${className} bg-white rounded-full flex items-center justify-center border-2 border-[#0D0D0D] shadow-sm`}>
    <svg viewBox="0 0 100 100" className="w-7 h-7">
      <path d="M22 25 L49 33 V80 H36 V41 L22 33 Z" fill="#FFD100" />
      <path d="M78 25 L51 33 V80 H64 V41 L78 33 Z" fill="#0D0D0D" />
    </svg>
  </div>
);

export const LogoHorizontal = ({ className = "h-12", variant = "dark" }: { className?: string, variant?: "light" | "dark" }) => (
  <div className={`flex items-center space-x-3 ${className}`}>
    <LogoSymbol className="w-10 h-10" />
    <div className="flex flex-col justify-center">
      <span className={`text-xl font-display font-black tracking-tighter uppercase italic leading-none ${variant === "light" ? "text-[#0D0D0D]" : "text-white"}`}>
        TáNaMão <span className="text-[#FFD100]">Brasil</span>
      </span>
      <span className={`text-[7px] font-black uppercase tracking-[0.4em] mt-1 ${variant === "light" ? "text-black/40" : "text-white/40"}`}>
        O Brasil encontra aqui.
      </span>
    </div>
  </div>
);

export const LogoVertical = ({ className = "w-32", variant = "dark" }: { className?: string, variant?: "light" | "dark" }) => (
  <div className={`flex flex-col items-center text-center ${className}`}>
    <LogoSymbol className="w-16 h-16 border-[3px] mb-4" />
    <span className={`text-2xl font-display font-black tracking-tighter uppercase italic leading-none ${variant === "light" ? "text-[#0D0D0D]" : "text-white"}`}>
      TáNaMão <span className="text-[#FFD100]">Brasil</span>
    </span>
    <span className={`text-[8px] font-black uppercase tracking-[0.4em] mt-2 ${variant === "light" ? "text-black/40" : "text-white/40"}`}>
      O Brasil encontra aqui.
    </span>
  </div>
);
