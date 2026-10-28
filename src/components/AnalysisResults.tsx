
import {
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  Clock,
  Cpu,
  Search,
  Brain,
  Lightbulb,
  TriangleAlert,
  ChevronRight,
} from 'lucide-react';
import type { AnalysisResult, EvidenceFinding, Severity } from '../types';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

// ── Helpers ───────────────────────────────────────────────────────────

function riskColor(level: 'high' | 'medium' | 'low') {
  switch (level) {
    case 'high':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        badge: 'bg-red-100 text-red-700',
        icon: 'text-red-500',
      };
    case 'medium':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        badge: 'bg-amber-100 text-amber-700',
        icon: 'text-amber-500',
      };
    case 'low':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        badge: 'bg-green-100 text-green-700',
        icon: 'text-green-500',
      };
  }
}

function RiskIcon({ level }: { level: 'high' | 'medium' | 'low' }) {
  const cls = `w-6 h-6 ${riskColor(level).icon}`;
  switch (level) {
    case 'high':
      return <ShieldAlert className={cls} />;
    case 'medium':
      return <ShieldQuestion className={cls} />;
    case 'low':
      return <ShieldCheck className={cls} />;
  }
}

function severityBadge(severity: Severity) {
  const colors: Record<Severity, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-blue-100 text-blue-700',
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full uppercase tracking-wide ${colors[severity]}`}
    >
      {severity}
    </span>
  );
}

function labelColor(label: string) {
  switch (label.toLowerCase()) {
    case 'fraud':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'spam':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'legitimate':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

/**
 * Safely highlights a matched phrase in the analyzed text.
 * All text is rendered as plain text — no dangerouslySetInnerHTML.
 */
function HighlightedPhrase({
  text,
  highlight,
}: {
  text: string;
  highlight: string | null;
}) {
  if (!highlight) {
    return <span className="text-gray-600 text-sm">{text}</span>;
  }
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) {
    return <span className="text-gray-600 text-sm">{text}</span>;
  }

  // Show context around the match
  const contextSize = 40;
  const start = Math.max(0, idx - contextSize);
  const end = Math.min(text.length, idx + highlight.length + contextSize);

  const before = (start > 0 ? '…' : '') + text.slice(start, idx);
  const match = text.slice(idx, idx + highlight.length);
  const after = text.slice(idx + highlight.length, end) + (end < text.length ? '…' : '');

  return (
    <span className="text-sm font-mono bg-gray-50 px-2 py-1 rounded inline-block mt-1">
      <span className="text-gray-500">{before}</span>
      <mark className="bg-yellow-200 text-gray-900 px-0.5 rounded">{match}</mark>
      <span className="text-gray-500">{after}</span>
    </span>
  );
}

function FindingCard({
  finding,
  analyzedText,
}: {
  finding: EvidenceFinding;
  analyzedText: string;
}) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <TriangleAlert className={`w-4 h-4 flex-shrink-0 ${
            finding.severity === 'high' ? 'text-red-500' : 'text-amber-500'
          }`} />
          <h4 className="font-semibold text-gray-900 text-sm">{finding.title}</h4>
        </div>
        {severityBadge(finding.severity)}
      </div>
      <p className="text-gray-600 text-sm mb-2">{finding.explanation}</p>
      <p className="text-gray-400 text-xs italic mb-2">{finding.reason}</p>
      {finding.matchedPhrase && (
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Matched text:
          </span>
          <div className="mt-1">
            <HighlightedPhrase text={analyzedText} highlight={finding.matchedPhrase} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const { classification, evidence, interpretation, recommendations } = result;
  const colors = riskColor(interpretation.riskLevel);

  return (
    <section className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* ── Headline card ────────────────────────────────────────── */}
      <div
        className={`${colors.bg} ${colors.border} border rounded-2xl p-6 sm:p-8`}
      >
        <div className="flex items-start gap-4">
          <div className="pt-1">
            <RiskIcon level={interpretation.riskLevel} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className={`text-xl font-bold ${colors.text}`}>
                {interpretation.headline}
              </h3>
              {interpretation.disagreement && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  AI & scanner disagree
                </span>
              )}
            </div>
            <p className={`text-sm ${colors.text} opacity-80`}>
              {interpretation.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* ── AI Model Scores ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-bold text-gray-900">AI Classification</h3>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">Predicted class:</span>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full border ${labelColor(
              classification.predictedLabel
            )}`}
          >
            {classification.predictedLabel.toUpperCase()}
          </span>
        </div>

        {/* Score bars */}
        <div className="space-y-3">
          {classification.scores.map((s) => {
            const pct = (s.score * 100).toFixed(1);
            const isTop = s.label.toLowerCase() === classification.predictedLabel;
            return (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm capitalize ${
                      isTop ? 'font-semibold text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {s.label}
                  </span>
                  <span
                    className={`text-sm tabular-nums ${
                      isTop ? 'font-semibold text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {pct}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      s.label.toLowerCase() === 'fraud'
                        ? 'bg-red-400'
                        : s.label.toLowerCase() === 'spam'
                        ? 'bg-amber-400'
                        : 'bg-green-400'
                    }`}
                    style={{ width: `${pct}%` }}
                    role="progressbar"
                    aria-valuenow={parseFloat(pct)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${s.label} score: ${pct}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" />
            {classification.modelIdentifier}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {classification.inferenceTimeMs}ms
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-3 leading-relaxed">
          Scores represent the model's output distribution, not calibrated
          probabilities. A high score indicates stronger association with that
          class but should not be interpreted as a precise fraud probability.
        </p>
      </div>

      {/* ── Evidence Scanner ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-bold text-gray-900">Evidence Scanner</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
            Rule-based
          </span>
        </div>

        {evidence.findings.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-700 font-medium">
                No suspicious patterns detected
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                The rule-based scanner found no known warning signs. This does
                not guarantee the message is safe.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-3">
              {evidence.findings.length} pattern{evidence.findings.length > 1 ? 's' : ''} detected.
              These are heuristic signals, not proof of fraud.
            </p>
            {evidence.findings.map((f) => (
              <FindingCard
                key={f.id}
                finding={f}
                analyzedText={result.analyzedText}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Recommendations ──────────────────────────────────────── */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-gray-900">
              Recommended Next Steps
            </h3>
          </div>
          <ul className="space-y-3">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>

          {/* India reporting link */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-start gap-3 bg-blue-50/50 -mx-2 px-4 py-3 rounded-xl">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p>
                To report cyber fraud in India, visit the{' '}
                <a
                  href="https://cybercrime.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2 inline-flex items-center gap-1"
                >
                  National Cyber Crime Portal
                  <ExternalLink className="w-3 h-3" />
                </a>{' '}
                or call the helpline at{' '}
                <strong className="text-gray-900">1930</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Disclaimer ───────────────────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <AlertTriangle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          ScamSieve is an experimental tool. The AI model can produce false
          positives (flagging safe messages) and false negatives (missing real
          scams). The evidence scanner uses heuristic rules that cannot catch
          every fraud pattern. Always verify suspicious messages independently
          and never rely solely on automated analysis.
        </p>
      </div>
    </section>
  );
}
