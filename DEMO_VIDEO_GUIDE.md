# 🎬 StockPulse AI: Official Hackathon Demo Video Guide & Script

> **Mandatory Hackathon Video Requirements Checklist:**
> - [x] **Duration:** Under 4 minutes (~3:45 target runtime)
> - [x] **Platform & Privacy:** Publicly accessible on **YouTube** or **Vimeo** (*Strictly NOT Private or Unlisted*)
> - [x] **Language & Audio:** Clear English voiceover with accurate subtitles/captions
> - [x] **The Problem:** Clear articulation of financial fragmentation, analysis paralysis, and manual quantitative burdens
> - [x] **Value Proposition:** Autonomous agentic pipeline, deterministic mathematical rigor, Gemini 3.7 Flash reasoning, and multimodal outputs
> - [x] **Live Agent Working:** End-to-end screen capture of the live app executing autonomous workflows
> - [x] **Google Cloud Proof:** Verifiable proof showing Google Cloud Console, Cloud Run container dashboard, Cloud Logging / Vertex AI logs, and active `.run.app` URL
> - [x] **Early Upload Warning:** Video uploaded and processed in advance of the deadline

---

## ⏱️ Video Structure & Timing Overview (3 min 45 sec total)

| Timecode | Segment | Core Focus | Visual On Screen |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:35** | **1. The Problem & Hook** | Pain points: Financial fragmentation, analysis paralysis, dry static reports. | Analyst overwhelmed with 10 browser tabs and messy spreadsheets vs. StockPulse clean terminal. |
| **0:35 - 1:10** | **2. The Value Proposition** | Autonomous 1-Action AI Agent powered by Gemini 3.7 Flash + deterministic math. | High-level system architecture overlay; transition into live StockPulse AI launchpad. |
| **1:10 - 2:35** | **3. Live Agent in Action** | Autonomous 1-Click Executive Presentation, Candlestick terminal, 5 Trader Risk Profiles, Story Studio & Voice Room. | Full screen live demo: Ingestion $\to$ Indicators $\to$ Gemini synthesis $\to$ Image generation $\to$ Voice briefing. |
| **2:35 - 3:25** | **4. Google Cloud Proof** | Google Cloud Console, Cloud Run Dashboard, Cloud Logging, Vertex AI/Gemini requests, `.run.app` URL. | Browser switches to Google Cloud Console showing Cloud Run service, logs, metrics, and live HTTPS URL. |
| **3:25 - 3:45** | **5. Summary & Outro** | Closing statement, recap of capabilities, and link to live Cloud Run deployment. | Terminal summary card, GitHub repo link, and live Cloud Run URL display. |

---

## 🎙️ Second-by-Second Voiceover Script & Visual Storyboard

### Segment 1: The Problem & The Hook (0:00 – 0:35)
- **Visual:** Split screen or quick cut showing a cluttered financial terminal with 12 open browser tabs, dense spreadsheet formulas, and raw time-series CSVs. Fast zoom into the clean, modern StockPulse AI dark-mode workstation.
- **Audio / Voiceover:**
  > *"Every trading day, financial analysts and individual investors lose hours juggling fragmented platforms, computing moving averages by hand, and drowning in dense spreadsheets. When critical market catalysts hit, analysis paralysis costs millions—and traditional text reports are too dry to communicate actionable insights quickly.  
  >  
  > We built **StockPulse AI**: an autonomous institutional financial workstation and multimodal storytelling engine powered by Google Gemini 3.7 Flash and Google Cloud Run. With a single intent, StockPulse transforms raw market feeds into actionable quantitative memos, visual concept art, and broadcast-ready audio briefings."*

---

### Segment 2: Value Proposition & Architecture (0:35 – 1:10)
- **Visual:** Display the built-in interactive Architecture Diagram modal (`ArchitectureDiagramModal`) inside StockPulse AI. Highlight the 4 decoupled tiers: React 19 Frontend $\to$ Cloud Run Express Gateway $\to$ Deterministic Quantitative Engine $\to$ Google Gemini 3.7 Flash Multimodal AI.
- **Audio / Voiceover:**
  > *"Unlike passive chatbots that only generate text when prompted, StockPulse AI acts as a true autonomous agent.  
  >  
  > It features a hybrid intelligence architecture: our backend computes mathematical precision—including exponential moving averages, RSI-14, MACD, Bollinger Bands, and annualized Sharpe Ratios—and feeds that structured telemetry into Gemini 3.7 Flash for deep qualitative synthesis.  
  >  
  > Everything runs serverlessly on Google Cloud Run with client-side Bring-Your-Own-Key privacy, guaranteeing zero credential leaks."*

