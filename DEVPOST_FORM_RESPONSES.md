# Devpost Submission Questionnaire & Answers

This file contains the complete, copy-paste-ready responses formatted specifically for all Devpost submission form fields, character limits, and judge criteria.

---

## 📌 1. Project Name (Max 60 characters)
`StockPulse AI - Autonomous Financial Research Terminal`
*(55 characters)*

---

## ⚡ 2. Elevator Pitch (Max 200 characters)
`Autonomous quantitative financial workstation & storytelling engine using Gemini 3.7 Flash, multi-timeframe risk algorithms, institutional slide decks, editorial visual art, and voice briefings.`
*(196 characters)*

---

## 📖 3. Project Story (About the Project)

### Inspiration
Financial market data is notoriously complex, fragmented, and dry. Institutional investors, fund managers, and retail traders spend countless hours every week pulling price time series across multiple platforms, computing statistical indicators by hand, and struggling through information overload to identify genuine market catalysts. Furthermore, traditional financial reports are dense spreadsheets that fail to convey the dynamic, human-driven narrative behind price action.

We were inspired to build **StockPulse AI** to bridge quantitative rigor with multimodal storytelling. We envisioned an **autonomous agentic workstation** where one single user intent or ticker selection orchestrates an entire institutional financial research pipeline: fetching tick-level market data, computing mathematical risk metrics ($SMA$, $RSI$, $MACD$, $Sharpe\ Ratio$, $Drawdowns$), synthesizing high-conviction memos via **Gemini 3.7 Flash**, generating concept art, and presenting broadcast-ready audio briefings.

---

### What it does

StockPulse AI transforms raw market time series into actionable institutional intelligence through four core pillars:

1. **Autonomous 1-Action Executive Presentation Pipeline ("One Intent Does It All"):**
   - Ingests market data, computes deterministic indicators, invokes **Gemini 3.7 Flash** quantitative reasoning, creates high-fidelity financial artwork, structures a multi-slide presentation deck, and delivers an audio briefing.
   - Includes verified milestone step persistence, real-time abort control via `AbortController`, instant step retries, and clear investor playbooks (*Current Holders*, *Potential Buyers*, *Cautious Investors*).

2. **Institutional Quantitative Math & Trader Horizons:**
   - Evaluates multi-timeframe horizons: **Day Trader**, **Weeks Trader**, **Months Trader**, **Long-Term Compounder**, and **Situational/Catalyst Trader**.
   - Calculates 3-tier stop-loss protocols (Tight, Hard, Structural) and staged profit targets based on volatility.
   - Computes moving averages ($SMA_{20}, SMA_{50}, SMA_{200}, EMA_{12}, EMA_{26}$), momentum ($RSI_{14}$, $MACD$), Bollinger Bands, and annualized Sharpe Ratio:
     $$\text{Sharpe Ratio} = \frac{R_p - R_f}{\sigma_p}$$
     where $R_f = 4.5\%$ (Risk-Free Benchmark) and $\sigma_p$ is annualized volatility.

3. **Multimodal Story Studio & Voice Briefing Room:**
   - Crafts multi-chapter market narratives in four distinct narrative tones (*Wall Street Memo*, *Cyberpunk Terminal*, *Renaissance Merchant*, *Documentary Narrator*).
   - Generates editorial concept art and high-fidelity spoken briefings via multi-voice Gemini audio synthesis (*Kore, Puck, Fenrir, Aoede*).

4. **Multi-Turn Quant Copilot & Analyst Dossier:**
   - An interactive conversational assistant with full context of live quotes, moving averages, and technical setups.
   - 1-click export to printable/saveable PDF, structured Markdown, and machine-readable JSON datasets.

5. **Client-Side BYOK Privacy (Bring Your Own Key):**
   - Secure browser-based API key management passing `x-gemini-api-key` headers directly to backend proxies, eliminating server-side credential leakage.

---

### How we built it

- **AI & Reasoning Core:** Built with the new **Google GenAI SDK (`@google/genai`)** utilizing **Gemini 3.7 Flash** for quantitative synthesis and conversational copilot reasoning, alongside Gemini Image models and Gemini TTS preview models.
- **Backend & Cloud Architecture:** Containerized **Express.js (TypeScript)** API proxy running on **Google Cloud Run**, delivering sub-second cold starts, automated SSL, and strict environment variable security.
- **Frontend & Visuals:** **React 19**, **Vite**, and **Tailwind CSS** with high-contrast institutional dark aesthetics, canvas rendering for responsive candlestick charts, and `motion/react` for smooth transitions.
- **Financial Data Ingestion:** Dual-fallback market pipeline supporting Polygon.io, Alpha Vantage, and custom CSV upload parsers for private historical data.

---

### Challenges we ran into

