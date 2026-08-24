import {
  TradePosition,
  PositionAnalysisResult,
  StockQuote,
  TechnicalIndicators,
  TraderProfile,
  StopLossLevel,
  TakeProfitLevel,
  BuySellTimingAnalysis,
  BuySellCondition,
  TargetSellZone,
  StrategyChecklistItem,
} from '../types/stock';

export const TRADER_PROFILES: {
  id: TraderProfile;
  label: string;
  shortLabel: string;
  horizon: string;
  typicalHold: string;
  riskTolerance: string;
  description: string;
  iconName: string;
}[] = [
  {
    id: 'day_trader',
    label: 'Day Trader (Intraday / Scalp)',
    shortLabel: 'Day Trader',
    horizon: 'Minutes to Hours',
    typicalHold: 'Same Day Close',
    riskTolerance: '1.0% - 2.5% Strict',
    description: 'Fast-paced execution, tight momentum stops, intraday VWAP/RSI triggers, zero overnight gap risk.',
    iconName: 'Zap',
  },
  {
    id: 'weeks_trader',
    label: 'Weeks Trader (Swing 1-4 Weeks)',
    shortLabel: 'Weeks Swing',
    horizon: '1 to 4 Weeks',
    typicalHold: '5 - 20 Trading Days',
    riskTolerance: '3.5% - 7.0% Balanced',
    description: 'Captures cyclical momentum swings, 20-day SMA bounces, earnings breakouts, and 1:2.5+ risk-reward setups.',
    iconName: 'TrendingUp',
  },
  {
    id: 'months_trader',
    label: 'Months Trader (Position 1-6 Months)',
    shortLabel: 'Months Position',
    horizon: '1 to 6 Months',
    typicalHold: '1 - 2 Quarters',
    riskTolerance: '8.0% - 15.0% Moderate',
    description: 'Focuses on 50-day & 200-day moving average expansions, macroeconomic trends, and multi-quarter revenue catalysts.',
    iconName: 'Layers',
  },
  {
    id: 'long_term',
    label: 'Long-Term Investor (1+ Years)',
    shortLabel: 'Long-Term',
    horizon: '1 to 5+ Years',
    typicalHold: 'Multi-Year Growth',
    riskTolerance: '15.0% - 25.0% Wide Support',
    description: 'Fundamental valuation, competitive moats, DCA accumulation, dividend reinvestment, and secular macro megatrends.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'situational',
    label: 'Adaptive / Situational (Regime Dependent)',
    shortLabel: 'Situational',
    horizon: 'Dynamic Horizon',
    typicalHold: 'Regime Dependent',
    riskTolerance: 'Volatility Adjusted',
    description: 'Automatically adjusts stop loss and profit targets dynamically based on real-time market volatility and RSI conditions.',
    iconName: 'Compass',
  },
];

