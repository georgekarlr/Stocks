import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Plus,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Building2,
  ExternalLink,
  Trash2,
  Sparkles,
  BarChart3,
  Download,
  Info,
  Layers,
  X,
  CheckCircle2,
  Zap,
  ChevronDown,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  Database,
} from 'lucide-react';
import { CompanyOverview, SortField, SortDirection } from '../types/stock';
import {
  fetchCompanyOverview,
  fetchBatchCompanyOverviews,
  fetchStockUniverse,
} from '../services/marketData';
import { useActionIndicator } from '../context/ActionIndicatorContext';

interface StockMarketTableProps {
  onSelectTickerForTerminal: (symbol: string) => void;
  onRunAnalysisForTicker: (symbol: string) => void;
  onGenerateStoryForTicker: (symbol: string) => void;
  onRunAutonomousWorkflow?: (symbol: string) => void;
}

const PRESET_COLLECTIONS = [
  {
    id: 'sp500-leaders',
    name: 'S&P 500 Market Leaders (15 Stocks)',
    description: 'Top US large-cap benchmark drivers by market capitalization',
    icon: Globe,
    tickers: [
      'NVDA',
      'AAPL',
      'MSFT',
      'AMZN',
      'GOOGL',
      'META',
      'TSLA',
      'AVGO',
      'JPM',
      'LLY',
      'V',
      'WMT',
      'MA',
      'UNH',
      'COST',
    ],
  },
  {
    id: 'ai-semis',
    name: 'AI, Chips & Next-Gen Hardware (12 Stocks)',
    description: 'Leading AI accelerators, cloud architecture, and silicon fabs',
    icon: Sparkles,
    tickers: [
      'NVDA',
      'AMD',
      'AVGO',
      'PLTR',
      'ARM',
      'SMCI',
      'TSM',
      'ASML',
      'QCOM',
      'INTC',
      'ORCL',
      'CRM',
    ],
  },
  {
    id: 'financials-banking',
    name: 'Global Financials & Banking (10 Stocks)',
    description: 'Tier-1 investment banks, asset managers, and credit networks',
    icon: Building2,
    tickers: ['JPM', 'BAC', 'GS', 'MS', 'BLK', 'V', 'MA', 'SPY', 'DIA', 'IWM'],
  },
  {
    id: 'healthcare-pharma',
    name: 'Healthcare & Biotechnology (8 Stocks)',
    description: 'Top pharmaceutical innovations, oncology, and health services',
    icon: Layers,
    tickers: ['LLY', 'UNH', 'JNJ', 'ABBV', 'MRK', 'V', 'WMT', 'COST'],
  },
  {
    id: 'consumer-energy',
    name: 'Consumer & Energy Giants (10 Stocks)',
    description: 'Global retail, restaurants, beverages, and energy infrastructure',
    icon: Zap,
    tickers: ['WMT', 'COST', 'HD', 'MCD', 'KO', 'PEP', 'XOM', 'CVX', 'CAT', 'BA'],
  },
];

