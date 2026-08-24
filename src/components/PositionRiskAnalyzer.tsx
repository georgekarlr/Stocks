import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Target,
  AlertTriangle,
  Zap,
  Layers,
  Compass,
  DollarSign,
  Percent,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  Crosshair,
  CheckCircle2,
  BarChart3,
  Bookmark,
  Share2,
  Copy,
  Check,
  ChevronRight,
  Search,
  Sliders,
  CheckSquare,
  XCircle,
  Flame,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import {
  TradePosition,
  PositionAnalysisResult,
  StockQuote,
  TechnicalIndicators,
  TraderProfile,
  BuySellTimingAnalysis,
  PositionAnalyzerTab,
} from '../types/stock';
import {
  TRADER_PROFILES,
  calculatePositionAnalysis,
  calculateBuySellTimingAnalysis,
} from '../utils/positionAnalyzer';
import { getApiAuthHeaders } from '../services/apiKeyService';

interface PositionRiskAnalyzerProps {
  currentTicker: string | null;
  quote: StockQuote | null;
  technicals: TechnicalIndicators | null;
  globalTraderProfile: TraderProfile;
  onSelectTraderProfile: (profile: TraderProfile) => void;
  onSelectTicker: (ticker: string) => void;
  onRunExecutiveWorkflow?: (ticker: string) => void;
}

const STORAGE_KEY = 'stockpulse_saved_positions';
const POPULAR_TICKERS = ['NVDA', 'AAPL', 'MSFT', 'TSLA', 'AMZN', 'GOOGL', 'META', 'AMD', 'SPY', 'QQQ'];

