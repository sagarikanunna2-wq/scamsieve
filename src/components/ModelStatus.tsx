import {
  CheckCircle,
  Loader2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Zap,
  Layers,
  HardDriveDownload,
} from 'lucide-react';
import type { ModelState, ModelMode } from '../types';

export interface ModelStatusProps {
  modelState: ModelState;
  onRetry: () => void;
  onModeChange: (mode: ModelMode) => void;
}

export default function ModelStatus({
  modelState,
  onRetry,
  onModeChange,
}: ModelStatusProps) {
  const { status, progress, error, mode, modelName, downloadSize } = modelState;

  // Clamped 0-100 progress value
  const normalizedProgress = Math.min(100, Math.max(0, Math.round(progress || 0)));

  return (
    <div
      className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs transition-all duration-300"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Model Mode Selection Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              AI Engine
            </span>
            <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
              {modelName} ({downloadSize})
            </span>
          </div>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => onModeChange('fast')}
            disabled={status === 'loading'}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'fast'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Fast AI (~4.5 MB)</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('deep')}
            disabled={status === 'loading'}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'deep'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Deep mmBERT (~640 MB)</span>
          </button>
        </div>
      </div>

      {/* ── Idle State ────────────────────────────────────────────────── */}
      {status === 'idle' && (
        <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500 shrink-0" aria-hidden="true" />
            <span>
              {mode === 'fast'
                ? 'Fast mode active: downloads only ~4.5 MB on first analysis (takes ~2 seconds).'
                : 'Deep mode active: full 640 MB mmBERT weights loaded on first analysis.'}
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-600 font-semibold hidden sm:inline">
            Browser Cached
          </span>
        </div>
      )}

      {/* ── Loading State ─────────────────────────────────────────────── */}
      {status === 'loading' && (
        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 shadow-xs transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <Loader2
                className="w-4 h-4 text-blue-600 animate-spin shrink-0"
                aria-hidden="true"
              />
              <span className="text-xs sm:text-sm font-semibold text-blue-950">
                Loading {modelName}...
              </span>
            </div>
            <span className="text-xs font-bold text-blue-700 font-mono tabular-nums">
              {normalizedProgress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${normalizedProgress}%` }}
              role="progressbar"
              aria-valuenow={normalizedProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-blue-800/90">
            <HardDriveDownload
              className="w-3.5 h-3.5 text-blue-600 shrink-0"
              aria-hidden="true"
            />
            <p>
              Downloading {downloadSize} ONNX package directly into browser memory.
            </p>
          </div>
        </div>
      )}

      {/* ── Ready State ───────────────────────────────────────────────── */}
      {status === 'ready' && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold shadow-xs">
          <CheckCircle
            className="w-4 h-4 text-emerald-600 shrink-0"
            aria-hidden="true"
          />
          <span>{modelName} active &amp; ready in browser</span>
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5"
            aria-hidden="true"
          />
        </div>
      )}

      {/* ── Error State ───────────────────────────────────────────────── */}
      {status === 'error' && (
        <div
          className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-rose-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          role="alert"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle
              className="w-4 h-4 text-rose-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-rose-950">
                Model download failed
              </h4>
              <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                {error || 'Network error downloading weights. Try Fast AI mode (~4.5 MB) for instant loading.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Retry</span>
          </button>
        </div>
      )}
    </div>
  );
}
