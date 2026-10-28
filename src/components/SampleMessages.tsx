import { AlertTriangle, Tag, CheckCircle, ArrowRight } from 'lucide-react';
import { SAMPLE_MESSAGES, type SampleMessage } from '../data/sampleMessages';

interface SampleMessagesProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

interface CategoryConfig {
  label: string;
  badgeClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_CONFIG: Record<SampleMessage['category'], CategoryConfig> = {
  suspicious: {
    label: 'Suspicious',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: AlertTriangle,
  },
  promotional: {
    label: 'Promotional',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Tag,
  },
  normal: {
    label: 'Normal',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
  },
};

/**
 * Truncate text to the first 80 characters followed by an ellipsis.
 */
function getTruncatedPreview(text: string): string {
  return `${text.slice(0, 80)}...`;
}

export default function SampleMessages({
  onSelect,
  disabled = false,
}: SampleMessagesProps) {
  return (
    <section
      className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
      aria-labelledby="sample-messages-heading"
    >
      {/* Header */}
      <div className="mb-6">
        <h2
          id="sample-messages-heading"
          className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
        >
          Try a sample message
        </h2>
        <p className="mt-1 text-sm text-slate-500 leading-relaxed max-w-3xl">
          Select a demonstration message to test the analyzer. Each sample is
          processed through the real AI model.
        </p>
      </div>

      {/* Grid of sample cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {SAMPLE_MESSAGES.map((message) => {
          const config = CATEGORY_CONFIG[message.category];
          const CategoryIcon = config.icon;
          const previewText = getTruncatedPreview(message.text);

          return (
            <button
              key={message.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  onSelect(message.text);
                }
              }}
              className={`w-full text-left bg-white rounded-2xl border border-slate-200 p-5 shadow-xs
                transition-all duration-200 flex flex-col justify-between group
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${
                  disabled
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                }`}
              aria-label={`Select sample: ${message.title}`}
            >
              <div>
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badgeClass}`}
                  >
                    <CategoryIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{config.label}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {message.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {message.description}
                </p>

                {/* Truncated Text Preview */}
                <div className="mt-3.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 font-mono italic leading-relaxed">
                  &ldquo;{previewText}&rdquo;
                </div>
              </div>

              {/* Action hint at the bottom */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 group-hover:text-blue-600 transition-colors">
                <span className="font-medium">Use this sample</span>
                <ArrowRight
                  className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
