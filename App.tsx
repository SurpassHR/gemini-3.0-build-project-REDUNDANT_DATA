import React, { useState, useEffect, useRef } from 'react';
import Background from './components/Background';
import AudioPlayer from './components/AudioPlayer';
import { HeroModule, OutlineModule, TimelineModule, WorldModule, ChaptersModule } from './components/ContentModules';
import EchoChat from './components/EchoChat';
import CustomCursor from './components/CustomCursor';
import CRTOverlay from './components/CRTOverlay';
import SponsorModal from './components/SponsorModal';
import { Section } from './types';

const navItems = [
  { id: Section.OUTLINE, label: 'SYNOPSIS', sub: '001' },
  { id: Section.TIMELINE, label: 'TIMELINE', sub: '002' },
  { id: Section.WORLD, label: 'DATABASE', sub: '003' },
  { id: Section.CHAPTERS, label: 'CHAPTERS', sub: '004' },
  { id: Section.ECHO, label: 'TALK_TO_ECHO', sub: 'AI', highlight: true },
];

interface SidebarItemProps {
  item: typeof navItems[0];
  mobile?: boolean;
  activeSection: Section;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, mobile = false, activeSection, onClick }) => (
  <button
    onClick={onClick}
    className={`relative group w-full text-left transition-all duration-300 overflow-hidden cursor-hover ${
      mobile ? 'py-4 border-b border-slate-200 dark:border-slate-800' : 'py-5 pl-8'
    } ${activeSection === item.id ? 'bg-emerald-100/50 dark:bg-emerald-900/10' : 'hover:bg-slate-100 dark:hover:bg-slate-900/50'}`}
  >
    {/* Active Indicator Line */}
    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 transition-transform duration-300 ${
      activeSection === item.id ? 'translate-x-0 shadow-[0_0_15px_#10b981]' : '-translate-x-full'
    }`} />

    <div className="flex items-baseline justify-between pr-6">
      <span className={`font-tech text-xs mr-2 ${activeSection === item.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600 group-hover:text-emerald-500/50'}`}>
        {item.sub}
      </span>
      <span className={`font-sci tracking-widest ${
        activeSection === item.id 
          ? 'text-emerald-700 dark:text-emerald-300 text-shadow-glow' 
          : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
      } ${item.highlight ? 'text-emerald-600 dark:text-emerald-200' : ''} ${mobile ? 'text-lg' : 'text-sm'}`}>
        {item.label}
      </span>
    </div>
    
    {/* Decorative connecting line for active state */}
    {activeSection === item.id && !mobile && (
      <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-[1px] opacity-50 hidden md:block" viewBox="0 0 50 1">
        <line x1="0" y1="0.5" x2="50" y2="0.5" stroke="#10b981" strokeDasharray="2 2" />
      </svg>
    )}
  </button>
);

interface ControlButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
  title: string;
}

