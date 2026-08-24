import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  Image as ImageIcon,
  Clock,
  Quote,
  Share2,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { StockStory, StockQuote } from '../types/stock';

interface StoryStudioProps {
  story: StockStory | null;
  quote: StockQuote | null;
  onGenerateStory: (genre: string) => void;
  onGenerateImage: (prompt: string) => void;
  onPlayStoryAudio: (text: string) => void;
  isStoryLoading: boolean;
  isImageLoading: boolean;
}

const GENRES = [
  { id: 'Wall Street Memo', label: 'Wall Street Memo', desc: 'High-stakes institutional hedge fund memo' },
  { id: 'Investigative Exposé', label: 'Investigative Exposé', desc: 'Dramatic financial journalism & market drama' },
  { id: 'Quant Odyssey', label: 'Quant Odyssey', desc: 'Data-driven algorithmic adventure with math & code' },
  { id: 'Retail Plain English', label: 'Plain English', desc: 'Accessible, relatable storytelling for retail investors' },
];

export const StoryStudio: React.FC<StoryStudioProps> = ({
  story,
  quote,
  onGenerateStory,
  onGenerateImage,
  onPlayStoryAudio,
  isStoryLoading,
  isImageLoading,
}) => {
  const [selectedGenre, setSelectedGenre] = useState('Wall Street Memo');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  if (!story) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center backdrop-blur shadow-2xl max-w-4xl mx-auto">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
          <BookOpen className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-black text-white">AI Financial Story Studio</h3>
        <p className="mt-2 text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Transform raw OHLCV prices, volume spikes, and indicator data for{' '}
          <strong className="text-cyan-400">{quote?.symbol || 'your asset'}</strong> into an episodic, cinematic financial documentary.
        </p>

        {/* Genre Selector */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-2xl mx-auto text-left">
          {GENRES.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.id)}
              className={`rounded-2xl border p-4 transition ${
                selectedGenre === g.id
                  ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-sm text-white">
                <span>{g.label}</span>
                {selectedGenre === g.id && <Sparkles className="h-4 w-4 text-indigo-400" />}
              </div>
              <p className="text-xs text-slate-400 mt-1">{g.desc}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => onGenerateStory(selectedGenre)}
          disabled={isStoryLoading || !quote}
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 px-8 py-3.5 text-sm font-black text-white shadow-xl shadow-indigo-500/25 hover:from-indigo-400 hover:to-cyan-400 transition disabled:opacity-50"
        >
          <Sparkles className={`h-5 w-5 ${isStoryLoading ? 'animate-spin' : ''}`} />
          <span>{isStoryLoading ? 'Gemini 3.7 Crafting Story & Chapters...' : 'Generate Financial Story with Gemini 3.7'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Story Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-950 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/40">
                {story.genre || selectedGenre}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                <Clock className="h-3.5 w-3.5 text-cyan-400" /> {story.readTime || '4 min read'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPlayStoryAudio(story.audioTranscript || story.chapters.map((c) => c.narrative).join(' '))}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition"
              >
                <Volume2 className="h-4 w-4" />
                <span>Play Voice Narration</span>
              </button>

              <button
                onClick={() => onGenerateStory(selectedGenre)}
                disabled={isStoryLoading}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isStoryLoading ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {story.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base font-medium text-slate-300 leading-relaxed italic">
            "{story.subtitle}"
          </p>

          {/* AI Generated Editorial Cover Art */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl relative group">
            {story.imageUrl ? (
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg backdrop-blur border border-slate-800">
                    <ImageIcon className="h-4 w-4 text-cyan-400" />
                    <span>AI Editorial Concept Art • Gemini Image Model</span>
                  </div>
                  <button
                    onClick={() => onGenerateImage(story.coverVisualPrompt || story.title)}
                    disabled={isImageLoading}
                    className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-200 transition"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isImageLoading ? 'animate-spin' : ''}`} />
                    <span>Re-render Art</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="aspect-[16/9] flex flex-col items-center justify-center p-6 text-center bg-slate-950">
                <ImageIcon className="h-10 w-10 text-slate-600 mb-3" />
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  Visual Prompt: {story.coverVisualPrompt || 'Market narrative visualization'}
                </p>
                <button
                  onClick={() => onGenerateImage(story.coverVisualPrompt || story.title)}
                  disabled={isImageLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isImageLoading ? 'Rendering Concept Visual...' : 'Generate Editorial Artwork'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chapter Tabs & Story Reader */}
      <div className="space-y-6">
        {/* Chapter Selection Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {story.chapters?.map((ch, idx) => (
            <button
              key={idx}
              onClick={() => setActiveChapterIndex(idx)}
              className={`flex flex-col text-left p-3.5 rounded-2xl border transition ${
                activeChapterIndex === idx
                  ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-400'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 mb-1">
                <span>CHAPTER {ch.chapterNumber}</span>
                <span className={`h-2 w-2 rounded-full ${
                  ch.sentiment === 'bullish' ? 'bg-emerald-400' : ch.sentiment === 'bearish' ? 'bg-rose-400' : 'bg-amber-400'
                }`} />
              </div>
              <span className="text-xs font-bold truncate text-slate-200">{ch.title}</span>
              <span className="text-[10px] text-slate-400 mt-1 truncate">{ch.timeframe}</span>
            </button>
          ))}
        </div>

        {/* Active Chapter Reader Card */}
        {story.chapters && story.chapters[activeChapterIndex] && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs font-black tracking-widest text-cyan-400 uppercase">
                  Chapter {story.chapters[activeChapterIndex].chapterNumber} • {story.chapters[activeChapterIndex].timeframe}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {story.chapters[activeChapterIndex].title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                  story.chapters[activeChapterIndex].sentiment === 'bullish'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : story.chapters[activeChapterIndex].sentiment === 'bearish'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}>
                  Sentiment: {story.chapters[activeChapterIndex].sentiment}
                </span>
              </div>
            </div>

            {/* Narrative Body */}
            <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 font-sans">
              {story.chapters[activeChapterIndex].narrative.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Key Quote Callout */}
            {story.chapters[activeChapterIndex].keyQuote && (
              <div className="my-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 relative">
                <Quote className="absolute top-4 left-4 h-6 w-6 text-indigo-400/40 pointer-events-none" />
                <p className="text-sm font-semibold italic text-indigo-200 pl-8 leading-relaxed">
                  "{story.chapters[activeChapterIndex].keyQuote}"
                </p>
              </div>
            )}

            {/* Data Metric Highlight */}
            {story.chapters[activeChapterIndex].metricsHighlight && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-950/80 px-4 py-3 border border-slate-800 text-xs text-slate-300">
                <Flame className="h-4 w-4 text-amber-400" />
                <span>
                  <strong className="text-white">Quantitative Anchor:</strong> {story.chapters[activeChapterIndex].metricsHighlight}
                </span>
              </div>
            )}

            {/* Chapter Stepper Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeChapterIndex === 0}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-30"
              >
                Previous Chapter
              </button>

              <button
                onClick={() =>
                  setActiveChapterIndex((prev) => Math.min(story.chapters.length - 1, prev + 1))
                }
                disabled={activeChapterIndex === story.chapters.length - 1}
                className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 disabled:opacity-30"
              >
                <span>Next Chapter</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
