import React from 'react';
import { Copy, Check, ArrowLeftRight } from 'lucide-react';
import { AngleMode, DisplayNotation } from '../types/calculator';

interface CalculatorDisplayProps {
  expression: string;
  result: string;
  exactFraction: string | null;
  showFraction: boolean;
  onToggleFraction: () => void;
  angleMode: AngleMode;
  onCycleAngleMode: () => void;
  isShift: boolean;
  isAlpha: boolean;
  hasMemory: boolean;
  notation: DisplayNotation;
  isError: boolean;
  livePreview?: string | null;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  result,
  exactFraction,
  showFraction,
  onToggleFraction,
  angleMode,
  onCycleAngleMode,
  isShift,
  isAlpha,
  hasMemory,
  notation,
  isError,
  livePreview
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (result && !isError) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const displayedResult = showFraction && exactFraction ? exactFraction : result;

  return (
    <div className="relative bg-[#16201f] text-[#a4c2b9] p-3 sm:p-4 rounded-xl border-2 border-neutral-800 lcd-screen-bevel font-lcd select-none shadow-inner">
      {/* Top LCD Status Row */}
      <div className="flex items-center justify-between text-[11px] font-mono tracking-wider pb-1.5 border-b border-[#243533] text-[#71958b]">
        {/* Indicators */}
        <div className="flex items-center gap-2">
          <span className={`px-1 py-0.2 rounded text-[10px] font-bold ${isShift ? 'bg-amber-400 text-black font-extrabold shadow-sm' : 'opacity-20 text-neutral-400'}`}>
            S
          </span>
          <span className={`px-1 py-0.2 rounded text-[10px] font-bold ${isAlpha ? 'bg-pink-400 text-black font-extrabold shadow-sm' : 'opacity-20 text-neutral-400'}`}>
            A
          </span>
          <span className={`px-1 py-0.2 rounded text-[10px] font-bold ${hasMemory ? 'bg-emerald-400 text-black font-extrabold shadow-sm' : 'opacity-20 text-neutral-400'}`}>
            M
          </span>

          <button
            onClick={onCycleAngleMode}
            className="hover:text-amber-300 font-bold tracking-widest px-1 py-0.5 rounded bg-[#1f2d2b] text-[#9ec4ba] transition flex items-center gap-1 cursor-pointer"
            title="Click to cycle DEG -> RAD -> GRAD"
          >
            <span>{angleMode}</span>
          </button>

          <span className="opacity-80 text-[10px]">
            {notation === 'NORMAL' ? 'NORM' : notation}
          </span>

          <span className="hidden sm:inline-block opacity-80 text-[10px]">
            MATH
          </span>
        </div>

        {/* Realistic Solar Cell mockup */}
        <div className="flex items-center gap-1">
          <div className="hidden sm:flex items-center gap-0.5 bg-[#2c1d11] px-2 py-0.5 rounded border border-[#523722] shadow-inner">
            <div className="w-2.5 h-3.5 bg-[#3a2719] border-r border-[#523722]"></div>
            <div className="w-2.5 h-3.5 bg-[#3a2719] border-r border-[#523722]"></div>
            <div className="w-2.5 h-3.5 bg-[#3a2719] border-r border-[#523722]"></div>
            <div className="w-2.5 h-3.5 bg-[#3a2719]"></div>
          </div>
          <span className="text-[9px] text-[#4d6b63] font-mono hidden md:inline">TWO WAY POWER</span>
        </div>
      </div>

      {/* Expression line */}
      <div className="min-h-[2.4rem] pt-2 pb-1 flex items-center justify-start overflow-x-auto text-left whitespace-nowrap scrollbar-none font-mono-math text-base sm:text-lg text-[#d8eae4] font-medium tracking-wide">
        {expression ? (
          <div className="flex items-center">
            <span>{expression}</span>
            <span className="w-2 h-5 bg-[#52d6a7] animate-pulse ml-0.5 inline-block opacity-75"></span>
          </div>
        ) : (
          <div className="flex items-center text-[#55776e]">
            <span>0</span>
            <span className="w-2 h-5 bg-[#52d6a7] animate-pulse ml-0.5 inline-block opacity-40"></span>
          </div>
        )}
      </div>

      {/* Live evaluation preview line if available */}
      {livePreview && !isError && expression && livePreview !== result && (
        <div className="text-right text-xs font-mono text-[#5f877c] truncate pr-1">
          ≈ {livePreview}
        </div>
      )}

      {/* Main Result Line */}
      <div className="flex items-baseline justify-between pt-1 border-t border-[#243533]/60">
        {/* Fraction S<=>D Toggle & Copy Button */}
        <div className="flex items-center gap-1.5">
          {exactFraction && !isError && (
            <button
              onClick={onToggleFraction}
              className="px-2 py-0.5 bg-[#1f2d2b] hover:bg-[#2b3e3c] active:scale-95 text-[#6ee7b7] rounded border border-[#2f4642] text-[11px] font-mono font-bold flex items-center gap-1 transition shadow-sm"
              title="Toggle Fraction ↔ Decimal (S⇔D)"
            >
              <ArrowLeftRight className="w-3 h-3" />
              <span>S⇔D</span>
            </button>
          )}

          {result && !isError && (
            <button
              onClick={handleCopy}
              className="p-1 bg-[#1f2d2b] hover:bg-[#2b3e3c] text-[#71958b] hover:text-[#c4ded6] rounded border border-[#2f4642] transition"
              title="Copy result to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Large Result Display */}
        <div className="text-right flex-1 overflow-x-auto scrollbar-none pl-2">
          <div className={`font-mono text-2xl sm:text-3xl font-bold tracking-tight select-all ${isError ? 'text-rose-400 text-lg sm:text-xl' : 'text-[#eefbf6]'}`}>
            {displayedResult || '0'}
          </div>
        </div>
      </div>
    </div>
  );
};