1. **Hallucination Prevention in Financial Math:** LLMs can approximate mathematical indicators inaccurately if asked to calculate them from raw numbers. We solved this by creating a **hybrid algorithmic pipeline**: our deterministic TypeScript engine computes exact mathematical metrics ($SMA$, $RSI$, $MACD$, Sharpe ratios) and feeds the structured telemetry into Gemini 3.7 Flash for qualitative synthesis, ensuring 100% mathematical precision.
2. **Long-Running Pipeline UX & Cancellation:** Running multi-step pipelines (quote $\to$ indicators $\to$ LLM analysis $\to$ image generation $\to$ TTS audio) can leave users stranded if a step hangs. We architected a granular **Action Indicator Context** and integrated native `AbortController` cancellation, allowing users to stop in-flight streams or retry specific failed sub-steps instantly.
3. **Responsive High-Density Financial UI:** Displaying multi-pane candlestick charts, technical indicators, trade tickets, and interactive slide teleprompters on both mobile and desktop screens required custom Tailwind layouts and dynamic canvas resize observers.

---

### Accomplishments that we're proud of

- **True 1-Action Autonomous Workflow:** Delivering a complete institutional slide deck, investment memo, editorial visual, and narrated briefing from a single user click or ticker query.
- **Trader Profile Risk Engine:** Building a deterministic risk system that calculates exact dollar-risk exposure, position sizing, and 3-tier stop-loss limits tailored to individual trader time horizons.
- **Zero-Seed Clean Start Architecture:** Giving users a responsive terminal that starts cleanly with zero hardcoded sample data and works on any global ticker or custom CSV upload.
- **Zero Key Leakage (BYOK):** Giving users full privacy and sovereignty to test and execute models using their own Gemini API keys stored locally in encrypted browser storage.

---

### What we learned

- Grounding **Gemini 3.7 Flash** with pre-computed quantitative telemetry produces institutional-grade research notes that match or exceed traditional sell-side research memos.
- Combining visual concept art, structured data grids, and voice synthesis creates a far more engaging and memorable user experience than standard text-only chatbots.
- Building resilient error boundaries with step-by-step state persistence is essential for real-world agentic workflows.

---

### What's next for StockPulse AI

- **Multi-Asset Portfolio Stress Testing:** Autonomous macroeconomic scenario modeling (e.g., simulating Fed rate shocks or oil price spikes across a 30-stock portfolio).
- **Automated SEC 10-K & 10-Q Parsing:** Agentic retrieval of earnings call transcripts and balance sheet filings for automated fundamental ratios.
- **Real-Time Live WebSockets:** Direct tick-by-tick streaming order book visualization with real-time anomaly detection alerts.

---

## 🏷️ 4. Built With (Up to 25 Tags)

1. `gemini-3.7-flash`
2. `google-genai-sdk`
3. `google-cloud-run`
4. `typescript`
5. `react`
6. `vite`
7. `express`
8. `tailwind-css`
9. `node.js`
10. `financial-analysis`
11. `quantitative-finance`
12. `multimodal-ai`
13. `text-to-speech`
14. `image-generation`
15. `canvas`
16. `lucide-icons`
17. `abort-controller`
18. `rest-api`
19. `polygon-io`
20. `alpha-vantage`
21. `csv-parser`
22. `agentic-ai`
23. `byok-security`
24. `docker`
25. `devpost`

---

## 📋 5. Additional Info for Judges & Organizers

### Sponsor / Special Prizes
- [x] **Select applicable track / prize** (e.g., *The Taskmaster*, *Best Multimodal UX*, *Best Architectural Design*)
- **Startup Excellence:** Opt-in if submitting on behalf of an incorporated entity.

### Submitter Information
- **Submitter Type:** Individual / Team *(Select your choice)*
- **Submitter Country of Residence:** *(Select your country)*
- **Which Category are you submitting to?:** *The Taskmaster* (or applicable category)
- **Organization Name (if applicable):** *(Leave blank if individual, or enter your company name)*
- **Corporate Email (if applicable):** *(Enter corporate email if opting in for Startup Prize)*
- **What date did you start this project?:** `02-15-2025` *(Or your respective hackathon start date during submission period)*

---

### Code Repository & Testing

- **URL to your code repo:** *(Insert your GitHub repository link)*
  - *If private, add collaborators:* `testing@devpost.com` and `cloudhackathons@google.com`
- **Did you add Reproducible Testing instructions to your README?:** `Yes`
- **Hosted Project URL:** 
  `https://ais-dev-422tk3x2p4mrhdymujnkym-14913470979.asia-southeast1.run.app`

---

### Testing Instructions for Judges (Reproducible Steps)

