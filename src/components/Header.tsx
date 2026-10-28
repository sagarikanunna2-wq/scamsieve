import type { MouseEvent } from 'react';
import { Shield, Lock, ChevronDown } from 'lucide-react';

export default function Header() {
  const scrollToHowItWorks = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              <Shield className="w-5 h-5 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  ScamSieve
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                  Client-side AI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                AI-powered message risk analysis
              </p>
            </div>
          </div>

          {/* Right Navigation & Privacy Indicator */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Desktop Privacy Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>Analysis runs locally in your browser</span>
            </div>

            {/* How It Works Link */}
            <nav className="flex items-center">
              <a
                href="#how-it-works"
                onClick={scrollToHowItWorks}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100/80"
              >
                <span>How It Works</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
            </nav>
          </div>
        </div>

        {/* Mobile Privacy Indicator Bar */}
        <div className="md:hidden py-1.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50/60 font-medium">
          <Lock className="w-3 h-3 text-emerald-600" aria-hidden="true" />
          <span>Analysis runs locally in your browser</span>
        </div>
      </div>
    </header>
  );
}
