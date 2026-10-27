import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, AlertCircle, HelpCircle, CornerDownRight, CheckCircle2 } from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { AIService } from '../services/ai';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isDemo?: boolean;
}

export const CivicAIChatbot: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { complaints } = useComplaints();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Welcome to the **CivicAI Assistant**. I can guide you through reporting municipal infrastructure defects, explain department routings, or look up your active complaint status by ID (e.g., `CIV-2026-RD4812`). How may I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickReplies = [
    'Report a pothole',
    'Report garbage',
    'Report water leakage',
    'Track my complaint',
    'Explain my complaint status',
  ];

  const handleSend = async (textToSend?: string) => {
    const userText = (textToSend || input).trim();
    if (!userText || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build complaint context from current store for real-time status lookup
      const complaintContext = complaints.map((c) => ({
        id: c.id,
        category: c.category,
        status: c.status,
        priority: c.priority,
        department: c.department,
        location: c.location,
        createdAt: c.createdAt,
      }));

      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await AIService.sendChatMessage(userText, complaintContext, history);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: res.isDemoMode,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (e) {
      const errMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content:
          'I am currently experiencing connectivity issues with the municipal server. You can track complaints directly from your "My Complaints" dashboard or report issues using the top navigation.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full sm:w-[420px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[85vh] bg-slate-900 border border-slate-700 rounded-xl shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-150">
      {/* Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-sky-950 border border-sky-800 flex items-center justify-center">
            <Bot className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Civic Assistant
              <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-sky-950 text-sky-300 border border-sky-800">
                Civic Triage
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Municipal Guidance Agent</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950 text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sky-700 text-white'
                  : 'bg-slate-800 border border-slate-700 text-slate-200'
              }`}
            >
              <div className="whitespace-pre-line">{msg.content}</div>
            </div>
            <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-slate-500">
              <span>{msg.timestamp}</span>
              {msg.isDemo && (
                <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1 rounded border border-amber-800/40">
                  Civic Rule Engine
                </span>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg max-w-[70%] border border-slate-700 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse delay-100"></span>
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse delay-200"></span>
            <span className="ml-1 text-slate-400">Consulting civic directory...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies - Rectangular rounded-md, not pill */}
      <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickReplies.map((qr) => (
          <button
            key={qr}
            onClick={() => handleSend(qr)}
            className="shrink-0 text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-sky-500 transition cursor-pointer"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a problem, routing, or complaint ID..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-md px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-md bg-sky-700 hover:bg-sky-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-500 text-center mt-1.5">
          CivicAI Assistant references active complaints in the municipal registry.
        </p>
      </div>
    </div>
  );
};