---

### Segment 3: Live Agent In Action (1:10 – 2:35)

#### Part A: Autonomous 1-Action Executive Presentation Pipeline (1:10 – 1:55)
- **Visual:**
  1. Show the clean-start Launchpad (zero hardcoded sample data).
  2. Type `NVDA` or select from the 50+ Market Universe.
  3. Click the **"Executive Briefing"** button.
  4. Show the autonomous 6-step progress pipeline updating in real-time:
     - Step 1: Ingesting Live Market Data
     - Step 2: Computing Algorithmic Indicators
     - Step 3: Gemini 3.7 Flash Quantitative Synthesis
     - Step 4: Editorial Financial Artwork Synthesis
     - Step 5: Executive Slide Deck Structuring
     - Step 6: Broadcast Audio Generation
  5. Demonstrate the live slide deck with synchronized audio waveform visualizer and direct "What To Do" playbook (*Current Holders*, *Potential Buyers*, *Cautious Investors*).
- **Audio / Voiceover:**
  > *"Let's watch the agent in action. Starting with a completely clean workspace, we initiate our autonomous Executive Presentation for NVIDIA.  
  >  
  > In one automated pipeline, the agent ingests tick data, computes our mathematical indicators, invokes Gemini 3.7 Flash for thesis synthesis, renders custom editorial concept art, and structures an interactive 5-slide executive presentation with voice narration.  
  >  
  > Notice the direct investor playbook giving exact entry corridors, trailing stop-losses, and catalysts. If needed, state persistence allows instant step retries, and users can cancel in-flight pipelines at any millisecond with native AbortController support."*

#### Part B: Candlestick Terminal & Multi-Horizon Trader Risk Engine (1:55 – 2:20)
- **Visual:** Switch to the **Terminal** tab showing interactive candlestick charts with SMA/EMA and Bollinger Band overlays. Then click over to the **Position & Risk** tab. Toggle between **Day Trader**, **Weeks Trader**, **Months Trader**, and **Long-Term Compounder**. Show dynamic 3-Tier Stop-Losses (Tight, Hard, Structural) updating automatically.
- **Audio / Voiceover:**
  > *"On the interactive Candlestick Terminal, analysts can inspect quantitative overlays in real time.  
  >  
  > Our Position & Risk Analyzer adapts dynamically across five distinct trader horizons—from intraday scalpers to long-term compounders—calculating volatility-adjusted position sizing and three tiers of stop-loss protection."*

#### Part C: Story Studio, Voice Briefing Room & Quant Copilot (2:20 – 2:35)
- **Visual:** Quick 15-second walkthrough showing the **Story Studio** (generating narrative chapters in *Wall Street Memo* or *Cyberpunk Terminal* style), the **Voice Briefing Room** (playing back with Gemini TTS voices like *Kore* or *Fenrir*), and a prompt in the **Quant Copilot**.
- **Audio / Voiceover:**
  > *"Through the Story Studio and Voice Briefing Room, financial reports become cinematic episodic stories with AI artwork and lifelike narration, while our Quant Copilot provides conversational balance sheet reasoning."*

---

### Segment 4: Proof of Backend on Google Cloud (2:35 – 3:25)
- **Visual:** Switch browser tab directly to **Google Cloud Console**:
  1. Show **Google Cloud Run** Service Dashboard:
     - Service name: `stockpulse-ai` / AI Studio Cloud Run instance.
     - Region: `asia-southeast1` (or your configured Cloud Run region).
     - Status: Green checkmark (Healthy / Serving 100% traffic).
     - URL: Point mouse to the active `https://...asia-southeast1.run.app` HTTPS domain.
  2. Click into **Cloud Run Logs / Cloud Logging**:
     - Filter by recent requests.
     - Show live incoming POST requests to `/api/analyze`, `/api/generate-story`, and `/api/executive-briefing`.
     - Highlight the Google GenAI SDK / Gemini 3.7 Flash API calls returning `200 OK`.
  3. Show the **Metrics Tab**:
     - CPU utilization, memory allocation (512MB/1GB), request latency (~300-800ms), and active instance count.
