import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Optional stagger delay in ms
  threshold?: number; // 0.0 to 1.0 (how much of element must be visible)
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className = '', 
  delay = 0, 
  threshold = 0.1 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we don't need to observe anymore (trigger once)
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: threshold,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before the very bottom
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold]);

  // Logic: 
  // 1. Initially opacity-0 via Tailwind class to hide it.
  // 2. When visible, apply 'animate-bio-entry'.
  // 3. Apply inline animationDelay for staggering multiple items.
  
  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? 'animate-bio-entry' : 'opacity-0'}`}
      style={isVisible ? { animationDelay: `${delay}ms` } : {}}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;