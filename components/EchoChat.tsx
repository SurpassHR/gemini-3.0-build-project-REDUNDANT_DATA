import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToEcho } from '../services/geminiService';
import { ChatMessage } from '../types';

const EchoChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Connection established. Biometric scan complete. Pulse elevated. How can I optimize your current state, Lin Xiao?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
        setApiKeyMissing(true);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading || apiKeyMissing) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await sendMessageToEcho(userMsg.content);
      const modelMsg: ChatMessage = { role: 'model', content: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
        const errorMsg: ChatMessage = { role: 'model', content: 'SYSTEM_CRITICAL: Network node unreachable.', timestamp: Date.now() };
        setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[80vh] max-h-[900px] w-full max-w-5xl mx-auto flex flex-col bg-slate-100/50 dark:bg-slate-950/50 border border-emerald-500/30 rounded-sm backdrop-blur-md overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.05)] relative group animate-bio-entry">
       
       {/* Background Grid Effect */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

       {/* Header */}
       <div className="bg-white/90 dark:bg-slate-950/90 p-4 border-b border-emerald-600/20 dark:border-emerald-900/50 flex justify-between items-center shrink-0 z-10">
           <div className="flex items-center space-x-3">
               <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-20"></div>
               </div>
               <span className="font-sci text-emerald-700 dark:text-emerald-400 tracking-widest text-sm md:text-base">ECHO_GENIE_V4.0</span>
           </div>
           <div className="flex flex-col items-end">
               <div className="text-[10px] font-tech text-emerald-600">SECURE_CHANNEL</div>
               <div className="text-[10px] font-tech text-slate-500">LATENCY: 4ms</div>
           </div>
       </div>

       {/* Chat Area */}
       <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 font-mono text-sm custom-scrollbar relative z-10">
            {apiKeyMissing && (
                <div className="p-4 bg-red-100/50 dark:bg-red-900/10 border border-red-500/30 text-red-600 dark:text-red-400 text-center rounded font-tech text-xs md:text-sm">
                    WARNING: MISSING_API_KEY. SIMULATION MODE ACTIVE. RESPONSES DISABLED.
                </div>
            )}
            
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out]`}>
                    <div className={`max-w-[85%] md:max-w-[70%] relative group-msg`}>
                        {/* Label */}
                        <div className={`text-[10px] font-tech mb-1 ${msg.role === 'user' ? 'text-right text-slate-500' : 'text-emerald-600'}`}>
                             {msg.role === 'user' ? 'USER_INPUT' : 'ECHO_RESPONSE'} // {new Date(msg.timestamp).toLocaleTimeString([], {hour12: false, minute:'2-digit', second:'2-digit'})}
                        </div>
                        
                        {/* Bubble */}
                        <div className={`p-4 rounded-sm border backdrop-blur-sm transition-all duration-300 ${
                            msg.role === 'user' 
                            ? 'bg-slate-200/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 rounded-tr-none hover:border-emerald-500/30' 
                            : 'bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 border-emerald-600/20 dark:border-emerald-500/30 rounded-tl-none hover:bg-emerald-100/50 dark:hover:bg-emerald-950/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                        }`}>
                            {/* Tech Accents for AI */}
                            {msg.role === 'model' && (
                                <>
                                  <div className="absolute top-0 left-0 w-1 h-3 bg-emerald-500"></div>
                                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500/50"></div>
                                </>
                            )}
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                </div>
            ))}

            {loading && (
                <div className="flex justify-start">
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-3 rounded border border-emerald-500/20 text-emerald-600 dark:text-emerald-500 flex items-center space-x-2">
                        <span className="font-tech text-xs animate-pulse">GENERATING_RESPONSE</span>
                        <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-[bounce_1s_infinite]"></div>
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-[bounce_1.2s_infinite]"></div>
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-[bounce_1.4s_infinite]"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
       </div>

       {/* Input Area */}
       <form onSubmit={handleSend} className="bg-slate-50/90 dark:bg-slate-950/90 p-4 border-t border-emerald-600/20 dark:border-emerald-900/50 flex gap-3 shrink-0 z-10 relative">
           {/* Decorative Line */}
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50"></div>
           
           <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={apiKeyMissing ? "SYSTEM OFFLINE" : "Input data stream..."}
            disabled={apiKeyMissing || loading}
            className="flex-1 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-sm p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-slate-50 dark:focus:bg-slate-900 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm md:text-base"
           />
           <button 
            type="submit"
            disabled={loading || !input.trim() || apiKeyMissing}
            className="px-6 md:px-8 bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-tech tracking-wider border border-emerald-500/30 dark:border-emerald-600/50 hover:bg-emerald-500 hover:text-white hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm clip-path-button"
           >
               TRANSMIT
           </button>
       </form>
    </div>
  );
};

export default EchoChat;