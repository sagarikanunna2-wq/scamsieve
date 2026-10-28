
import { ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50/50 to-white py-12 sm:py-16 md:py-20 border-b border-slate-100">
      {/* Decorative background radial blur */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-200/25 blur-3xl rounded-full"
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200/80 shadow-xs mb-6">
          <ShieldCheck className="w-4 h-4 text-blue-600" aria-hidden="true" />
          <span className="text-xs sm:text-sm font-medium text-slate-700">
            Private On-Device Scam Intelligence
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Think before you trust.
        </h1>

        {/* Subtext */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Analyze suspicious messages, uncover warning signs, and learn how to protect yourself before taking action.
        </p>

        {/* Privacy Note */}
        <div className="mt-8 inline-block max-w-xl mx-auto bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-xl px-5 py-3 shadow-xs">
          <p className="text-xs sm:text-sm text-slate-600 leading-normal">
            <span className="font-semibold text-slate-800">Privacy-first:</span> Message analysis runs locally in your browser using an on-device AI model. Your message text is never sent to a remote server for classification. An initial network download is required to load the model files.
          </p>
        </div>
      </div>
    </section>
  );
}
