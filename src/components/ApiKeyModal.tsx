import React, { useState, useEffect } from 'react';
import {
  Key,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Trash2,
  RefreshCw,
  Lock,
} from 'lucide-react';
import {
  getStoredApiKey,
  setStoredApiKey,
  clearStoredApiKey,
  verifyApiKey,
} from '../services/apiKeyService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedKey = getStoredApiKey();
      setApiKeyInput(storedKey);
      setHasExistingKey(!!storedKey);
      setVerificationStatus({ type: null, message: '' });
      setShowKey(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setVerificationStatus({
        type: 'error',
        message: 'Please enter a valid Gemini API key or click Clear to remove.',
      });
      return;
    }

    setStoredApiKey(trimmed);
    setHasExistingKey(true);
    setVerificationStatus({
      type: 'success',
      message: 'API Key securely saved to your local browser storage!',
    });
    if (onKeySaved) onKeySaved();
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleVerify = async () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setVerificationStatus({
        type: 'error',
        message: 'Please enter an API key first before testing.',
      });
      return;
    }

    setIsVerifying(true);
    setVerificationStatus({ type: null, message: '' });

    try {
      const result = await verifyApiKey(trimmed);
      setVerificationStatus({
        type: 'success',
        message: result.message || 'Key verified successfully with Gemini 3.7 Flash!',
      });
    } catch (err: any) {
      setVerificationStatus({
        type: 'error',
        message: err.message || 'Verification failed. Please check your API key.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClear = () => {
    clearStoredApiKey();
    setApiKeyInput('');
    setHasExistingKey(false);
    setVerificationStatus({
      type: 'success',
      message: 'Saved individual API key removed from local storage.',
    });
    if (onKeySaved) onKeySaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Gemini API Key (BYOK)</h3>
                <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-extrabold text-cyan-400 border border-cyan-500/30">
                  INDIVIDUAL KEY
                </span>
              </div>
              <p className="text-xs text-slate-400">Bring Your Own Key for AI Quantitative Analysis &amp; Storytelling</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Privacy & BYOK Callout */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-cyan-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Private &amp; Secure Client-Side Storage</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Your API key is kept securely in your browser’s private storage and is only passed via encrypted proxy headers to execute your financial analysis, stories, and Quant Copilot queries.
            </p>
          </div>

          {/* Key Input Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition"
              >
                <span>Get API Key from Google AI Studio</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </label>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-4 pr-12 text-sm text-white font-mono placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Keys typically begin with <code className="text-slate-400 font-mono">AIzaSy</code>.
            </p>
          </div>

          {/* Status Message */}
          {verificationStatus.type && (
            <div
              className={`rounded-xl border p-3 text-xs flex items-start gap-2.5 ${
                verificationStatus.type === 'success'
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                  : 'border-rose-500/40 bg-rose-950/40 text-rose-300'
              }`}
            >
              {verificationStatus.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{verificationStatus.message}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div>
              {hasExistingKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear Saved Key</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleVerify}
                disabled={isVerifying || !apiKeyInput.trim()}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition disabled:opacity-40"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isVerifying ? 'animate-spin text-cyan-400' : ''}`} />
                <span>{isVerifying ? 'Testing...' : 'Test Connection'}</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!apiKeyInput.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/20 disabled:opacity-40"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Save Key</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
