import React, { useEffect, useState, useRef } from 'react';

interface DataFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  type: 'PERSONNEL' | 'DATABASE' | 'SYSTEM' | 'CHRONICLE';
  children: React.ReactNode;
}

const DataFileModal: React.FC<DataFileModalProps> = ({ isOpen, onClose, title, subtitle, type, children }) => {
  const [isRendered, setIsRendered] = useState(false);
  // Cache content to preserve it during the closing animation when parent might have already set data to null
  const [cachedContent, setCachedContent] = useState<{title: string, subtitle: string, type: string, children: React.ReactNode} | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setCachedContent({ title, subtitle, type, children });
    } else {
      // Wait for animation to finish before unmounting
      // Acceleration: Reduced from 500ms to 250ms to match new animation speed
      const timer = setTimeout(() => {
        setIsRendered(false);
        setCachedContent(null); // Clean up
      }, 250); 
      return () => clearTimeout(timer);
    }
  }, [isOpen, title, subtitle, type, children]);

  if (!isRendered && !isOpen) return null;

  // Use current props if open, otherwise use cached props for the exit animation
  const content = isOpen ? { title, subtitle, type, children } : cachedContent;
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
      {/* Darkened Backdrop with fade */}
      <div 
        className={`absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      {/* Main Modal Frame with 3D Flip Animation */}
      {/* Acceleration: Exit animation set to 0.25s */}
      <div 
        className={`relative w-full max-w-4xl h-[85vh] bg-slate-50 dark:bg-slate-950 border border-emerald-500/40 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] clip-path-modal ${isOpen ? 'animate-[fileFlipIn_0.6s_cubic-bezier(0.23,1,0.32,1)_forwards]' : 'animate-[fileFlipOut_0.25s_ease-in_forwards]'}`}
      >
        
        {/* Decoration Lines */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
        
        {/* Header */}
        <div className="shrink-0 h-16 bg-emerald-900/10 dark:bg-emerald-900/20 border-b border-emerald-500/20 flex items-center justify-between px-6 select-none">
            <div className="flex items-center gap-4">
                <div className={`w-2 h-8 ${content.type === 'PERSONNEL' ? 'bg-emerald-500' : content.type === 'CHRONICLE' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                <div>
                    <h2 className="font-sci text-xl md:text-2xl text-slate-800 dark:text-emerald-100 tracking-widest uppercase">{content.title}</h2>
                    <div className="font-tech text-xs text-emerald-600 dark:text-emerald-500/70 tracking-[0.2em]">{content.type}_FILE // {content.subtitle}</div>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="group flex items-center gap-2 px-4 py-2 border border-emerald-500/30 hover:bg-emerald-500/10 transition-all"
            >
                <span className="font-tech text-xs text-emerald-600 group-hover:text-emerald-400">CLOSE_VIEWER</span>
                <div className="w-4 h-4 relative">
                    <div className="absolute inset-0 border border-emerald-500/50 rotate-45 group-hover:rotate-90 transition-transform"></div>
                </div>
            </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative">
             {/* Background Grid */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(0deg,transparent_24%,#10b981_25%,#10b981_26%,transparent_27%,transparent_74%,#10b981_75%,#10b981_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,#10b981_25%,#10b981_26%,transparent_27%,transparent_74%,#10b981_75%,#10b981_76%,transparent_77%,transparent)] bg-[length:50px_50px]"></div>
             
             <div className="relative z-10">
                {content.children}
             </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 h-8 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 font-tech text-[10px] text-slate-400 uppercase">
            <span>SECURE_CONNECTION_ESTABLISHED</span>
            <span>READ_ONLY_ACCESS</span>
        </div>
      </div>
    </div>
  );
};

export default DataFileModal;