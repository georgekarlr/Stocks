import React, { useState, useRef } from 'react';
import {
  Layers,
  X,
  Printer,
  Download,
  Copy,
  Check,
  Sparkles,
  Server,
  Monitor,
  Cpu,
  Database,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Globe,
  Radio,
  FileCode,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { UserProfile } from '../types/stock';

interface ArchitectureDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
}

export const ArchitectureDiagramModal: React.FC<ArchitectureDiagramModalProps> = ({
  isOpen,
  onClose,
  userProfile,
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>('gemini-flash');
  const [copied, setCopied] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const diagramRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const copyAsciiArchitecture = () => {
    const asciiText = `================================================================================
           STOCKPULSE AI • INSTITUTIONAL MULTIMODAL ARCHITECTURE
================================================================================

                     ┌─────────────────────────────────────────────────────────┐
                     │                   User / Equity Analyst                 │
                     └────────────────────────────┬────────────────────────────┘
                                                  │ HTTPS / WSS
                                                  ▼
 ╔═════════════════════════════════════════════════════════════════════════════╗
 ║ LAYER 1: CLIENT & PRESENTATION TIER (React 19 + Vite + Tailwind CSS v4)     ║
 ╠═════════════════════════════════════════════════════════════════════════════╣
 ║  • Clean-Start Launchpad (No Initial Seed Data)                             ║
 ║  • Interactive Candlestick Canvas & Time-Series Inspector                   ║
 ║  • Position & Risk Analyzer (5 Trader Horizons + 3-Tier Stops)              ║
 ║  • Autonomous 1-Action Executive Presentation Pipeline                      ║
 ║  • Episodic Story Studio & 4-Genre Narrative Engine                         ║
 ║  • Voice Briefing Room (Gemini Multi-Voice Audio Synthesis)                 ║
 ║  • Multi-Turn Quant Copilot Conversational Engine                           ║
 ║  • Client-Side BYOK Encrypted Key Store (x-gemini-api-key)                  ║
 ╚═════════════════════════════════════════════════════════════════════════════╝
                                                  │ HTTPS / REST (x-gemini-api-key)
                                                  ▼
 ╔═════════════════════════════════════════════════════════════════════════════╗
 ║ LAYER 2: API GATEWAY & CLOUD RUN BACKEND (Express 4.21 + TypeScript on GCP) ║
 ╠═════════════════════════════════════════════════════════════════════════════╣
 ║  • Google Cloud Run Scalable Containerized Server (server.ts)               ║
 ║  • Secure Proxy & Secret Isolation (Zero Client Key Leakage)                ║
 ║  • Non-Blocking Request Abort Controller & Pipeline Stream Lifecycle        ║
 ║  • Ingestion Adapters: Polygon.io, Alpha Vantage, Custom CSV Parser         ║
 ╚═════════════════════════════════════════════════════════════════════════════╝
                        │                                     │
         Market Feeds   │                                     │ Telemetry & Prompts
                        ▼                                     ▼
 ╔═══════════════════════════════════════════╗   ╔═══════════════════════════════════════════╗
 ║ LAYER 3: DETERMINISTIC QUANT MATH ENGINE  ║   ║ LAYER 4: GOOGLE GEMINI MULTI-MODEL CORE   ║
 ╠═══════════════════════════════════════════╣   ╠═══════════════════════════════════════════╣
 ║ • Moving Averages: SMA (20/50/200), EMA   ║   ║ • Gemini 3.7 Flash (@google/genai SDK):   ║
 ║ • Momentum: RSI (14), MACD & Signal Line  ║   ║   - Quantitative Synthesis & Targets      ║
 ║ • Volatility & Risk: Bollinger Bands,     ║   ║   - Catalyst Impact & Mitigation Matrix   ║
 ║   Annualized Volatility, Max Drawdown     ║   ║   - Multi-Turn Quant Copilot Reasoning    ║
 ║ • Risk-Adjusted: Sharpe Ratio (Rf = 4.5%) ║   ║ • Gemini Image Models:                    ║
 ║ • 3-Tier Stop Losses & Staged Take-Profit ║   ║   - Editorial Financial Concept Art       ║
 ╚═══════════════════════════════════════════╝   ║ • Gemini TTS Preview:                     ║
                                                 ║   - Broadcast Audio Briefing Synthesis    ║
                                                 ╚═══════════════════════════════════════════╝`;

    navigator.clipboard.writeText(asciiText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintToPDF = () => {
    window.print();
  };

  const handleDownloadSVG = () => {
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 850" width="1200" height="850">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="850" fill="url(#bgGrad)" rx="16"/>
  <rect width="1198" height="848" x="1" y="1" fill="none" stroke="#1e293b" stroke-width="2" rx="15"/>

  <!-- Header -->
  <g transform="translate(50, 40)">
    <rect width="1100" height="70" rx="12" fill="#0b1329" stroke="#334155" stroke-width="1.5" filter="url(#shadow)"/>
    <circle cx="45" cy="35" r="20" fill="url(#cyanGrad)"/>
    <text x="45" y="41" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16" text-anchor="middle">SP</text>
    <text x="80" y="32" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="800" font-size="20">STOCKPULSE AI</text>
    <text x="245" y="32" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="700" font-size="13">INSTITUTIONAL QUANTITATIVE &amp; MULTIMODAL SYSTEM ARCHITECTURE</text>
    <text x="80" y="52" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">Powered by Gemini 3.7 Flash • Google Cloud Run • @google/genai TypeScript SDK</text>
    <rect x="940" y="20" width="135" height="30" rx="6" fill="#06b6d4" fill-opacity="0.15" stroke="#06b6d4" stroke-width="1"/>
    <text x="1007" y="40" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="700" font-size="11" text-anchor="middle">CFA TIER-1 CERTIFIED</text>
  </g>

  <!-- Tier 1: Client Layer -->
  <g transform="translate(50, 135)">
    <rect width="1100" height="155" rx="14" fill="#0b1329" stroke="#0284c7" stroke-width="1.5" filter="url(#shadow)"/>
    <rect x="20" y="16" width="320" height="26" rx="6" fill="#0369a1" fill-opacity="0.3"/>
    <text x="32" y="34" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="800" font-size="13">TIER 1: PRESENTATION &amp; CLIENT WORKSTATION (REACT 19 + VITE)</text>
    
    <!-- Client Boxes -->
    <g transform="translate(20, 52)">
      <rect width="250" height="85" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="16" y="28" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="700" font-size="13">Launchpad &amp; Market Feeds</text>
      <text x="16" y="48" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• Clean-Start (Zero Hardcoded Data)</text>
      <text x="16" y="66" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• 50+ Universe &amp; CSV Ingestion</text>
    </g>

    <g transform="translate(290, 52)">
      <rect width="255" height="85" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="16" y="28" fill="#a855f7" font-family="system-ui, sans-serif" font-weight="700" font-size="13">Autonomous 1-Action Pipeline</text>
      <text x="16" y="48" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• 6-Stage Verified Workflow</text>
      <text x="16" y="66" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• In-Flight AbortController</text>
    </g>

    <g transform="translate(565, 52)">
      <rect width="250" height="85" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="16" y="28" fill="#10b981" font-family="system-ui, sans-serif" font-weight="700" font-size="13">Trader Risk &amp; Horizons</text>
      <text x="16" y="48" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• 5 Profiles: Day, Swing, Long</text>
      <text x="16" y="66" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• 3-Tier Stops &amp; Target Matrix</text>
    </g>

    <g transform="translate(835, 52)">
      <rect width="245" height="85" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="16" y="28" fill="#f59e0b" font-family="system-ui, sans-serif" font-weight="700" font-size="13">Story Studio &amp; Audio</text>
      <text x="16" y="48" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• 4-Genre Narrative Generation</text>
      <text x="16" y="66" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• Gemini Voice Briefing Room</text>
    </g>
  </g>

  <!-- Connection 1 -> 2 -->
  <path d="M 600 290 L 600 320" stroke="#0284c7" stroke-width="3" stroke-dasharray="6,4"/>
  <polygon points="595,320 605,320 600,328" fill="#0284c7"/>
  <text x="615" y="312" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="600" font-size="11">HTTPS REST &amp; BYOK Encrypted Headers</text>

  <!-- Tier 2: Cloud Run Backend -->
  <g transform="translate(50, 330)">
    <rect width="1100" height="135" rx="14" fill="#0b1329" stroke="#4f46e5" stroke-width="1.5" filter="url(#shadow)"/>
    <rect x="20" y="16" width="370" height="26" rx="6" fill="#3730a3" fill-opacity="0.3"/>
    <text x="32" y="34" fill="#818cf8" font-family="system-ui, sans-serif" font-weight="800" font-size="13">TIER 2: ORCHESTRATION &amp; GOOGLE CLOUD RUN GATEWAY (server.ts)</text>

    <!-- Cloud Run Submodules -->
    <g transform="translate(20, 52)">
      <rect width="335" height="70" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="16" y="26" fill="#818cf8" font-family="system-ui, sans-serif" font-weight="700" font-size="12">API Security &amp; BYOK Header Proxy</text>
      <text x="16" y="46" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">Zero server-side key exposure, passes x-gemini-api-key</text>
    </g>

    <g transform="translate(380, 52)">
      <rect width="335" height="70" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="16" y="26" fill="#818cf8" font-family="system-ui, sans-serif" font-weight="700" font-size="12">Dual Data Adapters &amp; Fallbacks</text>
      <text x="16" y="46" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">Polygon.io + Alpha Vantage + CSV Ingestion streams</text>
    </g>

    <g transform="translate(740, 52)">
      <rect width="340" height="70" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="16" y="26" fill="#818cf8" font-family="system-ui, sans-serif" font-weight="700" font-size="12">Lifecycle &amp; Abort Handlers</text>
      <text x="16" y="46" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">Non-blocking background queues, instant cancellation</text>
    </g>
  </g>

  <!-- Connectors 2 -> 3 & 4 -->
  <path d="M 330 465 L 330 500" stroke="#10b981" stroke-width="2.5" stroke-dasharray="4,4"/>
  <polygon points="325,500 335,500 330,508" fill="#10b981"/>

  <path d="M 870 465 L 870 500" stroke="#a855f7" stroke-width="2.5" stroke-dasharray="4,4"/>
  <polygon points="865,500 875,500 870,508" fill="#a855f7"/>

  <!-- Tier 3: Deterministic Math Engine -->
  <g transform="translate(50, 510)">
    <rect width="520" height="280" rx="14" fill="#0b1329" stroke="#059669" stroke-width="1.5" filter="url(#shadow)"/>
    <rect x="20" y="16" width="310" height="26" rx="6" fill="#065f46" fill-opacity="0.3"/>
    <text x="32" y="34" fill="#34d399" font-family="system-ui, sans-serif" font-weight="800" font-size="13">TIER 3: DETERMINISTIC QUANT MATH ENGINE</text>

    <!-- Math formulas & boxes -->
    <g transform="translate(20, 52)">
      <rect width="480" height="60" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="14" y="24" fill="#34d399" font-family="system-ui, sans-serif" font-weight="700" font-size="12">Trend &amp; Moving Average Algorithms</text>
      <text x="14" y="44" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">SMA(k) = (1/k) ∑ P(t-i) • EMA(k) Multipliers • Golden/Death Crosses</text>
    </g>

    <g transform="translate(20, 122)">
      <rect width="480" height="60" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="14" y="24" fill="#34d399" font-family="system-ui, sans-serif" font-weight="700" font-size="12">Momentum, Overbought/Oversold &amp; Divergence</text>
      <text x="14" y="44" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">RSI(14) Welles Wilder Smoothing • MACD = EMA(12) - EMA(26)</text>
    </g>

    <g transform="translate(20, 192)">
      <rect width="480" height="72" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="14" y="24" fill="#34d399" font-family="system-ui, sans-serif" font-weight="700" font-size="12">Risk Metrics, Volatility &amp; Sharpe Ratio</text>
      <text x="14" y="44" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">Annualized Volatility (σp * √252) • Sharpe = (Rp - Rf) / σp (Rf = 4.5%)</text>
      <text x="14" y="60" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">3-Tier Stops (Tight 0.8 ATR, Hard 1.5 ATR, Structural 200 SMA)</text>
    </g>
  </g>

  <!-- Feed connector 3 -> 4 -->
  <path d="M 570 650 L 630 650" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3"/>
  <polygon points="630,645 630,655 638,650" fill="#38bdf8"/>
  <text x="605" y="640" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="10" text-anchor="middle">Telemetry</text>

  <!-- Tier 4: Google Gemini Multi-Model Core -->
  <g transform="translate(630, 510)">
    <rect width="520" height="280" rx="14" fill="#0b1329" stroke="#7c3aed" stroke-width="1.5" filter="url(#shadow)"/>
    <rect x="20" y="16" width="350" height="26" rx="6" fill="#5b21b6" fill-opacity="0.3"/>
    <text x="32" y="34" fill="#c084fc" font-family="system-ui, sans-serif" font-weight="800" font-size="13">TIER 4: GOOGLE GEMINI MULTI-MODEL AI ENGINE</text>

    <!-- Gemini Flash Core -->
    <g transform="translate(20, 52)">
      <rect width="480" height="80" rx="8" fill="#0f172a" stroke="#7c3aed" stroke-width="1.2"/>
      <circle cx="28" cy="28" r="10" fill="#8b5cf6"/>
      <text x="28" y="32" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="10" text-anchor="middle">★</text>
      <text x="46" y="32" fill="#e9d5ff" font-family="system-ui, sans-serif" font-weight="800" font-size="13">Gemini 3.7 Flash (@google/genai SDK)</text>
      <text x="14" y="52" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11">• Grounded Quantitative Synthesis (Conviction Scores &amp; 12-Mo Targets)</text>
      <text x="14" y="68" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11">• Multi-Turn Quant Copilot &amp; Institutional Slide Deck Structuring</text>
    </g>

    <!-- Gemini Image & TTS -->
    <g transform="translate(20, 142)">
      <rect width="235" height="122" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="14" y="24" fill="#f43f5e" font-family="system-ui, sans-serif" font-weight="700" font-size="12">Gemini Image Generation</text>
      <text x="14" y="44" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• Editorial Concept Artwork</text>
      <text x="14" y="60" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• Story Visual Illustrations</text>
      <text x="14" y="76" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• 16:9 Slide Presentations</text>
    </g>

    <g transform="translate(265, 142)">
      <rect width="235" height="122" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="14" y="24" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="700" font-size="12">Gemini TTS Preview</text>
      <text x="14" y="44" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• Broadcast-Grade Voice</text>
      <text x="14" y="60" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• Multi-Voice (Kore, Puck)</text>
      <text x="14" y="76" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">• In-Sync Executive Audio</text>
    </g>
  </g>

  <!-- Footer -->
  <text x="600" y="820" fill="#64748b" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">StockPulse AI • Autonomous Financial Research &amp; Quantitative Storytelling Workstation • All Rights Reserved</text>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StockPulse_AI_Architecture_Diagram.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const nodeDetails: Record<
    string,
    { title: string; subtitle: string; tech: string; description: string; points: string[]; badge: string }
  > = {
    'gemini-flash': {
      title: 'Gemini 3.7 Flash Model Core',
      subtitle: 'Primary Quantitative Reasoning & Multimodal Engine',
      tech: '@google/genai TypeScript SDK v2.4.0',
      badge: 'Core Intelligence',
      description:
        'Processes pre-computed statistical and time-series telemetry to produce high-conviction verdicts, price targets, risk mitigation protocols, slide teleprompter scripts, and multi-turn conversational answers.',
      points: [
        'Zero-math hallucination via pre-computed deterministic input telemetry.',
        'Generates 12-month target price ranges, support/resistance channels, and catalyst impact matrices.',
        'Powers the Quant Copilot with dynamic context injection of current quote & technicals.',
        'Formats structured executive presentations with tailored investor playbooks.',
      ],
    },
    'cloud-run': {
      title: 'Google Cloud Run Server (server.ts)',
      subtitle: 'Containerized API Gateway & Security Boundary',
      tech: 'Express 4.21 • Node.js • Cloud Run',
      badge: 'Infrastructure',
      description:
        'Scalable serverless microservice handling live financial API proxying, API key secrecy, client-side BYOK header translation, and non-blocking streaming cancellation.',
      points: [
        'Strict credential isolation: Never exposes master secrets to client browsers.',
        'Dynamic BYOK injection: Reads x-gemini-api-key headers seamlessly.',
        'Dual-adapter fallback: Polygon.io + Alpha Vantage market data ingestion.',
        'Native AbortController integration for canceling multi-stage pipelines in flight.',
      ],
    },
    'quant-math': {
      title: 'Deterministic Quantitative Indicator Engine',
      subtitle: 'Algorithmic Financial Math & Statistical Computing',
      tech: 'TypeScript (Pure Algorithmic Matrix Functions)',
      badge: 'Mathematical Rigor',
      description:
        'Executes pure mathematical calculations for moving averages, momentum oscillators, risk-adjusted returns, and 3-tier stop loss thresholds before LLM reasoning.',
      points: [
        'SMA (20/50/200), EMA (12/26), RSI (14 with Wilder smoothing), MACD + Signal Line.',
        'Annualized Volatility (σp * √252) and Maximum Drawdown calculation.',
        'Annualized Sharpe Ratio with 4.5% Risk-Free Rate benchmark.',
        '3-Tier Stops: Tight (0.8 ATR), Hard (1.5 ATR), and Structural (200 SMA).',
      ],
    },
    'react-client': {
      title: 'React 19 & Vite Terminal Frontend',
      subtitle: 'High-Density Institutional Financial Workstation',
      tech: 'React 19 • Vite • Tailwind CSS v4 • motion/react',
      badge: 'Client UX',
      description:
        'A responsive, zero-seed clean workstation with interactive candlestick charts, multi-horizon trader selection, executive slide presentation decks, and audio briefing studio.',
      points: [
        'Clean-start architecture: Zero dummy seed data; supports any global ticker or CSV file.',
        'Autonomous 1-Action Pipeline with live milestone persistence and retry buttons.',
        '5 Trader Horizons: Day, Weeks, Months, Long-Term, and Situational.',
        'Export capabilities: Print/PDF, Markdown Dossier, and JSON time-series extracts.',
      ],
    },
    'gemini-image': {
      title: 'Gemini Image Generation Core',
      subtitle: 'Cinematic Financial Visuals & Concept Art',
      tech: 'Google GenAI Imagen / Visual Model',
      badge: 'Creative Multimodal',
      description:
        'Synthesizes high-fidelity editorial illustrations, financial charts, and conceptual metaphors that visually represent the stock’s market narrative and macroeconomic theme.',
      points: [
        'Generates 16:9 widescreen presentation slide visuals.',
        'Adapts art style across 4 genres (Cyberpunk, Wall Street Memo, Renaissance, Documentary).',
        'Directly embedded into the Autonomous 1-Action Executive Presentation.',
      ],
    },
    'gemini-tts': {
      title: 'Gemini TTS Audio Synthesis',
      subtitle: 'Broadcast-Grade Spoken Intelligence',
      tech: 'Gemini TTS Preview & Browser Web Audio',
      badge: 'Voice Synthesis',
      description:
        'Converts structured financial teleprompter scripts into studio-grade audio narration with natural inflection, professional pacing, and multi-speaker voice profiles.',
      points: [
        '4 distinct vocal personas: Kore, Puck, Fenrir, Aoede.',
        'Seamless synchronization with active presentation slide teleprompters.',
        'Client-side audio buffer caching and instant playback interruption controls.',
      ],
    },
  };

  const activeNodeData = selectedNode ? nodeDetails[selectedNode] || nodeDetails['gemini-flash'] : nodeDetails['gemini-flash'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-2 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white tracking-tight">System Architecture &amp; Data Pipeline</h3>
                <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30 uppercase">
                  Institutional Specification
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visual blueprint of Google Cloud Run, Gemini 3.7 Flash, Deterministic Math Engine &amp; React 19 Client
              </p>
            </div>
          </div>

          {/* Action Bar (Export to PDF, Download SVG, Copy ASCII, Close) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintToPDF}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition shadow-sm"
              title="Print formatted architecture document or Save as PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Export PDF / Print</span>
            </button>

            <button
              onClick={handleDownloadSVG}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition shadow-sm"
              title="Download standalone vector SVG diagram"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download SVG</span>
            </button>

            <button
              onClick={copyAsciiArchitecture}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
              title="Copy structured ASCII / Markdown schema to clipboard"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Schema'}</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-800/80 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Interactive Visual Canvas + Detail Inspector */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Zoom & View Controls */}
          <div className="flex items-center justify-between bg-slate-950/60 rounded-xl px-4 py-2 border border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Interactive Visual Diagram:</span>
              <span>Click any tier below to inspect technical specifications and latency protocols.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 1.4))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <span className="text-[11px] font-mono w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.7))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition ml-1"
                title="Reset Zoom"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Scalable Visual Architecture Canvas Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-inner" ref={diagramRef}>
            <div
              className="min-w-[900px] transition-transform duration-200 origin-top"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Architecture Tiers Visual Layout */}
              <div className="space-y-4">
                {/* TIER 1: CLIENT WORKSTATION */}
                <div
                  onClick={() => setSelectedNode('react-client')}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                    selectedNode === 'react-client'
                      ? 'border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/40'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">
                        Tier 1 • Client &amp; Presentation Layer (React 19 + Vite + Tailwind CSS)
                      </span>
                    </div>
                    <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/20">
                      Client-Side (Port 3000)
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-3 text-xs">
                    <div className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-3 space-y-1">
                      <div className="font-bold text-slate-200 flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5 text-cyan-400" /> Clean Launchpad
                      </div>
                      <p className="text-[11px] text-slate-400">Zero-seed start; direct ticker search, 50+ scanner &amp; CSV ingestion</p>
                    </div>

                    <div className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-3 space-y-1">
                      <div className="font-bold text-slate-200 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-purple-400" /> 1-Action Pipeline
                      </div>
                      <p className="text-[11px] text-slate-400">6-stage autonomous slide deck with AbortController cancellation</p>
                    </div>

                    <div className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-3 space-y-1">
                      <div className="font-bold text-slate-200 flex items-center gap-1">
                        <Activity className="h-3.5 w-3.5 text-emerald-400" /> Trader Risk Engine
                      </div>
                      <p className="text-[11px] text-slate-400">5 horizons + 3-tier stop losses (Tight, Hard, Structural)</p>
                    </div>

                    <div className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-3 space-y-1">
                      <div className="font-bold text-slate-200 flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> BYOK Key Vault
                      </div>
                      <p className="text-[11px] text-slate-400">Encrypted localStorage key store passing x-gemini-api-key</p>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector 1 -> 2 */}
                <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-mono py-0.5">
                  <div className="h-4 w-0.5 bg-gradient-to-b from-cyan-400 to-indigo-500"></div>
                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px] text-slate-400">
                    HTTPS REST / JSON • x-gemini-api-key Headers • Abort Signals
                  </span>
                  <div className="h-4 w-0.5 bg-gradient-to-b from-cyan-400 to-indigo-500"></div>
                </div>

                {/* TIER 2: CLOUD RUN API GATEWAY */}
                <div
                  onClick={() => setSelectedNode('cloud-run')}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                    selectedNode === 'cloud-run'
                      ? 'border-indigo-400 bg-indigo-950/20 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-400/40'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-indigo-400" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                        Tier 2 • Orchestration &amp; Google Cloud Run Gateway (server.ts)
                      </span>
                    </div>
                    <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-indigo-500/20">
                      Express 4.21 / Node.js
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-3 space-y-1">
                      <div className="font-bold text-slate-200">API Security &amp; Key Isolation</div>
                      <p className="text-[11px] text-slate-400">Proxies AI Studio secret keys without browser leakage; binds custom BYOK headers</p>
                    </div>

                    <div className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-3 space-y-1">
                      <div className="font-bold text-slate-200">Dual Market Feeds</div>
                      <p className="text-[11px] text-slate-400">Polygon.io + Alpha Vantage with resilient cache &amp; historical normalization</p>
                    </div>

                    <div className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-3 space-y-1">
                      <div className="font-bold text-slate-200">Pipeline Stream Management</div>
                      <p className="text-[11px] text-slate-400">Non-blocking background handlers, step telemetry, and instant cancellation</p>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector 2 -> 3 & 4 */}
                <div className="grid grid-cols-2 gap-6 py-0.5 text-xs font-mono">
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <div className="h-4 w-0.5 bg-emerald-500"></div>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px] text-slate-400">
                      Raw Candles &amp; Quotes
                    </span>
                    <div className="h-4 w-0.5 bg-emerald-500"></div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-purple-400">
                    <div className="h-4 w-0.5 bg-purple-500"></div>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px] text-slate-400">
                      @google/genai SDK Calls
                    </span>
                    <div className="h-4 w-0.5 bg-purple-500"></div>
                  </div>
                </div>

                {/* BOTTOM GRID: TIER 3 (MATH) & TIER 4 (GEMINI AI ENGINE) */}
                <div className="grid grid-cols-2 gap-4">
                  {/* TIER 3: DETERMINISTIC MATH ENGINE */}
                  <div
                    onClick={() => setSelectedNode('quant-math')}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                      selectedNode === 'quant-math'
                        ? 'border-emerald-400 bg-emerald-950/20 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/40'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                          Tier 3 • Deterministic Math Engine
                        </span>
                      </div>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-500/20">
                        Zero Hallucination
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-2.5">
                        <div className="font-bold text-slate-200 text-[11px]">Moving Averages &amp; Trend</div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">SMA(20/50/200), EMA(12/26), Crosses</p>
                      </div>

                      <div className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-2.5">
                        <div className="font-bold text-slate-200 text-[11px]">Momentum &amp; Oscillators</div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">RSI (14 Wilder), MACD Line &amp; Signal Histogram</p>
                      </div>

                      <div className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-2.5">
                        <div className="font-bold text-slate-200 text-[11px]">Volatility &amp; Sharpe Ratio</div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">σp * √252, Max Drawdown, Sharpe (Rf = 4.5%)</p>
                      </div>
                    </div>
                  </div>

                  {/* TIER 4: GOOGLE GEMINI MULTI-MODEL CORE */}
                  <div
                    onClick={() => setSelectedNode('gemini-flash')}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                      selectedNode === 'gemini-flash' || selectedNode === 'gemini-image' || selectedNode === 'gemini-tts'
                        ? 'border-purple-400 bg-purple-950/20 shadow-lg shadow-purple-500/10 ring-1 ring-purple-400/40'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                        <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400">
                          Tier 4 • Google Gemini Multi-Model Core
                        </span>
                      </div>
                      <span className="rounded bg-purple-500/10 px-2 py-0.5 text-[10px] font-mono text-purple-300 border border-purple-500/20">
                        @google/genai SDK
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNode('gemini-flash');
                        }}
                        className="rounded-xl border border-purple-500/30 bg-purple-950/30 p-2.5 hover:border-purple-400 transition"
                      >
                        <div className="font-bold text-purple-200 text-[11px] flex items-center justify-between">
                          <span>Gemini 3.7 Flash Reasoning</span>
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Primary Model</span>
                        </div>
                        <p className="text-[10px] text-slate-300 mt-0.5">
                          Quantitative synthesis, 12-mo targets, catalyst matrices &amp; Quant Copilot
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNode('gemini-image');
                          }}
                          className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-2.5 hover:border-rose-400/50 transition"
                        >
                          <div className="font-bold text-rose-300 text-[11px]">Gemini Image Models</div>
                          <p className="text-[10px] text-slate-400 mt-0.5">Editorial concept art &amp; presentation slides</p>
                        </div>

                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNode('gemini-tts');
                          }}
                          className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-2.5 hover:border-cyan-400/50 transition"
                        >
                          <div className="font-bold text-cyan-300 text-[11px]">Gemini TTS Preview</div>
                          <p className="text-[10px] text-slate-400 mt-0.5">Multi-voice audio synthesis (Kore, Puck, Fenrir)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Node Deep-Dive Inspector */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{activeNodeData.title}</h4>
                  <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/20">
                    {activeNodeData.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{activeNodeData.subtitle}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Technology Stack</span>
                <span className="text-xs font-mono font-bold text-slate-300">{activeNodeData.tech}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{activeNodeData.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {activeNodeData.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/70 rounded-lg p-2.5 border border-slate-800/60">
                  <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 bg-slate-950 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>
              CFA Tier-1 Terminal License • Sub ID: #{userProfile?.subscription_id ?? 3} • Confidential Architecture Specification
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-1.5 font-semibold text-white hover:bg-slate-700 transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
