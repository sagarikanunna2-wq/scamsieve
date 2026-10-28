
import { Shield, ExternalLink, AlertTriangle, PhoneCall } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 text-slate-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-200/80">
          {/* Brand & Privacy Statement */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700">
                <Shield className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                ScamSieve
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your messages are analyzed locally and never sent to a server.
            </p>
          </div>

          {/* Model & Source Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Model &amp; Code
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://huggingface.co/Horizon-Labs/phishing-scam-detector-base"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <span>Hugging Face Model</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency & Cybercrime Resources */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Report Fraud &amp; Helpline
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>
                  National Cyber Crime Helpline: <strong className="font-semibold text-slate-900">1930</strong>
                </span>
              </div>
              <div>
                <a
                  href="https://cybercrime.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <span>National Cyber Crime Portal (India)</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 space-y-4">
          <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-amber-50/80 border border-amber-200/70 text-amber-900 text-xs sm:text-sm leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              <strong className="font-semibold">Disclaimer:</strong> ScamSieve is an experimental tool and cannot guarantee detection of every scam. Always verify suspicious messages independently.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <p>
              &copy; {currentYear} ScamSieve. Privacy-first fraud prevention.
            </p>
            <p>
              All message analysis runs locally in your browser.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
