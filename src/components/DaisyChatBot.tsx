'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  Bot,
  User,
  FileText,
  HelpCircle,
  Briefcase,
  Heart,
  ChevronDown,
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'daisy';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'daisy',
    text: "Hi there! I'm **Daisy** 🌼, your AI career assistant! How can I help you today? You can ask about our jobs, application statuses, interview tips, or how to view and download your offer letter! ✨",
    timestamp: 'Just now',
  },
];

const SUGGESTED_PROMPTS = [
  { label: '📄 Download Offer Letter', query: 'How do I view and download my offer letter?' },
  { label: '🔍 Track Application', query: 'How can I check my application status?' },
  { label: '🎁 NexaTech Benefits', query: 'What benefits and perks does NexaTech offer?' },
  { label: '💡 Interview Tips', query: 'What are some tips for interviewing at NexaTech?' },
];

export default function DaisyChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showGreetingTooltip, setShowGreetingTooltip] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      setShowGreetingTooltip(false);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat/daisy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Daisy is thinking...');
      }

      const daisyMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'daisy',
        text: data.data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, daisyMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'daisy',
        text: "Oopsie! 🌸 I had a little hiccup connecting to the server. But you can check your Candidate Dashboard or reach out to hiring@nexatech.internal! 🌼",
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  // Helper to format simple markdown (bold, bullet points, links)
  const formatMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold replacer
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const parsedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="text-white font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <li key={idx} className="ml-4 list-disc text-zinc-300">
            {parsedLine}
          </li>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="leading-relaxed">
          {parsedLine}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Floating Greeting Bubble (when closed) */}
      <AnimatePresence>
        {!isOpen && showGreetingTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-3 mr-1 glass-card px-4 py-2.5 rounded-2xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center gap-2.5 max-w-xs cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            <span className="text-xl animate-bounce">🌼</span>
            <div className="text-xs">
              <span className="font-bold text-white block">Hi! I'm Daisy ✨</span>
              <span className="text-zinc-400 text-[11px]">Ask me anything about careers!</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGreetingTooltip(false);
              }}
              className="text-zinc-500 hover:text-zinc-300 p-1 rounded-full ml-1"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-300 text-zinc-950 shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] transition-all cursor-pointer group"
          title="Chat with Daisy"
        >
          {/* Animated Glow Rings */}
          <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-ping" />
          <div className="relative text-2xl group-hover:rotate-12 transition-transform duration-300">
            🌼
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[9px] font-black text-zinc-950 border-2 border-zinc-950">
            ✨
          </span>
        </motion.button>
      )}

      {/* Main Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[92vw] sm:w-[400px] h-[580px] max-h-[85vh] glass-card rounded-3xl border border-emerald-500/30 shadow-[0_10px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.2)] flex flex-col overflow-hidden relative backdrop-blur-2xl bg-zinc-950/95"
          >
            {/* Daisy Header */}
            <div className="p-4 px-5 border-b border-white/10 bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-zinc-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-300 text-xl shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                    🌼
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-zinc-950 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-white">Daisy</h3>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                      AI Assistant
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                    Always here to help you bloom ✨
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-zinc-400">
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                  title="Reset conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                  title="Minimize chat"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((msg) => {
                const isDaisy = msg.sender === 'daisy';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2.5 ${isDaisy ? 'justify-start' : 'justify-end'}`}
                  >
                    {isDaisy && (
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-sm mt-0.5">
                        🌼
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl p-3.5 space-y-1 ${
                        isDaisy
                          ? 'bg-white/[0.04] border border-white/10 text-zinc-200 shadow-sm'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-zinc-950 font-medium shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      }`}
                    >
                      <div className="text-xs leading-relaxed space-y-1">
                        {isDaisy ? formatMarkdown(msg.text) : msg.text}
                      </div>
                      <span
                        className={`text-[9px] block text-right pt-0.5 ${
                          isDaisy ? 'text-zinc-500' : 'text-zinc-900/70 font-semibold'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {!isDaisy && (
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-800 border border-white/10 text-zinc-300 mt-0.5">
                        <User className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-sm">
                    🌼
                  </div>
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 rounded-full bg-teal-300 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-amber-300 animate-bounce" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Carousel */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex gap-2 overflow-x-auto no-scrollbar">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt.query)}
                  className="flex-shrink-0 rounded-full bg-white/[0.04] hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 px-3 py-1.5 text-[11px] font-medium text-zinc-300 hover:text-emerald-300 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {prompt.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-zinc-950 border-t border-white/10 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Daisy a question..."
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-3.5 pr-3 text-xs text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:bg-white/[0.06] focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-zinc-950 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-30 disabled:hover:from-emerald-500 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                title="Send query"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
