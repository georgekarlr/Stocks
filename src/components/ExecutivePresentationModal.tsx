import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  Target,
  AlertTriangle,
  Layers,
  ChevronRight,
  ChevronLeft,
  Share2,
  Copy,
  Check,
  Printer,
  Maximize2,
  Minimize2,
  Radio,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Ban,
  RefreshCw,
  Key,
} from 'lucide-react';
import {
  ExecutiveBriefingData,
  StockQuote,
  TechnicalIndicators,
} from '../types/stock';
import {
  VoiceOption,
  speakWithBrowserSynthesis,
  stopAllAudioPlayback,
} from '../utils/speech';

export type PipelineStepStatus = 'pending' | 'running' | 'success' | 'error';

export interface StepInfo {
  step: number;
  label: string;
  sublabel: string;
  status: PipelineStepStatus;
}

interface ExecutivePresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticker: string | null;
  quote: StockQuote | null;
  technicals: TechnicalIndicators | null;
  briefingData: ExecutiveBriefingData | null;
  isLoading: boolean;
  pipelineStep: number; // 1 to 5
  pipelineMessage: string;
  pipelineError?: string | null;
  stepStatuses?: Record<number, PipelineStepStatus>;
  isCancelled?: boolean;
  onCancel?: () => void;
  onRetry?: () => void;
  onUseFallback?: () => void;
  onOpenApiKeyModal?: () => void;
  onAskCopilot?: (question: string) => void;
}

const VOICES: { id: VoiceOption; name: string; style: string; pitch: number }[] = [
  { id: 'Kore', name: 'Kore', style: 'Executive Institutional & Measured', pitch: 1.0 },
  { id: 'Puck', name: 'Puck', style: 'Dynamic Quant & Momentum Trader', pitch: 1.1 },
  { id: 'Fenrir', name: 'Fenrir', style: 'Deep Macro & Risk Strategist', pitch: 0.85 },
  { id: 'Zephyr', name: 'Zephyr', style: 'Cinematic Storyteller & Anchor', pitch: 0.95 },
];

const DEFAULT_STEPS: { step: number; label: string; sublabel: string }[] = [
  { step: 1, label: '1. Ingest Data', sublabel: 'Live candles & market feed' },
  { step: 2, label: '2. Quant Models', sublabel: 'SMA, RSI, MACD & Sharpe' },
  { step: 3, label: '3. Gemini 3.7 Synthesis', sublabel: 'Executive verdict & action plan' },
  { step: 4, label: '4. Visuals & Deck', sublabel: 'Slide deck & concept art' },
  { step: 5, label: '5. Voice Narration', sublabel: 'Live spoken audio initialization' },
];