export const PositionRiskAnalyzer: React.FC<PositionRiskAnalyzerProps> = ({
  currentTicker,
  quote,
  technicals,
  globalTraderProfile,
  onSelectTraderProfile,
  onSelectTicker,
  onRunExecutiveWorkflow,
}) => {
  // Active Primary Sub-Mode:
  // Option 1: 'buy_sell_timing' (Analyze When to Buy and Sell)
  // Option 2: 'specific_position_risk' (Put Specific Position: When to Stop Loss and Take Profit)
  const [activeSubMode, setActiveSubMode] = useState<PositionAnalyzerTab>('buy_sell_timing');

  // Shared active symbol input
  const [symbolInput, setSymbolInput] = useState<string>(currentTicker || 'NVDA');
  const [selectedProfile, setSelectedProfile] = useState<TraderProfile>(globalTraderProfile);

  // Option 1: Buy/Sell Timing State
  const [timingAnalysis, setTimingAnalysis] = useState<BuySellTimingAnalysis | null>(null);
  const [isTimingAiLoading, setIsTimingAiLoading] = useState<boolean>(false);

  // Option 2: Specific Position Form State
  const [positionType, setPositionType] = useState<'BUY' | 'SELL'>('BUY');
  const [entryPrice, setEntryPrice] = useState<string>(quote?.price ? quote.price.toFixed(2) : '130.00');
  const [shares, setShares] = useState<string>('50');
  const [notes, setNotes] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<PositionAnalysisResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Saved Positions List (local storage)
  const [savedPositions, setSavedPositions] = useState<TradePosition[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync symbol & entry price when currentTicker or quote changes
  useEffect(() => {
    if (currentTicker) {
      setSymbolInput(currentTicker);
      if (quote?.price && (!entryPrice || entryPrice === '130.00')) {
        setEntryPrice(quote.price.toFixed(2));
      }
    }
  }, [currentTicker, quote]);

  // Keep selectedProfile synced with globalTraderProfile
  useEffect(() => {
    setSelectedProfile(globalTraderProfile);
  }, [globalTraderProfile]);

  // Persist saved positions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPositions));
    } catch (e) {
      console.warn('Failed to persist positions:', e);
    }
  }, [savedPositions]);

  // Re-calculate Option 1: Buy/Sell Timing Analysis
  useEffect(() => {
    if (symbolInput) {
      const result = calculateBuySellTimingAnalysis(
        symbolInput.toUpperCase().trim(),
        quote,
        technicals,
        selectedProfile
      );
      setTimingAnalysis(result);
    }
  }, [symbolInput, quote, technicals, selectedProfile]);

  // Re-calculate Option 2: Specific Position Analysis
  useEffect(() => {
    const numEntry = parseFloat(entryPrice);
    const numShares = parseFloat(shares);

    if (symbolInput && !isNaN(numEntry) && numEntry > 0 && !isNaN(numShares) && numShares > 0) {
      const position: TradePosition = {
        id: 'active_draft',
        symbol: symbolInput.toUpperCase().trim(),
        positionType,
        entryPrice: numEntry,
        shares: numShares,
        traderProfile: selectedProfile,
        notes,
        createdAt: Date.now(),
      };

      const result = calculatePositionAnalysis(position, quote, technicals);
      setAnalysisResult(result);
    }
  }, [symbolInput, positionType, entryPrice, shares, selectedProfile, quote, technicals, notes]);

  // Option 1: AI Timing Deep Dive with Gemini 3.7 Flash
  const handleRunAiTimingAnalysis = async () => {
    if (!symbolInput) return;
    setIsTimingAiLoading(true);

    try {
      const res = await fetch('/api/analyze-buy-sell-timing', {
        method: 'POST',
        headers: getApiAuthHeaders(),
        body: JSON.stringify({
          symbol: symbolInput.toUpperCase().trim(),
          quote,
          technicals,
          traderProfile: selectedProfile,
        }),
      });

      if (res.ok) {
        const aiData = await res.json();
        setTimingAnalysis((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            timingVerdict: aiData.timingVerdict || prev.timingVerdict,
            timingScore: aiData.timingScore !== undefined ? aiData.timingScore : prev.timingScore,
            conviction: aiData.conviction || prev.conviction,
            summaryHeadline: aiData.summaryHeadline || prev.summaryHeadline,
            whenToBuy: {
              ...prev.whenToBuy,
              recommendedEntryZone: aiData.whenToBuy?.recommendedEntryZone || prev.whenToBuy.recommendedEntryZone,
              breakoutEntryTrigger: aiData.whenToBuy?.breakoutEntryTrigger || prev.whenToBuy.breakoutEntryTrigger,
              pullbackDipEntry: aiData.whenToBuy?.pullbackDipEntry || prev.whenToBuy.pullbackDipEntry,
              buyInvalidationPrice: aiData.whenToBuy?.buyInvalidationPrice || prev.whenToBuy.buyInvalidationPrice,
              strategicGuidance: aiData.whenToBuy?.strategicGuidance || prev.whenToBuy.strategicGuidance,
            },
            whenToSell: {
              ...prev.whenToSell,
              targetSellZones: aiData.whenToSell?.targetSellZones || prev.whenToSell.targetSellZones,
              emergencyCutPrice: aiData.whenToSell?.emergencyCutPrice || prev.whenToSell.emergencyCutPrice,
              strategicGuidance: aiData.whenToSell?.strategicGuidance || prev.whenToSell.strategicGuidance,
            },
            geminiTimingThesis: aiData.geminiTimingThesis || prev.geminiTimingThesis,
          };
        });
      }
    } catch (err) {
      console.warn('AI Timing analysis failed, fallback to quant engine:', err);
    } finally {
      setIsTimingAiLoading(false);
    }
  };

  // Option 2: AI Risk Diagnosis for Specific Position with Gemini 3.7 Flash
  const handleRunAiDiagnosis = async () => {
    if (!analysisResult) return;
    setIsAiLoading(true);

    try {
      const position: TradePosition = {
        id: 'active_analysis',
        symbol: symbolInput.toUpperCase().trim(),
        positionType,
        entryPrice: parseFloat(entryPrice),
        shares: parseFloat(shares),
        traderProfile: selectedProfile,
        notes,
        createdAt: Date.now(),
      };

      const res = await fetch('/api/analyze-position', {
        method: 'POST',
        headers: getApiAuthHeaders(),
        body: JSON.stringify({
          position,
          quote,
          technicals,
          traderProfile: selectedProfile,
        }),
      });

      if (res.ok) {
        const aiData = await res.json();
        setAnalysisResult((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            tradeHealthScore: aiData.tradeHealthScore || prev.tradeHealthScore,
            tradeStatus: aiData.tradeStatus || prev.tradeStatus,
            riskRewardRatio: aiData.riskRewardRatio || prev.riskRewardRatio,
            riskRewardAssessment: aiData.riskRewardAssessment || prev.riskRewardAssessment,
            aiDiagnosis: aiData.aiDiagnosis || prev.aiDiagnosis,
            tailoredGuidanceForProfile: aiData.tailoredGuidanceForProfile || prev.tailoredGuidanceForProfile,
            whenToStopLoss: {
              ...prev.whenToStopLoss,
              exactActionProtocol: aiData.whenToStopLoss?.exactActionProtocol || prev.whenToStopLoss.exactActionProtocol,
              primaryStopReason: aiData.whenToStopLoss?.primaryStopReason || prev.whenToStopLoss.primaryStopReason,
            },
            whenToTakeProfit: {
              ...prev.whenToTakeProfit,
              exactActionProtocol: aiData.whenToTakeProfit?.exactActionProtocol || prev.whenToTakeProfit.exactActionProtocol,
              primaryProfitReason: aiData.whenToTakeProfit?.primaryProfitReason || prev.whenToTakeProfit.primaryProfitReason,
            },
          };
        });
      }
    } catch (err) {
      console.warn('AI position diagnosis failed, using quant calculation:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Convert Option 1 Timing Setup into an Active Position in Option 2
  const handleAdoptSetupToPosition = (targetPrice: number) => {
    setEntryPrice(targetPrice.toFixed(2));
    setPositionType('BUY');
    setActiveSubMode('specific_position_risk');
  };

  // Save current position
  const handleSavePosition = () => {
    const numEntry = parseFloat(entryPrice);
    const numShares = parseFloat(shares);
    if (!symbolInput || isNaN(numEntry) || numEntry <= 0) return;

    const newPos: TradePosition = {
      id: `pos_${Date.now()}`,
      symbol: symbolInput.toUpperCase().trim(),
      positionType,
      entryPrice: numEntry,
      shares: isNaN(numShares) ? 10 : numShares,
      traderProfile: selectedProfile,
      notes,
      createdAt: Date.now(),
    };

    setSavedPositions((prev) => [newPos, ...prev]);
  };

  // Load a saved position
  const handleLoadSavedPosition = (pos: TradePosition) => {
    setSymbolInput(pos.symbol);
    setPositionType(pos.positionType);
    setEntryPrice(pos.entryPrice.toString());
    setShares(pos.shares.toString());
    setSelectedProfile(pos.traderProfile);
    setNotes(pos.notes || '');
    onSelectTicker(pos.symbol);
    setActiveSubMode('specific_position_risk');
  };

  // Delete a saved position
  const handleDeletePosition = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPositions((prev) => prev.filter((p) => p.id !== id));
  };

  // Copy Trade / Timing Report
  const handleCopyReport = () => {
    let text = '';
    if (activeSubMode === 'buy_sell_timing' && timingAnalysis) {
      text = `STOCKPULSE MARKET TIMING & TRADE SETUP (${timingAnalysis.symbol})
Profile: ${selectedProfile.toUpperCase()} | Timing Verdict: ${timingAnalysis.timingVerdict} (Score: ${timingAnalysis.timingScore}/100)
Current Price: $${timingAnalysis.currentPrice.toFixed(2)}

WHEN TO BUY:
• Recommended Entry Zone: $${timingAnalysis.whenToBuy.recommendedEntryZone.min.toFixed(2)} - $${timingAnalysis.whenToBuy.recommendedEntryZone.max.toFixed(2)}
• Pullback Dip Entry: $${timingAnalysis.whenToBuy.pullbackDipEntry.toFixed(2)}
• Breakout Trigger: $${timingAnalysis.whenToBuy.breakoutEntryTrigger.toFixed(2)}
• Invalidation Stop: $${timingAnalysis.whenToBuy.buyInvalidationPrice.toFixed(2)}
• Guidance: ${timingAnalysis.whenToBuy.strategicGuidance}

WHEN TO SELL:
• Target 1: $${timingAnalysis.whenToSell.targetSellZones[0]?.targetPrice.toFixed(2)} (+${timingAnalysis.whenToSell.targetSellZones[0]?.upsidePct}%)
• Target 2: $${timingAnalysis.whenToSell.targetSellZones[1]?.targetPrice.toFixed(2)} (+${timingAnalysis.whenToSell.targetSellZones[1]?.upsidePct}%)
• Target 3: $${timingAnalysis.whenToSell.targetSellZones[2]?.targetPrice.toFixed(2)} (+${timingAnalysis.whenToSell.targetSellZones[2]?.upsidePct}%)
• Guidance: ${timingAnalysis.whenToSell.strategicGuidance}

THESIS:
${timingAnalysis.geminiTimingThesis}`;
    } else if (analysisResult) {
      text = `STOCKPULSE TRADE POSITION & RISK DIAGNOSIS
Asset: ${analysisResult.symbol} (${analysisResult.positionType})
Entry Price: $${analysisResult.entryPrice.toFixed(2)} | Current: $${analysisResult.currentPrice.toFixed(2)}
Unrealized P&L: $${analysisResult.unrealizedPnL.toFixed(2)} (${analysisResult.unrealizedPnLPct >= 0 ? '+' : ''}${analysisResult.unrealizedPnLPct.toFixed(2)}%)
Trader Profile: ${selectedProfile.toUpperCase()}
Risk/Reward: ${analysisResult.riskRewardRatio}:1 (${analysisResult.riskRewardAssessment})

WHEN TO STOP LOSS:
• Stop Price: $${analysisResult.whenToStopLoss.recommendedStopPrice.toFixed(2)} (-${analysisResult.whenToStopLoss.recommendedDownsidePct}%)
• Max Dollar Risk: -$${analysisResult.whenToStopLoss.maxCapitalRisk.toFixed(2)}
• Action Protocol: ${analysisResult.whenToStopLoss.exactActionProtocol}

WHEN TO TAKE PROFIT:
• Primary Target: $${analysisResult.whenToTakeProfit.recommendedExitPrice.toFixed(2)}
• Expected Profit: +$${analysisResult.whenToTakeProfit.expectedGainAmount.toFixed(2)}
• Action Protocol: ${analysisResult.whenToTakeProfit.exactActionProtocol}

AI VERDICT:
${analysisResult.aiDiagnosis}`;
    }

    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeProfileConfig = TRADER_PROFILES.find((p) => p.id === selectedProfile) || TRADER_PROFILES[1];

  return (
    <div className="space-y-6">
      {/* 1. Master Header: Trader Profile Selector & Navigation */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/30 mb-2">
              <Clock className="h-3.5 w-3.5" />
              <span>POSITION RISK &amp; EXECUTION ENGINE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Position Risk &amp; Strategy Desk</span>
              <span className="text-sm font-normal text-cyan-400">({symbolInput || 'NVDA'})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dual-mode institutional desk: Analyze <strong>when to buy and sell</strong> before entering, or input a <strong>specific position</strong> to calculate exact stop-losses and take-profit targets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
              title="Copy analysis summary to clipboard"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Active Horizon:</span>
              <span className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-black text-white uppercase shadow-md shadow-cyan-500/20">
                {activeProfileConfig.shortLabel}
              </span>
            </div>
          </div>
        </div>

        {/* 5 Trader Horizon Selector Pills */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Select Trader Style / Time Horizon:</span>
            <span className="text-cyan-400 text-[11px] font-medium">{activeProfileConfig.description}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {TRADER_PROFILES.map((profile) => {
              const isSelected = selectedProfile === profile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => {
                    setSelectedProfile(profile.id);
                    onSelectTraderProfile(profile.id);
                  }}
                  className={`relative rounded-2xl border p-3 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/50'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className={`rounded-lg p-1.5 ${isSelected ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {profile.id === 'day_trader' && <Zap className="h-3.5 w-3.5" />}
                        {profile.id === 'weeks_trader' && <TrendingUp className="h-3.5 w-3.5" />}
                        {profile.id === 'months_trader' && <Layers className="h-3.5 w-3.5" />}
                        {profile.id === 'long_term' && <ShieldCheck className="h-3.5 w-3.5" />}
                        {profile.id === 'situational' && <Compass className="h-3.5 w-3.5" />}
                      </span>
                      {isSelected && (
                        <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[9px] font-black text-cyan-300 border border-cyan-400/40">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-white mb-0.5">{profile.shortLabel}</h3>
                    <p className="text-[10px] text-slate-400 leading-tight line-clamp-1">{profile.typicalHold}</p>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 text-[10px] text-cyan-400 font-semibold">
                    Risk Buffer: {profile.riskTolerance}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2 DISTINCT PRIMARY OPTIONS SELECTOR */}
        <div className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            {/* OPTION 1 BUTTON */}
            <button
              onClick={() => setActiveSubMode('buy_sell_timing')}
              className={`flex items-start gap-3 p-4 rounded-xl text-left transition-all cursor-pointer ${
                activeSubMode === 'buy_sell_timing'
                  ? 'bg-gradient-to-r from-cyan-600/90 to-blue-700/90 text-white shadow-xl shadow-cyan-600/25 ring-2 ring-cyan-400'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${activeSubMode === 'buy_sell_timing' ? 'bg-white/20 text-white' : 'bg-slate-800 text-cyan-400'}`}>
                <Target className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black tracking-wide">
                    OPTION 1: Analyze When to Buy &amp; Sell
                  </span>
                  {activeSubMode === 'buy_sell_timing' && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                      Active Mode
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1 text-slate-200/90 leading-snug">
                  Optimal entry zones, pullback triggers, breakout levels, and staged exit conditions for any stock.
                </p>
              </div>
            </button>

            {/* OPTION 2 BUTTON */}
            <button
              onClick={() => setActiveSubMode('specific_position_risk')}
              className={`flex items-start gap-3 p-4 rounded-xl text-left transition-all cursor-pointer ${
                activeSubMode === 'specific_position_risk'
                  ? 'bg-gradient-to-r from-indigo-600/90 to-cyan-700/90 text-white shadow-xl shadow-indigo-600/25 ring-2 ring-cyan-400'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${activeSubMode === 'specific_position_risk' ? 'bg-white/20 text-white' : 'bg-slate-800 text-indigo-400'}`}>
                <Crosshair className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black tracking-wide">
                    OPTION 2: Put Specific Position (Stop Loss &amp; Take Profit)
                  </span>
                  {activeSubMode === 'specific_position_risk' && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                      Active Mode
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1 text-slate-200/90 leading-snug">
                  Input what you bought/sold, exact execution price &amp; shares to get 3-tier stop losses and profit targets.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* OPTION 1 VIEW: ANALYZE WHEN TO BUY AND SELL (MARKET TIMING ENGINE) */}
      {/* ========================================================================= */}
      {activeSubMode === 'buy_sell_timing' && timingAnalysis && (
        <div className="space-y-6">
          {/* Quick Ticker Search & Asset Bar */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 mr-1">Analyze Asset:</span>
                <div className="relative">
                  <input
                    type="text"
                    value={symbolInput}
                    onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
                    placeholder="Ticker (e.g. NVDA)"
                    className="w-36 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-bold text-white uppercase focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => onSelectTicker(symbolInput)}
                  className="rounded-xl bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-cyan-500 transition"
                >
                  Analyze Timing
                </button>
              </div>

              {/* Popular Ticker Quick Switch Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <span className="text-[11px] text-slate-500 font-semibold mr-1">Presets:</span>
                {POPULAR_TICKERS.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => {
                      setSymbolInput(sym);
                      onSelectTicker(sym);
                    }}
                    className={`rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                      symbolInput.toUpperCase() === sym
                        ? 'bg-cyan-500 text-white font-black'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timing Verdict & Setup Score Banner */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    timingAnalysis.timingVerdict.includes('Buy')
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : timingAnalysis.timingVerdict.includes('Overbought') || timingAnalysis.timingVerdict.includes('Sell')
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {timingAnalysis.timingVerdict.includes('Buy') ? (
                    <TrendingUp className="h-6 w-6" />
                  ) : timingAnalysis.timingVerdict.includes('Overbought') || timingAnalysis.timingVerdict.includes('Sell') ? (
                    <TrendingDown className="h-6 w-6" />
                  ) : (
                    <Sliders className="h-6 w-6" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl font-black text-white">{timingAnalysis.symbol}</span>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-300">
                      Live Price: ${timingAnalysis.currentPrice.toFixed(2)}
                    </span>
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-xs font-black uppercase ${
                        timingAnalysis.timingVerdict.includes('Optimal Buy')
                          ? 'bg-emerald-500 text-white'
                          : timingAnalysis.timingVerdict.includes('Pullback')
                          ? 'bg-cyan-600 text-white'
                          : timingAnalysis.timingVerdict.includes('Overbought') || timingAnalysis.timingVerdict.includes('Sell')
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {timingAnalysis.timingVerdict}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-medium">{timingAnalysis.summaryHeadline}</p>
                </div>
              </div>

              {/* Timing Alignment Score Gauge */}
              <div className="flex items-center gap-4 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Timing Quality Score
                  </span>
                  <span className="text-xl font-black text-cyan-400">
                    {timingAnalysis.timingScore} / 100
                  </span>
                </div>
                <div className="border-l border-slate-800 pl-4 text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Conviction
                  </span>
                  <span className="text-base font-black text-emerald-400">
                    {timingAnalysis.conviction}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Strategic Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Optimal Buy Zone</span>
                <span className="text-sm sm:text-base font-black text-emerald-400">
                  ${timingAnalysis.whenToBuy.recommendedEntryZone.min.toFixed(2)} - ${timingAnalysis.whenToBuy.recommendedEntryZone.max.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 block">Accumulation Corridor</span>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Pullback Dip Buy</span>
                <span className="text-sm sm:text-base font-black text-cyan-300">
                  ${timingAnalysis.whenToBuy.pullbackDipEntry.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 block">Support Rebound Level</span>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Primary Target (TP 2)</span>
                <span className="text-sm sm:text-base font-black text-white">
                  ${timingAnalysis.whenToSell.targetSellZones[1]?.targetPrice.toFixed(2)}
                </span>
                <span className="text-[10px] text-emerald-400 block">
                  +{timingAnalysis.whenToSell.targetSellZones[1]?.upsidePct}% Upside Target
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Pre-Entry Invalidation</span>
                <span className="text-sm sm:text-base font-black text-rose-400">
                  ${timingAnalysis.whenToBuy.buyInvalidationPrice.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 block">Do Not Enter Below</span>
              </div>
            </div>
          </div>

          {/* SIDE-BY-SIDE: WHEN TO BUY vs WHEN TO SELL BLUEPRINT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GREEN BOX: WHEN TO BUY (ENTRY RULES & CONDITIONS) */}
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-emerald-300 uppercase tracking-tight">
                      When To Buy (Entry Blueprint)
                    </h4>
                    <span className="text-[11px] text-slate-400">Execution Triggers &amp; Timing</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block">Ideal Entry</span>
                  <span className="text-base sm:text-lg font-black text-white">
                    ${timingAnalysis.whenToBuy.recommendedEntryZone.min.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Strategic Guidance Callout */}
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 space-y-1.5">
                <div className="text-xs font-black text-emerald-300 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Strategic Buying Playbook ({activeProfileConfig.shortLabel})</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {timingAnalysis.whenToBuy.strategicGuidance}
                </p>
              </div>

              {/* Price Entry Zones */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Pullback / Dip Buy</span>
                  <span className="text-base font-black text-cyan-300 font-mono">
                    ${timingAnalysis.whenToBuy.pullbackDipEntry.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Buy limit on support bounce</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Breakout Entry Trigger</span>
                  <span className="text-base font-black text-emerald-400 font-mono">
                    ${timingAnalysis.whenToBuy.breakoutEntryTrigger.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Buy on confirmed volume break</span>
                </div>
              </div>

              {/* Technical Indicator Requirements for Buying */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-300 block">
                  Indicators Checklist Before Buying:
                </span>
                <div className="space-y-2">
                  {timingAnalysis.whenToBuy.requiredBuyConditions.map((cond, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-white">{cond.indicator}</div>
                        <div className="text-[11px] text-slate-400">{cond.condition}</div>
                      </div>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-black shrink-0 ${
                          cond.status === 'MET'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : cond.status === 'WARNING'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {cond.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RED/AMBER BOX: WHEN TO SELL (EXIT RULES & TARGETS) */}
            <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-b from-rose-950/20 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-rose-300 uppercase tracking-tight">
                      When To Sell &amp; Take Profit
                    </h4>
                    <span className="text-[11px] text-slate-400">Exit Milestones &amp; Risk Cut</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-rose-400 block">Emergency Cut</span>
                  <span className="text-base sm:text-lg font-black text-white">
                    ${timingAnalysis.whenToSell.emergencyCutPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Strategic Guidance Callout */}
              <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 space-y-1.5">
                <div className="text-xs font-black text-rose-300 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                  <span>Strategic Exit Playbook ({activeProfileConfig.shortLabel})</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {timingAnalysis.whenToSell.strategicGuidance}
                </p>
              </div>

              {/* Staged Target Sell Milestones */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-300 block">
                  Staged Profit Targets:
                </span>
                <div className="space-y-2">
                  {timingAnalysis.whenToSell.targetSellZones.map((zone, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          {zone.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-400">
                            Est: {zone.estimatedTimeframe}
                          </span>
                          <span className="font-mono font-black text-emerald-300 text-sm">
                            ${zone.targetPrice.toFixed(2)} (+{zone.upsidePct}%)
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {zone.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exit Triggers Checklist */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-300 block">
                  Sell / Exit Conditions:
                </span>
                <div className="space-y-2">
                  {timingAnalysis.whenToSell.requiredSellConditions.map((cond, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-white">{cond.indicator}</div>
                        <div className="text-[11px] text-slate-400">{cond.condition}</div>
                      </div>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-black shrink-0 ${
                          cond.status === 'MET'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {cond.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pre-Trade Verification Checklist */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-cyan-400" />
                <span>Pre-Trade Quantitative Verification Checklist</span>
              </h4>
              <span className="text-xs text-slate-400">Institutional Risk Protocol</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {timingAnalysis.checklist.map((chk, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border p-3.5 space-y-1 text-xs ${
                    chk.passed
                      ? 'border-emerald-500/30 bg-emerald-950/20 text-slate-200'
                      : 'border-amber-500/30 bg-amber-950/20 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-white">{chk.item}</span>
                    {chk.passed ? (
                      <span className="text-emerald-400 font-black flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> PASSED
                      </span>
                    ) : (
                      <span className="text-amber-400 font-black flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> CAUTION
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{chk.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini 3.7 AI Strategic Timing Synthesis & 1-Click Adopt Button */}
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">
                    Gemini 3.7 Institutional Timing Synthesis
                  </h4>
                  <span className="text-[11px] text-slate-400">Quantitative Strategy Thesis for {symbolInput}</span>
                </div>
              </div>

              <button
                onClick={handleRunAiTimingAnalysis}
                disabled={isTimingAiLoading}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 text-xs font-black text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition disabled:opacity-50"
              >
                <Sparkles className={`h-3.5 w-3.5 ${isTimingAiLoading ? 'animate-spin' : ''}`} />
                <span>{isTimingAiLoading ? 'Auditing Timing...' : 'Run Deep AI Timing Audit'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              {timingAnalysis.geminiTimingThesis}
            </p>

            {/* Seamless Action Switch: Convert to Option 2 */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
              <div className="text-xs text-slate-400">
                Ready to execute or track this setup? Adopt this entry price into Option 2 to manage live stop-loss &amp; profit targets.
              </div>

              <button
                onClick={() => handleAdoptSetupToPosition(timingAnalysis.whenToBuy.recommendedEntryZone.min)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-cyan-500 transition"
              >
                <span>Adopt Setup &amp; Track Specific Position</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OPTION 2 VIEW: PUT SPECIFIC POSITION (STOP LOSS & TAKE PROFIT MANAGER) */}
      {/* ========================================================================= */}
      {activeSubMode === 'specific_position_risk' && (
        <div className="space-y-6">
          {/* Position Input Form & Saved Positions Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Specific Position Entry Form (7 Cols) */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Crosshair className="h-4 w-4 text-cyan-400" />
                  <span>Input Your Specific Trade Position</span>
                </h3>
                <span className="text-xs text-slate-400">Stop-Loss &amp; Profit Engine</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Symbol Input */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Stock Symbol / Ticker
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={symbolInput}
                      onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
                      placeholder="e.g. NVDA, AAPL, TSLA"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none uppercase"
                    />
                    {symbolInput !== currentTicker && (
                      <button
                        onClick={() => onSelectTicker(symbolInput)}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded bg-cyan-600/80 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-cyan-500 transition"
                      >
                        Load Market Feed
                      </button>
                    )}
                  </div>
                </div>

                {/* Position Direction Toggle: BUY / LONG vs SELL / SHORT */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Position Direction
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPositionType('BUY')}
                      className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
                        positionType === 'BUY'
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400'
                          : 'border border-slate-700 bg-slate-950 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>BUY (Long)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPositionType('SELL')}
                      className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
                        positionType === 'SELL'
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25 ring-2 ring-rose-400'
                          : 'border border-slate-700 bg-slate-950 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <TrendingDown className="h-3.5 w-3.5" />
                      <span>SELL (Short)</span>
                    </button>
                  </div>
                </div>

                {/* Exact Entry Price */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300">
                      Executed Entry Price ($)
                    </label>
                    {quote?.price && (
                      <button
                        type="button"
                        onClick={() => setEntryPrice(quote.price.toFixed(2))}
                        className="text-[10px] font-bold text-cyan-400 hover:underline"
                      >
                        Use Live Price (${quote.price.toFixed(2)})
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      step="any"
                      value={entryPrice}
                      onChange={(e) => setEntryPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-7 pr-3 text-sm font-bold text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Position Size (Shares) */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Position Size (Shares / Units)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      placeholder="100"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                    <div className="flex gap-1 shrink-0">
                      {['25', '100', '500'].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setShares(amt)}
                          className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition"
                        >
                          {amt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trade Notes Input */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Position Thesis / Trade Strategy Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Bought on 20-day EMA bounce, targeting swing high..."
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSavePosition}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    <Bookmark className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Save Position</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Report'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRunAiDiagnosis}
                    disabled={isAiLoading}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition disabled:opacity-50"
                  >
                    <Sparkles className={`h-3.5 w-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                    <span>{isAiLoading ? 'Analyzing Risk...' : 'Run Gemini 3.7 AI Trade Diagnosis'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Saved Portfolio Positions List (5 Cols) */}
            <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-cyan-400" />
                    <span>My Saved Positions</span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
                      {savedPositions.length}
                    </span>
                  </h4>
                  {savedPositions.length > 0 && (
                    <button
                      onClick={() => setSavedPositions([])}
                      className="text-[10px] font-bold text-rose-400 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {savedPositions.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-500">
                      <Bookmark className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-400">No saved positions yet</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Enter your trade entry price above and click <em>Save Position</em> to track multiple assets simultaneously.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-2 pt-2 pr-1">
                    {savedPositions.map((pos) => {
                      const isPosBuy = pos.positionType === 'BUY';
                      return (
                        <div
                          key={pos.id}
                          onClick={() => handleLoadSavedPosition(pos)}
                          className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 hover:border-cyan-500/40 hover:bg-slate-900 transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${
                                isPosBuy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                              }`}
                            >
                              {pos.positionType}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-white text-sm">{pos.symbol}</span>
                                <span className="text-[10px] text-slate-400">
                                  @{pos.entryPrice.toFixed(2)} ({pos.shares} sh)
                                </span>
                              </div>
                              <span className="text-[10px] text-cyan-400 font-semibold uppercase">
                                {pos.traderProfile.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleDeletePosition(pos.id, e)}
                              className="p-1 text-slate-600 hover:text-rose-400 transition"
                              title="Delete position"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Launch 1-Action Presentation for this asset */}
              {onRunExecutiveWorkflow && symbolInput && (
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onRunExecutiveWorkflow(symbolInput)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 py-2.5 text-xs font-black text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-300 hover:to-blue-400 transition"
                  >
                    <Zap className="h-4 w-4 fill-white" />
                    <span>Launch 1-Action Presentation for {symbolInput}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Position P&L & Trade Performance Dashboard */}
          {analysisResult && (
            <div className="space-y-6">
              {/* Main Status & Metrics Hero */}
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 sm:p-6 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        analysisResult.unrealizedPnL >= 0
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {analysisResult.unrealizedPnL >= 0 ? (
                        <TrendingUp className="h-6 w-6" />
                      ) : (
                        <TrendingDown className="h-6 w-6" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-white">{analysisResult.symbol}</span>
                        <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-300">
                          {analysisResult.positionType === 'BUY' ? 'LONG POSITION' : 'SHORT POSITION'}
                        </span>
                        <span
                          className={`rounded-md px-2.5 py-0.5 text-xs font-black uppercase ${
                            analysisResult.tradeStatus.includes('Profit')
                              ? 'bg-emerald-500 text-white'
                              : analysisResult.tradeStatus.includes('Loss') || analysisResult.tradeStatus.includes('Stop')
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-500 text-slate-950'
                          }`}
                        >
                          {analysisResult.tradeStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Tailored for: <strong className="text-cyan-300 uppercase">{analysisResult.traderProfile.replace('_', ' ')}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Trade Health & R:R Score */}
                  <div className="flex items-center gap-4 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Trade Health Score
                      </span>
                      <span className="text-xl font-black text-cyan-400">
                        {analysisResult.tradeHealthScore} / 100
                      </span>
                    </div>
                    <div className="border-l border-slate-800 pl-4 text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Risk-Reward Ratio
                      </span>
                      <span className="text-xl font-black text-emerald-400">
                        {analysisResult.riskRewardRatio}:1
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantitative Position Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3.5 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Entry Execution</span>
                    <span className="text-lg font-black text-white">${analysisResult.entryPrice.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-500 block">{analysisResult.shares} shares</span>
                  </div>

                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3.5 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Current Price</span>
                    <span className="text-lg font-black text-white">${analysisResult.currentPrice.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-500 block">Live Market Feed</span>
                  </div>

                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3.5 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Cost Basis</span>
                    <span className="text-lg font-black text-white">${analysisResult.costBasis.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 block">Market Val: ${analysisResult.currentValue.toLocaleString()}</span>
                  </div>

                  <div
                    className={`rounded-2xl border p-3.5 text-center ${
                      analysisResult.unrealizedPnL >= 0
                        ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                        : 'border-rose-500/40 bg-rose-950/30 text-rose-300'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase block">Unrealized P&amp;L</span>
                    <span className="text-lg font-black block">
                      {analysisResult.unrealizedPnL >= 0 ? '+' : ''}${analysisResult.unrealizedPnL.toFixed(2)}
                    </span>
                    <span className="text-xs font-extrabold block">
                      {analysisResult.unrealizedPnLPct >= 0 ? '+' : ''}{analysisResult.unrealizedPnLPct.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Deep STOP LOSS vs TAKE PROFIT Battleground */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* STOP LOSS DIAGNOSTIC PANEL (RED/DEFENSE) */}
                <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-b from-rose-950/20 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-rose-300 uppercase tracking-tight">
                          When To Stop Loss (Capital Defense)
                        </h4>
                        <span className="text-[11px] text-slate-400">Strict Invalidation Triggers</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-rose-400 block">Recommended Stop</span>
                      <span className="text-xl font-black text-white">
                        ${analysisResult.whenToStopLoss.recommendedStopPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Exact Action Protocol Callout */}
                  <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 space-y-1.5">
                    <div className="text-xs font-black text-rose-300 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-rose-400" />
                      <span>Exact Action Protocol: When &amp; How To Exit</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {analysisResult.whenToStopLoss.exactActionProtocol}
                    </p>
                  </div>

                  {/* Key Risk Parameters */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Maximum Dollar Loss</span>
                      <span className="text-base font-black text-rose-400">
                        -${analysisResult.whenToStopLoss.maxCapitalRisk.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        -{analysisResult.whenToStopLoss.recommendedDownsidePct}% of trade capital
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Trailing Stop Distance</span>
                      <span className="text-base font-black text-cyan-300">
                        {analysisResult.whenToStopLoss.trailingStopDistancePct}%
                      </span>
                      <span className="text-[10px] text-slate-500 block">Dynamic peak trail</span>
                    </div>
                  </div>

                  {/* Stop Loss Levels Breakdown Table */}
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold text-slate-300 block">
                      Calibrated Stop Loss Thresholds:
                    </span>
                    <div className="space-y-2">
                      {analysisResult.whenToStopLoss.levels.map((lvl, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-rose-400" />
                              {lvl.label}
                            </span>
                            <span className="font-mono font-black text-rose-300 text-sm">
                              ${lvl.price.toFixed(2)} (-{lvl.downsidePct}%)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug">
                            {lvl.triggerCondition}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TAKE PROFIT DIAGNOSTIC PANEL (GREEN/OFFENSE) */}
                <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Target className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-emerald-300 uppercase tracking-tight">
                          When To Take Profit (Milestones)
                        </h4>
                        <span className="text-[11px] text-slate-400">Profit Scaling &amp; Target Targets</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-emerald-400 block">Core Target (TP 2)</span>
                      <span className="text-xl font-black text-white">
                        ${analysisResult.whenToTakeProfit.recommendedExitPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Exact Action Protocol Callout */}
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 space-y-1.5">
                    <div className="text-xs font-black text-emerald-300 uppercase flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      <span>Exact Action Protocol: When &amp; How To Scale Out</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {analysisResult.whenToTakeProfit.exactActionProtocol}
                    </p>
                  </div>

                  {/* Key Profit Parameters */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Expected Cash Gain</span>
                      <span className="text-base font-black text-emerald-400">
                        +${analysisResult.whenToTakeProfit.expectedGainAmount.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">At core target TP2</span>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Risk-Reward Skew</span>
                      <span className="text-base font-black text-cyan-300">
                        {analysisResult.riskRewardAssessment}
                      </span>
                      <span className="text-[10px] text-slate-500 block">{analysisResult.riskRewardRatio}:1 Ratio</span>
                    </div>
                  </div>

                  {/* Take Profit Levels Breakdown Table */}
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold text-slate-300 block">
                      Structured Profit Scale-Out Milestones:
                    </span>
                    <div className="space-y-2">
                      {analysisResult.whenToTakeProfit.levels.map((lvl) => (
                        <div
                          key={lvl.levelNumber}
                          className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-emerald-400" />
                              {lvl.label}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                                R:R {lvl.riskRewardRatio}
                              </span>
                              <span className="font-mono font-black text-emerald-300 text-sm">
                                ${lvl.targetPrice.toFixed(2)} (+{lvl.upsidePct}%)
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            {lvl.suggestedAction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gemini 3.7 Flash Institutional Trade Diagnosis */}
              <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 p-5 sm:p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">
                        Gemini 3.7 Institutional Trade Review &amp; Profile Diagnosis
                      </h4>
                      <span className="text-[11px] text-slate-400">Quantitative Risk Management Thesis</span>
                    </div>
                  </div>

                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] font-bold text-cyan-300 border border-cyan-500/30 hidden sm:inline">
                    Profile: {activeProfileConfig.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1.5">
                    <span className="text-xs font-bold text-cyan-300 uppercase block">
                      Overall Position Assessment
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                      {analysisResult.aiDiagnosis}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1.5">
                    <span className="text-xs font-bold text-blue-300 uppercase block">
                      Tailored Advice for {activeProfileConfig.shortLabel}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                      {analysisResult.tailoredGuidanceForProfile}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
