import { StockCandle, StockQuote } from '../types/stock';

export interface CSVParseResult {
  symbol: string;
  candles: StockCandle[];
  quote: StockQuote;
}

export function parseStockCSV(csvText: string, defaultSymbol = 'CUSTOM'): CSVParseResult {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) {
    throw new Error('CSV file must contain a header row and at least one data row.');
  }

  const rawHeaders = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));

  // Detect column indexes
  const dateIdx = rawHeaders.findIndex((h) => h.includes('date') || h.includes('time') || h.includes('timestamp'));
  const openIdx = rawHeaders.findIndex((h) => h === 'open' || h.includes('open_price') || h.includes('open'));
  const highIdx = rawHeaders.findIndex((h) => h === 'high' || h.includes('high_price') || h.includes('max'));
  const lowIdx = rawHeaders.findIndex((h) => h === 'low' || h.includes('low_price') || h.includes('min'));
  const closeIdx = rawHeaders.findIndex(
    (h) => h === 'close' || h.includes('adj close') || h.includes('last') || h.includes('price')
  );
  const volumeIdx = rawHeaders.findIndex((h) => h.includes('vol') || h.includes('shares') || h.includes('quantity'));

  if (closeIdx === -1) {
    throw new Error('Could not find Close or Price column in the CSV.');
  }

  const candles: StockCandle[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(',').map((c) => c.trim().replace(/['"$]/g, ''));

    const rawClose = parseFloat(cols[closeIdx]);
    if (isNaN(rawClose)) continue;

    const rawOpen = openIdx !== -1 && !isNaN(parseFloat(cols[openIdx])) ? parseFloat(cols[openIdx]) : rawClose;
    const rawHigh = highIdx !== -1 && !isNaN(parseFloat(cols[highIdx])) ? parseFloat(cols[highIdx]) : Math.max(rawOpen, rawClose);
    const rawLow = lowIdx !== -1 && !isNaN(parseFloat(cols[lowIdx])) ? parseFloat(cols[lowIdx]) : Math.min(rawOpen, rawClose);
    const rawVol = volumeIdx !== -1 && !isNaN(parseFloat(cols[volumeIdx])) ? Math.round(parseFloat(cols[volumeIdx])) : 100000;

    let dateStr = `Day ${i}`;
    let ts = Date.now() - (lines.length - i) * 86400000;

    if (dateIdx !== -1 && cols[dateIdx]) {
      const parsedDate = new Date(cols[dateIdx]);
      if (!isNaN(parsedDate.getTime())) {
        dateStr = parsedDate.toISOString().split('T')[0];
        ts = parsedDate.getTime();
      } else {
        dateStr = cols[dateIdx];
      }
    }

    candles.push({
      date: dateStr,
      timestamp: ts,
      open: Number(rawOpen.toFixed(2)),
      high: Number(rawHigh.toFixed(2)),
      low: Number(rawLow.toFixed(2)),
      close: Number(rawClose.toFixed(2)),
      volume: rawVol,
    });
  }

  if (candles.length === 0) {
    throw new Error('No valid price rows found in the CSV.');
  }

  // Sort by timestamp ascending
  candles.sort((a, b) => a.timestamp - b.timestamp);

  const lastCandle = candles[candles.length - 1];
  const prevCandle = candles.length > 1 ? candles[candles.length - 2] : lastCandle;
  const change = Number((lastCandle.close - prevCandle.close).toFixed(2));
  const changePercent = Number(((change / (prevCandle.close || 1)) * 100).toFixed(2));

  const quote: StockQuote = {
    symbol: defaultSymbol.toUpperCase(),
    companyName: `${defaultSymbol.toUpperCase()} (Custom Dataset)`,
    price: lastCandle.close,
    change,
    changePercent,
    high52: Number(Math.max(...candles.map((c) => c.high)).toFixed(2)),
    low52: Number(Math.min(...candles.map((c) => c.low)).toFixed(2)),
    open: lastCandle.open,
    previousClose: prevCandle.close,
    volume: lastCandle.volume,
    currency: 'USD',
    exchange: 'Uploaded CSV',
  };

  return {
    symbol: defaultSymbol.toUpperCase(),
    candles,
    quote,
  };
}
