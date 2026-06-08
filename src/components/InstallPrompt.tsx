import React from 'react';
import { Download, X } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShow(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[100] animate-bounce-in">
      <div className="bg-brand-yellow text-black p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-black/10">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Download className="w-5 h-5 text-brand-yellow" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">Instale o App</p>
            <p className="text-xs font-bold">TáNaMão no seu celular</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleInstall}
            className="h-10 px-4 bg-black text-brand-yellow text-[10px] font-black uppercase tracking-widest rounded-xl"
          >
            Instalar
          </button>
          <button 
            onClick={() => setShow(false)}
            className="w-10 h-10 flex items-center justify-center hover:bg-black/10 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