1. **Open the Live Application:** Navigate to the hosted Google Cloud Run URL.
2. **Set Your Gemini API Key (Optional / BYOK):** Click **"Set API Key / BYOK"** in the top navigation bar, enter your Gemini API Key, and click **"Test Connection"** to verify against Gemini 3.7 Flash. (Alternatively, default environment credentials run server-side).
3. **Launch an Equity Analysis:**
   - On the Launchpad, type any global stock ticker (e.g., `NVDA`, `AAPL`, `MSFT`, `TSLA`, `AMD`, `GOOGL`) and press **"Analyze Stock"**, OR click any sector chip in the **Market Universe** tab, OR click **"Upload CSV"** to upload your own price history.
4. **Trigger the 1-Action Autonomous Presentation:**
   - Click the **"Executive Briefing"** button with the sparkle icon on the top right.
   - Watch the autonomous pipeline execute all steps (Market Quote $\to$ Technical Indicators $\to$ Gemini 3.7 Synthesis $\to$ Editorial Artwork $\to$ Slide Generation $\to$ Voice Narration).
   - Use the slide controls, test the **Cancel Pipeline** button, or trigger 1-click step retries.
5. **Explore Trader Horizon Risk Modeling:**
   - Click the **"Position & Risk"** tab. Select different trader profiles (**Day Trader**, **Weeks Trader**, **Months Trader**, **Long-Term**, **Situational**).
   - Review the calculated 3-tier stop losses (Tight, Hard, Structural), staged profit targets, and customized trade tickets.
6. **Test Multimodal Story Studio & Quant Copilot:**
   - Visit the **"Story Studio"** tab to generate multi-chapter financial narratives with AI artwork and TTS narration.
   - Open the **"Quant Copilot"** tab to ask context-aware questions about the active stock setup.
   - Open the **"Analyst Dossier"** tab to export to PDF/Print, Markdown, or JSON.

---

### Google SDKs & Cloud Services Used

- **Which Google SDK did you use?:**
  - [x] `Google GenAI SDK (google-genai)` (`@google/genai` TypeScript SDK)
- **Which Google Cloud Service(s) did you use?:**
  - [x] `Cloud Run` (Containerized production deployment)
- **Which Google AI Models did you use?:**
  - [x] `Gemini 3.7 Flash` (`gemini-3.7-flash` for quantitative reasoning, analyst synthesis, and copilot reasoning)
  - [x] `Gemini Image Generation Model` (for editorial financial artwork)
  - [x] `Gemini TTS Preview Model` (for high-fidelity voice briefing narration)

---

### Architecture Diagram (ASCII / Embeddable)

```
                     ┌─────────────────────────────────────────────────────────┐
                     │                   User / Equity Analyst                 │
                     └────────────────────────────┬────────────────────────────┘
                                                  │
                                                  ▼
                     ┌─────────────────────────────────────────────────────────┐
                     │            StockPulse AI React 19 Frontend              │
                     │  - Clean-Start Launchpad (No Initial Seed Data)         │
                     │  - Candlestick & Technical Indicator Canvas             │
                     │  - Trader Profile Risk Engine (5 Horizons + 3 Stops)    │
                     │  - Autonomous 1-Action Executive Presentation Modal     │
                     │  - Story Studio, Voice Briefing & Quant Copilot         │
                     │  - Client-Side BYOK Encrypted Key Store                 │
                     └────────────────────────────┬────────────────────────────┘
                                                  │ HTTPS / REST (x-gemini-api-key)
                                                  ▼
                     ┌─────────────────────────────────────────────────────────┐
                     │            Google Cloud Run Server (server.ts)          │
                     │  ┌──────────────────────────┐ ┌──────────────────────┐  │
                     │  │ Live Financial Feeds     │ │ Deterministic Engine │  │
                     │  │ (Polygon / Alpha Vantage)│ │ (SMA/EMA/RSI/Sharpe) │  │
                     │  └─────────────┬────────────┘ └──────────┬───────────┘  │
                     └────────────────┼─────────────────────────┼──────────────┘
                                      │                         │
                                      ▼                         ▼
                     ┌─────────────────────────────────────────────────────────┐
                     │           Google Gemini Multi-Model AI Engine           │
                     │  ┌───────────────────────────────────────────────────┐  │
                     │  │ Gemini 3.7 Flash:                                 │  │
                     │  │ - Quantitative Synthesis & Thesis Formation       │  │
                     │  │ - 12-Month Targets, Catalysts, & Risk Mitigation  │  │
                     │  │ - Multi-Turn Quant Copilot Grounded Reasoning     │  │
                     │  └───────────────────────────────────────────────────┘  │
                     │  ┌───────────────────────────────────────────────────┐  │
                     │  │ Gemini Image Models:                              │  │
                     │  │ - Editorial Concept & Financial Story Artwork     │  │
                     │  └───────────────────────────────────────────────────┘  │
                     │  ┌───────────────────────────────────────────────────┐  │
                     │  │ Gemini TTS Preview:                               │  │
                     │  │ - Broadcast-Grade Audio Briefings & Multi-Voices  │  │
                     │  └───────────────────────────────────────────────────┘  │
                     └─────────────────────────────────────────────────────────┘
```
