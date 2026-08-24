import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Upload,
  Sparkles,
  BarChart3,
  Cpu,
  Volume2,
  TableProperties,
  ArrowRight,
  Shield,
  Activity,
  Layers,
  LineChart,
  Zap,
  Clock,
  Crosshair,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { TraderProfile } from '../types/stock';
import { TRADER_PROFILES } from '../utils/positionAnalyzer';

interface SearchLaunchpadProps {
  onSearchTicker: (ticker: string) => void;
  onRunExecutiveWorkflow?: (ticker: string) => void;
  onOpenCSVModal: () => void;
  onOpenMarketTable?: () => void;
  onOpenPositionAnalyzer?: () => void;
  globalTraderProfile?: TraderProfile;
  onSelectTraderProfile?: (profile: TraderProfile) => void;
  isLoading: boolean;
}

const POPULAR_TICKERS = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Semiconductors / AI' },
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Consumer Electronics' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Enterprise Cloud & AI' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'EV & Robotics' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', sector: 'US Benchmark Index' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Computing & AI Hardware' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', sector: 'E-Commerce & AWS' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Search & Generative AI' },
  { symbol: 'BTC-USD', name: 'Bitcoin USD', sector: 'Digital Currency' },
];

export const SearchLaunchpad: React.FC<SearchLaunchpadProps> = ({
  onSearchTicker,
  onRunExecutiveWorkflow,
  onOpenCSVModal,
  onOpenMarketTable,
  onOpenPositionAnalyzer,
  globalTraderProfile = 'weeks_trader',
  onSelectTraderProfile,
  isLoading,
}) => {
  const [tickerInput, setTickerInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerInput.trim()) {
      onSearchTicker(tickerInput.trim().toUpperCase());
    }
  };

  const handleRun1Action = (sym?: string) => {
    const symbolToUse = sym || tickerInput.trim() || 'NVDA';
    if (onRunExecutiveWorkflow) {
      onRunExecutiveWorkflow(symbolToUse.toUpperCase());
    } else {
      onSearchTicker(symbolToUse.toUpperCase());
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Hero Welcome & Ingestion Bar */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-10 shadow-2xl">
        {/* Glow gradients */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400 mb-5 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 animate-spin-slow text-cyan-300" />
            <span>POWERED BY GEMINI 3.7 FLASH REASONING & REAL-TIME DATA API</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Financial Analytics & <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">AI Storytelling</span>
          </h1>

          <p className="mt-4 text-sm text-slate-300 sm:text-base leading-relaxed">
            Ingest live market data feeds via Alpha Vantage / Polygon.io API or custom CSV time-series. Formulate institutional quantitative models, render interactive candlestick charts, explore sortable multi-asset tables, and produce AI financial stories and voice broadcasts.
          </p>

          {/* Search Bar Input */}
          <form onSubmit={handleSubmit} className="mt-8 relative max-w-xl mx-auto">
            <div className="relative flex items-center shadow-2xl">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter stock ticker symbol (e.g., NVDA, AAPL, SPY, TSLA, PLTR)..."
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value)}
                className="w-full rounded-2xl border-2 border-slate-700 bg-slate-950/90 py-4 pl-12 pr-32 text-sm text-white placeholder-slate-500 shadow-inner transition-all focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
              />
              <button
                type="submit"
                disabled={isLoading || !tickerInput.trim()}
                className="absolute right-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 flex items-center gap-1.5"
              >
                {isLoading ? (
                  <span>Fetching...</span>
                ) : (
                  <>
                    <span>Ingest Data</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* 1-ACTION ULTIMATE WORKFLOW BANNER & QUICK LAUNCHER */}
          <div className="mt-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 p-4 sm:p-5 shadow-2xl backdrop-blur max-w-2xl mx-auto text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30 text-xs">
                    ⚡
                  </span>
                  <h3 className="text-sm font-extrabold text-white tracking-tight">
                    1-Action Autonomous Executive Presentation
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  Select a stock → Ingest &amp; Quant Analysis → AI Visuals &amp; Action Plan → Live Voice Presentation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleRun1Action(tickerInput.trim() || 'NVDA')}
                disabled={isLoading}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-5 py-3 text-xs font-black text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-300 hover:to-blue-400 transition active:scale-95 disabled:opacity-40"
              >
                <Zap className="h-4 w-4" />
                <span>Launch Presentation</span>
              </button>
            </div>
          </div>

          {/* Trader Style & Horizon Profile Selector Strip */}
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Select Your Trader Style &amp; Horizon:
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Calibrates stop losses, profit targets &amp; analysis
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {TRADER_PROFILES.map((p) => {
                const isSelected = globalTraderProfile === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectTraderProfile && onSelectTraderProfile(p.id)}
                    className={`rounded-xl border p-2.5 text-left transition ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/50 text-white ring-1 ring-cyan-400 shadow-sm'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-white block">{p.shortLabel}</span>
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 block">{p.typicalHold}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Action Ticker Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Quick 1-Action Run:</span>
            {POPULAR_TICKERS.map((t) => (
              <button
                key={t.symbol}
                onClick={() => handleRun1Action(t.symbol)}
                className="group flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-white transition shadow-sm"
              >
                <Zap className="h-3 w-3 text-cyan-400 group-hover:scale-110 transition" />
                <span className="font-bold text-cyan-400 group-hover:text-cyan-300">{t.symbol}</span>
                <span className="text-[10px] text-slate-500 hidden sm:inline">({t.sector})</span>
              </button>
            ))}
          </div>

          {/* CSV Upload, Position Analyzer & Market Table Alternative */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            {onOpenPositionAnalyzer && (
              <button
                onClick={onOpenPositionAnalyzer}
                className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-900/40 hover:border-emerald-400 transition shadow"
              >
                <Crosshair className="h-4 w-4 text-emerald-400" />
                <span>Trade Position &amp; Stop Loss Analyzer</span>
              </button>
            )}

            {onOpenMarketTable && (
              <button
                onClick={onOpenMarketTable}
                className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/30 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-900/40 hover:border-cyan-400 transition shadow"
              >
                <TableProperties className="h-4 w-4 text-cyan-400" />
                <span>Open Live Market Scanner Table</span>
              </button>
            )}

            <button
              onClick={onOpenCSVModal}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:border-slate-500 hover:text-white transition shadow"
            >
              <Upload className="h-4 w-4 text-cyan-400" />
              <span>Upload CSV / Excel Dataset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Capabilities Grid */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur shadow-sm hover:border-slate-700 transition">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-3 border border-cyan-500/20">
            <TableProperties className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white">1. Live Data &amp; Table</h3>
          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
            Real-time pricing, sortable market cap, P/E ratios, 52-week channels, and deep fundamental company profiles.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur shadow-sm hover:border-slate-700 transition">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-3 border border-blue-500/20">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white">2. Gemini 3.7 Synthesis</h3>
          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
            Institutional quant synthesis, conviction rating, support/resistance detection, and risk-adjusted Sharpe/VaR modeling.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur shadow-sm hover:border-slate-700 transition">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/20">
            <Crosshair className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white">3. Stop Loss / Take Profit</h3>
          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
            Add your Buy/Sell positions to compute live P&amp;L, risk/reward gauges, ATR trailing stops, and exact exit protocols.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur shadow-sm hover:border-slate-700 transition">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-3 border border-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white">4. Story &amp; Visual Studio</h3>
          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
            Multi-chapter financial narratives, Wall Street memos, and custom AI editorial artwork generated per asset.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur shadow-sm hover:border-slate-700 transition">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/20">
            <Volume2 className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white">5. AI Voice Briefing</h3>
          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
            Hands-free audio briefings, multiple executive voice actors (Kore, Puck, Fenrir, Zephyr), and live word-by-word read-along.
          </p>
        </div>
      </div>
    </div>
  );
};