export function calculatePositionAnalysis(
  position: TradePosition,
  quote: StockQuote | null,
  technicals: TechnicalIndicators | null
): PositionAnalysisResult {
  const isBuy = position.positionType === 'BUY';
  const entry = position.entryPrice > 0 ? position.entryPrice : 100;
  const current = quote?.price && quote.price > 0 ? quote.price : entry;
  const shares = position.shares > 0 ? position.shares : 10;
  const costBasis = entry * shares;
  const currentValue = current * shares;

  // Calculate P&L
  const unrealizedPnL = isBuy
    ? (current - entry) * shares
    : (entry - current) * shares;
  
  const unrealizedPnLPct = isBuy
    ? ((current - entry) / entry) * 100
    : ((entry - current) / entry) * 100;

  // Profile-specific parameters
  let stopLossPct = 5.0;
  let tp1Pct = 6.0;
  let tp2Pct = 14.0;
  let tp3Pct = 25.0;
  let trailingDistPct = 3.5;
  let primaryStopReason = '';
  let primaryProfitReason = '';

  const rsi = technicals?.rsi || 50;
  const sma20 = technicals?.sma20 || entry;
  const sma50 = technicals?.sma50 || entry;
  const sma200 = technicals?.sma200 || entry;
  const support1 = technicals?.supportLevel || entry * 0.95;
  const resistance1 = technicals?.resistanceLevel || entry * 1.08;

  switch (position.traderProfile) {
    case 'day_trader':
      stopLossPct = 1.8;
      tp1Pct = 2.5;
      tp2Pct = 4.8;
      tp3Pct = 7.5;
      trailingDistPct = 1.2;
      primaryStopReason = `Intraday breakdown threshold below immediate support zone ($${(entry * (isBuy ? 0.982 : 1.018)).toFixed(2)}).`;
      primaryProfitReason = `Intraday liquidity expansion and momentum exhaustion zone.`;
      break;

    case 'weeks_trader':
      stopLossPct = 4.5;
      tp1Pct = 7.5;
      tp2Pct = 15.0;
      tp3Pct = 24.0;
      trailingDistPct = 3.8;
      primaryStopReason = `Technical swing invalidation below the 20-day moving average ($${sma20.toFixed(2)}) and support corridor ($${support1.toFixed(2)}).`;
      primaryProfitReason = `Key structural swing resistance zone and Fibonacci 1.618 extension target.`;
      break;

    case 'months_trader':
      stopLossPct = 10.0;
      tp1Pct = 16.0;
      tp2Pct = 32.0;
      tp3Pct = 50.0;
      trailingDistPct = 7.5;
      primaryStopReason = `Medium-term regime breakdown below the 50-day moving average ($${sma50.toFixed(2)}).`;
      primaryProfitReason = `Quarterly institutional earnings expansion and multi-month trend target ($${resistance1.toFixed(2)}).`;
      break;

    case 'long_term':
      stopLossPct = 18.0;
      tp1Pct = 30.0;
      tp2Pct = 65.0;
      tp3Pct = 110.0;
      trailingDistPct = 12.0;
      primaryStopReason = `Fundamental thesis invalidation and secular breakdown below the 200-day SMA ($${sma200.toFixed(2)}).`;
      primaryProfitReason = `Long-term valuation multiple expansion and fundamental intrinsic fair value.`;
      break;

    case 'situational':
    default: {
      const vol = technicals?.volatility ? Math.min(technicals.volatility * 100, 40) : 22;
      stopLossPct = Math.max(2.5, Math.min(12, vol * 0.25));
      tp1Pct = stopLossPct * 1.6;
      tp2Pct = stopLossPct * 3.0;
      tp3Pct = stopLossPct * 5.0;
      trailingDistPct = stopLossPct * 0.75;
      primaryStopReason = `Regime-adaptive volatility barrier calibrated to ${vol.toFixed(1)}% annualized price variance.`;
      primaryProfitReason = `Risk-adjusted volatility expansion channel target.`;
      break;
    }
  }

  // Calculate Stop Loss Prices
  const recommendedStopPrice = isBuy
    ? Math.round(entry * (1 - stopLossPct / 100) * 100) / 100
    : Math.round(entry * (1 + stopLossPct / 100) * 100) / 100;

  const maxCapitalRisk = Math.abs(entry - recommendedStopPrice) * shares;

  // Calculate Stop Loss Levels
  const tightStopPrice = isBuy
    ? Math.round(entry * (1 - (stopLossPct * 0.6) / 100) * 100) / 100
    : Math.round(entry * (1 + (stopLossPct * 0.6) / 100) * 100) / 100;

  const structuralStopPrice = isBuy
    ? Math.round(Math.min(recommendedStopPrice, support1) * 100) / 100
    : Math.round(Math.max(recommendedStopPrice, resistance1) * 100) / 100;

  const stopLossLevels: StopLossLevel[] = [
    {
      label: 'Tight Intraday/Momentum Stop',
      price: tightStopPrice,
      downsidePct: Math.round(stopLossPct * 0.6 * 10) / 10,
      potentialLossAmount: Math.round(Math.abs(entry - tightStopPrice) * shares * 100) / 100,
      triggerCondition: isBuy
        ? `If price drops below $${tightStopPrice.toFixed(2)} on high volume, exit 50% immediately to preserve capital.`
        : `If price spikes above $${tightStopPrice.toFixed(2)}, cover 50% immediately.`,
      isTight: true,
    },
    {
      label: 'Core Strategy Stop-Loss (Hard Exit)',
      price: recommendedStopPrice,
      downsidePct: stopLossPct,
      potentialLossAmount: Math.round(maxCapitalRisk * 100) / 100,
      triggerCondition: isBuy
        ? `Mandatory 100% position liquidation if daily candle closes below $${recommendedStopPrice.toFixed(2)}.`
        : `Mandatory 100% short cover if daily candle closes above $${recommendedStopPrice.toFixed(2)}.`,
      isTight: false,
    },
    {
      label: 'Structural Key Support/Floor Stop',
      price: structuralStopPrice,
      downsidePct: Math.round(Math.abs(((structuralStopPrice - entry) / entry) * 100) * 10) / 10,
      potentialLossAmount: Math.round(Math.abs(entry - structuralStopPrice) * shares * 100) / 100,
      triggerCondition: `Major pivot level breakdown. Violating $${structuralStopPrice.toFixed(2)} destroys the prevailing bull structure.`,
      isTight: false,
    },
  ];

  // Calculate Take Profit Prices
  const tp1Price = isBuy
    ? Math.round(entry * (1 + tp1Pct / 100) * 100) / 100
    : Math.round(entry * (1 - tp1Pct / 100) * 100) / 100;

  const tp2Price = isBuy
    ? Math.round(entry * (1 + tp2Pct / 100) * 100) / 100
    : Math.round(entry * (1 - tp2Pct / 100) * 100) / 100;

  const tp3Price = isBuy
    ? Math.round(entry * (1 + tp3Pct / 100) * 100) / 100
    : Math.round(entry * (1 - tp3Pct / 100) * 100) / 100;

  const takeProfitLevels: TakeProfitLevel[] = [
    {
      levelNumber: 1,
      label: 'TP 1: Conservative Milestone (De-risk)',
      targetPrice: tp1Price,
      upsidePct: tp1Pct,
      suggestedAction: 'Sell / Cover 30% - 40% of shares and move stop-loss to Breakeven ($' + entry.toFixed(2) + ').',
      riskRewardRatio: `1:${(tp1Pct / stopLossPct).toFixed(1)}`,
    },
    {
      levelNumber: 2,
      label: 'TP 2: Core Price Objective (Main Target)',
      targetPrice: tp2Price,
      upsidePct: tp2Pct,
      suggestedAction: 'Sell / Cover next 40% of shares to secure substantial realized gains.',
      riskRewardRatio: `1:${(tp2Pct / stopLossPct).toFixed(1)}`,
    },
    {
      levelNumber: 3,
      label: 'TP 3: Trend Runner (Max Upside Expansion)',
      targetPrice: tp3Price,
      upsidePct: tp3Pct,
      suggestedAction: 'Keep remaining 20% position with a dynamic trailing stop (' + trailingDistPct + '% distance).',
      riskRewardRatio: `1:${(tp3Pct / stopLossPct).toFixed(1)}`,
    },
  ];

  // Evaluate Risk-to-Reward Ratio (Core target TP2 vs Stop Loss)
  const riskRewardRatio = Math.round((tp2Pct / stopLossPct) * 10) / 10;
  let riskRewardAssessment: PositionAnalysisResult['riskRewardAssessment'] = 'Moderate (2:1)';
  if (riskRewardRatio >= 3.0) {
    riskRewardAssessment = 'Favorable (3:1+)';
  } else if (riskRewardRatio >= 2.0) {
    riskRewardAssessment = 'Moderate (2:1)';
  } else if (riskRewardRatio >= 1.4) {
    riskRewardAssessment = 'Marginal (1:1.5)';
  } else {
    riskRewardAssessment = 'Unfavorable (<1.5:1)';
  }

  // Evaluate Trade Status & Health Score
  let tradeStatus: PositionAnalysisResult['tradeStatus'] = 'Near Breakeven';
  let tradeHealthScore = 70;

  if (unrealizedPnLPct >= tp2Pct * 0.8) {
    tradeStatus = 'Strong Profit';
    tradeHealthScore = 95;
  } else if (unrealizedPnLPct >= tp1Pct * 0.5) {
    tradeStatus = 'Modest Profit';
    tradeHealthScore = 85;
  } else if (unrealizedPnLPct <= -stopLossPct * 0.85) {
    tradeStatus = 'Critical Stop Zone';
    tradeHealthScore = 25;
  } else if (unrealizedPnLPct <= -stopLossPct * 0.4) {
    tradeStatus = 'Moderate Loss';
    tradeHealthScore = 50;
  } else {
    tradeStatus = 'Near Breakeven';
    tradeHealthScore = 72;
  }

  // Exact Action Protocols
  const isCurrentlyInProfit = unrealizedPnLPct > 0;
  let exactStopLossProtocol = '';
  let exactTakeProfitProtocol = '';

  if (isCurrentlyInProfit) {
    if (unrealizedPnLPct >= tp1Pct) {
      exactStopLossProtocol = `🛡️ PROTECT PROFITS: Your position is up +${unrealizedPnLPct.toFixed(1)}%! Immediately raise your stop loss to BREAKEVEN at $${entry.toFixed(2)} or lock in guaranteed profit at $${(entry * (isBuy ? 1.02 : 0.98)).toFixed(2)}. Do NOT allow a winning trade to turn into a loss.`;
      exactTakeProfitProtocol = `🎯 SCALE OUT GAINS: Take Profit 1 ($${tp1Price.toFixed(2)}) is active. Sell 35% of your shares now to lock in $${Math.round((tp1Price - entry) * shares * 0.35)} in cash profit, letting the rest run toward TP2 ($${tp2Price.toFixed(2)}).`;
    } else {
      exactStopLossProtocol = `🛡️ TRAILING DEFENSE: Position is up +${unrealizedPnLPct.toFixed(1)}%. Maintain your initial stop loss at $${recommendedStopPrice.toFixed(2)}, and prepare to move to breakeven once price crosses $${tp1Price.toFixed(2)}.`;
      exactTakeProfitProtocol = `🎯 HOLD FOR MILESTONE: Position is developing nicely. Keep target orders set at TP1 ($${tp1Price.toFixed(2)}) and TP2 ($${tp2Price.toFixed(2)}).`;
    }
  } else {
    if (unrealizedPnLPct <= -stopLossPct) {
      exactStopLossProtocol = `🚨 STOP LOSS TRIGGERED: Price has breached your recommended stop level of $${recommendedStopPrice.toFixed(2)} (-${Math.abs(unrealizedPnLPct).toFixed(1)}%). EXECUTE DISCIPLINED EXIT NOW to prevent catastrophic drawdown. Capital preservation is priority #1.`;
      exactTakeProfitProtocol = `⚠️ DEFENSIVE RECOVERY: Do NOT average down on a failing setup. If a technical bounce occurs toward $${entry.toFixed(2)}, trim risk immediately.`;
    } else {
      exactStopLossProtocol = `🛡️ ACTIVE RISK BUFFER: Position is currently at ${unrealizedPnLPct.toFixed(1)}% vs. maximum tolerated stop at $${recommendedStopPrice.toFixed(2)} (-${stopLossPct}% / -$${maxCapitalRisk.toFixed(0)} max risk). If price closes below $${recommendedStopPrice.toFixed(2)}, close the position without hesitation.`;
      exactTakeProfitProtocol = `🎯 TARGET ROADMAP: Maintain disciplined patience while price remains above the $${recommendedStopPrice.toFixed(2)} stop. Initial profit target is $${tp1Price.toFixed(2)}.`;
    }
  }

  // Profile-specific guidance
  let tailoredGuidanceForProfile = '';
  switch (position.traderProfile) {
    case 'day_trader':
      tailoredGuidanceForProfile = `As a Day Trader, speed is your edge. Never hold this trade overnight if it reaches your stop of $${recommendedStopPrice.toFixed(2)}. Look for intraday momentum exhaustion around $${tp1Price.toFixed(2)} to lock in rapid returns.`;
      break;
    case 'weeks_trader':
      tailoredGuidanceForProfile = `As a Weeks/Swing Trader, give this position room to breathe around daily moving averages. Respect the $${recommendedStopPrice.toFixed(2)} swing low stop. Use Fibonacci extension at $${tp2Price.toFixed(2)} as your primary exit.`;
      break;
    case 'months_trader':
      tailoredGuidanceForProfile = `As a Months/Position Trader, filter out intraday noise. Monitor the weekly close relative to the 50-day moving average. Ride the quarterly expansion toward $${tp2Price.toFixed(2)}.`;
      break;
    case 'long_term':
      tailoredGuidanceForProfile = `As a Long-Term Investor, your edge is time and compounding. Short-term volatility between $${recommendedStopPrice.toFixed(2)} and $${entry.toFixed(2)} is a Dollar-Cost-Averaging opportunity unless fundamental earnings breakdown.`;
      break;
    case 'situational':
    default:
      tailoredGuidanceForProfile = `Based on current market volatility and RSI readings, keep dynamic trailing stops active. Scale out incrementally at each Take Profit level.`;
      break;
  }

  const aiDiagnosis = `${position.symbol} ${position.positionType} position entered at $${entry.toFixed(2)} is currently trading at $${current.toFixed(2)} (${unrealizedPnLPct >= 0 ? '+' : ''}${unrealizedPnLPct.toFixed(2)}% P&L). With a ${riskRewardAssessment} Risk-to-Reward profile of ${riskRewardRatio}:1, the optimal stop-loss is calibrated at $${recommendedStopPrice.toFixed(2)} and primary profit target at $${tp2Price.toFixed(2)}.`;

  return {
    symbol: position.symbol.toUpperCase(),
    positionType: position.positionType,
    entryPrice: entry,
    currentPrice: current,
    shares,
    costBasis: Math.round(costBasis * 100) / 100,
    currentValue: Math.round(currentValue * 100) / 100,
    unrealizedPnL: Math.round(unrealizedPnL * 100) / 100,
    unrealizedPnLPct: Math.round(unrealizedPnLPct * 100) / 100,
    tradeHealthScore,
    tradeStatus,
    traderProfile: position.traderProfile,
    whenToStopLoss: {
      recommendedStopPrice,
      recommendedDownsidePct: stopLossPct,
      maxCapitalRisk: Math.round(maxCapitalRisk * 100) / 100,
      trailingStopDistancePct: trailingDistPct,
      primaryStopReason,
      exactActionProtocol: exactStopLossProtocol,
      levels: stopLossLevels,
    },
    whenToTakeProfit: {
      recommendedExitPrice: tp2Price,
      expectedGainAmount: Math.round(Math.abs(tp2Price - entry) * shares * 100) / 100,
      primaryProfitReason,
      exactActionProtocol: exactTakeProfitProtocol,
      levels: takeProfitLevels,
    },
    riskRewardRatio,
    riskRewardAssessment,
    aiDiagnosis,
    tailoredGuidanceForProfile,
  };
}

