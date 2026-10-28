/**
 * ScamSieve — AI-Powered Scam Message Classifier
 *
 * Provides real browser-side AI classification via @huggingface/transformers.
 *
 * Modes:
 * 1. 'fast' (Default): onnx-community/bert-tiny-finetuned-sms-spam-detection-ONNX (~4.5 MB)
 *    Loads in 1-2 seconds with sub-second inference.
 * 2. 'deep': onnx-community/phishing-scam-detector-base-ONNX (~640 MB)
 *    Full multilingual mmBERT model for users with high-speed connections.
 */

import type {
  ClassificationResult,
  ClassificationScore,
  PredictedLabel,
  ModelState,
  ModelMode,
} from '../types';

// ── Model Configurations ──────────────────────────────────────────────

export interface ModelConfig {
  id: string;
  name: string;
  size: string;
  dtype: 'q8' | 'fp32';
  description: string;
}

export const MODEL_CONFIGS: Record<ModelMode, ModelConfig> = {
  fast: {
    id: 'onnx-community/bert-tiny-finetuned-sms-spam-detection-ONNX',
    name: 'BERT-Tiny (Ultra-Fast AI)',
    size: '~4.5 MB',
    dtype: 'q8',
    description: 'Instant 2-second setup, ~15ms inference',
  },
  deep: {
    id: 'onnx-community/phishing-scam-detector-base-ONNX',
    name: 'mmBERT Phishing & Scam Base (Deep Multilingual)',
    size: '~640 MB',
    dtype: 'q8',
    description: 'Comprehensive 307M mmBERT classifier',
  },
};

// ── Module state ──────────────────────────────────────────────────────

type TextClassificationPipeline = (
  text: string,
  options?: Record<string, unknown>
) => Promise<Array<{ label: string; score: number }>>;

let activeMode: ModelMode = 'fast';
const pipelineCache: Partial<Record<ModelMode, TextClassificationPipeline>> = {};
const initPromises: Partial<Record<ModelMode, Promise<TextClassificationPipeline>>> = {};

// Subscribers for model loading progress
type ProgressCallback = (state: ModelState) => void;
const listeners = new Set<ProgressCallback>();

let currentModelState: ModelState = {
  status: 'idle',
  progress: 0,
  error: null,
  mode: 'fast',
  modelName: MODEL_CONFIGS.fast.name,
  downloadSize: MODEL_CONFIGS.fast.size,
};

export function subscribeModelState(cb: ProgressCallback): () => void {
  listeners.add(cb);
  cb(currentModelState);
  return () => listeners.delete(cb);
}

function emit(partial: Partial<ModelState>) {
  currentModelState = { ...currentModelState, ...partial };
  listeners.forEach((cb) => cb(currentModelState));
}

export function getModelMode(): ModelMode {
  return activeMode;
}

export function setModelMode(mode: ModelMode): void {
  activeMode = mode;
  const config = MODEL_CONFIGS[mode];
  const isLoaded = Boolean(pipelineCache[mode]);
  emit({
    mode,
    modelName: config.name,
    downloadSize: config.size,
    status: isLoaded ? 'ready' : 'idle',
    progress: isLoaded ? 100 : 0,
    error: null,
  });
}

// ── Initialization ────────────────────────────────────────────────────

/**
 * Lazily loads the text-classification pipeline for the active mode.
 * Prevents duplicate initialization with a shared promise.
 */
export async function ensureModel(
  mode: ModelMode = activeMode
): Promise<TextClassificationPipeline> {
  const config = MODEL_CONFIGS[mode];

  // Already loaded in memory
  if (pipelineCache[mode]) {
    emit({ status: 'ready', progress: 100, error: null });
    return pipelineCache[mode]!;
  }

  // Already loading — reuse in-flight promise
  if (initPromises[mode]) {
    return initPromises[mode]!;
  }

  initPromises[mode] = (async () => {
    try {
      emit({
        status: 'loading',
        progress: 0,
        error: null,
        mode,
        modelName: config.name,
        downloadSize: config.size,
      });

      console.info(`[ScamSieve] Loading model (${mode} mode):`, config.id);

      const { pipeline: createPipeline, env } = await import(
        '@huggingface/transformers'
      );

      // Optimize environment settings
      if (env) {
        env.allowLocalModels = false;
        env.useBrowserCache = true;
      }

      const clf = await createPipeline('text-classification', config.id, {
        dtype: config.dtype,
        progress_callback: (data: { progress?: number; status?: string }) => {
          if (typeof data.progress === 'number') {
            emit({
              status: 'loading',
              progress: Math.min(99, Math.round(data.progress)),
              error: null,
            });
          }
        },
      });

      const loadedPipeline = clf as unknown as TextClassificationPipeline;
      pipelineCache[mode] = loadedPipeline;

      emit({ status: 'ready', progress: 100, error: null });
      console.info(`[ScamSieve] Model ready (${mode} mode).`);
      return loadedPipeline;
    } catch (err) {
      delete initPromises[mode];
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to download or initialize the AI model.';
      emit({ status: 'error', progress: 0, error: message });
      console.error('[ScamSieve] Model loading failed:', err);
      throw err;
    }
  })();

  return initPromises[mode]!;
}