export const StockMarketTable: React.FC<StockMarketTableProps> = ({
  onSelectTickerForTerminal,
  onRunAnalysisForTicker,
  onGenerateStoryForTicker,
  onRunAutonomousWorkflow,
}) => {
  // Ticker items in table
  const [stocks, setStocks] = useState<CompanyOverview[]>([]);
  const [newTickerInput, setNewTickerInput] = useState('');
  const [isAddingTicker, setIsAddingTicker] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [tableError, setTableError] = useState<string | null>(null);

  // Pagination for "Load More" from the global universe
  const [universePage, setUniversePage] = useState<number>(1);
  const [hasMoreInUniverse, setHasMoreInUniverse] = useState<boolean>(true);
  const [totalInUniverse, setTotalInUniverse] = useState<number>(40);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter state
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedPresetGroup, setSelectedPresetGroup] = useState<string>('all');

  // Selected Stock for Details Modal
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<CompanyOverview | null>(null);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string | null>(null);
  const { startAction, finishAction } = useActionIndicator();

  // Add a user-specified ticker
  const handleAddTicker = async (tickerToAdd?: string) => {
    const symbol = (tickerToAdd || newTickerInput).trim().toUpperCase();
    if (!symbol) return;

    if (stocks.some((s) => s.symbol === symbol)) {
      setTableError(`Ticker ${symbol} is already loaded in the market table.`);
      return;
    }

    setIsAddingTicker(true);
    setTableError(null);
    const actionId = startAction(`Adding ${symbol} to Scanner`, 'Fetching company overview, market cap & technicals');

    try {
      const companyData = await fetchCompanyOverview(symbol);
      setStocks((prev) => [companyData, ...prev]);
      setNewTickerInput('');
      setLastRefreshedTime(new Date().toLocaleTimeString());
      finishAction(actionId, true, undefined, `Added ${symbol} ($${companyData.price.toFixed(2)})`);
    } catch (err: any) {
      const errMsg = err.message || `Failed to fetch real-time market data for ${symbol}`;
      setTableError(errMsg);
      finishAction(actionId, false, errMsg);
    } finally {
      setIsAddingTicker(false);
    }
  };

  // Load Preset Group
  const handleLoadPreset = async (tickers: string[]) => {
    setIsRefreshing(true);
    setTableError(null);
    const actionId = startAction(`Loading Preset (${tickers.length} Assets)`, `Batch querying real-time prices for ${tickers.slice(0, 4).join(', ')}...`);
    try {
      const results = await fetchBatchCompanyOverviews(tickers);
      setStocks((prev) => {
        const existingSymbols = new Set(prev.map((s) => s.symbol));
        const newUnique = results.filter((r) => !existingSymbols.has(r.symbol));
        return [...prev, ...newUnique];
      });
      setLastRefreshedTime(new Date().toLocaleTimeString());
      finishAction(actionId, true, undefined, `Loaded ${results.length} stocks successfully`);
    } catch (err: any) {
      const errMsg = err.message || 'Failed to load preset group';
      setTableError(errMsg);
      finishAction(actionId, false, errMsg);
    } finally {
      setIsRefreshing(false);
    }
  };

  // "Load Initial Universe" or "Load Next Batch of Stocks"
  const handleLoadMoreFromUniverse = async (batchSize = 15) => {
    setIsLoadingMore(true);
    setTableError(null);
    const actionId = startAction('Loading Universe Batch', `Fetching ${batchSize} stocks from curated sector catalog`);

    try {
      const nextPage = universePage;
      const data = await fetchStockUniverse(nextPage, batchSize, selectedSector);

      if (data.stocks && data.stocks.length > 0) {
        setStocks((prev) => {
          const existingSymbols = new Set(prev.map((s) => s.symbol));
          const newUnique = data.stocks.filter((r) => !existingSymbols.has(r.symbol));
          return [...prev, ...newUnique];
        });
        setUniversePage(nextPage + 1);
        setHasMoreInUniverse(data.hasMore);
        setTotalInUniverse(data.total);
        setLastRefreshedTime(new Date().toLocaleTimeString());
        finishAction(actionId, true, undefined, `Added ${data.stocks.length} assets (Page ${nextPage})`);
      } else {
        setHasMoreInUniverse(false);
        finishAction(actionId, true, undefined, 'Universe fully loaded');
      }
    } catch (err: any) {
      const errMsg = err.message || 'Failed to load more stocks from universe';
      setTableError(errMsg);
      finishAction(actionId, false, errMsg);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Load All Curated Stocks at once
  const handleLoadAllStocks = async () => {
    setIsLoadingMore(true);
    setTableError(null);
    const actionId = startAction('Loading All Curated Stocks', 'Batch ingesting 100 benchmark assets');
    try {
      const data = await fetchStockUniverse(1, 100, 'All');
      if (data.stocks && data.stocks.length > 0) {
        setStocks((prev) => {
          const existingSymbols = new Set(prev.map((s) => s.symbol));
          const newUnique = data.stocks.filter((r) => !existingSymbols.has(r.symbol));
          return [...prev, ...newUnique];
        });
        setUniversePage(5);
        setHasMoreInUniverse(false);
        setTotalInUniverse(data.total);
        setLastRefreshedTime(new Date().toLocaleTimeString());
        finishAction(actionId, true, undefined, `Populated ${data.stocks.length} benchmark stocks`);
      }
    } catch (err: any) {
      const errMsg = err.message || 'Failed to load all universe stocks';
      setTableError(errMsg);
      finishAction(actionId, false, errMsg);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Refresh All Loaded Tickers
  const handleRefreshAll = async () => {
    if (stocks.length === 0) return;
    setIsRefreshing(true);
    setTableError(null);
    const actionId = startAction(`Refreshing ${stocks.length} Assets`, 'Re-fetching live prices & percentage shifts');

    try {
      const symbols = stocks.map((s) => s.symbol);
      const updated = await fetchBatchCompanyOverviews(symbols);
      setStocks(updated);
      setLastRefreshedTime(new Date().toLocaleTimeString());
      finishAction(actionId, true, undefined, `Updated ${updated.length} quotes`);
    } catch (err: any) {
      const errMsg = err.message || 'Failed to refresh market prices';
      setTableError(errMsg);
      finishAction(actionId, false, errMsg);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Clear all loaded stocks
  const handleClearAll = () => {
    const actionId = startAction('Clearing Scanner Table', 'Resetting active scanner list');
    setStocks([]);
    setUniversePage(1);
    setHasMoreInUniverse(true);
    finishAction(actionId, true, undefined, 'Table cleared');
  };

  // Remove single ticker
  const handleRemoveTicker = (symbol: string) => {
    const actionId = startAction(`Removing ${symbol}`, 'Removed from local scanner');
    setStocks((prev) => prev.filter((s) => s.symbol !== symbol));
    finishAction(actionId, true, undefined, `${symbol} removed`);
  };

  // Sort Toggle Handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(
        field === 'symbol' || field === 'companyName' || field === 'sector' ? 'asc' : 'desc'
      );
    }
  };

  // Extract unique sectors
  const availableSectors = useMemo(() => {
    const set = new Set<string>();
    stocks.forEach((s) => {
      if (s.sector) set.add(s.sector);
    });
    return ['All', ...Array.from(set)];
  }, [stocks]);

  // Filtered & Sorted Stocks
  const filteredAndSortedStocks = useMemo(() => {
    return stocks
      .filter((s) => {
        const matchesQuery =
          s.symbol.toLowerCase().includes(searchFilter.toLowerCase()) ||
          s.companyName.toLowerCase().includes(searchFilter.toLowerCase()) ||
          s.sector.toLowerCase().includes(searchFilter.toLowerCase()) ||
          (s.industry && s.industry.toLowerCase().includes(searchFilter.toLowerCase()));
        const matchesSector = selectedSector === 'All' || s.sector === selectedSector;
        return matchesQuery && matchesSector;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (valA === undefined || valA === null) valA = 0;
        if (valB === undefined || valB === null) valB = 0;

        if (typeof valA === 'string') {
          return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        return sortDirection === 'asc' ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
      });
  }, [stocks, searchFilter, selectedSector, sortField, sortDirection]);

  // Export CSV
  const handleExportCSV = () => {
    if (stocks.length === 0) return;
    const actionId = startAction('Exporting Scanner Dataset', `Packaging ${filteredAndSortedStocks.length} records into CSV`);

    const headers = [
      'Symbol',
      'Company Name',
      'Sector',
      'Industry',
      'Price (USD)',
      'Change ($)',
      'Change (%)',
      '52W Low',
      '52W High',
      'Market Cap',
      'P/E Ratio',
      'Volume',
      'Beta',
      'Dividend Yield',
      'Exchange',
    ];

    const rows = filteredAndSortedStocks.map((s) => [
      s.symbol,
      `"${s.companyName.replace(/"/g, '""')}"`,
      `"${s.sector}"`,
      `"${s.industry || ''}"`,
      s.price.toFixed(2),
      s.change.toFixed(2),
      s.changePercent.toFixed(2),
      s.low52.toFixed(2),
      s.high52.toFixed(2),
      s.marketCap || 0,
      s.peRatio || 'N/A',
      s.volume,
      s.beta ?? 'N/A',
      s.dividendYield ? `${(s.dividendYield * 100).toFixed(2)}%` : '0%',
      s.exchange,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `StockPulse_Market_Universe_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    finishAction(actionId, true, undefined, `Exported ${filteredAndSortedStocks.length} rows`);
  };

  // Helper formatter for Market Cap
  const formatMarketCap = (cap?: number) => {
    if (!cap) return 'N/A';
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  // Helper formatter for Volume
  const formatVolume = (vol: number) => {
    if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
    if (vol >= 1e3) return `${(vol / 1e3).toFixed(1)}k`;
    return vol.toLocaleString();
  };

  // Render Sort Header Column
  const renderSortHeader = (label: string, field: SortField, className = '') => {
    const isActive = sortField === field;
    return (
      <th
        onClick={() => handleSort(field)}
        className={`cursor-pointer px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-300 transition select-none hover:bg-slate-800/80 hover:text-white ${className}`}
      >
        <div className="flex items-center gap-1.5">
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="h-3.5 w-3.5 text-cyan-400" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5 text-cyan-400" />
            )
          ) : (
            <ArrowUpDown className="h-3 w-3 text-slate-500 opacity-60" />
          )}
        </div>
      </th>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Header Title & Status */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-cyan-400 border border-cyan-500/30">
                REAL-TIME MARKET SCANNER
              </span>
              <span className="text-xs text-slate-400">
                Global Equity Universe • Sortable &amp; Infinite Expansion
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Multi-Asset Stock Market Scanner &amp; Data Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Monitor real-time prices, 24h momentum, 52-week channels, market caps, P/E ratios, and
              institutional balance sheet metrics. Ingest hundreds of securities, load incremental
              batches, or run instant Gemini 3.7 Flash quantitative modeling.
            </p>
          </div>

          {/* Quick Actions & Refreshes */}
          <div className="flex flex-wrap items-center gap-2.5">
            {lastRefreshedTime && (
              <div className="text-right hidden sm:block mr-1">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  Last Synced
                </span>
                <span className="text-xs font-mono font-medium text-slate-300">
                  {lastRefreshedTime}
                </span>
              </div>
            )}

            <button
              onClick={handleRefreshAll}
              disabled={isRefreshing || stocks.length === 0}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition disabled:opacity-40"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`}
              />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh All'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={stocks.length === 0}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>

            {stocks.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 transition"
                title="Clear loaded stocks table"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear Table</span>
              </button>
            )}
          </div>
        </div>

        {/* Input Bar & Preset Quick-Ingest */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTicker();
              }}
              className="relative flex-1"
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Add any stock symbol (e.g. NVDA, AAPL, MSFT, TSLA, PLTR, AMZN, LLY, JPM, WMT, COIN)..."
                value={newTickerInput}
                onChange={(e) => setNewTickerInput(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-28 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 shadow-inner"
              />
              <button
                type="submit"
                disabled={isAddingTicker || !newTickerInput.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 text-xs font-bold text-white transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isAddingTicker ? 'Fetching...' : 'Add Ticker'}</span>
              </button>
            </form>

            {/* Ingest Universe Quick Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleLoadMoreFromUniverse(15)}
                disabled={isLoadingMore}
                className="flex items-center gap-1.5 rounded-2xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 hover:bg-cyan-500 transition disabled:opacity-50"
              >
                <Database className="h-3.5 w-3.5" />
                <span>{isLoadingMore ? 'Loading Universe...' : 'Load +15 Stocks'}</span>
              </button>

              <button
                onClick={handleLoadAllStocks}
                disabled={isLoadingMore}
                className="flex items-center gap-1.5 rounded-2xl border border-indigo-500/40 bg-indigo-950/40 px-3.5 py-2.5 text-xs font-bold text-indigo-300 hover:bg-indigo-900/60 hover:text-white transition disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Load All Sectors (40+)</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
              <Zap className="h-3 w-3 text-cyan-400" /> Sector Baskets:
            </span>
            {PRESET_COLLECTIONS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset.tickers)}
                disabled={isRefreshing || isLoadingMore}
                className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-cyan-500/40 hover:bg-slate-800/80 hover:text-cyan-300 transition"
              >
                <span>+ {preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error notification */}
        {tableError && (
          <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-center justify-between">
            <span>{tableError}</span>
            <button
              onClick={() => setTableError(null)}
              className="text-rose-400 font-bold underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Filter & Live Search Bar */}
      {stocks.length > 0 && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3.5 backdrop-blur shadow">
          {/* Search Filter */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by symbol, company or industry..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Sector Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Sector:</span>
            {availableSectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition ${
                  selectedSector === sec
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Item Count Display */}
          <div className="text-xs text-slate-400 font-medium whitespace-nowrap self-end md:self-auto">
            Showing <strong className="text-white">{filteredAndSortedStocks.length}</strong> of{' '}
            <strong className="text-white">{stocks.length}</strong> loaded assets
          </div>
        </div>
      )}

      {/* Main Sortable Table View or Clean Start State */}
      {stocks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-10 sm:p-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-4 shadow-inner">
            <BarChart3 className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Stock Market Scanner Table is Empty</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-1.5 mb-6">
            Click below to load a large universe of market stocks, or select one of the curated
            baskets to inspect live metrics, 52-week channels, and valuations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleLoadMoreFromUniverse(15)}
              disabled={isLoadingMore}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-xs font-bold text-white shadow-xl shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition"
            >
              <Database className="h-4 w-4" />
              <span>Load 15 Market Leaders</span>
            </button>

            <button
              onClick={handleLoadAllStocks}
              disabled={isLoadingMore}
              className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Load All Sectors (40+ Stocks)</span>
            </button>
          </div>

          {/* Preset Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto text-left">
            {PRESET_COLLECTIONS.slice(0, 3).map((group) => {
              const Icon = group.icon;
              return (
                <button
                  key={group.id}
                  onClick={() => handleLoadPreset(group.tickers)}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 hover:border-cyan-500/40 hover:bg-slate-900 transition group text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                      {group.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{group.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="border-b border-slate-800 bg-slate-950/90">
                  <tr>
                    {renderSortHeader('Ticker', 'symbol')}
                    {renderSortHeader('Company & Sector', 'companyName')}
                    {renderSortHeader('Price', 'price')}
                    {renderSortHeader('24h Change', 'changePercent')}
                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-300">
                      52-Week Range
                    </th>
                    {renderSortHeader('Market Cap', 'marketCap')}
                    {renderSortHeader('P/E Ratio', 'peRatio')}
                    {renderSortHeader('Volume', 'volume')}
                    <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-300">
                      Analyst Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredAndSortedStocks.map((stock) => {
                    const isPositive = stock.change >= 0;
                    const rangeSpan = Math.max(0.01, stock.high52 - stock.low52);
                    const positionIn52Range = Math.min(
                      100,
                      Math.max(0, ((stock.price - stock.low52) / rangeSpan) * 100)
                    );

                    return (
                      <tr key={stock.symbol} className="group transition hover:bg-slate-800/50">
                        {/* Symbol & Badge */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onSelectTickerForTerminal(stock.symbol)}
                              className="font-mono text-sm font-extrabold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                              title="Open in Candlestick Terminal"
                            >
                              {stock.symbol}
                            </button>
                            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-700">
                              {stock.exchange}
                            </span>
                          </div>
                        </td>

                        {/* Company Name & Sector */}
                        <td className="px-4 py-3.5 max-w-xs">
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-cyan-200 transition line-clamp-1">
                              {stock.companyName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium truncate">
                              {stock.sector} • {stock.industry}
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="text-sm font-black text-white font-mono">
                            ${stock.price.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">USD</div>
                        </td>

                        {/* 24h Change */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div
                            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold font-mono ${
                              isPositive
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {isPositive ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span>
                              {isPositive ? '+' : ''}
                              {stock.change.toFixed(2)} ({isPositive ? '+' : ''}
                              {stock.changePercent.toFixed(2)}%)
                            </span>
                          </div>
                        </td>

                        {/* 52-Week Range Bar */}
                        <td className="px-4 py-3.5 min-w-[140px]">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-slate-400">
                              <span>${stock.low52.toFixed(1)}</span>
                              <span>${stock.high52.toFixed(1)}</span>
                            </div>
                            <div className="relative h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                style={{ width: `${positionIn52Range}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Market Cap */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-xs font-bold text-slate-200 font-mono">
                          {formatMarketCap(stock.marketCap)}
                        </td>

                        {/* P/E Ratio */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-xs font-semibold text-slate-300 font-mono">
                          {stock.peRatio ? stock.peRatio.toFixed(1) : 'N/A'}
                        </td>

                        {/* Volume */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-300 font-mono">
                          {formatVolume(stock.volume)}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* 1-Action Presentation Workflow */}
                            {onRunAutonomousWorkflow && (
                              <button
                                onClick={() => onRunAutonomousWorkflow(stock.symbol)}
                                title="1-Action Executive Presentation (Analysis + Visuals + Voice)"
                                className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 p-1.5 text-white hover:from-cyan-400 hover:to-blue-500 shadow-sm transition"
                              >
                                <Zap className="h-3.5 w-3.5 fill-white" />
                              </button>
                            )}

                            {/* Launch in Terminal */}
                            <button
                              onClick={() => onSelectTickerForTerminal(stock.symbol)}
                              title="Open in Terminal & Candlestick Chart"
                              className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-300 transition"
                            >
                              <BarChart3 className="h-3.5 w-3.5" />
                            </button>

                            {/* Run Gemini Analysis */}
                            <button
                              onClick={() => onRunAnalysisForTicker(stock.symbol)}
                              title="Run Gemini 3.7 Quantitative Synthesis"
                              className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-1.5 text-cyan-400 hover:bg-cyan-500/20 transition"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                            </button>

                            {/* Company Details Modal */}
                            <button
                              onClick={() => setSelectedCompanyModal(stock)}
                              title="View Detailed Company Dossier & Fundamentals"
                              className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:border-slate-600 hover:text-white transition"
                            >
                              <Info className="h-3.5 w-3.5" />
                            </button>

                            {/* Remove from watchlist table */}
                            <button
                              onClick={() => handleRemoveTicker(stock.symbol)}
                              title="Remove from Market Table"
                              className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-500 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom "Load More Stocks" Pagination Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur">
            <div className="text-xs text-slate-400">
              Showing <strong className="text-white">{filteredAndSortedStocks.length}</strong> stocks
              in table view
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleLoadMoreFromUniverse(15)}
                disabled={isLoadingMore}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-cyan-500 hover:to-blue-500 transition disabled:opacity-50"
              >
                <Plus className={`h-3.5 w-3.5 ${isLoadingMore ? 'animate-spin' : ''}`} />
                <span>{isLoadingMore ? 'Fetching Next Batch...' : 'Load 15 More Stocks'}</span>
              </button>

              <button
                onClick={handleLoadAllStocks}
                disabled={isLoadingMore}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
              >
                Load All Stocks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Fundamentals Detailed Modal */}
      {selectedCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedCompanyModal(null)}
              className="absolute right-5 top-5 rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-inner">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">
                    {selectedCompanyModal.companyName}
                  </h3>
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                    {selectedCompanyModal.symbol}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {selectedCompanyModal.sector} • {selectedCompanyModal.industry} (
                  {selectedCompanyModal.exchange})
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Company Overview &amp; Profile
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                {selectedCompanyModal.description}
              </p>
            </div>

            {/* Fundamentals Grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  Current Price
                </span>
                <span className="text-base font-black text-white font-mono">
                  ${selectedCompanyModal.price.toFixed(2)}
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  Market Cap
                </span>
                <span className="text-base font-black text-cyan-400 font-mono">
                  {formatMarketCap(selectedCompanyModal.marketCap)}
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  P/E Ratio
                </span>
                <span className="text-base font-black text-slate-200 font-mono">
                  {selectedCompanyModal.peRatio ? selectedCompanyModal.peRatio.toFixed(1) : 'N/A'}
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  Beta (5Y)
                </span>
                <span className="text-base font-black text-slate-200 font-mono">
                  {selectedCompanyModal.beta ?? '1.05'}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  52W Range
                </span>
                <span className="text-xs font-bold text-slate-200 font-mono">
                  ${selectedCompanyModal.low52.toFixed(1)} - ${selectedCompanyModal.high52.toFixed(1)}
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  Dividend Yield
                </span>
                <span className="text-xs font-bold text-slate-200 font-mono">
                  {selectedCompanyModal.dividendYield
                    ? `${(selectedCompanyModal.dividendYield * 100).toFixed(2)}%`
                    : '0.00%'}
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  EPS (TTM)
                </span>
                <span className="text-xs font-bold text-slate-200 font-mono">
                  ${selectedCompanyModal.eps ? selectedCompanyModal.eps.toFixed(2) : 'N/A'}
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  CEO
                </span>
                <span className="text-xs font-bold text-slate-200 truncate block">
                  {selectedCompanyModal.ceo || 'Executive Board'}
                </span>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-800">
              {selectedCompanyModal.website && (
                <a
                  href={selectedCompanyModal.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Company Website</span>
                </a>
              )}

              <button
                onClick={() => {
                  const sym = selectedCompanyModal.symbol;
                  setSelectedCompanyModal(null);
                  onSelectTickerForTerminal(sym);
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Launch in Terminal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
