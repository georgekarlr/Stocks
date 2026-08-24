import { StockCandle, TechnicalIndicators } from '../types/stock';

export function calculateSMA(candles: StockCandle[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const slice = candles.slice(i - period + 1, i + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      result.push(Number((sum / period).toFixed(2)));
    }
  }
  return result;
}

export function calculateEMA(candles: StockCandle[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (period + 1);
  let prevEMA: number | null = null;

  for (let i = 0; i < candles.length; i++) {
    const close = candles[i].close;
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      const slice = candles.slice(0, period);
      const initialSMA = slice.reduce((acc, c) => acc + c.close, 0) / period;
      prevEMA = initialSMA;
      result.push(Number(initialSMA.toFixed(2)));
    } else {
      const currentEMA = close * k + (prevEMA as number) * (1 - k);
      prevEMA = currentEMA;
      result.push(Number(currentEMA.toFixed(2)));
    }
  }
  return result;
}

export function calculateRSI(candles: StockCandle[], period = 14): (number | null)[] {
  const result: (number | null)[] = [];
  if (candles.length <= period) {
    return candles.map(() => null);
  }

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // First values are null
  for (let i = 0; i < period; i++) {
    result.push(null);
  }

  const firstRS = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const firstRSI = 100 - 100 / (1 + firstRS);
  result.push(Number(firstRSI.toFixed(1)));

  for (let i = period + 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    if (avgLoss === 0) {
      result.push(100);
    } else {
      const rs = avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);
      result.push(Number(rsi.toFixed(1)));
    }
  }

  return result;
}

export function calculateMACD(candles: StockCandle[]) {
  const ema12 = calculateEMA(candles, 12);
  const ema26 = calculateEMA(candles, 26);
  const macdLine: (number | null)[] = [];

  for (let i = 0; i < candles.length; i++) {
    if (ema12[i] !== null && ema26[i] !== null) {
      macdLine.push(Number(((ema12[i] as number) - (ema26[i] as number)).toFixed(2)));
    } else {
      macdLine.push(null);
    }
  }

  // Calculate 9-period EMA of MACD Line (signal line)
  const validMacdStartIndex = macdLine.findIndex((v) => v !== null);
  const signalLine: (number | null)[] = candles.map(() => null);
  const histogram: (number | null)[] = candles.map(() => null);

  if (validMacdStartIndex !== -1) {
    const validMacdValues = macdLine.slice(validMacdStartIndex) as number[];
    const k = 2 / (9 + 1);
    let prevSignal: number | null = null;

    for (let j = 0; j < validMacdValues.length; j++) {
      const originalIdx = validMacdStartIndex + j;
      if (j < 8) {
        // null
      } else if (j === 8) {
        const slice = validMacdValues.slice(0, 9);
        const sum = slice.reduce((a, b) => a + b, 0);
        prevSignal = sum / 9;
        signalLine[originalIdx] = Number(prevSignal.toFixed(2));
        histogram[originalIdx] = Number((macdLine[originalIdx]! - prevSignal).toFixed(2));
      } else {
        const currentSignal = validMacdValues[j] * k + (prevSignal as number) * (1 - k);
        prevSignal = currentSignal;
        signalLine[originalIdx] = Number(currentSignal.toFixed(2));
        histogram[originalIdx] = Number((macdLine[originalIdx]! - currentSignal).toFixed(2));
      }
    }
  }

  return { macdLine, signalLine, histogram };
}

export function calculateBollingerBands(candles: StockCandle[], period = 20, multiplier = 2) {
  const upper: (number | null)[] = [];
  const middle = calculateSMA(candles, period);
  const lower: (number | null)[] = [];

  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1 || middle[i] === null) {
      upper.push(null);
      lower.push(null);
    } else {
      const slice = candles.slice(i - period + 1, i + 1);
      const mean = middle[i] as number;
      const variance = slice.reduce((acc, c) => acc + Math.pow(c.close - mean, 2), 0) / period;
      const stdDev = Math.sqrt(variance);
      upper.push(Number((mean + multiplier * stdDev).toFixed(2)));
      lower.push(Number((mean - multiplier * stdDev).toFixed(2)));
    }
  }

  return { upper, middle, lower };
}

