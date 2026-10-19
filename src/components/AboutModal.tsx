import React from 'react';
import { Calculator, Award, ShieldCheck, Cpu } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">About Product & Creator</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Main Card with exact required statement */}
          <div className="bg-neutral-950 p-5 rounded-2xl border border-amber-500/30 text-center space-y-2 relative overflow-hidden">
            <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 mb-1 border border-amber-500/20">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold tracking-tight text-white font-tech">
              RAFI SCIENTIFIC CALCULATOR
            </h3>
            <p className="text-base text-amber-400 font-semibold tracking-wide">
              Created by Rakibul Hasan Rafi (RHR)
            </p>
            <p className="text-xs text-neutral-400 uppercase tracking-widest pt-1">
              An original scientific calculator project.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-3 text-xs text-neutral-300 leading-relaxed bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
            <p>
              <strong>RAFI SCIENTIFIC CALCULATOR</strong> is an authentic, production-grade online scientific instrument designed from first principles by Rakibul Hasan Rafi (RHR) to provide students, researchers, engineers, and scientists with high-precision mathematical capabilities.
            </p>
            <p>
              It integrates an authentic physical calculator layout, high-contrast LCD dot-matrix display, tactile feedback, exact fraction transformations, calculus, linear algebra, equation solving, and interactive graphing.
            </p>
          </div>

          {/* Features Highlights */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Cpu className="w-3.5 h-3.5" />
                <span>Deterministic Math</span>
              </div>
              <p className="text-neutral-400 text-[11px]">
                Safe evaluation parser without eval() or external API latency.
              </p>
            </div>
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Privacy</span>
              </div>
              <p className="text-neutral-400 text-[11px]">
                Runs entirely client-side. Calculations and history remain private.
              </p>
            </div>
          </div>

          {/* Attribution Box */}
          <div className="p-3 bg-neutral-950/90 rounded-xl border border-neutral-800 text-center text-xs">
            <div className="text-neutral-400">Project Architect & Creator:</div>
            <div className="font-bold text-amber-400 mt-0.5 text-sm">Rakibul Hasan Rafi (RHR)</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">RAFI SCIENTIFIC CALCULATOR — Original Mathematical Work</div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>RAFI SCIENTIFIC CALCULATOR</span>
          <span className="text-amber-400 font-medium">Created by Rakibul Hasan Rafi (RHR)</span>
        </div>
      </div>
    </div>
  );
};
