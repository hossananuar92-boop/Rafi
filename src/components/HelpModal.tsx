import React from 'react';
import { HelpCircle, Keyboard, Bookmark, BookOpen } from 'lucide-react';
import { SCIENTIFIC_CONSTANTS } from '../utils/mathEngine';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertConstant: (sym: string) => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, onInsertConstant }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Calculator Help & Manual</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs text-neutral-300">
          {/* Creator Note */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-neutral-200">RAFI SCIENTIFIC CALCULATOR</div>
              <div className="text-[11px] text-amber-400 font-medium">Created by Rakibul Hasan Rafi (RHR)</div>
            </div>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-mono text-[10px]">
              User Guide
            </span>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <Keyboard className="w-4 h-4 text-amber-400" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div className="flex justify-between items-center py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Calculate</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-800 text-white rounded font-mono text-[11px]">Enter or =</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Clear All</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-800 text-white rounded font-mono text-[11px]">Escape</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Backspace / DEL</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-800 text-white rounded font-mono text-[11px]">Backspace</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Operators</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-800 text-white rounded font-mono text-[11px]">+ - * / ^ %</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-neutral-400">Parentheses</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-800 text-white rounded font-mono text-[11px]">( and )</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-neutral-400">Shift Key</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-800 text-white rounded font-mono text-[11px]">Shift</kbd>
              </div>
            </div>
          </div>

          {/* Key Functions */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Key Features & Shifts</span>
            </div>
            <div className="space-y-1.5 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div className="leading-relaxed">
                <strong className="text-amber-400">SHIFT (Gold):</strong> Toggles secondary functions displayed above keys in yellow (e.g. sin⁻¹, cos⁻¹, tan⁻¹, ∛, ⁿ√, 10ˣ, eˣ, nPr, nCr, x!).
              </div>
              <div className="leading-relaxed">
                <strong className="text-pink-400">ALPHA (Pink):</strong> Activates variable letter storage and recall (A, B, C, D, X, Y, M).
              </div>
              <div className="leading-relaxed">
                <strong className="text-white">S⇔D:</strong> Converts results between decimal floating point and exact fractional representation (e.g. 0.75 ↔ 3/4).
              </div>
              <div className="leading-relaxed">
                <strong className="text-white">DEG / RAD / GRAD:</strong> Toggle in top status bar or settings for accurate trigonometric computation.
              </div>
            </div>
          </div>

          {/* Scientific Constants Reference */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Built-in Scientific Constants (Click to Insert)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800 max-h-48 overflow-y-auto">
              {SCIENTIFIC_CONSTANTS.map(c => (
                <div
                  key={c.symbol}
                  onClick={() => { onInsertConstant(c.symbol); onClose(); }}
                  className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-amber-500/50 cursor-pointer transition flex items-center justify-between"
                  title={c.description}
                >
                  <div>
                    <div className="font-bold text-amber-400 font-mono">{c.symbol} ({c.name})</div>
                    <div className="text-[10px] text-neutral-400 truncate max-w-[170px]">{c.description}</div>
                  </div>
                  <div className="text-[11px] font-mono text-white shrink-0">
                    {c.value.toExponential(3)}
                  </div>
                </div>
              ))}
            </div>
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
