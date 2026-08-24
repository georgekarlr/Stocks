import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Volume2,
  FileText,
  RefreshCw,
  Clock,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  ChevronDown,
  XCircle,
  TableProperties,
  Crosshair,
} from 'lucide-react';
import { StockQuote, TraderProfile } from '../types/stock';

interface StockOverviewHeaderProps {
  quote: StockQuote;
  onRefresh: () => void;
  onRunAnalysis: () => void;
  onRunAutonomousWorkflow?: () => void;
  onGenerateStory: () => void;
  onOpenVoice: () => void;
  onOpenReports: () => void;
  onOpenPositionAnalyzer?: () => void;
  onOpenStockSelector?: () => void;
  onClearStock?: () => void;
  isAnalyzing: boolean;
  isStoryLoading: boolean;
  hasAnalysis: boolean;
  hasStory: boolean;
  globalTraderProfile?: TraderProfile;
  onSelectTraderProfile?: (profile: TraderProfile) => void;
}

export const StockOverviewHeader: React.FC<StockOverviewHeaderProps> = ({
  quote,
  onRefresh,
  onRunAnalysis,
  onRunAutonomousWorkflow,
  onGenerateStory,
  onOpenVoice,
  onOpenReports,
  onOpenPositionAnalyzer,
  onOpenStockSelector,
  onClearStock,
  isAnalyzing,
  isStoryLoading,
  hasAnalysis,
  hasStory,
  globalTraderProfile = 'weeks_trader',
  onSelectTraderProfile,
}) => {
  const isPositive = quote.change >= 0;
  const range52Diff = quote.high52 - quote.low52;
  const current52Pos = range52Diff > 0 ? ((quote.price - quote.low52) / range52Diff) * 100 : 50;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-xl backdrop-blur">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Symbol & Company Details with Switch Stock Action */}
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-inner ${
              isPositive
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
            }`}
          >
            {isPositive ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <h2 className="text-2xl font-black tracking-tight text-white">{quote.symbol}</h2>

                {/* Direct Select Another Stock / Switcher Button */}
                {onOpenStockSelector && (
                  <button
                    onClick={onOpenStockSelector}
                    title="Select another stock / switch asset"
                    className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition"
                  >
                    <ArrowLeftRight className="h-3 w-3" />
                    <span>Switch Stock</span>
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </button>
                )}
              </div>

              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-300 border border-slate-700">
                {quote.exchange || 'NASDAQ'}
              </span>
              <span className="rounded-md bg-cyan-950/60 px-2 py-0.5 text-[11px] font-medium text-cyan-300 border border-cyan-800/60">
                {quote.currency || 'USD'}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-300 mt-0.5">{quote.companyName}</p>
          </div>
        </div>

        {/* Live Price & Day Change */}
        <div className="flex flex-wrap items-baseline gap-4 sm:gap-6">
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              ${quote.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${
                  isPositive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isPositive ? <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />}
                {isPositive ? '+' : ''}
                {quote.change.toFixed(2)} ({isPositive ? '+' : ''}
                {quote.changePercent.toFixed(2)}%)
              </span>
              <span className="text-[11px] text-slate-400">Past Close</span>
            </div>
          </div>

          {/* 52-Week Range Meter */}
          <div className="min-w-[180px] sm:min-w-[220px]">
            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
              <span>52W Low: ${quote.low52.toFixed(2)}</span>
              <span>52W High: ${quote.high52.toFixed(2)}</span>
            </div>
            <div className="relative mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400"
                style={{ width: '100%' }}
              />
              <div
                className="absolute top-0 h-full w-2 -translate-x-1/2 rounded-full bg-white shadow-md ring-2 ring-slate-900"
                style={{ left: `${Math.max(0, Math.min(100, current52Pos))}%` }}
              />
            </div>
            <div className="mt-1 text-right text-[10px] text-slate-400">
              Range Position: <strong className="text-slate-200">{current52Pos.toFixed(0)}%</strong>
            </div>
          </div>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* ULTIMATE 1-ACTION WORKFLOW BUTTON */}
          {onRunAutonomousWorkflow && (
            <button
              onClick={onRunAutonomousWorkflow}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-300 hover:to-blue-400 transition active:scale-95 animate-pulse"
              title="Autonomous 1-Click Executive Presentation (Analysis + Visuals + Action Plan + Voice)"
            >
              <span className="text-sm">⚡</span>
              <span>1-Action Presentation</span>
            </button>
          )}

          {/* Select Another Stock (Prominent in toolbar) */}
          {onOpenStockSelector && (
            <button
              onClick={onOpenStockSelector}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 hover:text-white transition shadow-sm"
              title="Select another stock ticker"
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-cyan-400" />
              <span>Select Stock</span>
            </button>
          )}

          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-white transition shadow-lg ${
              hasAnalysis
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/20'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-cyan-500/25 animate-pulse'
            } disabled:opacity-50`}
          >
            <Sparkles className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing with Gemini 3.7...' : hasAnalysis ? 'Re-Analyze AI' : 'Run Gemini 3.7 Analysis'}</span>
          </button>

          {/* Dedicated Position & Stop Loss / Take Profit Analyzer */}
          {onOpenPositionAnalyzer && (
            <button
              onClick={onOpenPositionAnalyzer}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-900/60 hover:text-white transition shadow-sm"
              title="Analyze My Position (Buy/Sell Price, Stop Loss & Take Profit Triggers)"
            >
              <Crosshair className="h-3.5 w-3.5 text-emerald-400" />
              <span>Position &amp; Risk</span>
            </button>
          )}

          <button
            onClick={onGenerateStory}
            disabled={isStoryLoading}
            className={`flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/40 px-3.5 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-900/60 hover:text-white transition ${
              hasStory ? 'border-indigo-400/60' : ''
            } disabled:opacity-50`}
          >
            <Layers className="h-4 w-4 text-indigo-400" />
            <span>{isStoryLoading ? 'Crafting Story...' : hasStory ? 'Story Studio' : 'Generate Story'}</span>
          </button>

          <button
            onClick={onOpenVoice}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-emerald-500/50 hover:bg-slate-700 hover:text-white transition"
          >
            <Volume2 className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Voice Briefing</span>
          </button>

          <button
            onClick={onOpenReports}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-500/50 hover:bg-slate-700 hover:text-white transition"
          >
            <FileText className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Dossier</span>
          </button>

          <button
            onClick={onRefresh}
            title="Refresh Live Data"
            className="rounded-xl border border-slate-700 bg-slate-800/90 p-2 text-slate-400 hover:text-white hover:border-slate-600 transition"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          {/* Clear Stock / Return to Clean Launchpad */}
          {onClearStock && (
            <button
              onClick={onClearStock}
              title="Clear Active Stock (Return to Launchpad)"
              className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-500 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 transition"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
