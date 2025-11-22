import React from 'react';

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SponsorModal: React.FC<SponsorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-slate-50 dark:bg-slate-900 border-2 border-emerald-500/50 rounded-sm p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(16,185,129,0.2)]">
        {/* Decoration */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-emerald-500 transition-colors font-tech"
        >
          [CLOSE_X]
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-sci text-slate-800 dark:text-emerald-100 mb-2">FUEL_THE_SYSTEM</h2>
          <p className="font-tech text-emerald-600 dark:text-emerald-500 text-sm tracking-wider">
            SUPPORT THE CONTINUATION OF THIS SIMULATION
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Alipay Placeholder */}
          <div className="flex flex-col items-center group">
            <div className="w-48 h-48 bg-blue-500/10 border border-blue-500/30 rounded flex items-center justify-center mb-4 relative overflow-hidden group-hover:border-blue-500/60 transition-colors">
               {/* Mock QR Pattern */}
               <div className="absolute inset-0 p-4 opacity-50">
                 <div className="w-full h-full border-4 border-blue-500/20 border-dashed"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500/20"></div>
               </div>
               <span className="font-sci text-blue-500 font-bold text-xl z-10">ALIPAY</span>
            </div>
            <span className="font-tech text-slate-500 text-xs">SCAN_VIA_ALIPAY</span>
          </div>

          {/* WeChat Pay Placeholder */}
          <div className="flex flex-col items-center group">
            <div className="w-48 h-48 bg-green-500/10 border border-green-500/30 rounded flex items-center justify-center mb-4 relative overflow-hidden group-hover:border-green-500/60 transition-colors">
               {/* Mock QR Pattern */}
               <div className="absolute inset-0 p-4 opacity-50">
                 <div className="w-full h-full border-4 border-green-500/20 border-dashed"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-green-500/20"></div>
               </div>
               <span className="font-sci text-green-500 font-bold text-xl z-10">WECHAT</span>
            </div>
            <span className="font-tech text-slate-500 text-xs">SCAN_VIA_WECHAT</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 font-tech italic">
            "Generosity is the only variable the algorithm cannot predict."
          </p>
        </div>
      </div>
    </div>
  );
};

export default SponsorModal;