import React from 'react';
import {
  Activity,
  Zap,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Percent,
  Gauge,
  Crosshair,
  BarChart2,
} from 'lucide-react';
import { TechnicalIndicators, StockQuote, StockCandle } from '../types/stock';

interface QuantMetricsGridProps {
  technicals: TechnicalIndicators;
  quote: StockQuote;
  candles: StockCandle[];
}

export const QuantMetricsGrid: React.FC<QuantMetricsGridProps> = ({
  technicals,
  quote,
  candles,
}) => {
  // Volume surge calculation
  const recentCandles = candles.slice(-20);
  const avgVolume20 =
    recentCandles.length > 0
      ? recentCandles.reduce((acc, c) => acc + (c.volume || 0), 0) / recentCandles.length
      : 1;
  const currentVolume = quote.volume || (candles.length > 0 ? candles[candles.length - 1].volume : 0);
  const volumeMultiplier = avgVolume20 > 0 ? currentVolume / avgVolume20 : 1;

  // RSI status
  const rsi = technicals.rsi;
  const rsiStatus =
    rsi === null
      ? 'Calculating...'
      : rsi >= 70
      ? 'Overbought (>70)'
      : rsi <= 30
      ? 'Oversold (<30)'
      : rsi >= 55
      ? 'Bullish Momentum'
      : rsi <= 45
      ? 'Bearish Pressure'
      : 'Neutral Range';

  const rsiColor =
    rsi === null
      ? 'text-slate-400'
      : rsi >= 70
      ? 'text-rose-400'
      : rsi <= 30
      ? 'text-emerald-400'
      : rsi >= 55
      ? 'text-cyan-400'
      : 'text-slate-300';

  // MACD status
  const macd = technicals.macd;
  const isMacdBullish = macd ? macd.macd > macd.signal : null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
      {/* 1. RSI */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold">RSI (14-Period)</span>
          <Gauge className="h-4 w-4 text-purple-400" />
        </div>
        <div className="text-2xl font-black text-white">
          {rsi !== null ? rsi.toFixed(1) : '--'}
        </div>
        <div className={`mt-1 text-[11px] font-bold ${rsiColor}`}>{rsiStatus}</div>
      </div>

      {/* 2. Moving Average Cross (Golden / Death Cross) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold">SMA 50 vs 200</span>
          <TrendingUp className="h-4 w-4 text-amber-400" />
        </div>
        <div className="text-xl font-bold text-white">
          {technicals.sma50Above200 === true ? (
            <span className="text-emerald-400">Golden Cross</span>
          ) : technicals.sma50Above200 === false ? (
            <span className="text-rose-400">Death Cross</span>
          ) : (
            'Observing'
          )}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          SMA50: ${technicals.sma50 ? technicals.sma50.toFixed(2) : '--'}
        </div>
      </div>

      {/* 3. MACD Divergence */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold">MACD Signal</span>
          <Activity className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-xl font-bold text-white">
          {isMacdBullish === true ? (
            <span className="text-cyan-400">Bullish Line</span>
          ) : isMacdBullish === false ? (
            <span className="text-rose-400">Bearish Line</span>
          ) : (
            '--'
          )}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          Hist: {macd ? (macd.histogram >= 0 ? `+${macd.histogram}` : macd.histogram) : '--'}
        </div>
      </div>

      {/* 4. Annualized Volatility */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold">Historical Volatility</span>
          <Percent className="h-4 w-4 text-blue-400" />
        </div>
        <div className="text-2xl font-black text-white">
          {technicals.volatility !== null ? `${(technicals.volatility * 100).toFixed(1)}%` : '--'}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          {technicals.volatility && technicals.volatility > 0.45
            ? 'High Risk / Beta'
            : technicals.volatility && technicals.volatility > 0.25
            ? 'Moderate Risk'
            : 'Low Volatility'}
        </div>
      </div>

      {/* 5. Max Drawdown */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold">Max Drawdown</span>
          <ShieldAlert className="h-4 w-4 text-rose-400" />
        </div>
        <div className="text-2xl font-black text-rose-400">
          {technicals.maxDrawdown !== null ? `-${(technicals.maxDrawdown * 100).toFixed(1)}%` : '--'}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">Peak-to-Trough Decline</div>
      </div>

      {/* 6. Sharpe Ratio */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold">Sharpe Ratio (Est.)</span>
          <Zap className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-black text-white">
          {technicals.sharpeRatio !== null ? technicals.sharpeRatio : '--'}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          {technicals.sharpeRatio && technicals.sharpeRatio > 1.5
            ? 'Excellent Alpha'
            : technicals.sharpeRatio && technicals.sharpeRatio > 0.8
            ? 'Good Risk-Adjusted'
            : 'Sub-Optimal Alpha'}
        </div>
      </div>

      {/* 7. Support & Resistance */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold">Key Pivot Levels</span>
          <Crosshair className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="flex items-center justify-between text-xs font-bold mt-1">
          <span className="text-emerald-400">Supp: ${technicals.supportLevel || '--'}</span>
          <span className="text-rose-400">Res: ${technicals.resistanceLevel || '--'}</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400">30-Session High/Low Channels</div>
      </div>

      {/* 8. Volume Surge Multiplier */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold">Volume Velocity</span>
          <BarChart2 className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-black text-white">
          {volumeMultiplier.toFixed(2)}x
        </div>
        <div className="mt-1 text-[11px] font-semibold text-slate-400">
          {volumeMultiplier > 1.5 ? (
            <span className="text-amber-300">Surge Detected</span>
          ) : volumeMultiplier < 0.6 ? (
            <span className="text-slate-400">Low Liquidity</span>
          ) : (
            'Normal Flow'
          )}
        </div>
      </div>
    </div>
  );
};
