import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let hasMoved = false;

    // Initially hide cursor elements via direct DOM manipulation to avoid React render cycle delays
    if (dot) dot.style.opacity = '0';
    if (ring) ring.style.opacity = '0';

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!hasMoved) {
        hasMoved = true;
        // Snap ring to current position immediately to prevent "flying in" from 0,0
        ringX = mouseX;
        ringY = mouseY;
        
        if (dot) dot.style.opacity = '1';
        if (ring) ring.style.opacity = '1';
      }
      
      if (dot) {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    };

    const onMouseDown = () => {
      if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(0.8)`;
    };

    const onMouseUp = () => {
      if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(${isHovering ? 1.5 : 1})`;
    };

    // Add event listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Hover detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'button' || 
          target.tagName.toLowerCase() === 'a' || 
          target.tagName.toLowerCase() === 'input' ||
          target.closest('button') || 
          target.closest('a') ||
          target.classList.contains('cursor-hover')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mouseover', handleMouseOver);

    // Animation loop for smooth ring movement
    const animate = () => {
      if (!hasMoved) {
        requestAnimationFrame(animate);
        return;
      }

      // Linear interpolation (Lerp) for delay effect
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (ring) {
        // We center the ring by subtracting half its width/height (32px / 2 = 16)
        // However, translate works from top-left, so we position top-left at ringX, ringY 
        // and use CSS to center the circle relative to that point
        const scale = isHovering ? 1.5 : 1;
        ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(${scale})`;
      }
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationId);
    };
  }, [isHovering]);

  const cursorPortal = document.getElementById('cursor-root');
  if (!cursorPortal) return null;

  return ReactDOM.createPortal(
    <>
      {/* Outer Ring */}
      <div 
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-8 h-8 border border-emerald-500 rounded-full pointer-events-none -ml-4 -mt-4 transition-colors duration-300 z-[9999] mix-blend-difference opacity-0"
        style={{ willChange: 'transform, opacity' }}
      >
         {/* Decorative ticks on ring */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[2px] w-[2px] h-[4px] bg-emerald-500"></div>
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[2px] w-[2px] h-[4px] bg-emerald-500"></div>
         <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[2px] w-[4px] h-[2px] bg-emerald-500"></div>
         <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] w-[4px] h-[2px] bg-emerald-500"></div>
      </div>
      
      {/* Inner Dot */}
      <div 
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-emerald-400 rounded-full pointer-events-none -ml-1 -mt-1 z-[9999] mix-blend-difference opacity-0"
        style={{ willChange: 'transform, opacity' }}
      />
    </>,
    cursorPortal
  );
};

export default CustomCursor;