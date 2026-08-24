import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  BarChart2,
  Layers,
} from 'lucide-react';
import { StockAnalysis, StockStory, StockQuote, TechnicalIndicators, UserProfile } from '../types/stock';

interface AnalystReportsViewProps {
  analysis: StockAnalysis | null;
  story: StockStory | null;
  quote: StockQuote | null;
  technicals: TechnicalIndicators | null;
  userProfile: UserProfile;
  onRunAutonomousWorkflow?: () => void;
}

export const AnalystReportsView: React.FC<AnalystReportsViewProps> = ({
  analysis,
  story,
  quote,
  technicals,
  userProfile,
  onRunAutonomousWorkflow,
}) => {
  const [copied, setCopied] = useState(false);
  const [includeStory, setIncludeStory] = useState(true);
  const [includeTechnicals, setIncludeTechnicals] = useState(true);
  const [includeRisks, setIncludeRisks] = useState(true);

  if (!quote) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center backdrop-blur shadow-2xl max-w-xl mx-auto">
        <FileText className="mx-auto h-12 w-12 text-slate-600 mb-3" />
        <h3 className="text-xl font-bold text-white">No Asset Loaded</h3>
        <p className="text-xs text-slate-400 mt-1">Please select or search a ticker to compile an institutional dossier.</p>
      </div>
    );
  }

  const generateMarkdownReport = () => {
    let md = `# INSTITUTIONAL RESEARCH DOSSIER: ${quote.symbol} (${quote.companyName})\n`;
    md += `**Date:** ${new Date().toISOString().split('T')[0]} | **Prepared by:** ${userProfile.name} (${userProfile.tier} - Sub ID: #${userProfile.subscription_id})\n`;
    md += `**Price:** $${quote.price} (${quote.change >= 0 ? '+' : ''}${quote.changePercent}%) | **Exchange:** ${quote.exchange}\n\n`;

    if (analysis) {
      md += `## 1. EXECUTIVE VERDICT & TARGETS\n`;
      md += `- **Verdict:** ${analysis.verdict} (Conviction: ${analysis.confidenceScore}%)\n`;
      md += `- **12-Month Target Price:** $${analysis.targetPrice}\n`;
      md += `- **Suggested Stop-Loss:** $${analysis.stopLoss}\n\n`;
      md += `### Executive Thesis\n${analysis.executiveSummary}\n\n`;

      if (includeTechnicals) {
        md += `## 2. QUANTITATIVE & TECHNICAL SIGNALS\n`;
        md += `- **RSI (14):** ${technicals?.rsi ?? 'N/A'}\n`;
        md += `- **SMA 20/50/200:** $${technicals?.sma20 ?? 'N/A'} / $${technicals?.sma50 ?? 'N/A'} / $${technicals?.sma200 ?? 'N/A'}\n`;
        md += `- **Annualized Volatility:** ${technicals?.volatility ? (technicals.volatility * 100).toFixed(1) + '%' : 'N/A'}\n`;
        md += `- **Max Drawdown:** ${technicals?.maxDrawdown ? (technicals.maxDrawdown * 100).toFixed(1) + '%' : 'N/A'}\n`;
        md += `- **Sharpe Ratio (Est.):** ${technicals?.sharpeRatio ?? 'N/A'}\n`;
        md += `- **Key Channels:** Support S1: $${analysis.keyPriceLevels?.support1} | Resistance R1: $${analysis.keyPriceLevels?.resistance1}\n\n`;
        md += `### Technical Breakdown\n${analysis.technicalThesis}\n\n`;
      }

      if (analysis.catalysts && analysis.catalysts.length > 0) {
        md += `## 3. KEY CATALYSTS\n`;
        analysis.catalysts.forEach((cat) => {
          md += `- **[${cat.type}] ${cat.title} (${cat.impact} Impact):** ${cat.description}\n`;
        });
        md += `\n`;
      }

      if (includeRisks && analysis.riskFactors && analysis.riskFactors.length > 0) {
        md += `## 4. RISK MATRIX & MITIGATION\n`;
        analysis.riskFactors.forEach((rf) => {
          md += `- **${rf.risk} [${rf.severity} Severity]:** Mitigation: ${rf.mitigation}\n`;
        });
        md += `\n`;
      }

      md += `## 5. ACTIONABLE STRATEGIES\n`;
      md += `- **Short-Term:** ${analysis.actionableRecommendations?.shortTermTrader}\n`;
      md += `- **Long-Term:** ${analysis.actionableRecommendations?.longTermInvestor}\n`;
      md += `- **Defensive:** ${analysis.actionableRecommendations?.defensiveHedging}\n\n`;
    }

    if (includeStory && story) {
      md += `## 6. FINANCIAL NARRATIVE: "${story.title}"\n`;
      md += `*${story.subtitle}* (Genre: ${story.genre})\n\n`;
      story.chapters.forEach((ch) => {
        md += `### Chapter ${ch.chapterNumber}: ${ch.title} (${ch.timeframe})\n`;
        md += `${ch.narrative}\n\n`;
        if (ch.keyQuote) md += `> "${ch.keyQuote}"\n\n`;
      });
    }

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${quote.symbol}_StockPulse_Dossier_${new Date().toISOString().split('T')[0]}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const payload = {
      ticker: quote.symbol,
      quote,
      technicals,
      analysis,
      story,
      metadata: {
        exportedAt: new Date().toISOString(),
        author: userProfile.name,
        subscription_id: userProfile.subscription_id,
        license: userProfile.analystLicense,
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${quote.symbol}_DataAnalyst_Package.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur print:hidden">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Institutional Analyst Dossier</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compiled for <strong>{quote.symbol}</strong> • Ready for PDF export, markdown, or JSON ingestion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onRunAutonomousWorkflow && (
            <button
              onClick={onRunAutonomousWorkflow}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-300 hover:to-blue-400 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>1-Action Voice Presentation</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-cyan-500 transition"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            <Download className="h-4 w-4 text-cyan-400" />
            <span>Markdown</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            <Download className="h-4 w-4 text-purple-400" />
            <span>JSON Dataset</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Rendered Dossier Document */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-12 shadow-2xl text-slate-200 font-sans print:border-none print:bg-white print:text-black">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 print:border-slate-300">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest print:text-blue-600">
                INSTITUTIONAL QUANTITATIVE RESEARCH
              </span>
              <h1 className="text-3xl font-black text-white mt-1 print:text-black">
                {quote.symbol} • {quote.companyName}
              </h1>
            </div>

            <div className="text-right text-xs text-slate-400 print:text-slate-600">
              <div>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>Analyst License: {userProfile.analystLicense}</div>
              <div>Subscription ID: #{userProfile.subscription_id}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            <span className="bg-slate-900 px-3 py-1 rounded-md border border-slate-800 print:bg-slate-100">
              Price: <strong className="text-white print:text-black">${quote.price}</strong> ({quote.change >= 0 ? '+' : ''}{quote.changePercent}%)
            </span>
            <span className="bg-slate-900 px-3 py-1 rounded-md border border-slate-800 print:bg-slate-100">
              52W Range: ${quote.low52} - ${quote.high52}
            </span>
            <span className="bg-slate-900 px-3 py-1 rounded-md border border-slate-800 print:bg-slate-100">
              Exchange: {quote.exchange}
            </span>
          </div>
        </div>

        {/* 1. Verdict & Strategic Targets */}
        {analysis && (
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider print:text-blue-700">
                1. Institutional Verdict & Key Targets
              </h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 print:border-slate-300 print:bg-slate-50">
                  <div className="text-xs text-slate-400">Analyst Recommendation</div>
                  <div className="text-xl font-black text-emerald-400 print:text-emerald-700 mt-1">{analysis.verdict}</div>
                  <div className="text-[11px] text-slate-400">Conviction: {analysis.confidenceScore}%</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 print:border-slate-300 print:bg-slate-50">
                  <div className="text-xs text-slate-400">Target Price (12M)</div>
                  <div className="text-xl font-black text-white print:text-black mt-1">${analysis.targetPrice}</div>
                  <div className="text-[11px] text-emerald-400">
                    +{(((analysis.targetPrice - quote.price) / quote.price) * 100).toFixed(1)}% Upside
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 print:border-slate-300 print:bg-slate-50">
                  <div className="text-xs text-slate-400">Stop-Loss Ceiling</div>
                  <div className="text-xl font-black text-rose-400 print:text-rose-700 mt-1">${analysis.stopLoss}</div>
                  <div className="text-[11px] text-slate-400">Maximum Risk Floor</div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 print:border-slate-200">
                <div className="text-xs font-bold text-slate-300 mb-1 print:text-slate-800">Executive Summary:</div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed print:text-slate-800">{analysis.executiveSummary}</p>
              </div>
            </div>

            {/* Technical Breakdown */}
            <div>
              <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider print:text-blue-700">
                2. Quantitative & Technical Thesis
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed print:text-slate-800">
                {analysis.technicalThesis}
              </p>
            </div>

            {/* Catalysts */}
            {analysis.catalysts && (
              <div>
                <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider print:text-blue-700">
                  3. Key Market Catalysts
                </h3>
                <div className="mt-3 space-y-2">
                  {analysis.catalysts.map((cat, idx) => (
                    <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-xs print:border-slate-200">
                      <span className="font-bold text-white print:text-black">[{cat.type}] {cat.title} ({cat.impact} Impact):</span>{' '}
                      <span className="text-slate-300 print:text-slate-700">{cat.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider print:text-blue-700">
                4. Actionable Strategy & Allocations
              </h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 print:border-slate-200">
                  <span className="font-bold text-cyan-400 print:text-blue-600 block mb-1">Short-Term Traders:</span>
                  <span className="text-slate-300 print:text-slate-700">{analysis.actionableRecommendations?.shortTermTrader}</span>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 print:border-slate-200">
                  <span className="font-bold text-blue-400 print:text-blue-600 block mb-1">Long-Term Investors:</span>
                  <span className="text-slate-300 print:text-slate-700">{analysis.actionableRecommendations?.longTermInvestor}</span>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 print:border-slate-200">
                  <span className="font-bold text-purple-400 print:text-blue-600 block mb-1">Defensive / Hedging:</span>
                  <span className="text-slate-300 print:text-slate-700">{analysis.actionableRecommendations?.defensiveHedging}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Narrative Story Section */}
        {story && (
          <div className="mt-10 border-t border-slate-800 pt-8 print:border-slate-300">
            <h3 className="text-base font-bold text-indigo-400 uppercase tracking-wider print:text-indigo-700">
              5. Financial Narrative: "{story.title}"
            </h3>
            <p className="text-xs italic text-slate-400 mb-4 print:text-slate-600">"{story.subtitle}"</p>

            <div className="space-y-4">
              {story.chapters.map((ch) => (
                <div key={ch.chapterNumber} className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 print:border-slate-200">
                  <h4 className="font-bold text-sm text-white print:text-black mb-1">
                    Chapter {ch.chapterNumber}: {ch.title} ({ch.timeframe})
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed print:text-slate-800">{ch.narrative}</p>
                  {ch.keyQuote && (
                    <div className="mt-2 text-xs italic text-indigo-300 print:text-indigo-800">
                      "{ch.keyQuote}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 border-t border-slate-800 pt-4 text-center text-[10px] text-slate-500 print:border-slate-300 print:text-slate-500">
          Generated via StockPulse AI • Gemini 3.7 Flash Quant Terminal • Proprietary & Confidential Research • Subscription ID: #{userProfile.subscription_id}
        </div>
      </div>
    </div>
  );
};
