
import React, { useState, useEffect, useRef } from 'react';

interface AudioPlayerProps {
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ className }) => {
  // Default to enabled (attempt auto-play)
  const [isPlaying, setIsPlaying] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Keep track of all nodes to stop them properly
  const nodesRef = useRef<AudioNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const startAudio = () => {
    // Use standard AudioContext with webkit fallback
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    // Initialize context if needed
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;
    
    // Resume if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume().catch(e => console.debug("Audio resume failed, waiting for interaction", e));
    }

    // Prevent multiple sources
    if (nodesRef.current.length > 0) return;

    // --- GENERATIVE SCI-FI DRONE SYNTHESIZER ---
    
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.4, now + 4); // Slow cinematic fade in
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Frequencies for a Dark D Minor Drone (Sci-fi standard)
    // D2 (Low), A2 (Fifth), D3 (Octave), F3 (Minor Third - faint)
    const droneLayers = [
        { freq: 73.42, type: 'sawtooth', vol: 0.15, pan: -0.3 }, // D2
        { freq: 110.00, type: 'triangle', vol: 0.15, pan: 0.3 }, // A2
        { freq: 146.83, type: 'triangle', vol: 0.1, pan: 0 },    // D3
        { freq: 36.71, type: 'sine', vol: 0.3, pan: 0 }          // D1 (Sub Bass)
    ];

    droneLayers.forEach(layer => {
        const osc = ctx.createOscillator();
        osc.type = layer.type as OscillatorType;
        osc.frequency.value = layer.freq;
        
        // Detune slightly for organic "drift"
        const drift = (Math.random() - 0.5) * 8;
        osc.detune.value = drift;

        // Filter to make it soft/atmospheric (remove harsh highs)
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300; // Start dark
        filter.Q.value = 1;

        // LFO for Filter breathing (Slow movement)
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.05 + (Math.random() * 0.05); // Very slow cycle (10-20s)
        
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 150; // Modulate filter cutoff by +/- 150Hz
        
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        
        // Stereo Panner for width
        const panner = ctx.createStereoPanner();
        panner.pan.value = layer.pan;

        // Volume gain
        const oscGain = ctx.createGain();
        oscGain.gain.value = layer.vol;

        // Connect graph: LFO -> Filter Freq | Osc -> Filter -> Gain -> Panner -> Master
        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(panner);
        panner.connect(masterGain);

        // Start oscillators
        osc.start();
        lfo.start();

        // Store nodes for cleanup
        nodesRef.current.push(osc, lfo, lfoGain, filter, oscGain, panner);
    });

    setIsPlaying(true);
  };

  const stopAudio = () => {
    const ctx = audioCtxRef.current;
    if (masterGainRef.current && ctx) {
        // Fade out nicely
        const now = ctx.currentTime;
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
        masterGainRef.current.gain.linearRampToValueAtTime(0, now + 1.5); // 1.5s fade out
        
        setTimeout(() => {
            cleanupNodes();
        }, 1500);
    } else {
        cleanupNodes();
    }
    setIsPlaying(false);
  };

  const cleanupNodes = () => {
      nodesRef.current.forEach(node => {
          if (node instanceof OscillatorNode) {
              try { node.stop(); } catch(e) {}
          }
          node.disconnect();
      });
      nodesRef.current = [];
      if (masterGainRef.current) {
          masterGainRef.current.disconnect();
          masterGainRef.current = null;
      }
  };

  // Auto-start and Cleanup
  useEffect(() => {
    startAudio();

    const handleFirstClick = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };
    document.addEventListener('click', handleFirstClick, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstClick);
      stopAudio();
      if (audioCtxRef.current) {
          audioCtxRef.current.close();
          audioCtxRef.current = null;
      }
    };
  }, []);

  // UI classes
  const baseClasses = "p-2 rounded-md border transition-all duration-300 flex items-center justify-center cursor-hover";
  const activeClasses = isPlaying 
    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
    : 'bg-slate-200/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-emerald-500/10 dark:hover:bg-emerald-900/20';

  return (
    <button
      onClick={togglePlay}
      className={`${baseClasses} ${activeClasses} ${className || ''}`}
      aria-label="Toggle BGM"
      title={isPlaying ? "Mute Ambient Drone" : "Play Ambient Drone"}
    >
      {isPlaying ? (
        <div className="flex space-x-[2px] h-3 items-end">
            <div className="w-[2px] h-2 bg-current animate-[bounce_2s_infinite]"></div>
            <div className="w-[2px] h-3 bg-current animate-[bounce_3s_infinite]"></div>
            <div className="w-[2px] h-1.5 bg-current animate-[bounce_2.5s_infinite]"></div>
        </div>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      )}
    </button>
  );
};

export default AudioPlayer;
