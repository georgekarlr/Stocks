import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Upload,
  BookOpen,
  Volume2,
  FileText,
  MessageSquare,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Zap,
  TableProperties,
  ArrowLeftRight,
  Key,
  Crosshair,
  Clock,
  Layers,
} from 'lucide-react';
import { UserProfile, TraderProfile } from '../types/stock';
import { hasStoredApiKey } from '../services/apiKeyService';
import { TRADER_PROFILES } from '../utils/positionAnalyzer';

interface NavbarProps {
  activeTab: 'terminal' | 'market' | 'positions' | 'story' | 'voice' | 'reports' | 'copilot' | 'manual';
  setActiveTab: (tab: 'terminal' | 'market' | 'positions' | 'story' | 'voice' | 'reports' | 'copilot' | 'manual') => void;
  onSearchTicker: (symbol: string) => void;
  onRunExecutiveWorkflow?: (symbol?: string) => void;
  onOpenStockSelector: () => void;
  onOpenCSVModal: () => void;
  onOpenApiKeyModal: () => void;
  onOpenArchitectureModal?: () => void;
  currentTicker: string | null;
  isLoading: boolean;
  userProfile: UserProfile;
  globalTraderProfile?: TraderProfile;
  onSelectTraderProfile?: (profile: TraderProfile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSearchTicker,
  onRunExecutiveWorkflow,
  onOpenStockSelector,
  onOpenCSVModal,
  onOpenApiKeyModal,
  onOpenArchitectureModal,
  currentTicker,
  isLoading,
  userProfile,
  globalTraderProfile = 'weeks_trader',
  onSelectTraderProfile,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const hasCustomKey = hasStoredApiKey();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchTicker(searchInput.trim().toUpperCase());
      setSearchInput('');
    }
  };

  const navItems = [
    { id: 'terminal', label: 'Terminal & Analytics', icon: BarChart3 },
    { id: 'market', label: 'Market Scanner Table', icon: TableProperties },
    { id: 'positions', label: 'Position & Risk Analyzer', icon: Crosshair },
    { id: 'story', label: 'Story Studio', icon: Sparkles },
    { id: 'voice', label: 'Voice Briefing', icon: Volume2 },
    { id: 'reports', label: 'Analyst Dossier', icon: FileText },
    { id: 'copilot', label: 'Quant Copilot', icon: MessageSquare },
    { id: 'manual', label: 'User Manual', icon: BookOpen },
  ] as const;

  const currentProfileObj = TRADER_PROFILES.find((p) => p.id === globalTraderProfile) || TRADER_PROFILES[1];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand & Ticker Current */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white">StockPulse</span>
              <span className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-cyan-400 border border-cyan-500/30">
                GEMINI 3.7 FLASH
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI Quant Analytics & Narrative Terminal</p>
          </div>
        </div>

        {/* Global Search & Stock Selector Bar */}
        <div className="flex items-center gap-2 max-w-xs sm:max-w-md w-full mx-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ticker (e.g. NVDA, AAPL, TSLA, SPY)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/90 py-1.5 pl-9 pr-20 text-xs text-white placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded bg-cyan-600 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-40"
            >
              Analyze
            </button>
          </form>

          {/* Quick 1-Action Presentation Launcher */}
          {onRunExecutiveWorkflow && (
            <button
              onClick={() => onRunExecutiveWorkflow(searchInput.trim() || currentTicker || 'NVDA')}
              title="1-Action Autonomous Executive Presentation (Analysis + AI Art + Voice Presentation)"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-2.5 py-1.5 text-xs font-black text-white shadow-md shadow-cyan-500/25 hover:from-cyan-300 hover:to-blue-400 transition whitespace-nowrap active:scale-95"
            >
              <Zap className="h-3.5 w-3.5 fill-white" />
              <span className="hidden sm:inline">1-Action Presentation</span>
            </button>
          )}

          {/* Quick Select Stock Modal Trigger */}
          <button
            onClick={onOpenStockSelector}
            title="Select Another Stock / Pick from Curated Sectors"
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition whitespace-nowrap"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Select Stock</span>
          </button>

          <button
            onClick={onOpenCSVModal}
            title="Upload CSV / Custom Stock Dataset"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white transition whitespace-nowrap"
          >
            <Upload className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden md:inline">Upload CSV</span>
          </button>
        </div>

        {/* User Tier & BYOK Key Badges */}
        <div className="flex items-center gap-2">
          {/* BYOK API Key Trigger Button */}
          <button
            onClick={onOpenApiKeyModal}
            title={hasCustomKey ? 'Individual Gemini API Key is Configured (BYOK)' : 'Set your Individual Gemini API Key (BYOK)'}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${
              hasCustomKey
                ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50 hover:border-emerald-400'
                : 'border-amber-500/40 bg-amber-950/30 text-amber-300 hover:bg-amber-900/50 hover:border-amber-400'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {hasCustomKey ? 'BYOK Active' : 'Set API Key'}
            </span>
          </button>

          <div className="hidden lg:flex flex-col items-end text-right">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>{userProfile.tier}</span>
            </div>
            <span className="text-[10px] text-slate-400">
              Sub ID: <strong className="text-cyan-300">#{userProfile.subscription_id}</strong>
            </span>
          </div>

          {/* Architecture Blueprint Trigger Button */}
          {onOpenArchitectureModal && (
            <button
              onClick={onOpenArchitectureModal}
              title="View & Export Multimodal System Architecture Diagram (PDF / SVG / ASCII)"
              className="flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-950/30 px-2.5 py-1.5 text-xs font-bold text-indigo-300 hover:bg-indigo-900/50 hover:border-indigo-400 transition"
            >
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Architecture</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('manual')}
            className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-2 text-slate-400 hover:text-white hover:border-slate-600 transition"
            title="Open User Manual"
          >
            <BookOpen className="h-4 w-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-header Tabs */}
      <div className="border-t border-slate-800/60 bg-slate-950/60 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between overflow-x-auto py-1 scrollbar-none">
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-3 text-xs">
            {/* Global Trader Profile Selector Badge */}
            {onSelectTraderProfile && (
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                <Clock className="h-3 w-3 text-cyan-400" />
                <span className="text-[11px] text-slate-400">Style:</span>
                <select
                  value={globalTraderProfile}
                  onChange={(e) => onSelectTraderProfile(e.target.value as TraderProfile)}
                  className="bg-transparent text-[11px] font-bold text-cyan-300 focus:outline-none cursor-pointer"
                  title="Switch your Trading Profile & Horizon"
                >
                  {TRADER_PROFILES.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                      {p.shortLabel}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentTicker && (
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400">Active Asset:</span>
                <button
                  onClick={onOpenStockSelector}
                  title="Click to select another stock or switch ticker"
                  className="group flex items-center gap-1.5 font-bold text-white bg-slate-800 hover:bg-cyan-950/80 px-2 py-0.5 rounded border border-slate-700 hover:border-cyan-500/50 transition cursor-pointer"
                >
                  <span>{currentTicker}</span>
                  <ArrowLeftRight className="h-3 w-3 text-cyan-400 group-hover:rotate-180 transition-transform duration-300" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
