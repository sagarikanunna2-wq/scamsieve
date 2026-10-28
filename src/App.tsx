import { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MessageInput from './components/MessageInput';
import SampleMessages from './components/SampleMessages';
import ModelStatus from './components/ModelStatus';
import AnalysisResults from './components/AnalysisResults';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import { analyzeMessage } from './services/analyzeOrchestrator';
import { subscribeModelState, resetModel, setModelMode } from './services/scamClassifier';
import type { ModelState, AnalysisResult, ModelMode } from './types';

function App() {
  // ── State ─────────────────────────────────────────────────
  const [modelState, setModelState] = useState<ModelState>({
    status: 'idle',
    progress: 0,
    error: null,
    mode: 'fast',
    modelName: 'BERT-Tiny (Ultra-Fast AI)',
    downloadSize: '~4.5 MB',
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [externalText, setExternalText] = useState<string | undefined>(undefined);

  // Track current analysis to avoid stale results
  const analysisIdRef = useRef(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ── Model state subscription ──────────────────────────────
  useEffect(() => {
    const unsub = subscribeModelState(setModelState);
    return unsub;
  }, []);

  // ── Analyze handler ───────────────────────────────────────
  const handleAnalyze = useCallback(async (text: string) => {
    const currentId = ++analysisIdRef.current;
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeMessage(text);

      // Stale-result protection
      if (currentId !== analysisIdRef.current) return;

      setAnalysisResult(result);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      if (currentId !== analysisIdRef.current) return;

      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setAnalysisError(message);
      console.error('[ScamSieve] Analysis failed:', err);
    } finally {
      if (currentId === analysisIdRef.current) {
        setIsAnalyzing(false);
      }
    }
  }, []);

  // ── Clear handler ─────────────────────────────────────────
  const handleClear = useCallback(() => {
    analysisIdRef.current++;
    setAnalysisResult(null);
    setAnalysisError(null);
    setIsAnalyzing(false);
    setExternalText('');
  }, []);

  // ── Sample selection ──────────────────────────────────────
  const handleSampleSelect = useCallback((text: string) => {
    // Set the text in the input — do NOT auto-analyze
    setExternalText(text);
    setAnalysisResult(null);
    setAnalysisError(null);

    // Scroll to input
    const analyzeSection = document.getElementById('analyze');
    if (analyzeSection) {
      analyzeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // ── Retry handler ─────────────────────────────────────────
  const handleRetry = useCallback(() => {
    resetModel();
  }, []);

  // ── Mode change handler ───────────────────────────────────
  const handleModeChange = useCallback((mode: ModelMode) => {
    setModelMode(mode);
    setAnalysisResult(null);
    setAnalysisError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <Hero />

        {/* Analysis workspace */}
        <div className="px-4 py-10 space-y-8">
          {/* Model status */}
          <div className="max-w-3xl mx-auto">
            <ModelStatus
              modelState={modelState}
              onRetry={handleRetry}
              onModeChange={handleModeChange}
            />
          </div>

          {/* Message input */}
          <MessageInput
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
            externalText={externalText}
          />

          {/* Sample messages */}
          <SampleMessages onSelect={handleSampleSelect} disabled={isAnalyzing} />

          {/* Error state */}
          {analysisError && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-red-800 font-semibold">Analysis failed</h3>
                  <p className="text-red-700 text-sm mt-1">{analysisError}</p>
                  <button
                    onClick={handleRetry}
                    className="mt-3 text-sm text-red-600 hover:text-red-800 underline underline-offset-2 font-medium"
                  >
                    Reset model and try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div ref={resultsRef}>
            {analysisResult && <AnalysisResults result={analysisResult} />}
          </div>
        </div>

        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}

export default App;
