import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  theme: 'light' | 'dark';
}

const Background: React.FC<BackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      phase: number;
    }

    const nodes: Node[] = [];
    const nodeCount = 60;
    const connectionDistance = 150;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      // Colors based on theme
      const isDark = theme === 'dark';
      const bgColor = isDark ? '#020617' : '#f8fafc'; // slate-950 vs slate-50
      const nodeColor = isDark ? '16, 185, 129' : '5, 150, 105'; // emerald-500 vs emerald-600
      const lineColor = isDark ? '16, 185, 129' : '100, 116, 139'; // emerald-500 vs slate-500
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Bounce
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Pulse
        node.phase += 0.02;
        const pulse = Math.sin(node.phase) * 0.5 + 1; // 0.5 to 1.5

        // Draw Node (Biocell)
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nodeColor}, ${0.3 * pulse})`; 
        ctx.fill();

        // Draw Connections (Synapses)
        for (let j = i + 1; j < nodeCount; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            // Quadratic curve for organic feel
            const cx = (node.x + other.x) / 2 + (Math.random() - 0.5) * 5;
            const cy = (node.y + other.y) / 2 + (Math.random() - 0.5) * 5;
            
            ctx.quadraticCurveTo(cx, cy, other.x, other.y);
            
            const opacity = 1 - dist / connectionDistance;
            // Light mode lines are more subtle slate, Dark mode are glowing emerald
            const lineOpacity = isDark ? opacity * 0.15 : opacity * 0.1;
            ctx.strokeStyle = `rgba(${lineColor}, ${lineOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      // Vignette
      // In light mode, vignette is white/greyish. In dark mode, it's black/dark slate.
      const gradient = ctx.createRadialGradient(width / 2, height / 2, height / 3, width / 2, height / 2, height);
      if (isDark) {
        gradient.addColorStop(0, 'rgba(2, 6, 23, 0)');
        gradient.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      } else {
        gradient.addColorStop(0, 'rgba(248, 250, 252, 0)');
        gradient.addColorStop(1, 'rgba(248, 250, 252, 0.8)');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      requestAnimationFrame(draw);
    };

    let animationFrame = requestAnimationFrame(draw);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none transition-colors duration-1000"
    />
  );
};

export default Background;