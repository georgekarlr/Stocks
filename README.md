# StockPulse AI • Autonomous Financial Research & Quantitative Storytelling Terminal

[![Google Cloud Run](https://img.shields.io/badge/Google%20Cloud-Cloud%20Run-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![Gemini 3.7 Flash](https://img.shields.io/badge/Gemini-3.7%20Flash-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**StockPulse AI** is an institutional-grade autonomous financial workstation and multimodal storytelling engine powered by **Gemini 3.7 Flash**, `@google/genai` TypeScript SDK, and **Google Cloud Run**.

---

## ⚡ Quick Links
- **Live Hosted Application:** [StockPulse AI Terminal](https://ais-dev-422tk3x2p4mrhdymujnkym-14913470979.asia-southeast1.run.app)
- **Demo Video Guide & Script:** [`/DEMO_VIDEO_GUIDE.md`](./DEMO_VIDEO_GUIDE.md)
- **Devpost Submission Answers:** [`/DEVPOST_FORM_RESPONSES.md`](./DEVPOST_FORM_RESPONSES.md)
- **Devpost Project Overview:** [`/DEVPOST_SUBMISSION.md`](./DEVPOST_SUBMISSION.md)

---

## 🧪 Reproducible Testing Instructions

Judges and evaluators can verify and test StockPulse AI either directly on the **Hosted Live URL** or locally via **Local Spin-up**.

### Method 1: Testing on the Live Hosted Platform (Fastest / Zero Setup)

1. **Launch the Live Application:**
   Open the deployed Google Cloud Run URL:
   👉 **`https://ais-dev-422tk3x2p4mrhdymujnkym-14913470979.asia-southeast1.run.app`**

2. **(Optional) Configure Bring-Your-Own-Key (BYOK):**
   - Click the **"Set API Key / BYOK"** button in the top navigation bar.
   - Enter your personal Google Gemini API Key and click **"Test Connection"**.
   - A live ping to **Gemini 3.7 Flash** will verify connectivity and store the key securely in browser `localStorage`.
   - *(Note: The backend environment key is also active as default).*

3. **Ingest Market Data (3 Ways):**
   - **Direct Search:** On the Launchpad, enter any global equity ticker (e.g. `NVDA`, `AAPL`, `MSFT`, `TSLA`, `AMD`, `GOOGL`) and click **"Analyze Stock"**.
   - **Market Universe Scanner:** Click the **"Market Universe"** tab in the navbar to scan 50+ equities categorized by sector, with 1-click batch loading (+15 pagination).
   - **Custom CSV Upload:** Click **"Upload CSV"** to ingest custom time-series price data.

4. **Execute the 1-Action Autonomous Presentation Pipeline:**
   - Click the **"Executive Briefing"** button with the sparkle icon on the top right.
   - Observe the 6-step autonomous pipeline:
     1. Quote Ingestion
     2. Technical Indicator Computation ($SMA_{20/50/200}$, $RSI_{14}$, $MACD$, Bollinger Bands, Sharpe Ratio)
     3. Gemini 3.7 Flash Quantitative Synthesis
     4. Editorial Financial Artwork Generation
     5. Executive Slide Deck Structuring
     6. Voice Narration Synthesis
   - Test **In-Flight Cancellation**: Click **"Cancel Pipeline"** at any point to verify immediate `AbortController` cancellation.
   - Test **Step Retries**: Use the 1-click retry button on any step to verify state persistence.

5. **Test Multi-Horizon Trader Risk Engine:**
   - Switch to the **"Position & Risk"** tab.
   - Toggle through the 5 Trader Profiles:
     - **Day Trader** (Intraday momentum, 1.0–2.0 ATR targets, 0.5–1.0 ATR stop)
     - **Weeks Trader** (Swing momentum, multi-week swing targets, 1.5–2.5 ATR stop)
     - **Months Trader** (Intermediate cyclical, major support stops)
     - **Long-Term Compounder** (Multi-quarter investment, 200 SMA structural floor)
     - **Situational / Catalyst Trader** (Event-driven earnings/FDA catalysts)
   - Inspect the automatically calculated **3-Tier Stop Losses** (Tight, Hard, Structural) and staged profit targets.

6. **Test Multimodal Story Studio & Audio Room:**
   - Navigate to the **"Story Studio"** tab. Select narrative styles (*Wall Street Memo*, *Cyberpunk Terminal*, *Renaissance Merchant*, *Documentary Narrator*) and generate episodic chapters with editorial artwork.
   - Navigate to the **"Voice Briefing Room"** tab to test audio playback across 4 Gemini voices (*Kore, Puck, Fenrir, Aoede*).

7. **Test Quant Copilot & Analyst Dossier Export:**
   - Open **"Quant Copilot"** to engage in context-grounded conversational reasoning.
   - Open **"Analyst Dossier"** and test 1-click export to **Print/PDF**, **Markdown**, or **JSON**.

---

### Method 2: Local Spin-up & Reproducible Build

#### Prerequisites
- **Node.js**: `v18.0.0` or higher (`v20+` recommended)
- **npm**: `v9.0.0` or higher
- **Gemini API Key**: ([Get a free key from Google AI Studio](https://aistudio.google.com/app/apikey))

#### Step-by-Step Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/georgekarlr/stockpulse-ai.git
cd stockpulse-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables (Optional - can also use client-side BYOK in UI)
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY if desired:
# GEMINI_API_KEY="AIzaSy..."

# 4. Verify TypeScript compilation and linting
npm run lint

# 5. Build production bundle (Vite + esbuild server bundle)
npm run build

# 6. Start the development server
npm run dev
```

The application dev server will bind to `http://localhost:3000`.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **AI Models** | **Google Gemini 3.7 Flash** (`gemini-3.7-flash`), Gemini Image Models, Gemini TTS Preview |
| **AI SDK** | **`@google/genai` TypeScript SDK** (`^2.4.0`) |
| **Backend** | **Express.js (`4.21`)**, **Node.js**, **Google Cloud Run**, `tsx` |
| **Frontend** | **React 19 (`19.0.1`)**, **TypeScript (`5.8`)**, **Vite (`6.2`)** |
| **Styling & Motion** | **Tailwind CSS (`v4`)**, **`motion/react`**, **Lucide Icons** |
| **Math & Data** | Custom deterministic TypeScript indicator engine, Polygon.io, Alpha Vantage |

---

## 📐 Mathematical Indicator Specifications

StockPulse AI uses deterministic mathematical models before feeding outputs into Gemini 3.7 Flash:

- **Simple Moving Average ($SMA_k$):**
  $$SMA_k = \frac{1}{k}\sum_{i=0}^{k-1} P_{t-i}$$
- **Exponential Moving Average ($EMA_k$):**
  $$EMA_t = P_t \times \left(\frac{2}{k+1}\right) + EMA_{t-1} \times \left(1 - \frac{2}{k+1}\right)$$
- **Relative Strength Index ($RSI_{14}$):**
  $$RSI = 100 - \left(\frac{100}{1 + \frac{\text{Average Gain}}{\text{Average Loss}}}\right)$$
- **Moving Average Convergence Divergence ($MACD$):**
  $$MACD = EMA_{12} - EMA_{26}, \quad \text{Signal} = EMA_9(MACD)$$
- **Annualized Sharpe Ratio:**
  $$\text{Sharpe Ratio} = \frac{R_p - R_f}{\sigma_p}$$
  *(Risk-free benchmark $R_f = 4.5\%$)*

---

## 🛡️ License & Institutional Compliance
- **Platform License:** Institutional CFA Tier-1 Terminal
- **Subscription Identifier:** `subscription_id = 3`
- **Security:** Zero client-side API key leakage with client-side encrypted BYOK headers.