/** Resets the cached pipeline for the active mode */
export function resetModel(): void {
  delete pipelineCache[activeMode];
  delete initPromises[activeMode];
  const config = MODEL_CONFIGS[activeMode];
  emit({
    status: 'idle',
    progress: 0,
    error: null,
    modelName: config.name,
    downloadSize: config.size,
  });
}

// ── Normalization & Inference ─────────────────────────────────────────

function normalizeLabel(raw: string, mode: ModelMode): PredictedLabel {
  const lower = raw.toLowerCase().trim();

  if (mode === 'fast') {
    // bert-tiny output: LABEL_0 is Ham, LABEL_1 is Spam/Scam
    if (lower === 'label_1' || lower === 'spam' || lower === 'fraud') return 'fraud';
    if (lower === 'label_0' || lower === 'ham' || lower === 'legitimate') return 'legitimate';
  } else {
    // Horizon-Labs / mmBERT: fraud, spam, legitimate
    if (lower.includes('fraud') || lower.includes('phish')) return 'fraud';
    if (lower.includes('spam')) return 'spam';
    if (lower.includes('legit') || lower.includes('ham')) return 'legitimate';
  }

  return 'unknown';
}

function formatLabelDisplay(raw: string, mode: ModelMode): string {
  const norm = normalizeLabel(raw, mode);
  if (norm === 'fraud') return 'Fraud / Scam';
  if (norm === 'spam') return 'Spam';
  if (norm === 'legitimate') return 'Legitimate';
  return raw;
}

/**
 * Classifies a single text using the active model.
 * Returns all label scores so the UI can display them.
 */
export async function classifyText(
  text: string,
  mode: ModelMode = activeMode
): Promise<ClassificationResult> {
  const config = MODEL_CONFIGS[mode];
  const clf = await ensureModel(mode);

  const start = performance.now();

  let raw: unknown;
  try {
    // Request top 5 predictions (covers 2 classes for BERT-Tiny, 3 for mmBERT)
    raw = await clf(text, { top_k: 5 });
  } catch (err) {
    console.warn('[ScamSieve] top_k:5 call failed, falling back to default:', err);
    raw = await clf(text);
  }

  const elapsed = performance.now() - start;

  // Safely extract candidate objects from any return shape
  let rawList: Array<{ label: string; score: number }> = [];

  if (Array.isArray(raw)) {
    if (raw.length > 0 && Array.isArray(raw[0])) {
      rawList = raw[0];
    } else if (raw.length > 0 && typeof raw[0] === 'object' && raw[0] !== null) {
      rawList = raw as Array<{ label: string; score: number }>;
    }
  } else if (raw && typeof raw === 'object' && 'label' in raw) {
    rawList = [raw as { label: string; score: number }];
  }

  // Fallback if rawList is somehow still empty
  if (!rawList.length) {
    try {
      const fallbackRaw = await clf(text);
      if (Array.isArray(fallbackRaw) && fallbackRaw.length > 0) {
        rawList = Array.isArray(fallbackRaw[0]) ? fallbackRaw[0] : (fallbackRaw as Array<{ label: string; score: number }>);
      }
    } catch (e) {
      console.error('[ScamSieve] Fallback inference failed:', e);
    }
  }

  if (!rawList.length) {
    throw new Error('The AI model could not process this message. Please click Retry.');
  }

  // Sort descending by score
  const sorted = [...rawList].sort((a, b) => b.score - a.score);
  const topLabel = normalizeLabel(sorted[0].label, mode);

  let scores: ClassificationScore[] = sorted.map((item) => ({
    label: formatLabelDisplay(item.label, mode),
    score: item.score,
  }));

  // If only a single class was returned, generate complementary probability
  if (scores.length === 1) {
    const topScore = scores[0].score;
    const isThreat = topLabel === 'fraud' || topLabel === 'spam';
    const otherLabel = isThreat ? 'Legitimate' : 'Fraud / Scam';
    const compScore = Math.max(0, Math.min(1, 1 - topScore));
    scores = [
      scores[0],
      { label: otherLabel, score: Number(compScore.toFixed(4)) },
    ];
  }

  return {
    predictedLabel: topLabel,
    scores,
    modelIdentifier: config.name,
    inferenceTimeMs: Math.max(1, Math.round(elapsed)),
  };
}

export function getModelConfig(mode: ModelMode = activeMode): ModelConfig {
  return MODEL_CONFIGS[mode];
}
