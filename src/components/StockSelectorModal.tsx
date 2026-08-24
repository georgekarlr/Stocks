import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  Building2,
  TableProperties,
  CheckCircle2,
  Zap,
  Layers,
  ChevronRight,
  Plus,
  Globe,
} from 'lucide-react';
import { searchTickers } from '../services/marketData';

interface StockSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (symbol: string) => void;
  currentTicker: string | null;
  onOpenMarketTable?: () => void;
  onClearActiveStock?: () => void;
  recentTickers?: string[];
}

interface StockItem {
  symbol: string;
  name: string;
  sector: string;
  category: string;
}

const EXTENDED_STOCK_CATALOG: StockItem[] = [
  // Magnificent 7 & Mega Tech
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Semiconductors & AI', category: 'Tech Titans' },
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Consumer Electronics & OS', category: 'Tech Titans' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Cloud & Enterprise AI', category: 'Tech Titans' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', sector: 'E-Commerce & AWS Cloud', category: 'Tech Titans' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Search & DeepMind AI', category: 'Tech Titans' },
  { symbol: 'META', name: 'Meta Platforms, Inc.', sector: 'Social Media & LLaMA AI', category: 'Tech Titans' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'Electric Vehicles & Robotics', category: 'Tech Titans' },

  // AI & Next-Gen Semiconductors
  { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Semiconductors', category: 'AI & Chips' },
  { symbol: 'AVGO', name: 'Broadcom Inc.', sector: 'Semiconductors & Infrastructure', category: 'AI & Chips' },
  { symbol: 'PLTR', name: 'Palantir Technologies', sector: 'Enterprise AI & Defense', category: 'AI & Chips' },
  { symbol: 'ARM', name: 'Arm Holdings plc', sector: 'Semiconductor IP & Architecture', category: 'AI & Chips' },
  { symbol: 'SMCI', name: 'Super Micro Computer', sector: 'AI Server & Liquid Cooling', category: 'AI & Chips' },
  { symbol: 'TSM', name: 'Taiwan Semiconductor Manufacturing', sector: 'Silicon Foundry', category: 'AI & Chips' },
  { symbol: 'ASML', name: 'ASML Holding N.V.', sector: 'EUV Lithography Equipment', category: 'AI & Chips' },
  { symbol: 'QCOM', name: 'QUALCOMM Incorporated', sector: 'Mobile Processors & AI', category: 'AI & Chips' },
  { symbol: 'INTC', name: 'Intel Corporation', sector: 'Semiconductors & Foundry', category: 'AI & Chips' },

  // Financials & Global Banking
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Diversified Banking', category: 'Financials' },
  { symbol: 'BAC', name: 'Bank of America Corp', sector: 'Commercial Banking', category: 'Financials' },
  { symbol: 'GS', name: 'Goldman Sachs Group', sector: 'Investment Banking & Trading', category: 'Financials' },
  { symbol: 'MS', name: 'Morgan Stanley', sector: 'Wealth & Asset Management', category: 'Financials' },
  { symbol: 'BLK', name: 'BlackRock, Inc.', sector: 'Asset Management & iShares', category: 'Financials' },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Digital Payments Network', category: 'Financials' },
  { symbol: 'MA', name: 'Mastercard Incorporated', sector: 'Credit & Payment Processing', category: 'Financials' },

  // Healthcare & Biotechnology
  { symbol: 'LLY', name: 'Eli Lilly and Company', sector: 'Pharmaceuticals & GLP-1', category: 'Healthcare' },
  { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Managed Healthcare & Optum', category: 'Healthcare' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Pharma & MedTech', category: 'Healthcare' },
  { symbol: 'ABBV', name: 'AbbVie Inc.', sector: 'Biopharmaceuticals & Immunology', category: 'Healthcare' },
  { symbol: 'MRK', name: 'Merck & Co., Inc.', sector: 'Immuno-Oncology & Vaccines', category: 'Healthcare' },

  // Consumer, Retail & Energy
  { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Global Retail & E-Commerce', category: 'Consumer & Energy' },
  { symbol: 'COST', name: 'Costco Wholesale Corp', sector: 'Warehouse Retail', category: 'Consumer & Energy' },
  { symbol: 'HD', name: 'The Home Depot, Inc.', sector: 'Home Improvement Retail', category: 'Consumer & Energy' },
  { symbol: 'MCD', name: "McDonald's Corporation", sector: 'Global Quick Service Franchising', category: 'Consumer & Energy' },
  { symbol: 'KO', name: 'The Coca-Cola Company', sector: 'Non-Alcoholic Beverages', category: 'Consumer & Energy' },
  { symbol: 'PEP', name: 'PepsiCo, Inc.', sector: 'Beverages & Snacks', category: 'Consumer & Energy' },
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Integrated Energy & Oil', category: 'Consumer & Energy' },
  { symbol: 'CVX', name: 'Chevron Corporation', sector: 'Energy & Refining', category: 'Consumer & Energy' },
  { symbol: 'CAT', name: 'Caterpillar Inc.', sector: 'Heavy Machinery & Mining', category: 'Consumer & Energy' },
  { symbol: 'BA', name: 'The Boeing Company', sector: 'Aerospace & Defense', category: 'Consumer & Energy' },

  // ETFs & Market Indices
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', sector: 'US Large-Cap Benchmark', category: 'ETFs & Macro' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', sector: 'Nasdaq-100 Tech Leaders', category: 'ETFs & Macro' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', sector: 'US Small-Cap Equity', category: 'ETFs & Macro' },
  { symbol: 'DIA', name: 'SPDR Dow Jones Industrial', sector: 'US Blue-Chip Benchmark', category: 'ETFs & Macro' },
  { symbol: 'SMH', name: 'VanEck Semiconductor ETF', sector: 'Global Semiconductor Index', category: 'ETFs & Macro' },
];

export const StockSelectorModal: React.FC<StockSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectStock,
  currentTicker,
  onOpenMarketTable,
  onClearActiveStock,
  recentTickers = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ symbol: string; name: string; sector: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Perform search debounced
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchTickers(searchQuery);
        setSearchResults(results);
      } catch (err) {
        setSearchResults([
          {
            symbol: searchQuery.toUpperCase().trim(),
            name: `${searchQuery.toUpperCase().trim()} Security`,
            sector: 'Public Equity',
          },
        ]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Categories list
  const categories = useMemo(() => {
    return ['All', 'Tech Titans', 'AI & Chips', 'Financials', 'Healthcare', 'Consumer & Energy', 'ETFs & Macro'];
  }, []);

  // Filtered Catalog
  const filteredCatalog = useMemo(() => {
    if (selectedCategory === 'All') return EXTENDED_STOCK_CATALOG;
    return EXTENDED_STOCK_CATALOG.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const displayedCatalog = useMemo(() => {
    return filteredCatalog.slice(0, visibleCount);
  }, [filteredCatalog, visibleCount]);

  if (!isOpen) return null;

  const handleSelect = (symbol: string) => {
    onSelectStock(symbol.trim().toUpperCase());
    setSearchQuery('');
    onClose();
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSelect(searchQuery);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Modal Top Header */}
        <div className="border-b border-slate-800/80 bg-slate-950/70 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-inner">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Select Stock or Switch Asset</h3>
                <p className="text-xs text-slate-400">
                  Search any global ticker or browse from over 40+ curated market leaders
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
              title="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleDirectSubmit} className="mt-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search ticker symbol or company (e.g. NVDA, AAPL, TSLA, SPY, AMD, PLTR, LLY)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-28 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 shadow-inner"
            />
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:from-cyan-400 hover:to-blue-500 transition disabled:opacity-40"
            >
              <span>Select</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Current Active Status & Quick Actions */}
          {currentTicker && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-2">
                <span>Currently Active:</span>
                <span className="font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  {currentTicker}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {onClearActiveStock && (
                  <button
                    onClick={() => {
                      onClearActiveStock();
                      onClose();
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline transition"
                  >
                    Clear Active Stock (Launchpad)
                  </button>
                )}
                {onOpenMarketTable && (
                  <button
                    onClick={() => {
                      onOpenMarketTable();
                      onClose();
                    }}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition"
                  >
                    <TableProperties className="h-3.5 w-3.5" />
                    <span>Open Market Table</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Category Pill Filters (when not actively searching) */}
        {!searchQuery.trim() && (
          <div className="border-b border-slate-800/60 bg-slate-950/40 px-5 py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 shrink-0">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(12);
                }}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Modal Body / Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          {/* Dynamic Search Results */}
          {searchQuery.trim().length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Search Results {isSearching ? '(Searching...)' : `(${searchResults.length})`}
                </span>
                <span className="text-[11px] text-slate-500">Press Enter or click to load</span>
              </div>

              {searchResults.length === 0 && !isSearching ? (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center">
                  <p className="text-xs text-slate-400">
                    No directory matches for "{searchQuery}". You can still click below to load this symbol directly via real-time market API.
                  </p>
                  <button
                    onClick={() => handleSelect(searchQuery)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition"
                  >
                    <span>Load "{searchQuery.toUpperCase().trim()}" from Market API</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {searchResults.map((stock) => {
                    const isCurrent = stock.symbol === currentTicker;
                    return (
                      <button
                        key={stock.symbol}
                        onClick={() => handleSelect(stock.symbol)}
                        className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                          isCurrent
                            ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                            : 'border-slate-800 bg-slate-950/70 text-slate-200 hover:border-slate-700 hover:bg-slate-800/70'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-sm text-cyan-400">
                              {stock.symbol}
                            </span>
                            {isCurrent && (
                              <span className="rounded bg-cyan-500/20 px-1.5 py-0.2 text-[10px] font-bold text-cyan-300">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-slate-300 truncate mt-0.5">
                            {stock.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{stock.sector}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Recently Viewed / Analyzed */}
              {recentTickers.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" /> Recent Stocks
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {recentTickers.map((sym) => (
                      <button
                        key={sym}
                        onClick={() => handleSelect(sym)}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold font-mono transition ${
                          sym === currentTicker
                            ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-300'
                            : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <span>{sym}</span>
                        {sym === currentTicker && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Extended Stock Catalog Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Market Leaders ({displayedCatalog.length} of {filteredCatalog.length})
                  </span>
                  <span className="text-[11px] text-slate-500">1-click switch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {displayedCatalog.map((item) => {
                    const isCurrent = item.symbol === currentTicker;
                    return (
                      <button
                        key={item.symbol}
                        onClick={() => handleSelect(item.symbol)}
                        className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                          isCurrent
                            ? 'border-cyan-500/60 bg-cyan-500/15 text-white shadow-md'
                            : 'border-slate-800/80 bg-slate-950/60 text-slate-300 hover:border-cyan-500/30 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-sm text-cyan-400">
                              {item.symbol}
                            </span>
                            {isCurrent && (
                              <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-slate-200 truncate mt-0.5">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">{item.sector}</div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>

                {/* Load More Button in Modal */}
                {visibleCount < filteredCatalog.length && (
                  <div className="pt-3 text-center">
                    <button
                      onClick={handleLoadMore}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-slate-700 hover:text-white transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Load More Stocks (+12)</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer info & Market Table link */}
        <div className="border-t border-slate-800/80 bg-slate-950/80 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">
            Powered by Alpha Vantage, Polygon.io & Gemini 3.7 Flash
          </span>

          <div className="flex items-center gap-2">
            {onOpenMarketTable && (
              <button
                onClick={() => {
                  onOpenMarketTable();
                  onClose();
                }}
                className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
              >
                <TableProperties className="h-3.5 w-3.5" />
                <span>Multi-Asset Market Scanner</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
