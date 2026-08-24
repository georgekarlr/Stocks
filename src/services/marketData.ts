import { CompanyOverview, StockCandle, StockQuote } from '../types/stock';

export interface MarketHistoryResponse {
  candles: StockCandle[];
  quote: StockQuote;
  companyOverview?: CompanyOverview;
}

/**
 * Fetch historical OHLCV data for a ticker
 */
export async function fetchStockHistory(
  ticker: string,
  range = '1y',
  interval = '1d',
  signal?: AbortSignal
): Promise<MarketHistoryResponse> {
  const normalizedTicker = ticker.trim().toUpperCase();
  const response = await fetch(
    `/api/stock/history?ticker=${encodeURIComponent(normalizedTicker)}&range=${encodeURIComponent(
      range
    )}&interval=${encodeURIComponent(interval)}`,
    { signal }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to fetch historical data for ${normalizedTicker}`);
  }

  return response.json();
}

/**
 * Fetch current real-time stock quote
 */
export async function fetchStockQuote(ticker: string, signal?: AbortSignal): Promise<StockQuote> {
  const normalizedTicker = ticker.trim().toUpperCase();
  const response = await fetch(`/api/stock/quote?ticker=${encodeURIComponent(normalizedTicker)}`, { signal });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to fetch quote for ${normalizedTicker}`);
  }

  return response.json();
}

/**
 * Fetch comprehensive company profile, fundamental metrics, and current price data
 */
export async function fetchCompanyOverview(ticker: string, signal?: AbortSignal): Promise<CompanyOverview> {
  const normalizedTicker = ticker.trim().toUpperCase();
  const response = await fetch(`/api/stock/company?ticker=${encodeURIComponent(normalizedTicker)}`, { signal });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to fetch company overview for ${normalizedTicker}`);
  }

  return response.json();
}

/**
 * Fetch batch company overviews and market metrics for multiple tickers in the sortable table
 */
export async function fetchBatchCompanyOverviews(tickers: string[]): Promise<CompanyOverview[]> {
  if (!tickers || tickers.length === 0) {
    return [];
  }

  const cleanTickers = tickers.map((t) => t.trim().toUpperCase()).filter(Boolean);
  const response = await fetch('/api/stock/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tickers: cleanTickers }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch batch stock table data');
  }

  const data = await response.json();
  return data.stocks || [];
}

/**
 * Search ticker symbols or company names
 */
/**
 * Search ticker symbols or company names
 */
export async function searchTickers(query: string): Promise<Array<{ symbol: string; name: string; sector: string }>> {
  if (!query.trim()) return [];
  
  const response = await fetch(`/api/stock/search?q=${encodeURIComponent(query.trim())}`);
  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.results || [];
}

export interface StockUniverseResponse {
  stocks: CompanyOverview[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  availableSectors: string[];
}

/**
 * Fetch paginated stock universe with optional sector and search filter
 */
export async function fetchStockUniverse(
  page = 1,
  limit = 20,
  sector = 'All',
  query = ''
): Promise<StockUniverseResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sector,
    q: query,
  });

  const response = await fetch(`/api/stock/universe?${params.toString()}`);
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch stock market universe');
  }

  return response.json();
}

