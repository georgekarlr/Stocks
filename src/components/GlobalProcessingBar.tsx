import React from 'react';
import { Loader2, Activity, ChevronRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useActionIndicator } from '../context/ActionIndicatorContext';

export const GlobalProcessingBar: React.FC = () => {
  const { isGlobalProcessing, activeActions, recentCompleted } = useActionIndicator();

  if (!isGlobalProcessing && recentCompleted.length === 0) {
    return null;
  }

  const currentAction = activeActions[0] || recentCompleted[0];

  return (
    <aside
      aria-label="Action processing status"
      className="border-b border-cyan-500/30 bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 px-4 py-2 text-xs backdrop-blur-md transition-all animate-fadeIn"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
              isGlobalProcessing
                ? 'bg-cyan-500/20 text-cyan-400'
                : currentAction?.status === 'success'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            {isGlobalProcessing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : currentAction?.status === 'success' ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="font-bold text-white text-xs truncate">
              {isGlobalProcessing ? 'Processing Action:' : 'Action Completed:'}
            </span>
            <span className="text-cyan-300 font-semibold truncate text-xs">
              {currentAction?.title}
            </span>
            {currentAction?.detail && (
              <span className="text-slate-400 text-[11px] hidden md:inline truncate">
                — {currentAction.detail}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeActions.length > 1 && (
            <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-black text-cyan-300 border border-cyan-400/30">
              +{activeActions.length - 1} queued
            </span>
          )}
          {isGlobalProcessing && (
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                EXECUTING
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
