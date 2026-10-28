// ── Classification types ──────────────────────────────────────────────

export interface ClassificationScore {
  label: string;
  score: number;
}

export type PredictedLabel = 'fraud' | 'spam' | 'legitimate' | 'unknown';

export interface ClassificationResult {
  predictedLabel: PredictedLabel;
  scores: ClassificationScore[];
  modelIdentifier: string;
  inferenceTimeMs: number;
}

// ── Evidence scanner types ────────────────────────────────────────────

export type Severity = 'high' | 'medium' | 'low';

export interface EvidenceFinding {
  id: string;
  title: string;
  explanation: string;
  matchedPhrase: string | null;
  severity: Severity;
  reason: string;
}

export interface EvidenceScanResult {
  findings: EvidenceFinding[];
  scannedAt: number;
}

// ── Combined analysis types ───────────────────────────────────────────

export interface AnalysisResult {
  classification: ClassificationResult;
  evidence: EvidenceScanResult;
  interpretation: Interpretation;
  recommendations: string[];
  analyzedText: string;
  timestamp: number;
}

export interface Interpretation {
  headline: string;
  explanation: string;
  riskLevel: 'high' | 'medium' | 'low';
  disagreement: boolean;
}

// ── Model loading state ───────────────────────────────────────────────

export type ModelStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'error';

export type ModelMode = 'fast' | 'deep';

export interface ModelState {
  status: ModelStatus;
  progress: number; // 0-100
  error: string | null;
  mode: ModelMode;
  modelName: string;
  downloadSize: string;
}

// ── Analysis state ────────────────────────────────────────────────────

export type AnalysisStatus =
  | 'idle'
  | 'loading-model'
  | 'analyzing'
  | 'complete'
  | 'error';

export interface AnalysisState {
  status: AnalysisStatus;
  result: AnalysisResult | null;
  error: string | null;
}
