import React, { useState, useRef, useMemo } from 'react';
import {
  BarChart2,
  LineChart as LineChartIcon,
  Sliders,
  Eye,
  EyeOff,
  Maximize2,
  Activity,
  Layers,
  TrendingUp,
  ArrowLeftRight,
} from 'lucide-react';
import { StockCandle } from '../types/stock';
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
} from '../utils/indicators';

interface InteractiveChartProps {
  candles: StockCandle[];
  symbol: string;
  activeRange: string;
  onRangeChange: (range: string) => void;
  isLoadingRange?: boolean;
  onOpenStockSelector?: () => void;
}

type ChartType = 'candlestick' | 'area' | 'line';
type SubChartType = 'volume' | 'rsi' | 'macd' | 'none';

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  candles,
  symbol,
  activeRange,
  onRangeChange,
  isLoadingRange = false,
  onOpenStockSelector,
}) => {
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [subChart, setSubChart] = useState<SubChartType>('volume');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Overlay state
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);
  const [showSMA200, setShowSMA200] = useState(false);
  const [showEMA12, setShowEMA12] = useState(false);
  const [showEMA26, setShowEMA26] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter candles based on visible data
  const data = useMemo(() => candles || [], [candles]);

  // Compute indicator series
  const sma20 = useMemo(() => calculateSMA(data, 20), [data]);
  const sma50 = useMemo(() => calculateSMA(data, 50), [data]);
  const sma200 = useMemo(() => calculateSMA(data, 200), [data]);
  const ema12 = useMemo(() => calculateEMA(data, 12), [data]);
  const ema26 = useMemo(() => calculateEMA(data, 26), [data]);
  const rsiSeries = useMemo(() => calculateRSI(data, 14), [data]);
  const macdSeries = useMemo(() => calculateMACD(data), [data]);
  const bollingerSeries = useMemo(() => calculateBollingerBands(data, 20, 2), [data]);

  // Dimensions
  const width = 1000;
  const mainHeight = 360;
  const subHeight = subChart !== 'none' ? 120 : 0;
  const padding = { top: 20, right: 65, bottom: 25, left: 15 };

  // Calculate Price domain
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (data.length === 0) return { minPrice: 0, maxPrice: 100, maxVolume: 100 };

    let min = Math.min(...data.map((c) => c.low));
    let max = Math.max(...data.map((c) => c.high));

    if (showBollinger) {
      bollingerSeries.upper.forEach((v) => {
        if (v !== null && v > max) max = v;
      });
      bollingerSeries.lower.forEach((v) => {
        if (v !== null && v < min) min = v;
      });
    }

    const margin = (max - min) * 0.05 || 1;
    const maxVol = Math.max(...data.map((c) => c.volume || 1));

    return {
      minPrice: Math.max(0, min - margin),
      maxPrice: max + margin,
      maxVolume: maxVol,
    };
  }, [data, showBollinger, bollingerSeries]);

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = mainHeight - padding.top - padding.bottom;

  // Scales
  const getX = (index: number) => {
    if (data.length <= 1) return padding.left + innerWidth / 2;
    return padding.left + (index / (data.length - 1)) * innerWidth;
  };

  const getY = (price: number) => {
    if (maxPrice === minPrice) return padding.top + innerHeight / 2;
    return padding.top + (1 - (price - minPrice) / (maxPrice - minPrice)) * innerHeight;
  };

  const getVolY = (vol: number) => {
    const subTop = mainHeight + 15;
    const subInnerH = subHeight - 25;
    return subTop + (1 - vol / (maxVolume || 1)) * subInnerH;
  };

  const getRsiY = (rsiVal: number) => {
    const subTop = mainHeight + 15;
    const subInnerH = subHeight - 25;
    return subTop + (1 - Math.max(0, Math.min(100, rsiVal)) / 100) * subInnerH;
  };

  // MACD domain
  const { minMacd, maxMacd } = useMemo(() => {
    let min = -1;
    let max = 1;
    macdSeries.macdLine.forEach((v) => {
      if (v !== null) {
        if (v > max) max = v;
        if (v < min) min = v;
      }
    });
    macdSeries.signalLine.forEach((v) => {
      if (v !== null) {
        if (v > max) max = v;
        if (v < min) min = v;
      }
    });
    const pad = Math.max(Math.abs(min), Math.abs(max)) * 1.1 || 1;
    return { minMacd: -pad, maxMacd: pad };
  }, [macdSeries]);

  const getMacdY = (val: number) => {
    const subTop = mainHeight + 15;
    const subInnerH = subHeight - 25;
    return subTop + (1 - (val - minMacd) / (maxMacd - minMacd)) * subInnerH;
  };

  // Generate SVG path for series
  const generatePath = (series: (number | null)[]) => {
    let path = '';
    series.forEach((val, i) => {
      if (val !== null) {
        const x = getX(i);
        const y = getY(val);
        if (!path) path = `M ${x} ${y}`;
        else path += ` L ${x} ${y}`;
      }
    });
    return path;
  };

  const generateAreaPath = () => {
    if (data.length === 0) return '';
    let p = `M ${getX(0)} ${getY(data[0].close)}`;
    for (let i = 1; i < data.length; i++) {
      p += ` L ${getX(i)} ${getY(data[i].close)}`;
    }
    p += ` L ${getX(data.length - 1)} ${padding.top + innerHeight}`;
    p += ` L ${getX(0)} ${padding.top + innerHeight} Z`;
    return p;
  };

  // Mouse move handler for crosshair
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const ratio = (clientX / rect.width) * width;
    const relX = ratio - padding.left;

    if (relX >= 0 && relX <= innerWidth && data.length > 0) {
      const idx = Math.round((relX / innerWidth) * (data.length - 1));
      setHoverIndex(Math.max(0, Math.min(data.length - 1, idx)));
    }
  };

  const activeCandle = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : data[data.length - 1];

  const ranges = ['1D', '5D', '1M', '3M', '6M', '1Y', '5Y'];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-xl backdrop-blur">
      {/* Chart Controls Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-4">
        {/* Chart Type Toggles & Ticker Switcher */}
        <div className="flex items-center gap-2">
          {onOpenStockSelector && (
            <button
              onClick={onOpenStockSelector}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition"
              title="Select another stock / switch ticker"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>{symbol}</span>
              <span className="text-[10px] text-cyan-400/80 font-normal hidden sm:inline">Switch</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setChartType('candlestick')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                chartType === 'candlestick'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" />
              <span>Candles</span>
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                chartType === 'area'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LineChartIcon className="h-3.5 w-3.5" />
              <span>Area</span>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                chartType === 'line'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Line</span>
            </button>
          </div>
        </div>

        {/* Sub-chart Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Sub-Chart:</span>
          {(['volume', 'rsi', 'macd', 'none'] as SubChartType[]).map((st) => (
            <button
              key={st}
              onClick={() => setSubChart(st)}
              className={`rounded-lg px-2 py-1 text-[11px] font-bold uppercase transition ${
                subChart === st
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Timeframe Range Buttons */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          {ranges.map((r) => (
            <button
              key={r}
              disabled={isLoadingRange}
              onClick={() => onRangeChange(r.toLowerCase())}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                activeRange.toUpperCase() === r
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              } disabled:opacity-40`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Indicator Pills & Toggles */}
      <div className="flex flex-wrap items-center gap-2 py-3 border-b border-slate-800/40">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <Sliders className="h-3 w-3 text-cyan-400" /> Overlays:
        </span>

        <button
          onClick={() => setShowSMA20(!showSMA20)}
          className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border transition ${
            showSMA20
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          SMA 20
        </button>

        <button
          onClick={() => setShowSMA50(!showSMA50)}
          className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border transition ${
            showSMA50
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          SMA 50
        </button>

        <button
          onClick={() => setShowSMA200(!showSMA200)}
          className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border transition ${
            showSMA200
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/40'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
          SMA 200
        </button>

        <button
          onClick={() => setShowEMA12(!showEMA12)}
          className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border transition ${
            showEMA12
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/40'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          EMA 12
        </button>

        <button
          onClick={() => setShowEMA26(!showEMA26)}
          className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border transition ${
            showEMA26
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/40'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
          EMA 26
        </button>

        <button
          onClick={() => setShowBollinger(!showBollinger)}
          className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border transition ${
            showBollinger
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Bollinger (20,2)
        </button>
      </div>

      {/* Hover Inspection Stats Strip */}
      {activeCandle && (
        <div className="my-2 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-slate-950/90 px-3 py-1.5 text-xs text-slate-300 font-mono border border-slate-800">
          <span className="font-bold text-cyan-400">{activeCandle.date}</span>
          <span>
            O: <strong className="text-white">${activeCandle.open.toFixed(2)}</strong>
          </span>
          <span>
            H: <strong className="text-emerald-400">${activeCandle.high.toFixed(2)}</strong>
          </span>
          <span>
            L: <strong className="text-rose-400">${activeCandle.low.toFixed(2)}</strong>
          </span>
          <span>
            C: <strong className="text-white">${activeCandle.close.toFixed(2)}</strong>
          </span>
          <span>
            Vol: <strong className="text-slate-200">{activeCandle.volume?.toLocaleString() || 0}</strong>
          </span>
          {hoverIndex !== null && sma20[hoverIndex] && (
            <span className="text-cyan-400 hidden md:inline">SMA20: ${sma20[hoverIndex]}</span>
          )}
          {hoverIndex !== null && sma50[hoverIndex] && (
            <span className="text-amber-400 hidden md:inline">SMA50: ${sma50[hoverIndex]}</span>
          )}
          {hoverIndex !== null && rsiSeries[hoverIndex] && (
            <span className="text-purple-400 hidden lg:inline">RSI: {rsiSeries[hoverIndex]}</span>
          )}
        </div>
      )}

      {/* Main SVG Financial Chart */}
      <div ref={containerRef} className="relative mt-2 select-none overflow-hidden rounded-xl bg-slate-950 p-1">
        <svg
          viewBox={`0 0 ${width} ${mainHeight + subHeight}`}
          className="w-full h-auto cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="chartAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.0" />
            </linearGradient>
            <linearGradient id="bbBandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.12" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.04" />
            </linearGradient>
          </defs>

          {/* Grid lines - Price Horizontals */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
            const y = padding.top + p * innerHeight;
            const priceVal = maxPrice - p * (maxPrice - minPrice);
            return (
              <g key={`grid-h-${idx}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={width - padding.right + 8}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  ${priceVal.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Bollinger Bands Fill Ribbon */}
          {showBollinger && (
            <path
              d={(() => {
                let p = '';
                // upper line forward
                bollingerSeries.upper.forEach((v, i) => {
                  if (v !== null) {
                    const x = getX(i);
                    const y = getY(v);
                    if (!p) p = `M ${x} ${y}`;
                    else p += ` L ${x} ${y}`;
                  }
                });
                // lower line backward
                for (let i = bollingerSeries.lower.length - 1; i >= 0; i--) {
                  const v = bollingerSeries.lower[i];
                  if (v !== null) {
                    const x = getX(i);
                    const y = getY(v);
                    p += ` L ${x} ${y}`;
                  }
                }
                p += ' Z';
                return p;
              })()}
              fill="url(#bbBandGrad)"
            />
          )}

          {/* Bollinger Bands Lines */}
          {showBollinger && (
            <>
              <path d={generatePath(bollingerSeries.upper)} fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <path d={generatePath(bollingerSeries.lower)} fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            </>
          )}

          {/* Area/Line Chart View */}
          {chartType === 'area' && (
            <>
              <path d={generateAreaPath()} fill="url(#chartAreaGrad)" />
              <path
                d={generatePath(data.map((c) => c.close))}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />
            </>
          )}

          {chartType === 'line' && (
            <path
              d={generatePath(data.map((c) => c.close))}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
          )}

          {/* Candlestick Rendering */}
          {chartType === 'candlestick' &&
            data.map((c, i) => {
              const x = getX(i);
              const isGreen = c.close >= c.open;
              const color = isGreen ? '#10b981' : '#f43f5e';
              const openY = getY(c.open);
              const closeY = getY(c.close);
              const highY = getY(c.high);
              const lowY = getY(c.low);

              const candleTop = Math.min(openY, closeY);
              const candleHeight = Math.max(1.5, Math.abs(closeY - openY));
              const candleWidth = Math.max(2, Math.min(10, innerWidth / (data.length * 1.4)));

              return (
                <g key={`candle-${i}`}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={candleTop}
                    width={candleWidth}
                    height={candleHeight}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })}

          {/* Technical Moving Average Overlays */}
          {showSMA20 && <path d={generatePath(sma20)} fill="none" stroke="#22d3ee" strokeWidth="1.8" opacity="0.9" />}
          {showSMA50 && <path d={generatePath(sma50)} fill="none" stroke="#fbbf24" strokeWidth="1.8" opacity="0.9" />}
          {showSMA200 && <path d={generatePath(sma200)} fill="none" stroke="#c084fc" strokeWidth="2" opacity="0.9" />}
          {showEMA12 && <path d={generatePath(ema12)} fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 2" />}
          {showEMA26 && <path d={generatePath(ema26)} fill="none" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4 2" />}

          {/* Sub-Chart Divider & Sub-Chart Elements */}
          {subChart !== 'none' && (
            <>
              {/* Divider */}
              <line
                x1={padding.left}
                y1={mainHeight + 5}
                x2={width - padding.right}
                y2={mainHeight + 5}
                stroke="#334155"
                strokeWidth="1"
              />

              {/* Volume Sub-Chart */}
              {subChart === 'volume' && (
                <g>
                  <text x={padding.left} y={mainHeight + 20} fill="#94a3b8" fontSize="10" fontWeight="bold">
                    VOLUME PROFILE
                  </text>
                  {data.map((c, i) => {
                    const x = getX(i);
                    const y = getVolY(c.volume);
                    const isGreen = c.close >= c.open;
                    const color = isGreen ? '#10b981' : '#f43f5e';
                    const barW = Math.max(2, Math.min(8, innerWidth / (data.length * 1.5)));
                    const barH = mainHeight + subHeight - 10 - y;

                    return (
                      <rect
                        key={`vol-${i}`}
                        x={x - barW / 2}
                        y={y}
                        width={barW}
                        height={Math.max(1, barH)}
                        fill={color}
                        opacity="0.6"
                      />
                    );
                  })}
                  <text
                    x={width - padding.right + 8}
                    y={mainHeight + 25}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {(maxVolume / 1e6).toFixed(1)}M
                  </text>
                </g>
              )}

              {/* RSI Sub-Chart */}
              {subChart === 'rsi' && (
                <g>
                  <text x={padding.left} y={mainHeight + 20} fill="#94a3b8" fontSize="10" fontWeight="bold">
                    RSI (14-PERIOD)
                  </text>
                  {/* 70 line */}
                  <line
                    x1={padding.left}
                    y1={getRsiY(70)}
                    x2={width - padding.right}
                    y2={getRsiY(70)}
                    stroke="#f43f5e"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <text x={width - padding.right + 8} y={getRsiY(70) + 3} fill="#f43f5e" fontSize="9">
                    70 (OB)
                  </text>
                  {/* 30 line */}
                  <line
                    x1={padding.left}
                    y1={getRsiY(30)}
                    x2={width - padding.right}
                    y2={getRsiY(30)}
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <text x={width - padding.right + 8} y={getRsiY(30) + 3} fill="#10b981" fontSize="9">
                    30 (OS)
                  </text>
                  {/* RSI Curve */}
                  <path
                    d={(() => {
                      let p = '';
                      rsiSeries.forEach((v, i) => {
                        if (v !== null) {
                          const x = getX(i);
                          const y = getRsiY(v);
                          if (!p) p = `M ${x} ${y}`;
                          else p += ` L ${x} ${y}`;
                        }
                      });
                      return p;
                    })()}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="2"
                  />
                </g>
              )}

              {/* MACD Sub-Chart */}
              {subChart === 'macd' && (
                <g>
                  <text x={padding.left} y={mainHeight + 20} fill="#94a3b8" fontSize="10" fontWeight="bold">
                    MACD (12, 26, 9)
                  </text>
                  {/* Zero line */}
                  <line
                    x1={padding.left}
                    y1={getMacdY(0)}
                    x2={width - padding.right}
                    y2={getMacdY(0)}
                    stroke="#475569"
                    strokeWidth="1"
                  />
                  {/* Histogram bars */}
                  {macdSeries.histogram.map((h, i) => {
                    if (h === null) return null;
                    const x = getX(i);
                    const zeroY = getMacdY(0);
                    const valY = getMacdY(h);
                    const isUp = h >= 0;
                    const barW = Math.max(2, Math.min(6, innerWidth / (data.length * 1.6)));

                    return (
                      <rect
                        key={`macd-hist-${i}`}
                        x={x - barW / 2}
                        y={isUp ? valY : zeroY}
                        width={barW}
                        height={Math.max(1, Math.abs(valY - zeroY))}
                        fill={isUp ? '#10b981' : '#f43f5e'}
                        opacity="0.75"
                      />
                    );
                  })}
                  {/* MACD line */}
                  <path
                    d={(() => {
                      let p = '';
                      macdSeries.macdLine.forEach((v, i) => {
                        if (v !== null) {
                          const x = getX(i);
                          const y = getMacdY(v);
                          if (!p) p = `M ${x} ${y}`;
                          else p += ` L ${x} ${y}`;
                        }
                      });
                      return p;
                    })()}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.8"
                  />
                  {/* Signal line */}
                  <path
                    d={(() => {
                      let p = '';
                      macdSeries.signalLine.forEach((v, i) => {
                        if (v !== null) {
                          const x = getX(i);
                          const y = getMacdY(v);
                          if (!p) p = `M ${x} ${y}`;
                          else p += ` L ${x} ${y}`;
                        }
                      });
                      return p;
                    })()}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                </g>
              )}
            </>
          )}

          {/* Interactive Crosshair Cursor */}
          {hoverIndex !== null && data[hoverIndex] && (
            <g>
              {/* Vertical line */}
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={mainHeight + subHeight - 10}
                stroke="#94a3b8"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              {/* Horizontal line on main price */}
              <line
                x1={padding.left}
                y1={getY(data[hoverIndex].close)}
                x2={width - padding.right}
                y2={getY(data[hoverIndex].close)}
                stroke="#94a3b8"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              {/* Target intersection circle */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(data[hoverIndex].close)}
                r="4.5"
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* Price badge right */}
              <rect
                x={width - padding.right + 2}
                y={getY(data[hoverIndex].close) - 9}
                width="60"
                height="18"
                rx="3"
                fill="#06b6d4"
              />
              <text
                x={width - padding.right + 32}
                y={getY(data[hoverIndex].close) + 3}
                fill="#020617"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                ${data[hoverIndex].close.toFixed(2)}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