export function computeTechnicalIndicators(candles: StockCandle[]): TechnicalIndicators {
  if (!candles || candles.length === 0) {
    return {
      sma20: null,
      sma50: null,
      sma200: null,
      ema12: null,
      ema26: null,
      rsi: null,
      macd: null,
      bollinger: null,
      volatility: null,
      maxDrawdown: null,
      sharpeRatio: null,
      supportLevel: 0,
      resistanceLevel: 0,
      sma50Above200: null,
    };
  }

  const sma20Series = calculateSMA(candles, 20);
  const sma50Series = calculateSMA(candles, 50);
  const sma200Series = calculateSMA(candles, 200);
  const ema12Series = calculateEMA(candles, 12);
  const ema26Series = calculateEMA(candles, 26);
  const rsiSeries = calculateRSI(candles, 14);
  const macdData = calculateMACD(candles);
  const bollingerData = calculateBollingerBands(candles, 20, 2);

  const lastIdx = candles.length - 1;
  const sma20 = sma20Series[lastIdx];
  const sma50 = sma50Series[lastIdx];
  const sma200 = sma200Series[lastIdx];
  const ema12 = ema12Series[lastIdx];
  const ema26 = ema26Series[lastIdx];
  const rsi = rsiSeries[lastIdx];

  const macd =
    macdData.macdLine[lastIdx] !== null && macdData.signalLine[lastIdx] !== null
      ? {
          macd: macdData.macdLine[lastIdx]!,
          signal: macdData.signalLine[lastIdx]!,
          histogram: macdData.histogram[lastIdx] || 0,
        }
      : null;

  const bollinger =
    bollingerData.upper[lastIdx] !== null &&
    bollingerData.middle[lastIdx] !== null &&
    bollingerData.lower[lastIdx] !== null
      ? {
          upper: bollingerData.upper[lastIdx]!,
          middle: bollingerData.middle[lastIdx]!,
          lower: bollingerData.lower[lastIdx]!,
        }
      : null;

  // Annualized Volatility
  const returns: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const prev = candles[i - 1].close;
    const curr = candles[i].close;
    if (prev > 0) {
      returns.push((curr - prev) / prev);
    }
  }

  let volatility: number | null = null;
  let sharpeRatio: number | null = null;

  if (returns.length > 5) {
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / returns.length;
    const dailyStdDev = Math.sqrt(variance);
    volatility = dailyStdDev * Math.sqrt(252);

    const annualizedReturn = meanReturn * 252;
    const riskFreeRate = 0.04; // 4% benchmark
    if (volatility > 0) {
      sharpeRatio = Number(((annualizedReturn - riskFreeRate) / volatility).toFixed(2));
    }
  }

  // Max Drawdown
  let maxDrawdown = 0;
  let peak = candles[0].close;
  for (const c of candles) {
    if (c.close > peak) {
      peak = c.close;
    }
    const dd = (peak - c.close) / peak;
    if (dd > maxDrawdown) {
      maxDrawdown = dd;
    }
  }

  // Pivot Support / Resistance
  const recentSlice = candles.slice(-30);
  const supportLevel = Number(Math.min(...recentSlice.map((c) => c.low)).toFixed(2));
  const resistanceLevel = Number(Math.max(...recentSlice.map((c) => c.high)).toFixed(2));

  const sma50Above200 = sma50 !== null && sma200 !== null ? sma50 > sma200 : null;

  return {
    sma20,
    sma50,
    sma200,
    ema12,
    ema26,
    rsi,
    macd,
    bollinger,
    volatility: volatility !== null ? Number(volatility.toFixed(4)) : null,
    maxDrawdown: Number(maxDrawdown.toFixed(4)),
    sharpeRatio,
    supportLevel,
    resistanceLevel,
    sma50Above200,
  };
}
