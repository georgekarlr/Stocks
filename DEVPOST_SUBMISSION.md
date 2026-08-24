# 🚀 Devpost Submission: StockPulse AI
### *Autonomous Multi-Agent Financial Research & Quantitative Storytelling Engine*
**Hackathon:** All Things Agentic Hackathon (Google & Devpost)  
**Track:** The Taskmaster *(Eligible for Best Multimodal UX & Best Architectural Design)*  
**Live Application URL:** [StockPulse AI on Google Cloud Run](https://ais-dev-yyjcl5f3ws2yupj4tehjeu-174976184741.asia-southeast1.run.app)  

---

## 📌 1. Project Overview & Elevator Pitch

**StockPulse AI** is an autonomous, multi-agent institutional financial analyst and quantitative storytelling workstation powered by **Gemini 3.7 Flash**, Google GenAI SDK, and **Google Cloud Run**.

Unlike standard passive chatbots that wait for user prompts, StockPulse AI takes **autonomous action** to ingest real-time market feeds across a 50+ global stock universe, compute institutional technical indicators (SMA, EMA, RSI, MACD, Bollinger Bands, Sharpe Ratios), synthesize investment memos with high-conviction ratings, and produce multimodal episodic narratives with AI-generated editorial artwork and voice briefings.

---

## 💡 2. The Problem We Solved

Institutional-grade financial analysis is fragmented, exhausting, and manual:
1. **Scattered Data & Manual Calculations:** Analysts and retail investors spend hours every week pulling raw historical data and computing quantitative indicators by hand.
2. **Analysis Paralysis:** Interpreting dense spreadsheets and balance sheets without structured institutional conviction frameworks leads to missed market catalysts.
3. **Dry & Inaccessible Communication:** Traditional financial reports are boring and inaccessible for decision-makers who need quick multimodal summaries (narratives, visual concept art, and voice briefings).
4. **Data Privacy & API Key Governance:** Users need sovereign control over their individual API keys without hardcoding secrets on remote servers.

---

## 🛠️ 3. Features & Agentic Functionality

### A. ⚡ The Ultimate 1-Action Autonomous Presentation Workflow ("One Intent Does It All")
- **End-to-End Autonomous Pipeline:** Triggering a single stock action autonomously runs data ingestion -> algorithmic math -> Gemini 3.7 Flash reasoning -> visual concept artwork -> interactive slide deck -> broadcast-grade voice presentation.
- **Step-by-Step Verified State Persistence:** Saves intermediate results at every milestone (market quotes, candles, quantitative indicators, analysis). If a subsequent step encounters an issue, previously calculated assets are never lost.
- **Graceful Error Recovery & Algorithmic Fallback:** Provides instant 1-click step retries and deterministic quantitative fallbacks without crashing or restarting from scratch.
- **Real-Time Request Cancellation:** Instant cancel mechanism powered by `AbortController` allows the user to abort in-flight workflows and audio playback at any millisecond.
- **Crystal-Clear "What To Do" Direct Playbook:** Tells investors exactly what to do in plain English:
  - *Current Holders:* Precise profit targets and trailing stop-loss triggers.
  - *Potential Buyers:* Exact accumulation entry zones and 12-month upside targets.
  - *Cautious Investors:* Risk hedging and portfolio sizing rules.
- **Synchronized Visual Stage & Teleprompter:** Interactive presentation cards, live audio visualizer waveform, teleprompter transcript, and voice actor controls.

### B. Autonomous Quantitative Pipeline ("The Taskmaster")
- **Live Market Data Ingestion:** Real-time data pipeline pulling price action, 52-week corridors, and volume metrics via Polygon.io and Alpha Vantage feeds.
- **Dynamic 50+ Stock Market Universe:** Filterable by sector (*Tech Titans, AI & Chips, Financials, Healthcare, Consumer & Energy, ETFs*) with 1-click batch loading (+15 stocks pagination) and custom ticker ingestion.
- **Custom CSV Time-Series Ingestion:** Upload any standard equity CSV to parse and compute quantitative indicators on private datasets.
- **Automated Formula Engine:** Asynchronously computes:
  - **Moving Averages:** SMA (20, 50, 200), EMA (12, 26)
  - **Momentum & Volatility:** RSI 14, MACD (12, 26, 9), Bollinger Bands (20, 2)
  - **Risk Ratios:** Annualized Volatility & Sharpe Ratio (Risk-Free Benchmark: 4.5%)

### B. Gemini 3.7 Flash Quantitative Synthesis
- **Institutional Verdicts:** Conviction ratings (`Strong Buy`, `Buy`, `Hold`, `Sell`, `Strong Sell`) backed by macro and micro rationale.
- **Target Corridors:** Precise Price Target, Stop-Loss, and Take-Profit calculations.
- **Catalyst Radar & Risk Protocols:** Categorized catalysts (Earnings, Product, Regulatory, Macro) and dynamic risk-mitigation plans.

### C. Multimodal Story Studio & Voice Briefing Room
- **Episodic Financial Storytelling:** Generates structured multi-chapter financial storylines across 4 tones (*Wall Street Memo, Cyberpunk Terminal, Renaissance Merchant, Documentary Narrator*).
- **AI Editorial Cover Art:** High-fidelity financial concept artwork synthesized via Gemini image models.
- **Audio Narrator Briefings:** Generates broadcast-ready spoken monologues via Gemini TTS with multi-voice selection (*Kore, Puck, Fenrir, Aoede*).

### D. Interactive Quant Copilot
- Context-aware financial assistant grounded in the live stock’s balance sheet, technical indicators, and quantitative verdict.

### E. Individual Gemini API Key Management (BYOK)
- Sovereign Bring-Your-Own-Key model with encrypted client-side browser storage and direct proxy headers (`x-gemini-api-key`).
- Built-in live connection testing against Gemini 3.7 Flash.

---

## 🏗️ 4. System Architecture Diagram

```
[ User / Analyst ]
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│              StockPulse React SPA (Vite + TS)               │
│  - Clean-Start Launchpad (Zero Seed Data)                   │
│  - Multi-Asset Market Scanner (50+ Universe & Load More)    │
│  - Interactive Candlestick Terminal & Indicator Overlay     │
│  - Story Studio, Voice Briefing Room & Quant Copilot        │
│  - Client-Side BYOK Key Manager                             │
└───────────────┬─────────────────────────────────────────────┘
                │ HTTPS (x-gemini-api-key encrypted headers)
                ▼
┌─────────────────────────────────────────────────────────────┐
│          Google Cloud Run Express Backend (/server.ts)      │
│  ┌───────────────────────────┐ ┌──────────────────────────┐ │
│  │ Market Data Ingestion     │ │ Quantitative Engine      │ │
│  │ (Polygon / Alpha Vantage) │ │ (SMA/EMA/RSI/MACD/Sharpe)│ │
│  └─────────────┬─────────────┘ └────────────┬─────────────┘ │
└────────────────┼────────────────────────────┼───────────────┘
                 ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│             Google Gemini Enterprise Agent Platform         │
│  - Gemini 3.7 Flash: Quantitative Reasoning & Synthesizer   │
│  - Gemini Image Model: Editorial Financial Artwork          │
│  - Gemini TTS Preview: High-Fidelity Audio Narrator         │
│  - Grounded Context: Real-time Quote & Technical Telemetry  │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 5. Technologies Used

- **AI Models:** Google Gemini 3.7 Flash, Gemini 3.1 Flash Image, Gemini 3.1 Flash TTS Preview
- **Agent SDK:** `@google/genai` TypeScript SDK
- **Backend & Compute:** Express.js, TypeScript, Google Cloud Run (Containerized GCP deployment)
- **Frontend & UI:** React 18, Vite, Tailwind CSS, Lucide Icons, Canvas 2D Rendering
- **Financial APIs:** Polygon.io & Alpha Vantage live proxy feeds

---

## ⚙️ 6. Spin-up & Reproducibility Instructions

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Google Gemini API Key ([Get a key here](https://aistudio.google.com/app/apikey))

### Local Installation
```bash
# 1. Clone the repository
git clone https://github.com/georgekarlr/stockpulse-ai.git
cd stockpulse-ai

# 2. Install dependencies
npm install

# 3. (Optional) Create .env file
echo "PORT=3000" > .env

# 4. Build and run locally
npm run build
npm run dev
```
Open `http://localhost:3000` in your browser. Configure your personal Gemini API key using the **"Set API Key / BYOK"** button in the navigation bar.

### Cloud Run Deployment
```bash
gcloud run deploy stockpulse-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🔬 7. Findings & Key Learnings

1. **Context Grounding Enhances Financial Accuracy:** Feeding structured mathematical indicators (SMA, RSI, Sharpe ratio) directly into Gemini 3.7 Flash significantly eliminated financial hallucinations and produced institutional-grade conviction memos.
2. **Multimodal Delivery Boosts User Engagement:** Combining technical charts with AI-written episodic stories, editorial cover art, and TTS audio transformed complex raw numbers into accessible, executive-ready briefings.
3. **Client-Side BYOK Empowers Users:** Enabling users to bring their own Gemini API keys ensured privacy and zero server-side key vulnerabilities.
