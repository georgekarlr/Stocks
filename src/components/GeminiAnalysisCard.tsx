import React from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Target,
  ArrowRight,
  Crosshair,
  Compass,
  CheckCircle2,
  HelpCircle,
  BarChart,
  Layers,
} from 'lucide-react';
import { StockAnalysis, StockQuote } from '../types/stock';

interface GeminiAnalysisCardProps {
  analysis: StockAnalysis;
  quote: StockQuote;
  onGenerateStory: () => void;
  onOpenVoice: () => void;
  onOpenPositionAnalyzer?: () => void;
}

export const GeminiAnalysisCard: React.FC<GeminiAnalysisCardProps> = ({
  analysis,
  quote,
  onGenerateStory,
  onOpenVoice,
  onOpenPositionAnalyzer,
}) => {
  const isBuy = analysis.verdict.includes('Buy');
  const isSell = analysis.verdict.includes('Sell');

  const upsidePercent = quote.price > 0 && analysis.targetPrice
    ? (((analysis.targetPrice - quote.price) / quote.price) * 100).toFixed(1)
    : '0.0';

  const downsidePercent = quote.price > 0 && analysis.stopLoss
    ? (((analysis.stopLoss - quote.price) / quote.price) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/30 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>GEMINI 3.7 FLASH QUANT SYNTHESIS</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Institutional Research & Strategic Verdict
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Asset: <strong className="text-white">{quote.symbol}</strong> ({quote.companyName}) | Price: ${quote.price}
          </p>
        </div>

        {/* Verdict Badge & Conviction Score */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Analyst Conviction</div>
            <div className="text-2xl font-black text-cyan-400">{analysis.confidenceScore}%</div>
          </div>
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black tracking-wide uppercase shadow-lg ${
              isBuy
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/20'
                : isSell
                ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-rose-500/20'
                : 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-amber-500/20'
            }`}
          >
            {isBuy ? <TrendingUp className="h-5 w-5" /> : isSell ? <TrendingDown className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
            <span>{analysis.verdict}</span>
          </div>
        </div>
      </div>

      {/* Target Price & Stop-loss Callout Banner */}
      <div className="relative z-10 my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Target Price */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
            <span>Price Target (12M)</span>
            <Target className="h-4 w-4" />
          </div>
          <div className="mt-1 text-2xl font-extrabold text-white">${analysis.targetPrice?.toFixed(2)}</div>
          <div className="text-xs font-bold text-emerald-400 mt-0.5">
            {Number(upsidePercent) >= 0 ? `+${upsidePercent}% upside` : `${upsidePercent}%`}
          </div>
        </div>

        {/* Current Price */}
        <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Current Asset Price</span>
            <Crosshair className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-1 text-2xl font-extrabold text-white">${quote.price.toFixed(2)}</div>
          <div className="text-xs text-slate-400 mt-0.5">{quote.exchange} Real-time Base</div>
        </div>

        {/* Stop Loss Level */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-400">
            <span>Recommended Stop-Loss</span>
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="mt-1 text-2xl font-extrabold text-white">${analysis.stopLoss?.toFixed(2)}</div>
          <div className="text-xs font-bold text-rose-400 mt-0.5">
            {downsidePercent}% max risk threshold
          </div>
        </div>
      </div>

      {/* Executive Summary & Deep Theses */}
      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Executive Summary */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h4 className="flex items-center gap-2 text-sm font-bold text-cyan-300 mb-2">
            <Compass className="h-4 w-4" /> Executive Summary
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {analysis.executiveSummary}
          </p>
        </div>

        {/* Technical Thesis */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h4 className="flex items-center gap-2 text-sm font-bold text-blue-300 mb-2">
            <BarChart className="h-4 w-4" /> Technical & Momentum Analysis
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {analysis.technicalThesis}
          </p>
        </div>
      </div>

      {/* Catalysts Radar */}
      <div className="relative z-10 mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
        <h4 className="flex items-center gap-2 text-sm font-bold text-amber-300 mb-4">
          <Sparkles className="h-4 w-4" /> Key Catalysts & Market Drivers
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {analysis.catalysts?.map((cat, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-3.5 ${
                cat.type === 'Bullish'
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                  : cat.type === 'Bearish'
                  ? 'border-rose-500/30 bg-rose-950/20 text-rose-300'
                  : 'border-slate-700 bg-slate-900/60 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>{cat.title}</span>
                <span className="rounded px-1.5 py-0.5 text-[10px] uppercase font-mono bg-slate-900/80">
                  {cat.impact} Impact
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Support & Resistance Price Level Matrix */}
      {analysis.keyPriceLevels && (
        <div className="relative z-10 mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h4 className="text-sm font-bold text-indigo-300 mb-3 flex items-center gap-2">
            <Crosshair className="h-4 w-4" /> Strategic Price Channels (Support & Resistance)
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-3 text-center">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Support 1 (Immediate)</span>
              <div className="text-lg font-black text-white mt-0.5">
                ${analysis.keyPriceLevels.support1?.toFixed(2)}
              </div>
            </div>
            <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3 text-center">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Support 2 (Floor)</span>
              <div className="text-lg font-black text-white mt-0.5">
                ${analysis.keyPriceLevels.support2?.toFixed(2)}
              </div>
            </div>
            <div className="rounded-xl border border-rose-900/60 bg-rose-950/30 p-3 text-center">
              <span className="text-[10px] font-bold text-rose-400 uppercase">Resistance 1 (Breakout)</span>
              <div className="text-lg font-black text-white mt-0.5">
                ${analysis.keyPriceLevels.resistance1?.toFixed(2)}
              </div>
            </div>
            <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-3 text-center">
              <span className="text-[10px] font-bold text-rose-400 uppercase">Resistance 2 (Ceiling)</span>
              <div className="text-lg font-black text-white mt-0.5">
                ${analysis.keyPriceLevels.resistance2?.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Factors & Mitigation */}
      <div className="relative z-10 mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
        <h4 className="flex items-center gap-2 text-sm font-bold text-rose-300 mb-3">
          <AlertTriangle className="h-4 w-4" /> Risk Factors & Hedging Protocols
        </h4>
        <div className="space-y-2.5">
          {analysis.riskFactors?.map((r, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
              <div className="flex items-start gap-2">
                <span className={`mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                  r.severity === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {r.severity}
                </span>
                <span className="font-semibold text-white">{r.risk}</span>
              </div>
              <div className="text-slate-400 text-[11px] sm:text-right">
                <strong className="text-slate-300">Mitigation:</strong> {r.mitigation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Strategy Recommendations */}
      <div className="relative z-10 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4">
          <span className="text-[11px] font-bold text-cyan-400 uppercase">Short-Term Traders</span>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            {analysis.actionableRecommendations?.shortTermTrader}
          </p>
        </div>
        <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-4">
          <span className="text-[11px] font-bold text-blue-400 uppercase">Long-Term Investors</span>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            {analysis.actionableRecommendations?.longTermInvestor}
          </p>
        </div>
        <div className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4">
          <span className="text-[11px] font-bold text-purple-400 uppercase">Defensive / Hedging</span>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            {analysis.actionableRecommendations?.defensiveHedging}
          </p>
        </div>
      </div>

      {/* Position Analyzer Action Banner */}
      {onOpenPositionAnalyzer && (
        <div className="relative z-10 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Crosshair className="h-5 w-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                Holding or Trading {quote.symbol}?
              </h5>
              <p className="text-[11px] text-slate-300">
                Input what price you bought or sold at to compute exact stop loss and take profit triggers.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenPositionAnalyzer}
            className="shrink-0 flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition"
          >
            <Crosshair className="h-3.5 w-3.5" />
            <span>Analyze My Position &amp; Triggers</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
