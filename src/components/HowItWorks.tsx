import type { ComponentType } from 'react';
import {
  MessageSquare,
  Brain,
  Search,
  FileText,
  ShieldCheck,
  Cpu,
  Lock,
} from 'lucide-react';

interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  tag: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
}

const STEPS: StepItem[] = [
  {
    number: '01',
    title: 'Submit your message',
    description: 'Paste a suspicious SMS, email, or message into the text area.',
    icon: MessageSquare,
    tag: 'Input',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    number: '02',
    title: 'AI classification',
    description:
      'An open-weight text classifier (Horizon-Labs/phishing-scam-detector-base) running locally in your browser analyzes the text.',
    icon: Brain,
    tag: 'Local ML',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    number: '03',
    title: 'Evidence scanning',
    description:
      'A separate rule-based scanner checks for known suspicious patterns like urgency, credential requests, and unusual links.',
    icon: Search,
    tag: 'Heuristics',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
  },
  {
    number: '04',
    title: 'Combined report',
    description:
      'Results from both the AI model and the evidence scanner are presented side by side — clearly distinguishing machine-learning predictions from rule-based checks.',
    icon: FileText,
    tag: 'Synthesis',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    number: '05',
    title: 'Safety recommendations',
    description:
      'Receive practical safety advice tailored to the specific findings.',
    icon: ShieldCheck,
    tag: 'Action Plan',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      aria-labelledby="how-it-works-heading"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <Cpu className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
          <span>Transparent Security Architecture</span>
        </div>
        <h2
          id="how-it-works-heading"
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
        >
          How ScamSieve Works
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          A dual-layer security pipeline combining client-side machine learning
          with deterministic pattern matching to safeguard your personal communications.
        </p>
      </div>

      {/* Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isLastCard = index === STEPS.length - 1;

          return (
            <div
              key={step.number}
              className={`relative bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group ${
                isLastCard ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div>
                {/* Header: Step Number & Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-slate-300 group-hover:text-blue-600 transition-colors font-mono">
                    {step.number}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${step.badgeBg} ${step.badgeText}`}
                  >
                    {step.tag}
                  </span>
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div
                    className={`flex items-center justify-center w-11 h-11 rounded-xl ${step.iconBg} ${step.iconColor} shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-200`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mt-2">
                  {step.description}
                </p>
              </div>

              {/* Step indicator bar at the bottom */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium">Step {index + 1} of 5</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Privacy Guarantee Note */}
      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
            <Lock className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              100% Client-Side Processing
            </h4>
            <p className="text-xs text-slate-600">
              Your message text never leaves your browser. AI model inference and rule scanning happen entirely on your computer.
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
          Zero Server Logs
        </div>
      </div>
    </section>
  );
}
