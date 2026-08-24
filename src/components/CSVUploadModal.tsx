import React, { useState } from 'react';
import {
  Upload,
  X,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { parseStockCSV } from '../utils/csvParser';
import { StockCandle, StockQuote } from '../types/stock';
import { useActionIndicator } from '../context/ActionIndicatorContext';

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (symbol: string, candles: StockCandle[], quote: StockQuote) => void;
}

export const CSVUploadModal: React.FC<CSVUploadModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
}) => {
  const [customTicker, setCustomTicker] = useState('CUSTOM');
  const [fileName, setFileName] = useState('');
  const [parsedData, setParsedData] = useState<{ candles: StockCandle[]; quote: StockQuote } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { startAction, finishAction } = useActionIndicator();

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    setError(null);
    setFileName(file.name);
    const actionId = startAction(`Parsing CSV (${file.name})`, 'Validating OHLCV columns and date timestamps');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const result = parseStockCSV(text, customTicker || 'CUSTOM');
        setParsedData({
          candles: result.candles,
          quote: result.quote,
        });
        finishAction(actionId, true, undefined, `Parsed ${result.candles.length} price rows`);
      } catch (err: any) {
        const errMsg = err.message || 'Failed to parse CSV file.';
        setError(errMsg);
        setParsedData(null);
        finishAction(actionId, false, errMsg);
      }
    };
    reader.onerror = () => {
      setError('Error reading uploaded file.');
      finishAction(actionId, false, 'File read error');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleConfirm = () => {
    if (parsedData) {
      const targetSym = customTicker.toUpperCase();
      const actionId = startAction(`Ingesting Custom Dataset (${targetSym})`, `Binding ${parsedData.candles.length} candles to Terminal`);
      onDataLoaded(targetSym, parsedData.candles, {
        ...parsedData.quote,
        symbol: targetSym,
        companyName: `${targetSym} (Custom Dataset)`,
      });
      finishAction(actionId, true, undefined, `Active asset set to ${targetSym}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Upload Stock / Portfolio CSV</h3>
            <p className="text-xs text-slate-400">Ingest proprietary time-series and quant datasets</p>
          </div>
        </div>

        {/* Custom Identifier */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Custom Symbol / Identifier:
          </label>
          <input
            type="text"
            value={customTicker}
            onChange={(e) => setCustomTicker(e.target.value.toUpperCase())}
            placeholder="e.g., MY_PORTFOLIO, ALPHA_MODEL, STRAT_1"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
            isDragging
              ? 'border-cyan-500 bg-cyan-500/10'
              : 'border-slate-700 bg-slate-950/60 hover:border-slate-600'
          }`}
        >
          <Upload className="h-8 w-8 text-cyan-400 mb-2 animate-bounce" />
          <p className="text-xs font-bold text-slate-200">
            Drag & drop your CSV file here, or{' '}
            <label className="cursor-pointer text-cyan-400 underline hover:text-cyan-300">
              browse files
              <input
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />
            </label>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Supported columns: Date, Open, High, Low, Close, Volume
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Preview */}
        {parsedData && (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-emerald-300">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Parsed {parsedData.candles.length} historical data points successfully!</span>
            </div>
            <div className="text-slate-400 text-[11px] font-mono mt-1">
              File: {fileName} | Latest Close: ${parsedData.quote.price} | Date Range:{' '}
              {parsedData.candles[0].date} to {parsedData.candles[parsedData.candles.length - 1].date}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!parsedData}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40"
          >
            <span>Load into Terminal</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
