import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  BarChart2,
  Sparkles,
  Volume2,
  FileText,
  Upload,
  ShieldCheck,
  Zap,
  Code,
  Layers,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  TableProperties,
  ArrowUpDown,
  Building2,
  ArrowLeftRight,
  Key,
  Target,
  Clock,
  Crosshair,
  MessageSquare,
  Printer,
  Download,
  Activity,
} from 'lucide-react';
import { UserProfile } from '../types/stock';

interface UserManualProps {
  userProfile: UserProfile;
}

export const UserManual: React.FC<UserManualProps> = ({ userProfile }) => {
  const [openSection, setOpenSection] = useState<string>('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: '1. Getting Started & Architecture',
      icon: Zap,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Welcome to <strong>StockPulse AI</strong> — an institutional financial analyst workstation combining live market data ingestion via real-time APIs (Alpha Vantage, Polygon.io feeds), algorithmic quantitative modeling, and <strong>Gemini 3.7 Flash</strong> reasoning for financial synthesis and narrative storytelling.
          </p>
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3.5 text-xs text-indigo-300">
            <strong>Clean-Start Architecture (Zero Pre-loaded Seed Data):</strong> StockPulse AI initializes with a clean slate without default or hardcoded stock state. Users initiate analysis by entering any global ticker, selecting an asset from the curated market universe, or uploading custom CSV time-series data.
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4">
            <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Core Capabilities Workflow
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-200">
              <li><strong>Live Data Ingestion & Scanner:</strong> Query global stock tickers or explore the interactive sortable table with real-time price updates and 52-week channels.</li>
              <li><strong>Quick Stock Switcher:</strong> Switch between assets seamlessly at any time from the header, navigation bar, candlestick chart, or curated sector catalog.</li>
              <li><strong>Individual Gemini API Key (BYOK):</strong> Supply your individual Google Gemini API key to power all quantitative reasoning and narratives on your own quota.</li>
              <li><strong>Quantitative Engine:</strong> Automated computation of SMA 20/50/200, EMA 12/26, RSI 14, MACD, Bollinger Bands, Volatility, and Sharpe Ratio.</li>
              <li><strong>Gemini 3.7 Flash Analysis:</strong> Deep institutional verdict (Strong Buy to Strong Sell), price targets, catalyst radar, and risk mitigation protocols.</li>
              <li><strong>Story Studio:</strong> Episodic, cinematic financial narratives crafted across 4 genre tones with AI editorial cover art.</li>
              <li><strong>Voice Briefing Room:</strong> Hands-free audio reading with multiple voice personas (Kore, Puck, Fenrir, Zephyr).</li>
              <li><strong>Analyst Dossier:</strong> 1-click Print/PDF export, Markdown docs, and JSON analyst packages.</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 'byok-gemini-key',
      title: '2. Individual Gemini API Key (BYOK Setup & Security)',
      icon: Key,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            StockPulse AI supports a <strong>Bring Your Own Key (BYOK)</strong> model so each individual analyst, developer, or fund manager can supply their personal Google Gemini API key to power Gemini 3.7 Flash reasoning, narrative generation, image synthesis, and Copilot chats.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <h5 className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Key className="h-4 w-4" /> How to Set Your API Key
              </h5>
              <ol className="list-decimal list-inside space-y-1 text-xs text-slate-400">
                <li>Click the <strong>"Set API Key / BYOK"</strong> badge in the top navigation bar.</li>
                <li>Paste your Google Gemini API key (starts with <code className="text-cyan-300">AIzaSy...</code>).</li>
                <li>Click <strong>"Test Connection"</strong> to verify real-time model communication with Gemini 3.7 Flash.</li>
                <li>Click <strong>"Save Key"</strong> to store it in your browser's private storage.</li>
              </ol>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <h5 className="font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Client-Side Privacy &amp; Security
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your API key is saved exclusively in your browser’s private <code className="text-slate-300">localStorage</code>. It is transmitted securely via custom request headers solely to the proxy route executing your financial prompts.
              </p>
              <div className="pt-1">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
                >
                  <span>Get Free Gemini API Key</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h5 className="font-bold text-white">BYOK Features &amp; Troubleshooting:</h5>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              <li><strong>Active Key Status Badge:</strong> The top bar turns green (<code className="text-emerald-400">BYOK Active</code>) once your key is configured.</li>
              <li><strong>Zero Friction Updates:</strong> Update, test, or clear your key at any time from the BYOK modal.</li>
              <li><strong>Automatic Fallback:</strong> If a server-level environment key is available, it serves as the default while your custom key always takes precedence.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'ultimate-workflow',
      title: '3. Ultimate 1-Action Autonomous Workflow (Analysis + Visuals + Voice + Action Plan)',
      icon: Zap,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            The <strong>Ultimate 1-Action Autonomous Presentation Workflow</strong> performs the entire financial intelligence lifecycle with a single click. Instead of navigating separate screens, the agent automatically executes all steps in sequence:
          </p>

          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 p-4">
            <h5 className="font-bold text-cyan-300 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" /> The 5-Step Autonomous Pipeline &amp; Verified State Saving
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-2.5">
                <span className="font-extrabold text-cyan-400 block mb-1">1. Ingest</span>
                <span className="text-slate-400 text-[11px]">Real-time API quotes &amp; candles (Saved)</span>
              </div>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-2.5">
                <span className="font-extrabold text-cyan-400 block mb-1">2. Quant Math</span>
                <span className="text-slate-400 text-[11px]">SMA, RSI, MACD, Sharpe Ratio (Saved)</span>
              </div>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-2.5">
                <span className="font-extrabold text-cyan-400 block mb-1">3. Gemini 3.7</span>
                <span className="text-slate-400 text-[11px]">Verdict &amp; Plain-English script (Saved)</span>
              </div>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-2.5">
                <span className="font-extrabold text-cyan-400 block mb-1">4. Visual Art</span>
                <span className="text-slate-400 text-[11px]">AI concept art &amp; slide deck (Saved)</span>
              </div>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-2.5">
                <span className="font-extrabold text-cyan-400 block mb-1">5. Spoken Voice</span>
                <span className="text-slate-400 text-[11px]">Live anchor voice presentation</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 space-y-2 text-xs">
            <h5 className="font-bold text-blue-300 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-cyan-400" /> Error Handling, Step-Level Persistence &amp; User Cancellation
            </h5>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li><strong>Step-by-Step State Saving:</strong> Each milestone saves intermediate results into active memory upon completion. If later steps fail, ingested data and computed indicators are never lost.</li>
              <li><strong>Instant Request Cancellation:</strong> Users can click <em>Cancel Request</em> or close the modal at any millisecond during processing. In-flight network requests abort immediately via <code>AbortController</code> and audio shuts down.</li>
              <li><strong>Step-Level Error Boundaries &amp; Retry:</strong> If an external API or key limitation occurs at Step 3 or 4, the interface provides 1-click <em>Retry Step</em>, <em>Configure API Key</em>, or <em>Continue with Algorithmic Quant Model</em> without starting over.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <h5 className="font-bold text-white flex items-center gap-1.5">
                <Target className="h-4 w-4 text-emerald-400" /> "What To Do" Direct Playbook
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                The presentation eliminates Wall Street jargon and provides tailored, unambiguous guidance:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                <li><strong>For Current Holders:</strong> Precise take-profit levels and trailing stop-loss triggers.</li>
                <li><strong>For Potential Buyers:</strong> Ideal entry price zones and 12-month upside targets.</li>
                <li><strong>For Cautious Investors:</strong> Downside hedging, max drawdown risk, and portfolio sizing.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <h5 className="font-bold text-white flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-cyan-400" /> Interactive Presentation Stage
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                The presentation suite opens in a rich multimedia modal with:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                <li><strong>Hands-Free Spoken Presentation:</strong> High-fidelity voice actors (Kore, Puck, Fenrir, Zephyr).</li>
                <li><strong>Slide Deck Carousel:</strong> Interactive slides breaking down quant signals simply.</li>
                <li><strong>Export &amp; Copilot Follow-up:</strong> 1-click text copy, PDF save, and prompt transfer to Quant Copilot.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'trader-profiles-risk',
      title: '4. Trader Profiles & Stop Loss / Take Profit Position Analyzer',
      icon: Target,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            StockPulse AI provides institutional risk management tailored to <strong>5 distinct trading styles and time horizons</strong>, coupled with a dedicated <strong>Position Risk Analyzer</strong> to determine exact stop losses and profit targets for your Buy or Sell orders.
          </p>

          <div className="rounded-2xl border border-cyan-500/30 bg-slate-950 p-4 space-y-3">
            <h5 className="font-bold text-cyan-400 flex items-center gap-2">
              <Clock className="h-4 w-4" /> 5 Dedicated Trader Profile Horizons
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                <div className="font-bold text-white text-xs mb-1">1. Day Trader</div>
                <div className="text-[11px] text-cyan-400 font-semibold mb-1">Intraday (0-24 hrs)</div>
                <p className="text-[11px] text-slate-400">Tight 1.5x ATR stops, fast scalping targets (1:1.5 to 1:2 R:R), high volatility reactivity.</p>
              </div>
              <div className="rounded-xl bg-slate-900 border border-cyan-500/30 p-3 bg-cyan-950/20">
                <div className="font-bold text-cyan-300 text-xs mb-1">2. Weeks Trader</div>
                <div className="text-[11px] text-cyan-400 font-semibold mb-1">Swing (1-4 weeks)</div>
                <p className="text-[11px] text-slate-400">20-day EMA support stops, 1:2.5 target channels, momentum breakout ride.</p>
              </div>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                <div className="font-bold text-white text-xs mb-1">3. Months Trader</div>
                <div className="text-[11px] text-cyan-400 font-semibold mb-1">Position (1-6 months)</div>
                <p className="text-[11px] text-slate-400">50-day SMA trend trailing stops, quarterly earnings cycle targets, fundamental catalyst sync.</p>
              </div>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                <div className="font-bold text-white text-xs mb-1">4. Long-Term</div>
                <div className="text-[11px] text-cyan-400 font-semibold mb-1">Investor (1-5+ years)</div>
                <p className="text-[11px] text-slate-400">200-day macro trendline guardrails, dollar-cost averaging dips, wide thesis invalidation stops.</p>
              </div>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                <div className="font-bold text-white text-xs mb-1">5. Situational</div>
                <div className="text-[11px] text-cyan-400 font-semibold mb-1">Adaptive Regime</div>
                <p className="text-[11px] text-slate-400">Dynamic regime switches based on market volatility, Fed macro events, and earnings surprises.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-4">
            <h5 className="font-bold text-emerald-300 flex items-center gap-2">
              <Crosshair className="h-4 w-4" /> Position Risk: Two Specialized Operating Modes
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 rounded-xl bg-slate-900/80 border border-slate-800 p-3.5">
                <div className="flex items-center gap-1.5 font-black text-cyan-300 text-sm">
                  <Target className="h-4 w-4 text-cyan-400" />
                  <span>OPTION 1: Analyze When to Buy &amp; Sell</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Engineered for strategic market timing before taking or sizing a position:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                  <li><strong>Timing Verdict &amp; Score:</strong> Immediate badge (Optimal Buy Zone, Wait for Dip, Overbought - Sell, Breakout Watch, Short Breakdown) with 0-100 quality score.</li>
                  <li><strong>When to Buy Triggers:</strong> Recommended entry price corridor, pullback dip buy level, momentum breakout trigger, and pre-entry invalidation floor.</li>
                  <li><strong>When to Sell Targets:</strong> Staged profit target zones (Stage 1 de-risk, Stage 2 core objective, Stage 3 trend runner) with expected timeframe.</li>
                  <li><strong>Indicator Status Checklist:</strong> Live verification of RSI momentum, 20-day SMA alignment, MACD crossover, and support buffer clearance.</li>
                  <li><strong>1-Click Adopt Setup:</strong> Converts calculated optimal entry price directly into an active position in Option 2.</li>
                </ul>
              </div>

              <div className="space-y-2 rounded-xl bg-slate-900/80 border border-slate-800 p-3.5">
                <div className="flex items-center gap-1.5 font-black text-indigo-300 text-sm">
                  <Crosshair className="h-4 w-4 text-indigo-400" />
                  <span>OPTION 2: Put Specific Position (Stop Loss &amp; Take Profit)</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Engineered for active trade management and exact risk calculation:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                  <li><strong>Position Direction:</strong> Select BUY (Long) or SELL (Short).</li>
                  <li><strong>Exact Entry &amp; Shares:</strong> Input execution price and share quantity to track live mark-to-market P&amp;L ($ and %).</li>
                  <li><strong>3-Tier Stop Loss Matrix:</strong> Conservative Tight stop, Core Hard stop, and Structural support breakdown floor stop with dollar loss calculations.</li>
                  <li><strong>Multi-Stage Take Profit Milestones:</strong> TP 1 (trim 30-40% + breakeven stop), TP 2 (core objective), TP 3 (runner with dynamic ATR trailing stop).</li>
                  <li><strong>Gemini 3.7 AI Risk Diagnosis:</strong> Institutional trade health score and step-by-step action protocols.</li>
                  <li><strong>Saved Portfolio Drawer:</strong> Save and track multiple active positions locally across sessions.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'stock-selection-switcher',
      title: '5. Stock Selection & Seamless Asset Switching',
      icon: ArrowLeftRight,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            When inspecting or analyzing a stock, you can instantly switch to another security without losing context or restarting your workflow:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h5 className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                <ArrowLeftRight className="h-4 w-4" /> Multi-Point Switcher Triggers
              </h5>
              <p className="text-slate-400 text-xs">
                Click <strong>"Switch Stock"</strong> in the main asset overview header, the navigation bar active asset chip, or directly from the <strong>Interactive Candlestick Chart toolbar</strong> to open the full asset catalog.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h5 className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Curated Sector Catalogs
              </h5>
              <p className="text-slate-400 text-xs">
                The switcher dialog includes institutional presets: <em>Magnificent 7 &amp; Tech Giants</em>, <em>AI Accelerators &amp; Next-Gen Tech</em>, <em>Market Indices &amp; Macro ETFs</em>, and <em>Finance &amp; Healthcare Leaders</em>.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h5 className="font-bold text-white">Stock Selection Shortcuts & Options:</h5>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              <li><strong>Real-time Search Bar:</strong> Type any ticker symbol or company name in the search bar to query live API feeds immediately.</li>
              <li><strong>Recent Stocks History:</strong> Quickly re-select previously loaded stocks from the Recent Stocks chip bar.</li>
              <li><strong>Launchpad Reset:</strong> Click <em>"Clear Active Stock"</em> in the header or switcher modal to return to the clean home search launchpad.</li>
              <li><strong>Market Scanner Ingestion:</strong> In the Market Table, click any ticker or row action to load that asset into the terminal.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'market-data-api-table',
      title: '6. Real-Time Stock Market Data API, Large Universe & Load More',
      icon: TableProperties,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            The <strong>Multi-Asset Market Scanner &amp; Data Hub</strong> connects to institutional market data APIs (Alpha Vantage &amp; Polygon.io feeds) with a universe of 50+ global equities across all sectors with infinite incremental batch loading:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h5 className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                <ArrowUpDown className="h-4 w-4" /> Multi-Column Sorting
              </h5>
              <p className="text-slate-400 text-xs">
                Click any column header to sort ascending or descending. Supports sorting by <strong>Symbol</strong>, <strong>Company Name</strong>, <strong>Current Price</strong>, <strong>24h Change (%)</strong>, <strong>Market Cap</strong>, <strong>P/E Ratio</strong>, and <strong>Trading Volume</strong>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h5 className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                <Building2 className="h-4 w-4" /> Comprehensive Universe &amp; Load More
              </h5>
              <p className="text-slate-400 text-xs">
                Click <strong>"Load +15 Stocks"</strong> or <strong>"Load All Sectors (40+)"</strong> to incrementally ingest larger sets of equities. The bottom pagination bar provides continuous <strong>"Load 15 More Stocks"</strong> controls.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <h5 className="font-bold text-white">Market Universe &amp; Scanner Features:</h5>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              <li><strong>Broad Sector Baskets:</strong> 1-click loading for S&amp;P 500 Leaders, AI &amp; Hardware, Financials &amp; Banking, Healthcare &amp; Pharma, and Consumer &amp; Energy.</li>
              <li><strong>Dynamic Incremental Pagination:</strong> Load batches of 15, 25, or 50+ stocks smoothly with live network progress indicators.</li>
              <li><strong>Add Any Global Ticker:</strong> Enter any custom ticker symbol (e.g. NVDA, AAPL, MSFT, TSLA, PLTR, AMZN, LLY) to fetch live metrics and profile data.</li>
              <li><strong>Multi-Field Live Search &amp; Filter:</strong> Instant real-time filtering across symbol, company name, sector, and industry.</li>
              <li><strong>Interactive 52-Week Range Channel:</strong> Visual gauge showing where the current price trades relative to its annual high and low.</li>
              <li><strong>Company Fundamentals Modal:</strong> Inspect full company dossier: Sector, Industry, CEO, Employee Count, Beta, Dividend Yield, and EPS.</li>
              <li><strong>1-Click Terminal &amp; AI Analysis:</strong> Launch any row straight into the interactive Candlestick Chart or run Gemini 3.7 Quantitative Synthesis.</li>
              <li><strong>CSV Export:</strong> Download full structured spreadsheets containing all loaded stocks and fundamental data points.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'data-ingestion',
      title: '7. Historical Data & CSV Import',
      icon: Upload,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>StockPulse provides seamless options for loading and inspecting financial time-series:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h5 className="font-bold text-white mb-1">Live API Lookups</h5>
              <p className="text-slate-400 text-xs">
                Enter any valid US or international ticker in the top search bar (e.g. <code className="text-cyan-300">NVDA</code>, <code className="text-cyan-300">AAPL</code>, <code className="text-cyan-300">SPY</code>, <code className="text-cyan-300">TSLA</code>, <code className="text-cyan-300">BTC-USD</code>).
                Historical intervals (1D, 5D, 1M, 3M, 6M, 1Y, 5Y) are calculated automatically.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h5 className="font-bold text-white mb-1">Custom CSV Upload</h5>
              <p className="text-slate-400 text-xs">
                Upload historical prices or custom quant backtest CSVs. Supports standard headers: <code className="text-cyan-300">Date</code>, <code className="text-cyan-300">Open</code>, <code className="text-cyan-300">High</code>, <code className="text-cyan-300">Low</code>, <code className="text-cyan-300">Close</code>, and <code className="text-cyan-300">Volume</code>.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'indicators-formula',
      title: '8. Technical & Quantitative Formulas',
      icon: BarChart2,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>Our mathematical engine calculates all indicator metrics client-side with high numerical precision:</p>
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
              <span className="font-bold text-cyan-400">RSI (Relative Strength Index - 14 Periods)</span>
              <p className="text-slate-400 text-xs mt-0.5">
                Computed via Wilder's smoothed averages: <code className="text-slate-200">RSI = 100 - (100 / (1 + RS))</code>. Values above 70 indicate Overbought conditions; below 30 indicate Oversold momentum.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
              <span className="font-bold text-amber-400">Golden Cross / Death Cross (SMA 50 vs SMA 200)</span>
              <p className="text-slate-400 text-xs mt-0.5">
                Detects long-term macro trend shifts when the 50-day Simple Moving Average crosses above (Golden) or below (Death) the 200-day Simple Moving Average.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
              <span className="font-bold text-blue-400">Annualized Historical Volatility</span>
              <p className="text-slate-400 text-xs mt-0.5">
                Standard deviation of logarithmic daily price returns scaled by <code className="text-slate-200">sqrt(252 trading days)</code>.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
              <span className="font-bold text-emerald-400">Estimated Sharpe Ratio</span>
              <p className="text-slate-400 text-xs mt-0.5">
                Formula: <code className="text-slate-200">(Annualized Return - 4% Risk-Free Rate) / Annualized Volatility</code>. Values &gt; 1.0 indicate strong alpha generation.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'story-studio',
      title: '9. AI Financial Storytelling & Editorial Art',
      icon: Sparkles,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Traditional data tables can be dry and dense. The <strong>Story Studio</strong> transforms quantitative figures into high-conviction narrative journalism:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs">
              <strong className="text-indigo-400">Wall Street Memo:</strong> Formatted as an internal hedge fund memo detailing institutional flows and catalyst triggers.
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs">
              <strong className="text-cyan-400">Investigative Exposé:</strong> Dramatic market journalism exploring executive decisions and competitive battles.
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs">
              <strong className="text-purple-400">Quant Odyssey:</strong> Mathematical tale focused on volatility regimes and algorithmic liquidity.
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs">
              <strong className="text-emerald-400">Plain English:</strong> Jargon-free narrative designed for retail investors and clients.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'voice-briefing',
      title: '10. Voice Briefing & Audio Narrator',
      icon: Volume2,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Experience hands-free executive updates through our multi-voice synthesis engine. Choose between four voice actors:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
            <li><strong>Kore:</strong> Authoritative, measured executive persona.</li>
            <li><strong>Puck:</strong> Dynamic, fast-paced momentum trader.</li>
            <li><strong>Fenrir:</strong> Deep, contemplative macro risk strategist.</li>
            <li><strong>Zephyr:</strong> Smooth, immersive financial storyteller.</li>
          </ul>
          <p className="text-xs text-slate-400">
            Playback speed can be adjusted from <strong>0.75x to 2.0x</strong> with live audio waveform visualization.
          </p>
        </div>
      ),
    },
    {
      id: 'quant-copilot',
      title: '11. Quant Copilot (Multi-Turn Conversational Reasoning)',
      icon: MessageSquare,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            The <strong>Quant Copilot</strong> provides an interactive conversational interface powered by <strong>Gemini 3.7 Flash</strong>. It automatically injects the active stock’s real-time quote, multi-period moving averages, RSI, MACD, volatility, and historical price range into its reasoning context:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <h5 className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Context-Aware Financial Analysis
              </h5>
              <p className="text-xs text-slate-400">
                Ask targeted queries such as <em>"What happens to my position if inflation rises by 50 bps?"</em>, <em>"Explain the current MACD histogram divergence"</em>, or <em>"Calculate risk-reward for a breakout entry."</em>
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <h5 className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> Instant Preset Prompts
              </h5>
              <p className="text-xs text-slate-400">
                Use 1-click prompt chips for rapid analysis: <em>Technical Trend Evaluation</em>, <em>Risk &amp; Drawdown Assessment</em>, <em>Catalyst Outlook</em>, or <em>Price Target Projections</em>.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'analyst-dossier',
      title: '12. Institutional Analyst Dossier & Print/PDF Export',
      icon: FileText,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            The <strong>Analyst Dossier</strong> view formats all quantitative metrics, Gemini 3.7 Flash analysis, risk mitigation protocols, and narrative summaries into a clean, executive-ready report:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-cyan-400 text-xs">
                <Printer className="h-4 w-4" /> Print / Save as PDF
              </div>
              <p className="text-[11px] text-slate-400">
                1-click formatted document export optimized for standard paper sizes and dark/light PDF generation.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
                <Download className="h-4 w-4" /> Export Markdown
              </div>
              <p className="text-[11px] text-slate-400">
                Download structured Markdown files ready for Obsidian, Notion, or internal research repositories.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-indigo-400 text-xs">
                <Code className="h-4 w-4" /> Export JSON
              </div>
              <p className="text-[11px] text-slate-400">
                Extract complete machine-readable quantitative datasets for algorithmic trading pipelines.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'global-processing-bar',
      title: '13. Global Real-Time Processing Indicator & Action Queue',
      icon: Activity,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            StockPulse AI features a sticky <strong>Global Processing Bar</strong> that visualizes all background operations in real time (API lookups, Gemini synthesis, image generation, and indicator calculation):
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
            <li><strong>Live Execution Status:</strong> Shows active task descriptions, sub-steps, and progress animations.</li>
            <li><strong>Success &amp; Verification Badges:</strong> Displays completed milestone tags with exact execution summaries.</li>
            <li><strong>Non-Blocking Workflow:</strong> Analysts can continue interacting with charts and tabs while background models run.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'license-subscription',
      title: '14. Institutional License & Subscription ID',
      icon: ShieldCheck,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Institutional License Active</span>
                <h4 className="text-lg font-black text-white">{userProfile.tier}</h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Subscription ID</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">#{userProfile.subscription_id}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-emerald-900/40 grid grid-cols-2 gap-2 text-xs">
              <div><strong className="text-slate-300">Account:</strong> {userProfile.name}</div>
              <div><strong className="text-slate-300">Terminal Tier:</strong> {userProfile.analystLicense}</div>
              <div><strong className="text-slate-300">AI Core:</strong> Gemini 3.7 Flash</div>
              <div><strong className="text-slate-300">Subscription Ref:</strong> {userProfile.subscription_id}</div>
              <div><strong className="text-slate-300">Status:</strong> {userProfile.accountStatus}</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'system-architecture',
      title: '15. Multimodal System Architecture & PDF Blueprint Export',
      icon: Layers,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            StockPulse AI is structured around a 4-tier decoupled institutional architecture uniting client-side responsiveness, serverless containerized execution on Google Cloud Run, deterministic quantitative math algorithms, and multimodal Google Gemini intelligence:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
              <h5 className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Layers className="h-4 w-4" /> 4-Tier Separation of Concerns
              </h5>
              <p className="text-slate-400 text-[11px]">
                Tier 1 (React 19 Workstation) $\to$ Tier 2 (Cloud Run API Gateway) $\to$ Tier 3 (Deterministic Math Engine) $\to$ Tier 4 (Gemini 3.7 Flash, Image &amp; TTS Models).
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
              <h5 className="font-bold text-indigo-400 flex items-center gap-1.5">
                <Printer className="h-4 w-4" /> PDF &amp; Vector SVG Export
              </h5>
              <p className="text-slate-400 text-[11px]">
                Access the <strong>Architecture</strong> button in the top navigation bar to inspect interactive nodes, download standalone vector SVG blueprints, or export formatted PDF documents.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-inner">
            <BookOpen className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              StockPulse Analyst Manual & Documentation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Complete reference guide to live market APIs, sortable data tables, stock selection & switching, Gemini 3.7 Flash quantitative modeling, storytelling, and audio broadcasting.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-3">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isOpen = openSection === sec.id;
          return (
            <div
              key={sec.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md backdrop-blur overflow-hidden transition"
            >
              <button
                onClick={() => setOpenSection(isOpen ? '' : sec.id)}
                className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-850"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-white">{sec.title}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="h-5 w-5 text-cyan-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-slate-500" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-slate-800/80 p-5 sm:p-6 bg-slate-950/40">
                  {sec.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