- **Audio / Voiceover:**
  > *"Here is verifiable proof that StockPulse AI's backend is actively deployed and running on Google Cloud.  
  >  
  > In the Google Cloud Console, you can see our containerized Express and TypeScript service running on Google Cloud Run in the `asia-southeast1` region, bound to our live secure `.run.app` endpoint.  
  >  
  > Looking at the real-time Cloud Run logs, we see live HTTP POST traffic executing Gemini 3.7 Flash quantitative inferences and audio endpoints with sub-second response times, zero cold-start bottlenecks, and enterprise container security."*

---

### Segment 5: Summary & Conclusion (3:25 – 3:45)
- **Visual:** Return to the live StockPulse AI application. Show the 1-click **Analyst Dossier Export** (PDF/Markdown/JSON), BYOK modal with passing Gemini connection test, and the closing title card with live Cloud Run URL and GitHub link.
- **Audio / Voiceover:**
  > *"StockPulse AI bridges quantitative precision with generative storytelling, turning complex markets into instant, decisive action.  
  >  
  > The platform is fully live, open source, and available to test immediately on Google Cloud Run. Thank you for watching!"*

---

## 📋 YouTube & Vimeo Video Publishing Checklist

### 1. Privacy & Visibility Settings (CRITICAL)
- [ ] **Visibility:** Set to **Public** on YouTube or Vimeo.
- [ ] ⚠️ **DO NOT set to "Unlisted" or "Private"** (Devpost judges and automated submission checkers may disqualify private/unlisted videos).
- [ ] **Audience:** Select *"No, it's not made for kids"* (Standard compliance).
- [ ] **Embedding:** Allow video embedding so Devpost can embed the player directly on your project submission page.

### 2. Copy-Paste YouTube Title & Description

#### Video Title:
```
StockPulse AI – Autonomous Multi-Agent Financial Research & Storytelling Terminal (Gemini 3.7 & Cloud Run)
```

#### Video Description:
```markdown
StockPulse AI is an autonomous, multi-agent financial analytics and quantitative storytelling terminal powered by Google Gemini 3.7 Flash, the Google GenAI TypeScript SDK, and Google Cloud Run.

🏆 Submission for the Google & Devpost "All Things Agentic Hackathon" (The Taskmaster Track).

🌐 Live Hosted App (Google Cloud Run): 
https://ais-dev-qk33zyy3vff4knkcuhnxv5-645771398329.asia-southeast1.run.app

💻 GitHub Repository: 
https://github.com/georgekarlr/stockpulse-ai

⏱️ Video Chapters / Timestamps:
0:00 - The Problem: Financial Fragmentation & Analysis Paralysis
0:35 - Value Proposition & 4-Tier System Architecture
1:10 - Autonomous 1-Action Executive Presentation Pipeline
1:55 - Candlestick Terminal & Multi-Horizon Trader Risk Engine
2:20 - Multimodal Story Studio & Voice Briefing Room
2:35 - Google Cloud Proof: Cloud Run Console, Logs & Live .run.app URL
3:25 - Summary & Live Deployment Links

Key Technologies:
- Google Gemini 3.7 Flash (Reasoning & Quantitative Synthesis)
- Google GenAI TypeScript SDK (@google/genai)
- Google Cloud Run (Containerized Serverless Backend)
- React 19, TypeScript, Vite & Tailwind CSS
- Polygon.io & Alpha Vantage Market Data Ingestion
```

---

## 🖥️ Screen Recording & Production Best Practices

1. **Resolution & Aspect Ratio:**
   - Record at **1080p (1920x1080)** or **4K (3840x2160)** at **60 fps**.
   - Standard 16:9 landscape aspect ratio.

2. **Browser & UI Preparation:**
   - Set browser zoom to **100%** (or 110% on high-DPI displays for maximum clarity).
   - Close all unnecessary bookmarks, tabs, and personal notifications before recording.
   - Have two browser tabs pre-opened:
     - **Tab 1:** Live StockPulse AI application on the `.run.app` domain.
     - **Tab 2:** Google Cloud Console (Cloud Run service dashboard + Cloud Logging tab).

3. **Audio Quality:**
   - Use a dedicated USB/XLR microphone or crisp headset mic.
   - Keep background noise to zero; apply subtle noise suppression in OBS / Camtasia / Premiere.

4. **Closed Captions & Subtitles:**
   - Upload English `.srt` subtitles or enable and review YouTube’s automated caption transcription to guarantee 100% accessibility.

5. **Upload Timing:**
   - ⚠️ **Upload at least 4–6 hours before the hackathon deadline.** YouTube 4K/1080p processing, copyright scans, and HD generation can take several hours during peak submission periods.