export const ExecutivePresentationModal: React.FC<ExecutivePresentationModalProps> = ({
  isOpen,
  onClose,
  ticker,
  quote,
  technicals,
  briefingData,
  isLoading,
  pipelineStep,
  pipelineMessage,
  pipelineError,
  stepStatuses = {},
  isCancelled = false,
  onCancel,
  onRetry,
  onUseFallback,
  onOpenApiKeyModal,
  onAskCopilot,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>('Kore');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentWordCharIndex, setCurrentWordCharIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Auto-play when briefing finishes generating
  useEffect(() => {
    if (isOpen && briefingData && !isLoading && !pipelineError && !isCancelled) {
      setCurrentSlide(0);
      const timer = setTimeout(() => {
        startVoicePresentation(briefingData.spokenPresenterScript);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, briefingData, isLoading, pipelineError, isCancelled]);

  // Clean up audio on close or cancel
  useEffect(() => {
    if (!isOpen || isCancelled) {
      stopAllAudioPlayback();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [isOpen, isCancelled]);

  if (!isOpen) return null;

  const startVoicePresentation = (scriptText?: string) => {
    const textToSpeak = scriptText || briefingData?.spokenPresenterScript;
    if (!textToSpeak) return;

    stopAllAudioPlayback();
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentWordCharIndex(0);

    const activeVoiceConfig = VOICES.find((v) => v.id === selectedVoice);

    speakWithBrowserSynthesis({
      text: textToSpeak,
      voiceName: selectedVoice,
      rate: playbackSpeed,
      pitch: activeVoiceConfig?.pitch || 1.0,
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentWordCharIndex(0);
      },
      onBoundary: (charIdx) => {
        setCurrentWordCharIndex(charIdx);
      },
      onError: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
    });
  };

  const handlePauseResume = () => {
    if (!isPlaying) {
      startVoicePresentation();
    } else if (isPaused) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      setIsPaused(false);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    stopAllAudioPlayback();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordCharIndex(0);
  };

  const handleCopyBriefing = () => {
    if (!briefingData) return;
    const text = `STOCKPULSE EXECUTIVE BRIEFING: ${ticker}\n\nVERDICT: ${briefingData.verdict} (${briefingData.convictionScore}% Conviction)\nPRICE TARGET: $${briefingData.targetPrice} | STOP LOSS: $${briefingData.stopLossPrice}\n\nEXECUTIVE SUMMARY:\n${briefingData.headlineSummary}\n\nWHAT TO DO NOW:\n• Action: ${briefingData.whatToDoNow.actionVerdict}\n• Existing Holders: ${briefingData.whatToDoNow.forCurrentHolders}\n• Potential Buyers: ${briefingData.whatToDoNow.forNewBuyers}\n• Risk Mitigation: ${briefingData.whatToDoNow.forCautiousInvestors}\n\nSPOKEN TRANSCRIPT:\n${briefingData.spokenPresenterScript}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const verdictBadgeColor = (verdict: string) => {
    switch (verdict) {
      case 'Strong Buy':
        return 'bg-emerald-500 text-white shadow-emerald-500/30';
      case 'Buy':
        return 'bg-emerald-600/90 text-white shadow-emerald-600/30';
      case 'Hold':
        return 'bg-amber-500 text-slate-950 shadow-amber-500/30';
      case 'Sell':
        return 'bg-rose-600 text-white shadow-rose-600/30';
      case 'Strong Sell':
        return 'bg-rose-700 text-white shadow-rose-700/30';
      default:
        return 'bg-cyan-500 text-white shadow-cyan-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-2 sm:p-4 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className={`relative w-full rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isFullScreen
            ? 'max-w-full h-full my-0 rounded-none'
            : 'max-w-6xl max-h-[94vh] my-auto'
        }`}
      >
        {/* Top Executive Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>Executive Presentation Suite</span>
                  <span className="rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 px-2 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider">
                    Autonomous 1-Action Pipeline
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                {ticker ? `${ticker} • ${quote?.companyName || 'Live Market Asset'}` : 'Analyzing Market Data...'}
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2">
            {briefingData && (
              <>
                <button
                  onClick={handleCopyBriefing}
                  title="Copy Briefing Text"
                  className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  title="Print / Save PDF"
                  className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>PDF</span>
                </button>
              </>
            )}

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
              className="rounded-xl border border-slate-700 bg-slate-800/80 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              {isFullScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => {
                if (isLoading && onCancel) {
                  onCancel();
                }
                onClose();
              }}
              className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PIPELINE ERROR STATE CARD */}
        {pipelineError && !isLoading ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 flex-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-xl shadow-rose-500/10">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2 max-w-lg">
              <h4 className="text-xl font-bold text-white">Pipeline Execution Halted</h4>
              <p className="text-sm text-rose-300/90 leading-relaxed bg-rose-950/40 p-3 rounded-xl border border-rose-900/60 font-mono text-left text-xs">
                {pipelineError}
              </p>
              <p className="text-xs text-slate-400">
                Intermediate steps before this failure were successfully computed and saved.
              </p>
            </div>

            {/* Action Buttons in Error State */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-black text-white shadow-lg hover:from-cyan-400 hover:to-blue-500 transition"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Retry Pipeline</span>
                </button>
              )}

              {onUseFallback && (
                <button
                  onClick={onUseFallback}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-lg hover:bg-emerald-500 transition"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Continue with Algorithmic Quant Model</span>
                </button>
              )}

              {onOpenApiKeyModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenApiKeyModal();
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  <Key className="h-4 w-4 text-cyan-400" />
                  <span>Configure Gemini API Key</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                Cancel &amp; Close
              </button>
            </div>
          </div>
        ) : isCancelled && !isLoading ? (
          /* CANCELLED STATE */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-5 flex-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Ban className="h-7 w-7" />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h4 className="text-lg font-bold text-white">Execution Cancelled</h4>
              <p className="text-xs text-slate-400">
                The 1-Action presentation pipeline was stopped per your request. Ingested market data and indicators remain available in the terminal.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition shadow"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Restart Workflow</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                Close Modal
              </button>
            </div>
          </div>
        ) : isLoading ? (
          /* LOADING / STEP-BY-STEP PIPELINE EXECUTION STAGE WITH CANCEL BUTTON */
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 flex-1">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-blue-500 border-b-transparent border-l-transparent animate-spin" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-cyan-400 shadow-xl">
                <Sparkles className="h-7 w-7 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 max-w-lg">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-3 py-1 text-xs font-bold text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Executing Step {pipelineStep} of 5</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white">
                {pipelineMessage || 'Ingesting & processing market data...'}
              </h4>
              <p className="text-xs text-slate-400">
                Each step saves progress before proceeding. You can cancel at any moment.
              </p>
            </div>

            {/* Detailed Visual Step Card List */}
            <div className="w-full max-w-2xl space-y-2 pt-1 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {DEFAULT_STEPS.map((s) => {
                  const status = stepStatuses[s.step] || (pipelineStep > s.step ? 'success' : pipelineStep === s.step ? 'running' : 'pending');

                  return (
                    <div
                      key={s.step}
                      className={`rounded-xl border p-2.5 transition-all duration-300 ${
                        status === 'success'
                          ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                          : status === 'running'
                          ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                          : status === 'error'
                          ? 'border-rose-500 bg-rose-950/30 text-rose-300'
                          : 'border-slate-800 bg-slate-950/60 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">
                          Step {s.step}
                        </span>
                        {status === 'success' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        ) : status === 'running' ? (
                          <div className="h-3.5 w-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                        ) : status === 'error' ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-slate-700" />
                        )}
                      </div>
                      <span className="text-xs font-bold block truncate text-slate-200">
                        {s.label.replace(/^\d+\.\s*/, '')}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                        {status === 'success' ? 'Saved & Verified' : status === 'running' ? 'Processing...' : s.sublabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cancel Request Button */}
            {onCancel && (
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 px-5 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-900/60 hover:text-white transition shadow-sm"
                >
                  <Ban className="h-3.5 w-3.5 text-rose-400" />
                  <span>Cancel Request</span>
                </button>
              </div>
            )}
          </div>
        ) : briefingData ? (
          /* Presentation Main Stage */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Top Highlight Banner: "What To Do Right Now" */}
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 p-4 sm:p-5 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-cyan-500/20 px-2.5 py-0.5 text-xs font-black text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                      <Target className="h-3 w-3" /> WHAT TO DO NOW
                    </span>
                    <span className={`rounded-md px-2.5 py-0.5 text-xs font-black uppercase shadow ${verdictBadgeColor(briefingData.verdict)}`}>
                      {briefingData.verdict} ({briefingData.convictionScore}% Conviction)
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    {briefingData.whatToDoNow.actionVerdict}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {briefingData.headlineSummary}
                  </p>
                </div>

                {/* Key Target Levels */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 shrink-0">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Current Price</span>
                    <span className="text-base font-extrabold text-white">
                      ${quote?.price.toFixed(2)}
                    </span>
                    <span className={`text-[10px] font-bold block ${quote && quote.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {quote && quote.change >= 0 ? '+' : ''}{quote?.changePercent}%
                    </span>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-2.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Target Price</span>
                    <span className="text-base font-extrabold text-emerald-300">
                      ${briefingData.targetPrice}
                    </span>
                    <span className="text-[10px] text-emerald-400/80 block font-semibold">
                      +{quote ? (((briefingData.targetPrice - quote.price) / quote.price) * 100).toFixed(1) : 0}% Upside
                    </span>
                  </div>

                  <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-2.5 text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">Stop-Loss Exit</span>
                    <span className="text-base font-extrabold text-rose-300">
                      ${briefingData.stopLossPrice}
                    </span>
                    <span className="text-[10px] text-rose-400/80 block font-semibold">Strict Floor</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Screen: Presenter Voice Stage (Left) & Synchronized Slides / Action Deck (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Voice Broadcaster & Live Karaoke Script (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Audio Broadcast Control Console */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${isPlaying && !isPaused ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {isPlaying && !isPaused ? 'Voice Presentation Active' : isPaused ? 'Presentation Paused' : 'Voice Narrator Ready'}
                      </span>
                    </div>

                    {/* Audio Waveform Animation */}
                    {isPlaying && !isPaused && (
                      <div className="flex items-center gap-0.5">
                        <span className="h-4 w-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-6 w-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-3 w-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="h-5 w-1 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                      </div>
                    )}
                  </div>

                  {/* Playback Button Group */}
                  <div className="flex items-center justify-center gap-3 py-1">
                    <button
                      onClick={handlePauseResume}
                      className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition active:scale-95"
                    >
                      {isPlaying && !isPaused ? (
                        <>
                          <Pause className="h-4 w-4 fill-white" />
                          <span>Pause Voice</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 fill-white" />
                          <span>{isPaused ? 'Resume Voice' : 'Play Presentation'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleStop}
                      disabled={!isPlaying && !isPaused}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-30"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Restart</span>
                    </button>
                  </div>

                  {/* Voice & Speed Pickers */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Presenter Voice</label>
                      <select
                        value={selectedVoice}
                        onChange={(e) => {
                          setSelectedVoice(e.target.value as VoiceOption);
                          if (isPlaying) {
                            startVoicePresentation(briefingData.spokenPresenterScript);
                          }
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      >
                        {VOICES.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.style.split('&')[0].trim()})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Speaking Speed</label>
                      <select
                        value={playbackSpeed}
                        onChange={(e) => {
                          setPlaybackSpeed(parseFloat(e.target.value));
                          if (isPlaying) {
                            startVoicePresentation(briefingData.spokenPresenterScript);
                          }
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="0.85">0.85x (Deliberate)</option>
                        <option value="1.0">1.0x (Standard)</option>
                        <option value="1.2">1.2x (Fast)</option>
                        <option value="1.4">1.4x (High Speed)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Spoken Teleprompter / Transcript */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Spoken Presenter Teleprompter</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Live Script</span>
                  </div>

                  <div
                    ref={transcriptContainerRef}
                    className="max-h-60 overflow-y-auto rounded-xl bg-slate-900/80 p-3 text-xs leading-relaxed text-slate-300 font-normal border border-slate-800"
                  >
                    {briefingData.spokenPresenterScript}
                  </div>
                </div>

                {/* AI Editorial Image Card (if available) */}
                {briefingData.imageUrl && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
                    <div className="relative aspect-video w-full">
                      <img
                        src={briefingData.imageUrl}
                        alt="Editorial Art"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3">
                        <span className="rounded bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold text-cyan-300 backdrop-blur border border-cyan-500/30">
                          AI Editorial Concept Visual
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Visual Slides Deck & Action Guidance (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Slide Navigation Tabs */}
                <div className="flex items-center justify-between bg-slate-950 rounded-2xl p-1.5 border border-slate-800">
                  <div className="flex flex-wrap gap-1">
                    {briefingData.presentationSlides.map((slide, idx) => (
                      <button
                        key={slide.slideNumber}
                        onClick={() => setCurrentSlide(idx)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                          currentSlide === idx
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span>Slide {slide.slideNumber}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 pr-1">
                    <button
                      onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                      disabled={currentSlide === 0}
                      className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentSlide((prev) =>
                          Math.min(briefingData.presentationSlides.length - 1, prev + 1)
                        )
                      }
                      disabled={currentSlide === briefingData.presentationSlides.length - 1}
                      className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 transition"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Active Slide Card Display */}
                {briefingData.presentationSlides[currentSlide] && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6 space-y-4 shadow-xl relative overflow-hidden">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                          SLIDE {briefingData.presentationSlides[currentSlide].slideNumber} OF {briefingData.presentationSlides.length}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                          {briefingData.presentationSlides[currentSlide].slideTitle}
                        </h3>
                      </div>
                      <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-300 border border-slate-700">
                        {briefingData.presentationSlides[currentSlide].visualEmphasis}
                      </span>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2.5 pt-2">
                      {briefingData.presentationSlides[currentSlide].bullets.map((bullet, bIdx) => (
                        <div
                          key={bIdx}
                          className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-xs sm:text-sm text-slate-200"
                        >
                          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Action Playbook: "What To Do For Every Investor Type" */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-5 space-y-4 shadow-lg">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Direct Action Playbook (Tailored Guidance)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* Existing Holders */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1.5">
                      <div className="font-bold text-emerald-400 flex items-center gap-1">
                        <span>For Current Holders</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {briefingData.whatToDoNow.forCurrentHolders}
                      </p>
                    </div>

                    {/* Potential New Buyers */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1.5">
                      <div className="font-bold text-cyan-400 flex items-center gap-1">
                        <span>For Potential Buyers</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {briefingData.whatToDoNow.forNewBuyers}
                      </p>
                    </div>

                    {/* Cautious Investors */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1.5">
                      <div className="font-bold text-amber-400 flex items-center gap-1">
                        <span>Defensive &amp; Hedging</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {briefingData.whatToDoNow.forCautiousInvestors}
                      </p>
                    </div>
                  </div>

                  {/* Key Price Triggers Table */}
                  {briefingData.whatToDoNow.keyPriceTriggers && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-400">Target Trigger Levels:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {briefingData.whatToDoNow.keyPriceTriggers.map((trig, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs space-y-0.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-300">{trig.levelName}</span>
                              <span className="font-mono font-bold text-cyan-300">{trig.price}</span>
                            </div>
                            <p className="text-[11px] text-slate-400">{trig.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Plain English Story / Explanation */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    The Plain English Narrative
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {briefingData.plainEnglishStory}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Footer Bar */}
        <div className="border-t border-slate-800 bg-slate-950/90 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Autonomous Financial Intelligence powered by Gemini 3.7 Flash &amp; Google Cloud</span>
          </div>

          <div className="flex items-center gap-2">
            {onAskCopilot && ticker && (
              <button
                onClick={() => {
                  onClose();
                  onAskCopilot(`Explain the executive presentation and what to do with ${ticker} in more detail.`);
                }}
                className="flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 transition"
              >
                <span>Ask Quant Copilot Questions</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
