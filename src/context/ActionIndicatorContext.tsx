import React, { createContext, useContext, useState, useCallback, useId } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Sparkles, RefreshCw, X } from 'lucide-react';

export type ActionStatus = 'processing' | 'success' | 'error';

export interface ActionItem {
  id: string;
  title: string;
  detail?: string;
  status: ActionStatus;
  startedAt: number;
  completedAt?: number;
  error?: string;
}

interface ActionIndicatorContextType {
  activeActions: ActionItem[];
  recentCompleted: ActionItem[];
  isGlobalProcessing: boolean;
  latestMessage: string | null;
  startAction: (title: string, detail?: string) => string;
  updateAction: (id: string, updates: Partial<ActionItem>) => void;
  finishAction: (id: string, success?: boolean, errorMsg?: string, detail?: string) => void;
  clearCompleted: () => void;
  dismissAction: (id: string) => void;
}

const ActionIndicatorContext = createContext<ActionIndicatorContextType | null>(null);

export const ActionIndicatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actions, setActions] = useState<ActionItem[]>([]);

  const startAction = useCallback((title: string, detail?: string): string => {
    const id = `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newAction: ActionItem = {
      id,
      title,
      detail,
      status: 'processing',
      startedAt: Date.now(),
    };

    setActions((prev) => [newAction, ...prev.slice(0, 19)]);
    return id;
  }, []);

  const updateAction = useCallback((id: string, updates: Partial<ActionItem>) => {
    setActions((prev) =>
      prev.map((act) => (act.id === id ? { ...act, ...updates } : act))
    );
  }, []);

  const finishAction = useCallback((id: string, success = true, errorMsg?: string, detail?: string) => {
    setActions((prev) =>
      prev.map((act) => {
        if (act.id === id) {
          return {
            ...act,
            status: success ? 'success' : 'error',
            error: errorMsg,
            detail: detail || act.detail,
            completedAt: Date.now(),
          };
        }
        return act;
      })
    );

    // Automatically remove after 4.5 seconds
    setTimeout(() => {
      setActions((prev) => prev.filter((act) => act.id !== id || act.status === 'processing'));
    }, 4500);
  }, []);

  const dismissAction = useCallback((id: string) => {
    setActions((prev) => prev.filter((act) => act.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setActions((prev) => prev.filter((act) => act.status === 'processing'));
  }, []);

  const activeActions = actions.filter((a) => a.status === 'processing');
  const recentCompleted = actions.filter((a) => a.status !== 'processing');
  const isGlobalProcessing = activeActions.length > 0;
  const latestMessage = activeActions[0]?.title || null;

  return (
    <ActionIndicatorContext.Provider
      value={{
        activeActions,
        recentCompleted,
        isGlobalProcessing,
        latestMessage,
        startAction,
        updateAction,
        finishAction,
        clearCompleted,
        dismissAction,
      }}
    >
      {children}
      {/* Toast Notification Container for Processing & Action Feedback */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm sm:max-w-md w-full pointer-events-none px-3 sm:px-0">
        {actions.slice(0, 4).map((action) => (
          <div
            key={action.id}
            className={`pointer-events-auto rounded-2xl border p-3.5 shadow-2xl backdrop-blur-xl transition-all duration-300 transform translate-y-0 ${
              action.status === 'processing'
                ? 'border-cyan-500/40 bg-slate-950/95 text-slate-100 shadow-cyan-500/10 ring-1 ring-cyan-500/20 animate-pulse-slow'
                : action.status === 'success'
                ? 'border-emerald-500/40 bg-slate-950/95 text-slate-100 shadow-emerald-500/10 ring-1 ring-emerald-500/20'
                : 'border-rose-500/40 bg-slate-950/95 text-slate-100 shadow-rose-500/10 ring-1 ring-rose-500/20'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${
                    action.status === 'processing'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : action.status === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {action.status === 'processing' && <Loader2 className="h-4 w-4 animate-spin" />}
                  {action.status === 'success' && <CheckCircle2 className="h-4 w-4" />}
                  {action.status === 'error' && <AlertCircle className="h-4 w-4" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold tracking-wide text-white truncate">
                      {action.title}
                    </span>
                    {action.status === 'processing' && (
                      <span className="rounded bg-cyan-500/20 px-1.5 py-0.2 text-[9px] font-black text-cyan-300 uppercase tracking-wider animate-pulse">
                        In Progress
                      </span>
                    )}
                    {action.status === 'success' && (
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-black text-emerald-300 uppercase tracking-wider">
                        Done
                      </span>
                    )}
                    {action.status === 'error' && (
                      <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[9px] font-black text-rose-300 uppercase tracking-wider">
                        Failed
                      </span>
                    )}
                  </div>
                  {action.detail && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{action.detail}</p>
                  )}
                  {action.error && (
                    <p className="text-[11px] text-rose-300 truncate mt-0.5">{action.error}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => dismissAction(action.id)}
                className="text-slate-500 hover:text-slate-300 transition p-0.5 rounded-lg hover:bg-slate-800"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ActionIndicatorContext.Provider>
  );
};

export const useActionIndicator = () => {
  const context = useContext(ActionIndicatorContext);
  if (!context) {
    throw new Error('useActionIndicator must be used within an ActionIndicatorProvider');
  }
  return context;
};
