import React from 'react';

const CRTOverlay: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden h-full w-full crt-curvature">
      {/* Scanlines */}
      <div className="absolute inset-0 scanlines opacity-50 pointer-events-none"></div>
      
      {/* Screen flicker and subtle noise */}
      <div className="absolute inset-0 bg-white crt-flicker pointer-events-none mix-blend-overlay"></div>
      
      {/* Chromatic Aberration (Subtle RGB split at edges) */}
      <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,0,0,0.1),inset_0_0_10px_rgba(0,255,0,0.1),inset_0_0_30px_rgba(0,0,255,0.1)] pointer-events-none"></div>
    </div>
  );
};

export default CRTOverlay;