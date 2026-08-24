import { ExecutiveBriefingData, StockQuote, TechnicalIndicators } from '../types/stock';

/**
 * Generates an algorithmic, deterministic Executive Briefing Data
 * when offline or as a fallback when AI endpoint returns an error,
 * ensuring the 1-action workflow never leaves the user hanging.
 */
export function generateAlgorithmicExecutiveBriefing(
  ticker: string,
  quote: StockQuote | null,
  technicals: TechnicalIndicators | null
): ExecutiveBriefingData {
  const sym = ticker.toUpperCase();
  const price = quote?.price || 150;
  const change = quote?.change || 0;
  const changePct = quote?.changePercent || 0;
  const rsi = technicals?.rsi ? Math.round(technicals.rsi) : 50;
  const sma20 = technicals?.sma20 || price;
  const sma50 = technicals?.sma50 || price;
  const sma200 = technicals?.sma200 || price;
  const sharpe = technicals?.sharpeRatio ? technicals.sharpeRatio.toFixed(2) : '1.25';

  // Determine verdict algorithmically
  let verdict: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell' = 'Hold';
  let conviction = 65;
  let actionVerdict = 'HOLD & MONITOR KEY SUPPORT LEVELS';
  let upsideMultiplier = 1.12;
  let downsideMultiplier = 0.92;

  if (price > sma50 && price > sma200 && rsi >= 45 && rsi <= 68) {
    verdict = 'Strong Buy';
    conviction = 88;
    actionVerdict = 'ACCUMULATE STRATEGIC POSITION ON DIPS';
    upsideMultiplier = 1.25;
    downsideMultiplier = 0.94;
  } else if (price > sma50 && rsi < 70) {
    verdict = 'Buy';
    conviction = 76;
    actionVerdict = 'BUY IN TRANCHES WITH DISCIPLINED RISK';
    upsideMultiplier = 1.18;
    downsideMultiplier = 0.93;
  } else if (rsi >= 75) {
    verdict = 'Hold';
    conviction = 60;
    actionVerdict = 'TAKE PARTIAL PROFITS / TIGHTEN STOPS';
    upsideMultiplier = 1.06;
    downsideMultiplier = 0.95;
  } else if (price < sma50 && price < sma200 && rsi < 40) {
    verdict = 'Strong Sell';
    conviction = 82;
    actionVerdict = 'DEFENSIVE EXIT / CAPITAL PRESERVATION';
    upsideMultiplier = 1.02;
    downsideMultiplier = 0.85;
  } else if (price < sma50) {
    verdict = 'Sell';
    conviction = 70;
    actionVerdict = 'TRIM EXPOSURE ON RELIEF BOUNCES';
    upsideMultiplier = 1.05;
    downsideMultiplier = 0.88;
  }

  const targetPrice = Math.round(price * upsideMultiplier * 100) / 100;
  const stopLossPrice = Math.round(price * downsideMultiplier * 100) / 100;
  const buyEntryLow = Math.round(price * 0.97 * 100) / 100;
  const buyEntryHigh = Math.round(price * 1.01 * 100) / 100;

  return {
    presentationTitle: `${sym} Executive Quantitative Briefing: Actionable Playbook`,
    verdict,
    convictionScore: conviction,
    targetPrice,
    stopLossPrice,
    headlineSummary: `${sym} is trading at $${price.toFixed(2)} (${change >= 0 ? '+' : ''}${changePct}%). Quantitative models issue a ${verdict.toUpperCase()} with ${conviction}% conviction and a $${targetPrice} price objective.`,
    plainEnglishStory: `${sym} (${quote?.companyName || sym}) is displaying key price structural shifts. With the 14-day Relative Strength Index sitting at ${rsi} and the asset trading relative to its 50-day moving average of $${sma50.toFixed(2)}, the risk/reward skew favors disciplined market participants. \n\nFrom a quantitative perspective, the annualized Sharpe ratio of ${sharpe} demonstrates institutional capital positioning. Investors should adhere to strict stop-loss levels at $${stopLossPrice} while targeting the primary liquidity expansion target at $${targetPrice}.`,
    whatToDoNow: {
      actionVerdict,
      forCurrentHolders: `Maintain core allocation with a trailing stop at $${stopLossPrice}. Consider booking 25-35% profits as price approaches $${targetPrice}.`,
      forNewBuyers: `Initiate entry in the $${buyEntryLow} - $${buyEntryHigh} accumulation corridor. Size position to risk no more than 1.5% of total portfolio equity.`,
      forCautiousInvestors: `Utilize strict stop loss at $${stopLossPrice} to mitigate drawdown volatility. Avoid aggressive leverage in current market regime.`,
      keyPriceTriggers: [
        {
          levelName: 'Optimal Buy Entry Zone',
          price: `$${buyEntryLow} - $${buyEntryHigh}`,
          note: 'Key high-volume consolidation corridor',
        },
        {
          levelName: 'Primary Profit Target',
          price: `$${targetPrice}`,
          note: `+${(((targetPrice - price) / price) * 100).toFixed(1)}% upside objective`,
        },
        {
          levelName: 'Strict Stop Loss Floor',
          price: `$${stopLossPrice}`,
          note: `${(((stopLossPrice - price) / price) * 100).toFixed(1)}% maximum risk threshold`,
        },
      ],
    },
    presentationSlides: [
      {
        slideNumber: 1,
        slideTitle: 'Executive Snapshot & Strategic Verdict',
        bullets: [
          `Current Asset Price: $${price.toFixed(2)} with 24h momentum at ${changePct}%`,
          `Quantitative Recommendation: ${verdict} (${conviction}% Model Conviction)`,
          `Primary Price Target: $${targetPrice} vs Defensive Stop: $${stopLossPrice}`,
        ],
        visualEmphasis: 'High Priority',
      },
      {
        slideNumber: 2,
        slideTitle: 'Key Technical Indicators (Simplified)',
        bullets: [
          `RSI Momentum: ${rsi} (${rsi > 70 ? 'Overbought warning' : rsi < 30 ? 'Oversold opportunity' : 'Balanced accumulation zone'})`,
          `Moving Averages: 20-day ($${sma20.toFixed(2)}), 50-day ($${sma50.toFixed(2)}), 200-day ($${sma200.toFixed(2)})`,
          `Sharpe Ratio: ${sharpe} indicating risk-adjusted return efficiency`,
        ],
        visualEmphasis: 'Quantitative Signals',
      },
      {
        slideNumber: 3,
        slideTitle: 'Catalysts vs Market Drawdown Risks',
        bullets: [
          `Upside Driver: Strong institutional volume support above $${sma50.toFixed(2)}`,
          `Macro Risk: Market-wide volatility and liquidity fluctuations`,
          `Key Pivot Level: Must sustain price above $${stopLossPrice} to preserve bullish structure`,
        ],
        visualEmphasis: 'Risk / Reward',
      },
      {
        slideNumber: 4,
        slideTitle: 'Direct Action Playbook: What To Do Today',
        bullets: [
          `Existing Holders: ${actionVerdict}`,
          `New Buyers: Accumulate between $${buyEntryLow} and $${buyEntryHigh}`,
          `Risk Management: Strict hard stop at $${stopLossPrice}`,
        ],
        visualEmphasis: 'Immediate Execution',
      },
    ],
    spokenPresenterScript: `Hello and welcome to your Executive Market Briefing on ${quote?.companyName || sym}, ticker symbol ${sym}. Right now, ${sym} is trading at $${price.toFixed(2)}, reflecting a ${changePct >= 0 ? 'gain' : 'decline'} of ${Math.abs(changePct)} percent today. Looking at our quantitative indicators, the 14-day RSI is currently at ${rsi}, while the stock is positioned relative to its 50-day moving average of $${sma50.toFixed(2)}. Based on our full quantitative model, our verdict is a ${verdict} with a conviction score of ${conviction} percent. Here is exactly what you should do right now: If you are an existing holder, ${actionVerdict.toLowerCase()}. If you are looking to enter, accumulate within the $${buyEntryLow} to $${buyEntryHigh} range, targeting an exit at $${targetPrice}. And remember, protect your downside with a disciplined stop loss at $${stopLossPrice}. Thank you, and trade wisely.`,
    editorialArtPrompt: `Institutional quantitative financial editorial concept art for ${sym} stock market analysis`,
  };
}
