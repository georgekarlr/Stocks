import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  TrendingUp,
  Shield,
  HelpCircle,
  Key,
} from 'lucide-react';
import { StockQuote, StockAnalysis, TechnicalIndicators } from '../types/stock';
import { getApiAuthHeaders } from '../services/apiKeyService';
import { useActionIndicator } from '../context/ActionIndicatorContext';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface QuantCopilotChatProps {
  ticker: string | null;
  quote: StockQuote | null;
  analysis: StockAnalysis | null;
  technicals: TechnicalIndicators | null;
}

const PROMPT_SUGGESTIONS = [
  'What is the probability of breaking resistance R1 this week?',
  'Simulate a 10% market correction scenario on this stock.',
  'How does the current RSI and MACD setup compare to historical trends?',
  'Explain the key risk factors and how to hedge them using options.',
];

export const QuantCopilotChat: React.FC<QuantCopilotChatProps> = ({
  ticker,
  quote,
  analysis,
  technicals,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: `Hello! I am your **StockPulse Quant Copilot** powered by **Gemini 3.7 Flash**.
${
  ticker
    ? `I have actively loaded **${ticker}** ($${quote?.price || '--'}) into working memory with full technical indicators, catalysts, and risk parameters.`
    : 'Select or search any stock ticker or upload a dataset to begin interactive quantitative querying.'
}
Ask me about support/resistance probabilities, valuation models, scenario stress testing, or strategy formulation!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: getApiAuthHeaders(),
        body: JSON.stringify({
          message: textToSend,
          ticker: ticker || 'GENERAL_MARKET',
          quote,
          analysisContext: {
            technicals,
            analysis,
          },
          chatHistory: messages.slice(-8),
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Gemini Copilot query failed');
      }

      const data = await response.json();
      const botMessage: Message = {
        role: 'model',
        content: data.reply || 'No response returned from model.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: `⚠️ **Quant Copilot Error**: ${err.message || 'Network error'}\n\n*If this relates to an API key, please configure your individual Gemini API key using the "Set API Key / BYOK" button in the top navigation bar.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur overflow-hidden flex flex-col h-[680px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-sm">Quant Copilot</h3>
              <span className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
                GEMINI 3.7 FLASH
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Active Context: <strong className="text-slate-200">{ticker || 'No Ticker Loaded'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400 font-mono">Real-time Reasoning</span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'model' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                m.role === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none font-sans'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
              <div className={`mt-1.5 text-[10px] text-right ${m.role === 'user' ? 'text-cyan-200' : 'text-slate-500'}`}>
                {m.timestamp}
              </div>
            </div>

            {m.role === 'user' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center text-xs text-slate-400">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse">
              <Sparkles className="h-4 w-4 animate-spin" />
            </div>
            <span className="italic">Gemini 3.7 Flash calculating quantitative response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40">
          <div className="text-[10px] font-bold text-slate-400 mb-1.5">Suggested Inquiries:</div>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug)}
                className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:border-cyan-500/40 hover:text-white transition"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-slate-800 bg-slate-950/90 flex gap-2"
      >
        <input
          type="text"
          placeholder={`Ask anything about ${ticker || 'the stock market'}, technical signals, or trading models...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