/**
 * Option 1: Analyzes optimal timing for WHEN TO BUY and WHEN TO SELL
 * tailored to the user's trading horizon / style profile.
 */
export function calculateBuySellTimingAnalysis(
  symbol: string,
  quote: StockQuote | null,
  technicals: TechnicalIndicators | null,
  profile: TraderProfile
): BuySellTimingAnalysis {
  const current = quote?.price && quote.price > 0 ? quote.price : 100;
  const rsi = technicals?.rsi ?? 52;
  const sma20 = technicals?.sma20 ?? current * 0.98;
  const sma50 = technicals?.sma50 ?? current * 0.95;
  const sma200 = technicals?.sma200 ?? current * 0.90;
  const support = technicals?.supportLevel ?? current * 0.94;
  const resistance = technicals?.resistanceLevel ?? current * 1.08;
  const isAboveSma20 = current >= sma20;
  const isAboveSma50 = current >= sma50;
  const isAboveSma200 = current >= sma200;
  const macdPositive = technicals?.macd ? technicals.macd.histogram > 0 : true;

  // Profile-specific horizon parameters
  let horizonLabel = '1-4 Weeks';
  let dipDiscountPct = 2.5;
  let breakoutThresholdPct = 1.2;
  let target1Pct = 6.0;
  let target2Pct = 14.0;
  let target3Pct = 25.0;
  let stopFloorPct = 4.5;
  let timeEst1 = '3-7 Days';
  let timeEst2 = '2-4 Weeks';
  let timeEst3 = '1-2 Months';

  switch (profile) {
    case 'day_trader':
      horizonLabel = 'Intraday (Hours)';
      dipDiscountPct = 0.8;
      breakoutThresholdPct = 0.5;
      target1Pct = 2.2;
      target2Pct = 4.5;
      target3Pct = 7.5;
      stopFloorPct = 1.8;
      timeEst1 = '1-2 Hours';
      timeEst2 = '4-6 Hours';
      timeEst3 = 'Session Close';
      break;

    case 'weeks_trader':
      horizonLabel = '1 to 4 Weeks';
      dipDiscountPct = 2.8;
      breakoutThresholdPct = 1.5;
      target1Pct = 7.5;
      target2Pct = 15.0;
      target3Pct = 25.0;
      stopFloorPct = 4.5;
      timeEst1 = '3-7 Days';
      timeEst2 = '2-3 Weeks';
      timeEst3 = '4-6 Weeks';
      break;

    case 'months_trader':
      horizonLabel = '1 to 6 Months';
      dipDiscountPct = 5.5;
      breakoutThresholdPct = 2.5;
      target1Pct = 15.0;
      target2Pct = 30.0;
      target3Pct = 48.0;
      stopFloorPct = 9.0;
      timeEst1 = '3-5 Weeks';
      timeEst2 = '2-3 Months';
      timeEst3 = '4-6 Months';
      break;

    case 'long_term':
      horizonLabel = '1+ Years';
      dipDiscountPct = 10.0;
      breakoutThresholdPct = 4.0;
      target1Pct = 28.0;
      target2Pct = 60.0;
      target3Pct = 100.0;
      stopFloorPct = 16.0;
      timeEst1 = '3-6 Months';
      timeEst2 = '1-2 Years';
      timeEst3 = '3-5 Years';
      break;

    case 'situational':
    default: {
      const vol = technicals?.volatility ? Math.min(technicals.volatility * 100, 35) : 22;
      dipDiscountPct = Math.max(1.5, vol * 0.15);
      breakoutThresholdPct = Math.max(0.8, vol * 0.08);
      target1Pct = Math.max(3.5, vol * 0.35);
      target2Pct = Math.max(7.0, vol * 0.7);
      target3Pct = Math.max(12.0, vol * 1.2);
      stopFloorPct = Math.max(2.0, vol * 0.22);
      break;
    }
  }

  // Determine Timing Verdict & Score
  let timingVerdict: BuySellTimingAnalysis['timingVerdict'] = 'Optimal Buy Zone';
  let timingScore = 75;
  let conviction: BuySellTimingAnalysis['conviction'] = 'Medium';
  let summaryHeadline = '';

  if (rsi > 72 || (current > sma20 * 1.12 && isAboveSma50)) {
    timingVerdict = 'Overbought - Prepare to Sell / Take Profit';
    timingScore = 32;
    conviction = 'High';
    summaryHeadline = `${symbol} is in extreme overbought territory (RSI: ${rsi.toFixed(1)}). Favorable for locking in gains or waiting for mean reversion.`;
  } else if (current >= resistance * 0.985 && current <= resistance * 1.02) {
    timingVerdict = 'Range-Bound / Breakout Watch';
    timingScore = 65;
    conviction = 'Medium';
    summaryHeadline = `${symbol} is testing major overhead resistance at $${resistance.toFixed(2)}. Watch for high-volume breakout before entering.`;
  } else if (!isAboveSma50 && !isAboveSma200 && rsi < 42) {
    timingVerdict = 'Short / Breakdown Sell';
    timingScore = 28;
    conviction = 'High';
    summaryHeadline = `${symbol} is in a macro downtrend below 50 & 200 SMAs. High vulnerability to further selling pressure.`;
  } else if (current > sma20 * 1.04 && rsi >= 60 && rsi <= 72) {
    timingVerdict = 'Wait For Pullback / Dip';
    timingScore = 58;
    conviction = 'Medium';
    summaryHeadline = `${symbol} is trending upward but currently extended above the 20-day average. Optimal entry is on a minor pullback to $${(current * (1 - dipDiscountPct / 100)).toFixed(2)}.`;
  } else {
    timingVerdict = 'Optimal Buy Zone';
    timingScore = 88;
    conviction = 'High';
    summaryHeadline = `${symbol} shows high-probability accumulation characteristics near key support ($${support.toFixed(2)}) with healthy momentum indicators.`;
  }

  // Calculate Price Trigger Zones
  const dipBuyPrice = Math.round(Math.max(support, current * (1 - dipDiscountPct / 100)) * 100) / 100;
  const entryMin = Math.round(Math.min(dipBuyPrice, current * 0.99) * 100) / 100;
  const entryMax = Math.round(Math.max(current * 1.005, dipBuyPrice * 1.015) * 100) / 100;
  const breakoutTrigger = Math.round(Math.max(resistance * 1.005, current * (1 + breakoutThresholdPct / 100)) * 100) / 100;
  const buyInvalidationPrice = Math.round((entryMin * (1 - stopFloorPct / 100)) * 100) / 100;

  // Buy Conditions Check
  const requiredBuyConditions: BuySellCondition[] = [
    {
      indicator: 'RSI Momentum Buffer',
      condition: 'RSI between 35 and 62 (Not overbought)',
      status: rsi >= 35 && rsi <= 62 ? 'MET' : rsi > 62 ? 'WARNING' : 'PENDING',
    },
    {
      indicator: 'Trend Alignment (SMA 20)',
      condition: `Price above or holding 20-day SMA ($${sma20.toFixed(2)})`,
      status: isAboveSma20 ? 'MET' : 'PENDING',
    },
    {
      indicator: 'MACD Momentum Confirmation',
      condition: 'MACD histogram positive or crossing bullish',
      status: macdPositive ? 'MET' : 'PENDING',
    },
    {
      indicator: 'Support Floor Validation',
      condition: `Holding above structural support at $${support.toFixed(2)}`,
      status: current >= support ? 'MET' : 'WARNING',
    },
  ];

  // Target Sell Zones (TP1, TP2, TP3)
  const tp1 = Math.round(current * (1 + target1Pct / 100) * 100) / 100;
  const tp2 = Math.round(current * (1 + target2Pct / 100) * 100) / 100;
  const tp3 = Math.round(current * (1 + target3Pct / 100) * 100) / 100;

  const targetSellZones: TargetSellZone[] = [
    {
      label: 'Stage 1: De-Risk / Initial Take-Profit',
      targetPrice: tp1,
      upsidePct: target1Pct,
      rationale: `First structural resistance zone. Lock in 30%-40% of position and move stop to Breakeven.`,
      estimatedTimeframe: timeEst1,
    },
    {
      label: 'Stage 2: Core Strategy Price Objective',
      targetPrice: tp2,
      upsidePct: target2Pct,
      rationale: `Key Fibonacci extension & major institutional liquidity target. Realize main gains.`,
      estimatedTimeframe: timeEst2,
    },
    {
      label: 'Stage 3: Trend Runner / Blue Sky Expansion',
      targetPrice: tp3,
      upsidePct: target3Pct,
      rationale: `Multi-period expansion target. Trail remaining 20% shares with dynamic ATR stop.`,
      estimatedTimeframe: timeEst3,
    },
  ];

  // Sell Conditions Check
  const requiredSellConditions: BuySellCondition[] = [
    {
      indicator: 'Overbought Exhaustion',
      condition: 'RSI crosses above 75 or prints bearish divergence',
      status: rsi >= 75 ? 'MET' : 'PENDING',
    },
    {
      indicator: 'Target Milestone Reached',
      condition: `Price approaches or touches Target 1 ($${tp1.toFixed(2)}) or Target 2 ($${tp2.toFixed(2)})`,
      status: current >= tp1 ? 'MET' : 'PENDING',
    },
    {
      indicator: 'Trendline Breakdown',
      condition: `Daily close below 20-day SMA ($${sma20.toFixed(2)}) or Stop level ($${buyInvalidationPrice.toFixed(2)})`,
      status: !isAboveSma20 ? 'WARNING' : 'PENDING',
    },
  ];

  // Checklist
  const checklist: StrategyChecklistItem[] = [
    {
      item: 'Favorable Risk-to-Reward Ratio (>= 2.0:1)',
      description: `Target 2 ($${tp2.toFixed(2)} / +${target2Pct}%) vs Stop Loss ($${buyInvalidationPrice.toFixed(2)} / -${stopFloorPct}%) yields a ${(target2Pct / stopFloorPct).toFixed(1)}:1 R:R ratio.`,
      passed: target2Pct / stopFloorPct >= 2.0,
    },
    {
      item: 'Support Buffer Clearance',
      description: `Entry zone sits above key support floor ($${support.toFixed(2)}).`,
      passed: entryMin >= support * 0.98,
    },
    {
      item: 'Trend Structure Alignment',
      description: `Price action is aligned with ${profile.replace('_', ' ')} trend filters.`,
      passed: isAboveSma20 || isAboveSma50,
    },
    {
      item: 'Momentum Health Check',
      description: `RSI is not in severe overbought territory (< 70).`,
      passed: rsi < 70,
    },
    {
      item: 'Clear Defined Exit Rules',
      description: `Strict exit invalidation set at $${buyInvalidationPrice.toFixed(2)} before initiating trade.`,
      passed: true,
    },
  ];

  // Strategic Guidance
  let whenToBuyGuidance = '';
  let whenToSellGuidance = '';

  switch (profile) {
    case 'day_trader':
      whenToBuyGuidance = `Execute BUY on morning VWAP reclaim or pullbacks to $${dipBuyPrice.toFixed(2)}. Never chase green candles extended > 1% above VWAP. Invalidate if price breaks $${buyInvalidationPrice.toFixed(2)}.`;
      whenToSellGuidance = `Scale out aggressively: take 50% profit at $${tp1.toFixed(2)}, trail remaining to $${tp2.toFixed(2)}. Mandatory exit before market close.`;
      break;

    case 'weeks_trader':
      whenToBuyGuidance = `Accumulate in the $${entryMin.toFixed(2)} - $${entryMax.toFixed(2)} corridor on 20-day EMA bounces or enter on confirmed volume breakout above $${breakoutTrigger.toFixed(2)}. Stop at $${buyInvalidationPrice.toFixed(2)}.`;
      whenToSellGuidance = `Take 35% profit at $${tp1.toFixed(2)} and raise stop to breakeven. Take next 45% at $${tp2.toFixed(2)}. Trail runner with a 3.8% trailing stop.`;
      break;

    case 'months_trader':
      whenToBuyGuidance = `Build core position across 2-3 tranches between $${entryMin.toFixed(2)} and $${entryMax.toFixed(2)}. Confirm 50-day SMA ($${sma50.toFixed(2)}) is sloping upward.`;
      whenToSellGuidance = `Ride quarterly earnings momentum. Scale out at $${tp2.toFixed(2)} (+${target2Pct}%) and preserve capital if weekly close breaches $${sma50.toFixed(2)}.`;
      break;

    case 'long_term':
      whenToBuyGuidance = `Dollar-Cost-Average (DCA) systematically when ${symbol} trades below or near $${dipBuyPrice.toFixed(2)}. Long-term secular thesis remains healthy above $${sma200.toFixed(2)}.`;
      whenToSellGuidance = `Only rebalance or trim if valuation reaches extreme multiple expansion (> $${tp3.toFixed(2)}) or if fundamental business model deteriorates.`;
      break;

    case 'situational':
    default:
      whenToBuyGuidance = `Enter in tranches within $${entryMin.toFixed(2)} - $${entryMax.toFixed(2)}. Increase size on confirmed support confirmation.`;
      whenToSellGuidance = `Dynamically trim into strength at $${tp1.toFixed(2)} and $${tp2.toFixed(2)}. Invalidate setup below $${buyInvalidationPrice.toFixed(2)}.`;
      break;
  }

  const geminiTimingThesis = `${symbol} is currently priced at $${current.toFixed(2)} and exhibits a ${timingVerdict} status for a ${profile.replace('_', ' ')} (${horizonLabel} horizon). Optimal entry is between $${entryMin.toFixed(2)} - $${entryMax.toFixed(2)} (or breakout above $${breakoutTrigger.toFixed(2)}), with an initial profit target of $${tp1.toFixed(2)} (+${target1Pct}%) and primary target of $${tp2.toFixed(2)} (+${target2Pct}%). Maximum initial risk is capped at $${buyInvalidationPrice.toFixed(2)} (-${stopFloorPct}%).`;

  return {
    symbol: symbol.toUpperCase(),
    companyName: quote?.companyName || `${symbol.toUpperCase()} Corporation`,
    currentPrice: current,
    traderProfile: profile,
    timingVerdict,
    timingScore,
    conviction,
    summaryHeadline,
    whenToBuy: {
      recommendedEntryZone: { min: entryMin, max: entryMax },
      breakoutEntryTrigger: breakoutTrigger,
      pullbackDipEntry: dipBuyPrice,
      requiredBuyConditions,
      buyInvalidationPrice,
      strategicGuidance: whenToBuyGuidance,
    },
    whenToSell: {
      targetSellZones,
      requiredSellConditions,
      emergencyCutPrice: buyInvalidationPrice,
      strategicGuidance: whenToSellGuidance,
    },
    checklist,
    geminiTimingThesis,
  };
}
