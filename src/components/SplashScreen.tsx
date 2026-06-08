import React from 'react';
import { LogoVertical } from './brand/Logo';
import { motion, AnimatePresence } from 'motion/react';

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[1000] bg-brand-yellow flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Custom SVG Logo for the exact Branding */}
            <div className="w-32 h-32 bg-black rounded-[40px] flex items-center justify-center shadow-2xl mb-8">
               <svg viewBox="0 0 100 100" className="w-20 h-20 fill-[#FFD100]">
                 <path d="M20 20 H80 V35 H57 V80 H43 V35 H20 Z" />
               </svg>
            </div>
            <h1 className="text-4xl font-display font-black tracking-tighter text-black uppercase italic">
              TáNaMão <span className="opacity-60">Brasil</span>
            </h1>
            <div className="mt-8 flex space-x-2">
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
