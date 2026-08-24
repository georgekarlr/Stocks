import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { SearchLaunchpad } from './components/SearchLaunchpad';
import { StockOverviewHeader } from './components/StockOverviewHeader';
import { InteractiveChart } from './components/InteractiveChart';
import { QuantMetricsGrid } from './components/QuantMetricsGrid';
import { GeminiAnalysisCard } from './components/GeminiAnalysisCard';
import { StockMarketTable } from './components/StockMarketTable';
import { StoryStudio } from './components/StoryStudio';
import { VoiceBriefingRoom } from './components/VoiceBriefingRoom';
import { AnalystReportsView } from './components/AnalystReportsView';
import { QuantCopilotChat } from './components/QuantCopilotChat';
import { UserManual } from './components/UserManual';
import { CSVUploadModal } from './components/CSVUploadModal';
import { StockSelectorModal } from './components/StockSelectorModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ArchitectureDiagramModal } from './components/ArchitectureDiagramModal';
import { ExecutivePresentationModal, PipelineStepStatus } from './components/ExecutivePresentationModal';
import { PositionRiskAnalyzer } from './components/PositionRiskAnalyzer';
import { GlobalProcessingBar } from './components/GlobalProcessingBar';
import { useActionIndicator } from './context/ActionIndicatorContext';
import {
  StockCandle,
  StockQuote,
  TechnicalIndicators,
  StockAnalysis,
  StockStory,
  UserProfile,
  ExecutiveBriefingData,
  TraderProfile,
} from './types/stock';
import { computeTechnicalIndicators } from './utils/indicators';
import { fetchStockHistory } from './services/marketData';
import { getApiAuthHeaders, hasStoredApiKey } from './services/apiKeyService';
import { generateAlgorithmicExecutiveBriefing } from './utils/executiveFallback';
import { stopAllAudioPlayback } from './utils/speech';
import { Sparkles, AlertCircle, RefreshCw, Layers, Key } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'terminal' | 'market' | 'positions' | 'story' | 'voice' | 'reports' | 'copilot' | 'manual'
  >('terminal');

  const [globalTraderProfile, setGlobalTraderProfile] = useState<TraderProfile>('weeks_trader');

  // No initial seed data - clean start
  const [currentTicker, setCurrentTicker] = useState<string | null>(null);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [candles, setCandles] = useState<StockCandle[]>([]);
  const [technicals, setTechnicals] = useState<TechnicalIndicators | null>(null);
  const [activeRange, setActiveRange] = useState<string>('1y');

  // Tracking recently loaded tickers
  const [recentTickers, setRecentTickers] = useState<string[]>([]);

  // AI Outputs
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [story, setStory] = useState<StockStory | null>(null);

  // Loading States
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isStoryLoading, setIsStoryLoading] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & Audio Handlers
  const [isCSVModalOpen, setIsCSVModalOpen] = useState<boolean>(false);
  const [isStockSelectorOpen, setIsStockSelectorOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  const [incomingTextToPlay, setIncomingTextToPlay] = useState<string | null>(null);

  // Autonomous 1-Action Executive Presentation Pipeline State
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState<boolean>(false);
  const [isExecutiveLoading, setIsExecutiveLoading] = useState<boolean>(false);
  const [executivePipelineStep, setExecutivePipelineStep] = useState<number>(1);
  const [executivePipelineMessage, setExecutivePipelineMessage] = useState<string>('');
  const [executiveBriefingData, setExecutiveBriefingData] = useState<ExecutiveBriefingData | null>(null);
  const [executivePipelineStatuses, setExecutivePipelineStatuses] = useState<Record<number, PipelineStepStatus>>({});
  const [executivePipelineError, setExecutivePipelineError] = useState<string | null>(null);
  const [isExecutiveCancelled, setIsExecutiveCancelled] = useState<boolean>(false);
  const [executiveTargetTicker, setExecutiveTargetTicker] = useState<string | null>(null);
  const executiveAbortControllerRef = useRef<AbortController | null>(null);

  const { startAction, finishAction } = useActionIndicator();

  // User Profile (subscription_id always equals 3 per requirements)
  const userProfile: UserProfile = {
    name: 'George Karl Real',
    email: 'xgeorgekarlreal@gmail.com',
    tier: 'Institutional Pro',
    subscription_id: 3,
    subscriptionId: 3,
    accountStatus: 'Active Institutional',
    analystLicense: 'CFA Tier-1 Terminal',
  };

  // Fetch Stock Data via marketData service layer
  const loadStockData = async (ticker: string, range = activeRange) => {
    setIsDataLoading(true);
    setErrorMessage(null);

    const sym = ticker.toUpperCase().trim();
    const actionId = startAction(`Ingesting ${sym} Data`, `Fetching live market quote & ${range} historical candles`);

    try {
      const data = await fetchStockHistory(sym, range, '1d');
      if (!data.candles || data.candles.length === 0) {
        throw new Error('No historical price data returned.');
      }

      const computed = computeTechnicalIndicators(data.candles);

      setCurrentTicker(sym);
      setCandles(data.candles);
      setQuote(data.quote);
      setTechnicals(computed);
      setActiveRange(range);

      // Track recent ticker
      setRecentTickers((prev) => {
        const filtered = prev.filter((t) => t !== sym);
        return [sym, ...filtered].slice(0, 8);
      });

      // Reset previous AI outputs on new ticker search
      setAnalysis(null);
      setStory(null);
      finishAction(actionId, true, undefined, `Loaded ${data.candles.length} candles & live price $${data.quote.price.toFixed(2)}`);
    } catch (err: any) {
      const errMsg = err.message || `Error fetching stock data for ${sym} from API.`;
      setErrorMessage(errMsg);
      finishAction(actionId, false, errMsg);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleRangeChange = (newRange: string) => {
    if (currentTicker) {
      loadStockData(currentTicker, newRange);
    }
  };

  // Clear currently active stock (return to Launchpad)
  const handleClearActiveStock = () => {
    const actionId = startAction('Resetting Terminal', 'Clearing active asset selection');
    setCurrentTicker(null);
    setQuote(null);
    setCandles([]);
    setTechnicals(null);
    setAnalysis(null);
    setStory(null);
    finishAction(actionId, true, undefined, 'Returned to launchpad');
  };

  // Run Gemini 3.7 Flash Analysis
  const handleRunAnalysis = async (tickerToAnalyze?: string) => {
    const targetTicker = tickerToAnalyze || currentTicker;
    if (!targetTicker) return;

    // If ticker is different from current, load it first
    if (tickerToAnalyze && tickerToAnalyze !== currentTicker) {
      await loadStockData(tickerToAnalyze);
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    const actionId = startAction(`Gemini 3.7 Synthesis (${targetTicker})`, 'Computing quantitative thesis, targets & catalysts');

    try {
      const currentQuote = quote;
      const currentTech = technicals;

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: getApiAuthHeaders(),
        body: JSON.stringify({
          ticker: targetTicker,
          quote: currentQuote,
          technicals: currentTech,
          summaryStats: {
            candleCount: candles.length,
            startPrice: candles[0]?.close,
            endPrice: candles[candles.length - 1]?.close,
            trend: currentQuote?.change && currentQuote.change >= 0 ? 'Bullish Expansion' : 'Correction / Consolidation',
          },
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Gemini 3.7 analysis generation failed');
      }

      const result = await response.json();
      setAnalysis(result);
      setActiveTab('terminal');
      finishAction(actionId, true, undefined, `Verdict: ${result.verdict} (${result.confidenceScore}% conviction)`);
    } catch (err: any) {
      const errMsg = `Analysis Error: ${err.message}`;
      setErrorMessage(errMsg);
      finishAction(actionId, false, errMsg);
      if (err.message && err.message.toLowerCase().includes('api key')) {
        setIsApiKeyModalOpen(true);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run Gemini 3.7 Flash Story Generation
  const handleGenerateStory = async (genre = 'Wall Street Memo', tickerToStory?: string) => {
    const targetTicker = tickerToStory || currentTicker;
    if (!targetTicker || !quote) return;

    setIsStoryLoading(true);
    setErrorMessage(null);
    const actionId = startAction(`Drafting Story (${targetTicker})`, `Generating ${genre} episodic chapters`);

    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: getApiAuthHeaders(),
        body: JSON.stringify({
          ticker: targetTicker,
          quote,
          technicals,
          genre,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Gemini story generation failed');
      }

      const storyResult = await response.json();
      setStory(storyResult);
      setActiveTab('story');
      finishAction(actionId, true, undefined, `Story created: "${storyResult.title}"`);

      // Auto-trigger image generation for story visual
      if (storyResult.coverVisualPrompt) {
        handleGenerateImage(storyResult.coverVisualPrompt, storyResult);
      }
    } catch (err: any) {
      const errMsg = `Story Generation Error: ${err.message}`;
      setErrorMessage(errMsg);
      finishAction(actionId, false, errMsg);
      if (err.message && err.message.toLowerCase().includes('api key')) {
        setIsApiKeyModalOpen(true);
      }
    } finally {
      setIsStoryLoading(false);
    }
  };

  // Generate Image with Gemini
  const handleGenerateImage = async (prompt: string, currentStoryObj = story) => {
    if (!currentTicker) return;

    setIsImageLoading(true);
    const actionId = startAction(`Generating Editorial Art (${currentTicker})`, 'Rendering concept artwork via Gemini');
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: getApiAuthHeaders(),
        body: JSON.stringify({
          prompt,
          ticker: currentTicker,
        }),
      });

      const data = await response.json();
      if (data.imageUrl) {
        if (currentStoryObj) {
          setStory({
            ...currentStoryObj,
            imageUrl: data.imageUrl,
          });
        }
        finishAction(actionId, true, undefined, 'Editorial artwork generated');
      } else {
        finishAction(actionId, false, 'No image returned');
      }
    } catch (err: any) {
      console.warn('Image generation error:', err);
      finishAction(actionId, false, err.message || 'Image generation failed');
    } finally {
      setIsImageLoading(false);
    }
  };

  // Trigger Voice Player
  const handlePlayStoryAudio = (text: string) => {
    const actionId = startAction('Preparing Voice Narration', 'Routing transcript to Voice Briefing Room');
    setIncomingTextToPlay(text);
    setActiveTab('voice');
    finishAction(actionId, true, undefined, 'Audio synthesizer armed');
  };

  // ULTIMATE 1-ACTION AUTONOMOUS EXECUTIVE WORKFLOW PIPELINE
  const handleRunExecutiveWorkflow = async (targetTicker?: string) => {
    const sym = (targetTicker || currentTicker || 'NVDA').toUpperCase().trim();
    setExecutiveTargetTicker(sym);
    setIsExecutiveModalOpen(true);
    setIsExecutiveLoading(true);
    setIsExecutiveCancelled(false);
    setExecutivePipelineError(null);
    setExecutivePipelineStep(1);
    setExecutivePipelineStatuses({
      1: 'running',
      2: 'pending',
      3: 'pending',
      4: 'pending',
      5: 'pending',
    });
    setExecutivePipelineMessage(`Step 1/5: Ingesting Real-Time Market Feed & Historical Candles for ${sym}...`);
    setExecutiveBriefingData(null);
    setErrorMessage(null);

    // Abort previous in-flight workflow if any
    if (executiveAbortControllerRef.current) {
      executiveAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    executiveAbortControllerRef.current = controller;
    const signal = controller.signal;

    try {
      // ----------------------------------------------------
      // Step 1: Ingest Real-Time & Historical Data
      // ----------------------------------------------------
      if (signal.aborted) return;
      const data = await fetchStockHistory(sym, activeRange || '1y', '1d', signal);
      if (signal.aborted) return;

      if (!data.candles || data.candles.length === 0) {
        throw new Error(`Failed to retrieve live candle data for ${sym}`);
      }

      // Save intermediate data immediately into persistent application state
      setCurrentTicker(sym);
      setCandles(data.candles);
      setQuote(data.quote);
      setRecentTickers((prev) => {
        const filtered = prev.filter((t) => t !== sym);
        return [sym, ...filtered].slice(0, 8);
      });

      // Mark Step 1 Success & Saved
      setExecutivePipelineStatuses((prev) => ({ ...prev, 1: 'success', 2: 'running' }));
      setExecutivePipelineStep(2);
      setExecutivePipelineMessage(`Step 2/5: Computing Quantitative Models (SMA 20/50/200, RSI, MACD, Sharpe Ratio, Volatility)...`);

      // ----------------------------------------------------
      // Step 2: Compute Quantitative Indicators & Models
      // ----------------------------------------------------
      if (signal.aborted) return;
      await new Promise((res) => setTimeout(res, 200));
      if (signal.aborted) return;

      const computedTechnicals = computeTechnicalIndicators(data.candles);
      // Save indicators immediately
      setTechnicals(computedTechnicals);

      // Mark Step 2 Success & Saved
      setExecutivePipelineStatuses((prev) => ({ ...prev, 2: 'success', 3: 'running' }));
      setExecutivePipelineStep(3);
      setExecutivePipelineMessage(`Step 3/5: Gemini 3.7 Flash Reasoner Synthesizing Executive Verdict, Slide Deck & Action Plan...`);

      // ----------------------------------------------------
      // Step 3: Gemini 3.7 Flash Executive Synthesis
      // ----------------------------------------------------
      if (signal.aborted) return;

      let briefingResult: ExecutiveBriefingData;
      try {
        const briefingResponse = await fetch('/api/executive-briefing', {
          method: 'POST',
          headers: getApiAuthHeaders(),
          signal,
          body: JSON.stringify({
            ticker: sym,
            quote: data.quote,
            technicals: computedTechnicals,
          }),
        });

        if (signal.aborted) return;

        if (!briefingResponse.ok) {
          const errJson = await briefingResponse.json().catch(() => ({}));
          throw new Error(errJson.error || 'Failed to generate executive briefing from Gemini 3.7');
        }

        briefingResult = await briefingResponse.json();
      } catch (err: any) {
        if (signal.aborted) return;
        console.warn('AI Briefing error, providing step-level error handling:', err);
        setExecutivePipelineStatuses((prev) => ({ ...prev, 3: 'error' }));
        setExecutivePipelineError(`Step 3 (Gemini 3.7 Synthesis) failed: ${err.message || 'AI service unavailable'}`);
        setIsExecutiveLoading(false);
        return;
      }

      // Mark Step 3 Success & Saved
      setExecutivePipelineStatuses((prev) => ({ ...prev, 3: 'success', 4: 'running' }));
      setExecutivePipelineStep(4);
      setExecutivePipelineMessage(`Step 4/5: Generating AI Editorial Concept Visual Artwork...`);

      // ----------------------------------------------------
      // Step 4: AI Concept Artwork Generation (Non-blocking fallback)
      // ----------------------------------------------------
      if (signal.aborted) return;

      let generatedImageUrl = '';
      try {
        const imgRes = await fetch('/api/generate-image', {
          method: 'POST',
          headers: getApiAuthHeaders(),
          signal,
          body: JSON.stringify({
            prompt: briefingResult.editorialArtPrompt || `Financial editorial art for ${sym}`,
            ticker: sym,
          }),
        });
        if (!signal.aborted) {
          const imgData = await imgRes.json().catch(() => ({}));
          if (imgData.imageUrl) {
            generatedImageUrl = imgData.imageUrl;
          }
        }
      } catch {
        // Non-blocking fallback for visuals
      }

      // Mark Step 4 Success & Saved
      setExecutivePipelineStatuses((prev) => ({ ...prev, 4: 'success', 5: 'running' }));
      setExecutivePipelineStep(5);
      setExecutivePipelineMessage(`Step 5/5: Finalizing Presentation Suite & Preparing Spoken Voice Narration...`);

      // ----------------------------------------------------
      // Step 5: Finalizing Presentation & Spoken Audio
      // ----------------------------------------------------
      if (signal.aborted) return;
      await new Promise((res) => setTimeout(res, 250));
      if (signal.aborted) return;

      const finalizedData: ExecutiveBriefingData = {
        ...briefingResult,
        imageUrl: generatedImageUrl || undefined,
      };

      // Save the finalized presentation into state
      setExecutiveBriefingData(finalizedData);
      setExecutivePipelineStatuses((prev) => ({ ...prev, 5: 'success' }));
      setIsExecutiveLoading(false);

      // Background trigger general deep analysis if not already cached
      if (!analysis) {
        handleRunAnalysis(sym);
      }
    } catch (err: any) {
      if (signal.aborted) {
        setIsExecutiveCancelled(true);
        setIsExecutiveLoading(false);
        return;
      }

      console.error('Autonomous Workflow Pipeline Error:', err);
      setExecutivePipelineStatuses((prev) => ({
        ...prev,
        [executivePipelineStep]: 'error',
      }));
      setExecutivePipelineError(`Step ${executivePipelineStep} failed: ${err.message}`);
      setIsExecutiveLoading(false);
    }
  };

  // User Cancel Action for the 1-Action Pipeline
  const handleCancelExecutiveWorkflow = () => {
    if (executiveAbortControllerRef.current) {
      executiveAbortControllerRef.current.abort();
      executiveAbortControllerRef.current = null;
    }
    stopAllAudioPlayback();
    setIsExecutiveLoading(false);
    setIsExecutiveCancelled(true);
    setExecutivePipelineError(null);
  };

  // User Retry Action for the 1-Action Pipeline
  const handleRetryExecutiveWorkflow = () => {
    handleRunExecutiveWorkflow(executiveTargetTicker || currentTicker || undefined);
  };

  // Algorithmic Fallback Generator if AI backend has temporary issues
  const handleUseFallbackExecutiveWorkflow = () => {
    const sym = executiveTargetTicker || currentTicker || 'NVDA';
    const fallbackBriefing = generateAlgorithmicExecutiveBriefing(sym, quote, technicals);
    setExecutiveBriefingData(fallbackBriefing);
    setExecutivePipelineError(null);
    setIsExecutiveCancelled(false);
    setExecutivePipelineStatuses({
      1: 'success',
      2: 'success',
      3: 'success',
      4: 'success',
      5: 'success',
    });
    setIsExecutiveLoading(false);
  };

  // Ingest Custom CSV
  const handleDataLoadedFromCSV = (
    symbol: string,
    loadedCandles: StockCandle[],
    loadedQuote: StockQuote
  ) => {
    const computed = computeTechnicalIndicators(loadedCandles);
    const sym = symbol.toUpperCase().trim();
    setCurrentTicker(sym);
    setCandles(loadedCandles);
    setQuote(loadedQuote);
    setTechnicals(computed);
    setAnalysis(null);
    setStory(null);
    setActiveTab('terminal');

    setRecentTickers((prev) => {
      const filtered = prev.filter((t) => t !== sym);
      return [sym, ...filtered].slice(0, 8);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchTicker={(sym) => {
          loadStockData(sym);
          setActiveTab('terminal');
        }}
        onRunExecutiveWorkflow={handleRunExecutiveWorkflow}
        onOpenStockSelector={() => setIsStockSelectorOpen(true)}
        onOpenCSVModal={() => setIsCSVModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
        currentTicker={currentTicker}
        isLoading={isDataLoading}
        userProfile={userProfile}
        globalTraderProfile={globalTraderProfile}
        onSelectTraderProfile={setGlobalTraderProfile}
      />

      {/* Global Processing Indicator Bar for All Active Actions */}
      <GlobalProcessingBar />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Error Notification Bar */}
        {errorMessage && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs sm:text-sm text-rose-300 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center gap-2">
              {errorMessage.toLowerCase().includes('api key') && (
                <button
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-cyan-500 transition shadow-md shadow-cyan-500/20"
                >
                  <Key className="h-3.5 w-3.5" />
                  <span>Configure Gemini API Key</span>
                </button>
              )}
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-white font-bold text-xs underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Global Loading Spinner */}
        {isDataLoading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center backdrop-blur shadow-xl">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 animate-spin mb-3">
              <RefreshCw className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Ingesting Real-Time Market Feeds...</h4>
            <p className="text-xs text-slate-400 mt-1">
              Executing API lookups and calculating quantitative matrices.
            </p>
          </div>
        )}

        {/* TAB: Live Market Table (Can be accessed anytime) */}
        {activeTab === 'market' && (
          <StockMarketTable
            onSelectTickerForTerminal={(sym) => {
              loadStockData(sym);
              setActiveTab('terminal');
            }}
            onRunAnalysisForTicker={(sym) => {
              loadStockData(sym).then(() => {
                handleRunAnalysis(sym);
              });
            }}
            onGenerateStoryForTicker={(sym) => {
              loadStockData(sym).then(() => {
                handleGenerateStory('Wall Street Memo', sym);
              });
            }}
            onRunAutonomousWorkflow={(sym) => {
              handleRunExecutiveWorkflow(sym);
            }}
          />
        )}

        {/* TAB: Position & Risk Stop Loss / Take Profit Analyzer (Can be accessed anytime) */}
        {activeTab === 'positions' && (
          <PositionRiskAnalyzer
            currentTicker={currentTicker}
            quote={quote}
            technicals={technicals}
            globalTraderProfile={globalTraderProfile}
            onSelectTraderProfile={setGlobalTraderProfile}
            onSelectTicker={(sym) => {
              loadStockData(sym);
            }}
            onRunExecutiveWorkflow={(sym) => {
              handleRunExecutiveWorkflow(sym);
            }}
          />
        )}

        {/* 1. Empty State: Search Launchpad (No Initial Seed Data) */}
        {!currentTicker && activeTab !== 'manual' && activeTab !== 'market' && activeTab !== 'positions' && (
          <SearchLaunchpad
            onSearchTicker={(sym) => {
              loadStockData(sym);
              setActiveTab('terminal');
            }}
            onRunExecutiveWorkflow={handleRunExecutiveWorkflow}
            onOpenCSVModal={() => setIsCSVModalOpen(true)}
            onOpenMarketTable={() => setActiveTab('market')}
            onOpenPositionAnalyzer={() => setActiveTab('positions')}
            globalTraderProfile={globalTraderProfile}
            onSelectTraderProfile={setGlobalTraderProfile}
            isLoading={isDataLoading}
          />
        )}

        {/* 2. Active Ticker View for Terminal & AI Tabs */}
        {currentTicker && quote && !isDataLoading && (
          <>
            {/* Real-time Quote Overview Strip (Visible in Terminal/Story/Voice/Copilot/Reports) */}
            {activeTab !== 'market' && activeTab !== 'manual' && activeTab !== 'positions' && (
              <StockOverviewHeader
                quote={quote}
                onRefresh={() => loadStockData(currentTicker)}
                onRunAnalysis={() => handleRunAnalysis()}
                onRunAutonomousWorkflow={() => handleRunExecutiveWorkflow(currentTicker)}
                onGenerateStory={() => handleGenerateStory()}
                onOpenVoice={() => setActiveTab('voice')}
                onOpenReports={() => setActiveTab('reports')}
                onOpenPositionAnalyzer={() => setActiveTab('positions')}
                onOpenStockSelector={() => setIsStockSelectorOpen(true)}
                onClearStock={handleClearActiveStock}
                isAnalyzing={isAnalyzing}
                isStoryLoading={isStoryLoading}
                hasAnalysis={Boolean(analysis)}
                hasStory={Boolean(story)}
                globalTraderProfile={globalTraderProfile}
                onSelectTraderProfile={setGlobalTraderProfile}
              />
            )}

            {/* TAB: Terminal & Quantitative Analysis */}
            {activeTab === 'terminal' && (
              <div className="space-y-6">
                {/* Quantitative Metrics Bar */}
                {technicals && (
                  <QuantMetricsGrid
                    technicals={technicals}
                    quote={quote}
                    candles={candles}
                  />
                )}

                {/* Interactive Chart */}
                <InteractiveChart
                  candles={candles}
                  symbol={currentTicker}
                  activeRange={activeRange}
                  onRangeChange={handleRangeChange}
                  onOpenStockSelector={() => setIsStockSelectorOpen(true)}
                />

                {/* Gemini 3.7 Flash Analysis Card */}
                {analysis ? (
                  <GeminiAnalysisCard
                    analysis={analysis}
                    quote={quote}
                    onGenerateStory={() => handleGenerateStory()}
                    onOpenVoice={() => setActiveTab('voice')}
                    onOpenPositionAnalyzer={() => setActiveTab('positions')}
                  />
                ) : (
                  <div className="rounded-3xl border border-dashed border-cyan-500/30 bg-gradient-to-r from-slate-900/60 via-cyan-950/10 to-slate-900/60 p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-3">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      Ready for Gemini 3.7 Flash Quantitative Analysis
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                      Execute deep multi-factor thesis generation, price targets, support/resistance channel modeling, and catalyst tracking.
                    </p>
                    <button
                      onClick={() => handleRunAnalysis()}
                      disabled={isAnalyzing}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition disabled:opacity-50"
                    >
                      <Sparkles className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                      <span>{isAnalyzing ? 'Analyzing Asset with Gemini 3.7...' : 'Run Gemini 3.7 Flash Synthesis'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Story Studio */}
            {activeTab === 'story' && (
              <StoryStudio
                story={story}
                quote={quote}
                onGenerateStory={handleGenerateStory}
                onGenerateImage={handleGenerateImage}
                onPlayStoryAudio={handlePlayStoryAudio}
                isStoryLoading={isStoryLoading}
                isImageLoading={isImageLoading}
              />
            )}

            {/* TAB: Voice Briefing */}
            {activeTab === 'voice' && (
              <VoiceBriefingRoom
                story={story}
                analysis={analysis}
                quote={quote}
                incomingTextToPlay={incomingTextToPlay}
                onClearIncomingText={() => setIncomingTextToPlay(null)}
              />
            )}

            {/* TAB: Analyst Dossier Reports */}
            {activeTab === 'reports' && (
              <AnalystReportsView
                analysis={analysis}
                story={story}
                quote={quote}
                technicals={technicals}
                userProfile={userProfile}
                onRunAutonomousWorkflow={() => handleRunExecutiveWorkflow(currentTicker || undefined)}
              />
            )}

            {/* TAB: Quant Copilot Chat */}
            {activeTab === 'copilot' && (
              <QuantCopilotChat
                ticker={currentTicker}
                quote={quote}
                analysis={analysis}
                technicals={technicals}
              />
            )}
          </>
        )}

        {/* TAB: User Manual (Always Accessible) */}
        {activeTab === 'manual' && <UserManual userProfile={userProfile} />}
      </main>

      {/* 1-Action Autonomous Executive Presentation Modal */}
      <ExecutivePresentationModal
        isOpen={isExecutiveModalOpen}
        onClose={() => {
          if (isExecutiveLoading) {
            handleCancelExecutiveWorkflow();
          }
          setIsExecutiveModalOpen(false);
        }}
        ticker={executiveTargetTicker || currentTicker}
        quote={quote}
        technicals={technicals}
        briefingData={executiveBriefingData}
        isLoading={isExecutiveLoading}
        pipelineStep={executivePipelineStep}
        pipelineMessage={executivePipelineMessage}
        pipelineError={executivePipelineError}
        stepStatuses={executivePipelineStatuses}
        isCancelled={isExecutiveCancelled}
        onCancel={handleCancelExecutiveWorkflow}
        onRetry={handleRetryExecutiveWorkflow}
        onUseFallback={handleUseFallbackExecutiveWorkflow}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onAskCopilot={(question) => {
          setActiveTab('copilot');
        }}
      />

      {/* Quick Stock Selector & Switcher Modal */}
      <StockSelectorModal
        isOpen={isStockSelectorOpen}
        onClose={() => setIsStockSelectorOpen(false)}
        onSelectStock={(sym) => {
          loadStockData(sym);
          setActiveTab('terminal');
        }}
        currentTicker={currentTicker}
        onOpenMarketTable={() => setActiveTab('market')}
        onClearActiveStock={handleClearActiveStock}
        recentTickers={recentTickers}
      />

      {/* CSV Dataset Upload Modal */}
      <CSVUploadModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onDataLoaded={handleDataLoadedFromCSV}
      />

      {/* BYOK Gemini API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* System Architecture Diagram & PDF Export Modal */}
      <ArchitectureDiagramModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
        userProfile={userProfile}
      />
    </div>
  );
}
