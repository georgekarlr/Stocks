import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  UserCheck,
  Radio,
  Sliders,
  FileText,
  FastForward,
} from 'lucide-react';
import { VoiceOption, speakWithBrowserSynthesis, stopAllAudioPlayback } from '../utils/speech';
import { StockStory, StockAnalysis, StockQuote } from '../types/stock';

interface VoiceBriefingRoomProps {
  story: StockStory | null;
  analysis: StockAnalysis | null;
  quote: StockQuote | null;
  incomingTextToPlay?: string | null;
  onClearIncomingText?: () => void;
}

const VOICES: { id: VoiceOption; name: string; style: string; pitch: number }[] = [
  { id: 'Kore', name: 'Kore', style: 'Executive Institutional & Measured', pitch: 1.0 },
  { id: 'Puck', name: 'Puck', style: 'Dynamic Quant & Momentum Trader', pitch: 1.1 },
  { id: 'Fenrir', name: 'Fenrir', style: 'Deep Macro & Risk Strategist', pitch: 0.85 },
  { id: 'Zephyr', name: 'Zephyr', style: 'Cinematic Storyteller & Narrative', pitch: 0.95 },
];

export const VoiceBriefingRoom: React.FC<VoiceBriefingRoomProps> = ({
  story,
  analysis,
  quote,
  incomingTextToPlay,
  onClearIncomingText,
}) => {
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>('Kore');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordCharIndex, setCurrentWordCharIndex] = useState<number>(0);
  const [customText, setCustomText] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<'story' | 'analysis' | 'custom'>('analysis');

  const playbackControllerRef = useRef<{ stop: () => void; pause?: () => void; resume?: () => void } | null>(null);

  // Generate source texts
  const analysisScript = analysis && quote
    ? `Welcome to the StockPulse executive briefing for ${quote.symbol}, ${quote.companyName}.
Currently trading at $${quote.price}, showing a ${quote.change >= 0 ? 'gain' : 'decline'} of ${Math.abs(quote.changePercent)} percent.
Our quantitative model assigns a verdict of: ${analysis.verdict}, with an analyst conviction level of ${analysis.confidenceScore} percent.
Our 12-month target price is $${analysis.targetPrice}, offering an upside of ${(((analysis.targetPrice - quote.price) / quote.price) * 100).toFixed(1)} percent, with a suggested stop loss anchored at $${analysis.stopLoss}.
Executive thesis: ${analysis.executiveSummary}
On the technical front: ${analysis.technicalThesis}
Regarding risk management: ${analysis.riskFactors?.[0]?.risk || 'Monitor broad market volatility'}.
Short term traders should note: ${analysis.actionableRecommendations?.shortTermTrader}.
End of executive briefing.`
    : '';

  const storyScript = story?.audioTranscript || story?.chapters.map((c) => `Chapter ${c.chapterNumber}: ${c.title}. ${c.narrative}`).join('\n\n') || '';

  const activeText =
    selectedSource === 'story'
      ? storyScript
      : selectedSource === 'analysis'
      ? analysisScript
      : customText;

  // Handle incoming trigger to play immediately
  useEffect(() => {
    if (incomingTextToPlay) {
      setCustomText(incomingTextToPlay);
      setSelectedSource('custom');
      startPlayback(incomingTextToPlay);
      onClearIncomingText?.();
    }
  }, [incomingTextToPlay]);

  const startPlayback = (textToRead?: string) => {
    const text = textToRead || activeText;
    if (!text.trim()) return;

    stopAllAudioPlayback();
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentWordCharIndex(0);

    const activeVoiceConfig = VOICES.find((v) => v.id === selectedVoice);

    const controller = speakWithBrowserSynthesis({
      text,
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

    playbackControllerRef.current = controller;
  };

  const handlePauseResume = () => {
    if (!isPlaying) {
      startPlayback();
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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAllAudioPlayback();
    };
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Audio Console Header */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 mb-2">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>AI VOICE NARRATOR & AUDIO BRIEFING ROOM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Executive Audio Broadcast
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Listen to Gemini 3.7 quantified research dossiers, episodic market documentaries, and custom scripts hands-free.
            </p>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 shadow-inner">
            {[14, 28, 42, 20, 36, 48, 16, 32, 45, 22, 38, 12, 30, 44].map((h, idx) => (
              <div
                key={idx}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isPlaying && !isPaused
                    ? 'bg-gradient-to-t from-emerald-500 to-cyan-400'
                    : 'bg-slate-700'
                }`}
                style={{
                  height: isPlaying && !isPaused ? `${Math.max(8, (h * (1 + Math.sin(Date.now() * 0.01 + idx))) % 46)}px` : '8px',
                }}
              />
            ))}
            <span className="text-[11px] font-mono text-slate-400 ml-2 font-bold">
              {isPlaying && !isPaused ? 'TRANSMITTING' : 'IDLE'}
            </span>
          </div>
        </div>

        {/* Voice Persona Selector */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {VOICES.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setSelectedVoice(v.id);
                if (isPlaying) {
                  stopAllAudioPlayback();
                  setTimeout(() => startPlayback(), 100);
                }
              }}
              className={`flex flex-col text-left p-3.5 rounded-2xl border transition ${
                selectedVoice === v.id
                  ? 'border-emerald-500 bg-emerald-950/30 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
                <span>{v.name}</span>
                {selectedVoice === v.id && <UserCheck className="h-3.5 w-3.5" />}
              </div>
              <span className="text-[11px] text-slate-300 font-medium line-clamp-2 leading-tight">{v.style}</span>
            </button>
          ))}
        </div>

        {/* Playback Controls & Speed */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePauseResume}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 transition"
            >
              {isPlaying && !isPaused ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              <span>{isPlaying && !isPaused ? 'Pause Narration' : isPaused ? 'Resume' : 'Play Briefing'}</span>
            </button>

            <button
              onClick={handleStop}
              disabled={!isPlaying}
              className="rounded-2xl border border-slate-700 bg-slate-800/80 p-3 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 transition"
              title="Stop Audio"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>

          {/* Speed Multiplier */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 px-2">Speed:</span>
            {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => {
                  setPlaybackSpeed(rate);
                  if (isPlaying) {
                    stopAllAudioPlayback();
                    setTimeout(() => startPlayback(), 100);
                  }
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  playbackSpeed === rate
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Script Source Selector Tabs & Transcript Reader */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedSource('analysis');
                handleStop();
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                selectedSource === 'analysis'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Executive Analysis Script
            </button>

            <button
              onClick={() => {
                setSelectedSource('story');
                handleStop();
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                selectedSource === 'story'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Full Financial Story Script
            </button>

            <button
              onClick={() => {
                setSelectedSource('custom');
                handleStop();
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                selectedSource === 'custom'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Custom Analyst Prompt
            </button>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {activeText.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>

        {/* Content Display / Editor */}
        {selectedSource === 'custom' ? (
          <div>
            <textarea
              rows={6}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Type or paste any financial notes, earnings call transcripts, or analyst questions to hear them read aloud..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 font-sans text-sm sm:text-base leading-relaxed max-h-96 overflow-y-auto">
            {activeText ? (
              <div className="text-slate-300 space-y-4">
                {activeText.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                No script available. Run Gemini 3.7 Analysis or Generate a Story first!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