const ControlButton: React.FC<ControlButtonProps> = ({ onClick, isActive, icon, title }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-md border transition-all duration-300 flex items-center justify-center cursor-hover ${
      isActive 
      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
      : 'bg-slate-200/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-emerald-500/10 dark:hover:bg-emerald-900/20'
    }`}
    title={title}
  >
    {icon}
  </button>
);

// New Component: Simulated System Status
const SystemStatus: React.FC = () => {
  const [cpuLoad, setCpuLoad] = useState(32);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad(prev => {
        // Fluctuate randomly but somewhat smoothly
        const change = (Math.random() - 0.5) * 20; 
        let next = prev + change;
        // occasional spikes
        if (Math.random() > 0.95) next += 30;
        // occasional drops
        if (Math.random() > 0.95) next -= 20;
        
        // Clamp between 5% and 99%
        return Math.min(Math.max(Math.floor(next), 5), 99);
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Determine color based on load
  let colorClass = 'bg-emerald-500/50 dark:bg-emerald-600/50';
  if (cpuLoad > 60) colorClass = 'bg-yellow-500/50 dark:bg-yellow-600/50';
  if (cpuLoad > 85) colorClass = 'bg-red-500/50 dark:bg-red-600/50';

  return (
    <div className="mb-4">
      <div className="flex justify-between text-[10px] font-tech text-slate-500 mb-2">
        <span>CPU_LOAD (SIM)</span>
        <span className="tabular-nums">{cpuLoad}%</span>
      </div>
      <div className="w-full h-1 bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden mb-1">
        <div 
            className={`h-full transition-all duration-700 ease-out ${colorClass}`} 
            style={{ width: `${cpuLoad}%` }}
        ></div>
      </div>
      <div className="text-[10px] text-slate-400 font-mono text-right">ID: 1042-LX</div>
    </div>
  );
};

const App: React.FC = () => {
  // State for Splash Screen vs Main App
  const [hasStarted, setHasStarted] = useState(false);
  
  // Default active section is now Outline/Synopsis
  const [activeSection, setActiveSection] = useState<Section>(Section.OUTLINE);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isCRTEnabled, setIsCRTEnabled] = useState(true);
  const [isSponsorOpen, setIsSponsorOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const renderContent = () => {
    switch (activeSection) {
      case Section.OUTLINE:
        return <OutlineModule />;
      case Section.TIMELINE:
        return <TimelineModule />;
      case Section.WORLD:
        return <WorldModule />;
      case Section.CHAPTERS:
        return <ChaptersModule />;
      case Section.ECHO:
        return <EchoChat />;
      default:
        return <OutlineModule />;
    }
  };

  return (
    <div className="h-screen w-full flex bg-transparent overflow-hidden relative">
      {/* Global Visuals Layer (Persists across Splash/Main) */}
      <Background theme={theme} />
      <CustomCursor />
      {isCRTEnabled && <CRTOverlay />}
      <SponsorModal isOpen={isSponsorOpen} onClose={() => setIsSponsorOpen(false)} />

      {/* --- SPLASH SCREEN (HERO) --- */}
      {!hasStarted ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center w-full h-full animate-bio-entry">
          <HeroModule onStart={() => setHasStarted(true)} />
        </div>
      ) : (
        // --- MAIN APPLICATION LAYOUT ---
        <div className="flex w-full h-full animate-[bioEntry_1s_cubic-bezier(0.34,1.56,0.64,1)_backwards]">
          {/* --- DESKTOP SIDEBAR --- */}
          <aside className="hidden md:flex w-80 flex-col border-r border-emerald-900/30 dark:border-emerald-900/30 border-slate-200 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md z-30 relative shadow-[5px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
            {/* Header / Logo */}
            <div className="h-24 flex flex-col justify-center px-8 border-b border-emerald-900/10 dark:border-emerald-900/30 relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="18" stroke="#10b981" strokeWidth="1" strokeDasharray="4 2" className="animate-[spin_10s_linear_infinite]" />
                </svg>
              </div>
              <div className="flex justify-between items-start">
                <h1 className="font-sci text-2xl text-slate-800 dark:text-emerald-100 tracking-tighter">
                  REDUNDANT<br/><span className="text-emerald-600 dark:text-emerald-500">DATA</span>
                </h1>
              </div>
              <div className="text-[10px] font-tech text-slate-500 mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
                ONLINE
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
              {navItems.map(item => (
                <SidebarItem 
                  key={item.id} 
                  item={item} 
                  activeSection={activeSection}
                  onClick={() => setActiveSection(item.id)}
                />
              ))}
            </nav>

            {/* Footer Status & Controls Block */}
            <div className="p-6 border-t border-emerald-900/10 dark:border-emerald-900/30 bg-slate-100/50 dark:bg-slate-900/50 shrink-0">
              {/* Status Bar Component */}
              <SystemStatus />

              {/* System Controls Grid */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-300 dark:border-slate-800">
                  {/* Theme Toggle */}
                  <ControlButton 
                    onClick={toggleTheme} 
                    isActive={theme === 'dark'}
                    title="Toggle Theme"
                    icon={theme === 'dark' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    )}
                  />
                  
                  {/* CRT Toggle */}
                  <ControlButton 
                    onClick={() => setIsCRTEnabled(!isCRTEnabled)} 
                    isActive={isCRTEnabled}
                    title="Toggle CRT Effect"
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    }
                  />

                  {/* Audio Toggle */}
                  <AudioPlayer className="w-full" />

                  {/* Sponsor Button */}
                  <ControlButton 
                    onClick={() => setIsSponsorOpen(true)}
                    isActive={isSponsorOpen}
                    title="Support / Sponsor"
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    }
                  />
              </div>
            </div>

            {/* Decorative Spine */}
            <div className="absolute left-0 bottom-0 top-0 w-[1px] bg-gradient-to-b from-transparent via-slate-300 dark:via-emerald-900 to-transparent opacity-50"></div>
          </aside>


          {/* --- MOBILE HEADER --- */}
          <div className="md:hidden fixed top-0 w-full h-16 z-40 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-emerald-900/20 dark:border-emerald-900/50 flex justify-between px-4 items-center">
            <div className="font-sci text-slate-800 dark:text-emerald-100 text-sm">REDUNDANT <span className="text-emerald-600 dark:text-emerald-500">DATA</span></div>
            <div className="flex items-center gap-3">
              {/* Mobile Control Set */}
              <button onClick={() => setIsCRTEnabled(!isCRTEnabled)} className={`p-2 rounded ${isCRTEnabled ? 'text-emerald-500' : 'text-slate-500'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </button>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-emerald-600 dark:text-emerald-400 border border-emerald-900/20 dark:border-emerald-900/50 rounded bg-emerald-900/5 dark:bg-emerald-900/10"
              >
                {isMobileMenuOpen ? 'CLOSE' : 'MENU'}
              </button>
            </div>
          </div>

          {/* --- MOBILE MENU OVERLAY --- */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-30 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl pt-20 px-6 flex flex-col animate-[fadeIn_0.2s_ease-out]">
              <div className="flex justify-end gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                <ControlButton onClick={toggleTheme} isActive={theme === 'dark'} icon={theme === 'dark' ? "🌞" : "🌙"} title="Theme" />
                <ControlButton onClick={() => setIsSponsorOpen(true)} icon="❤️" title="Sponsor" />
                <div className="w-10"><AudioPlayer className="w-full h-full" /></div>
              </div>
              {navItems.map(item => (
                <SidebarItem 
                  key={item.id} 
                  item={item} 
                  mobile={true}
                  activeSection={activeSection}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                />
              ))}
            </div>
          )}

          {/* --- MAIN CONTENT AREA --- */}
          <main className="flex-1 h-full overflow-y-auto relative z-10 scroll-smooth custom-scrollbar">
            {/* Top decoration for large screens */}
            <div className="hidden md:flex absolute top-0 left-0 w-full h-8 items-center px-6 border-b border-slate-300 dark:border-emerald-900/20 pointer-events-none justify-between">
                <div className="text-[10px] font-tech text-slate-400 dark:text-slate-600">SYSTEM_READY</div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-slate-300 dark:bg-emerald-900/50 rounded-full"></div>
                  ))}
                </div>
            </div>

            {/* Content Container */}
            <div className="w-full max-w-6xl mx-auto p-6 md:p-12 md:pt-16 min-h-full flex flex-col cursor-default">
                {/* Key prop triggers re-mount to reset internal child animations. */}
                <div key={activeSection} className="flex-grow">
                  {renderContent()}
                </div>
                
                {/* Footer within scroll area */}
                <footer className="mt-20 pt-8 border-t border-slate-300 dark:border-slate-800 text-center md:text-left text-slate-500 dark:text-slate-600 font-tech text-xs">
                  &copy; 2024 SINGULARITY_LOGS // END_OF_FILE
                </footer>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;