export interface StockCandle {
  date: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockQuote {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  high52: number;
  low52: number;
  open: number;
  previousClose: number;
  marketCap?: number;
  peRatio?: number;
  volume: number;
  avgVolume?: number;
  currency: string;
  exchange: string;
}

export interface CompanyOverview {
  symbol: string;
  companyName: string;
  sector: string;
  industry: string;
  description: string;
  ceo?: string;
  employees?: number;
  headquarters?: string;
  marketCap?: number;
  peRatio?: number;
  beta?: number;
  dividendYield?: number;
  eps?: number;
  high52: number;
  low52: number;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume?: number;
  currency: string;
  exchange: string;
  website?: string;
  dataSource?: 'Alpha Vantage / Polygon.io API' | 'Live Market Feed' | 'Synthetic Model Feed';
}

export interface TechnicalIndicators {
  sma20: number | null;
  sma50: number | null;
  sma200: number | null;
  ema12: number | null;
  ema26: number | null;
  rsi: number | null;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  } | null;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  } | null;
  volatility: number | null;
  maxDrawdown: number | null;
  sharpeRatio: number | null;
  supportLevel: number;
  resistanceLevel: number;
  sma50Above200: boolean | null;
}

export interface CatalystItem {
  type: 'Bullish' | 'Bearish' | 'Neutral';
  title: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface RiskItem {
  risk: string;
  severity: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface StockAnalysis {
  verdict: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  confidenceScore: number;
  targetPrice: number;
  stopLoss: number;
  executiveSummary: string;
  technicalThesis: string;
  fundamentalPerspective: string;
  catalysts: CatalystItem[];
  keyPriceLevels: {
    support1: number;
    support2: number;
    resistance1: number;
    resistance2: number;
  };
  riskFactors: RiskItem[];
  quantMetrics: {
    trendStrength: 'Strong Bullish' | 'Moderate Bullish' | 'Consolidating' | 'Moderate Bearish' | 'Strong Bearish';
    volatilityRating: 'Low' | 'Medium' | 'High' | 'Extreme';
    liquidityProfile: 'Deep Institutional' | 'Moderate' | 'Thin';
    riskRewardRatio: string;
  };
  actionableRecommendations: {
    shortTermTrader: string;
    longTermInvestor: string;
    defensiveHedging: string;
  };
}

export interface StoryChapter {
  chapterNumber: number;
  title: string;
  timeframe: string;
  narrative: string;
  keyQuote: string;
  metricsHighlight: string;
  sentiment: 'bullish' | 'bearish' | 'volatile' | 'neutral';
}

export interface StockStory {
  title: string;
  subtitle: string;
  genre: string;
  readTime: string;
  coverVisualPrompt: string;
  chapters: StoryChapter[];
  audioTranscript: string;
  imageUrl?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  tier: string;
  subscription_id: 3;
  subscriptionId: 3;
  accountStatus: 'Active Institutional';
  analystLicense: 'CFA Tier-1 Terminal';
}

export interface PresentationSlide {
  slideNumber: number;
  slideTitle: string;
  bullets: string[];
  visualEmphasis: string;
}

export interface ExecutiveBriefingData {
  presentationTitle: string;
  verdict: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  convictionScore: number;
  targetPrice: number;
  stopLossPrice: number;
  headlineSummary: string;
  plainEnglishStory: string;
  whatToDoNow: {
    actionVerdict: string;
    forCurrentHolders: string;
    forNewBuyers: string;
    forCautiousInvestors: string;
    keyPriceTriggers: Array<{
      levelName: string;
      price: string;
      note: string;
    }>;
  };
  presentationSlides: PresentationSlide[];
  spokenPresenterScript: string;
  editorialArtPrompt: string;
  imageUrl?: string;
}

export type TraderProfile =
  | 'day_trader'
  | 'weeks_trader'
  | 'months_trader'
  | 'long_term'
  | 'situational';

export interface TradePosition {
  id: string;
  symbol: string;
  positionType: 'BUY' | 'SELL'; // BUY (Long) or SELL (Short)
  entryPrice: number;
  shares: number;
  entryDate?: string;
  notes?: string;
  traderProfile: TraderProfile;
  targetRiskPct?: number; // e.g. 2% or 5%
  createdAt: number;
}

export interface TakeProfitLevel {
  levelNumber: number;
  label: string;
  targetPrice: number;
  upsidePct: number;
  suggestedAction: string;
  riskRewardRatio: string;
}

export interface StopLossLevel {
  label: string;
  price: number;
  downsidePct: number;
  potentialLossAmount: number;
  triggerCondition: string;
  isTight: boolean;
}

export interface PositionAnalysisResult {
  symbol: string;
  positionType: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice: number;
  shares: number;
  costBasis: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPct: number;
  tradeHealthScore: number; // 0 to 100
  tradeStatus: 'Strong Profit' | 'Modest Profit' | 'Near Breakeven' | 'Moderate Loss' | 'Critical Stop Zone';
  traderProfile: TraderProfile;
  
  whenToStopLoss: {
    recommendedStopPrice: number;
    recommendedDownsidePct: number;
    maxCapitalRisk: number;
    trailingStopDistancePct: number;
    primaryStopReason: string;
    exactActionProtocol: string;
    levels: StopLossLevel[];
  };

  whenToTakeProfit: {
    recommendedExitPrice: number;
    expectedGainAmount: number;
    primaryProfitReason: string;
    exactActionProtocol: string;
    levels: TakeProfitLevel[];
  };

  riskRewardRatio: number;
  riskRewardAssessment: 'Favorable (3:1+)' | 'Moderate (2:1)' | 'Marginal (1:1.5)' | 'Unfavorable (<1.5:1)';
  aiDiagnosis: string;
  tailoredGuidanceForProfile: string;
}

export interface BuySellCondition {
  indicator: string;
  condition: string;
  status: 'MET' | 'PENDING' | 'WARNING';
}

export interface TargetSellZone {
  label: string;
  targetPrice: number;
  upsidePct: number;
  rationale: string;
  estimatedTimeframe: string;
}

export interface StrategyChecklistItem {
  item: string;
  description: string;
  passed: boolean;
}

export interface BuySellTimingAnalysis {
  symbol: string;
  companyName?: string;
  currentPrice: number;
  traderProfile: TraderProfile;
  timingVerdict:
    | 'Optimal Buy Zone'
    | 'Wait For Pullback / Dip'
    | 'Overbought - Prepare to Sell / Take Profit'
    | 'Range-Bound / Breakout Watch'
    | 'Short / Breakdown Sell';
  timingScore: number; // 0 to 100
  conviction: 'High' | 'Medium' | 'Speculative';
  summaryHeadline: string;

  whenToBuy: {
    recommendedEntryZone: { min: number; max: number };
    breakoutEntryTrigger: number;
    pullbackDipEntry: number;
    requiredBuyConditions: BuySellCondition[];
    buyInvalidationPrice: number;
    strategicGuidance: string;
  };

  whenToSell: {
    targetSellZones: TargetSellZone[];
    requiredSellConditions: BuySellCondition[];
    emergencyCutPrice: number;
    strategicGuidance: string;
  };

  checklist: StrategyChecklistItem[];
  geminiTimingThesis: string;
}

export type PositionAnalyzerTab = 'buy_sell_timing' | 'specific_position_risk';

export type SortField =
  | 'symbol'
  | 'companyName'
  | 'price'
  | 'change'
  | 'changePercent'
  | 'marketCap'
  | 'peRatio'
  | 'volume'
  | 'high52'
  | 'low52'
  | 'sector';

export type SortDirection = 'asc' | 'desc';
