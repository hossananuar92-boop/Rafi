import React from 'react';
import { Delete } from 'lucide-react';

interface CalculatorKeypadProps {
  isShift: boolean;
  isAlpha: boolean;
  onToggleShift: () => void;
  onToggleAlpha: () => void;
  onKeyPress: (val: string, type?: 'action' | 'func' | 'num' | 'op') => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onMemoryRecall: () => void;
  onMemoryClear: () => void;
  onClear: () => void;
  onDelete: () => void;
  onCalculate: () => void;
  onCursorMove: (dir: 'left' | 'right') => void;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  isShift,
  isAlpha,
  onToggleShift,
  onToggleAlpha,
  onKeyPress,
  onOpenSettings,
  onOpenHistory,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryRecall,
  onMemoryClear,
  onClear,
  onDelete,
  onCalculate,
  onCursorMove
}) => {
  return (
    <div className="flex flex-col gap-2 select-none">
      {/* Top Controls Row: SHIFT, ALPHA, REPLAY D-PAD, MODE, ON/CLEAR */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* SHIFT */}
        <button
          onClick={onToggleShift}
          className={`key-bevel py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm tracking-wide transition border ${isShift ? 'bg-amber-400 text-neutral-950 border-amber-300 font-extrabold shadow-md' : 'bg-neutral-800 hover:bg-neutral-700 text-amber-400 border-neutral-700'}`}
        >
          SHIFT
        </button>

        {/* ALPHA */}
        <button
          onClick={onToggleAlpha}
          className={`key-bevel py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm tracking-wide transition border ${isAlpha ? 'bg-pink-400 text-neutral-950 border-pink-300 font-extrabold shadow-md' : 'bg-neutral-800 hover:bg-neutral-700 text-pink-400 border-neutral-700'}`}
        >
          ALPHA
        </button>

        {/* REPLAY CURSOR D-PAD */}
        <div className="bg-neutral-800/90 border border-neutral-700 rounded-lg flex items-center justify-between px-1 py-1 text-xs">
          <button
            onClick={() => onCursorMove('left')}
            className="flex-1 py-1 hover:bg-neutral-700 text-neutral-300 rounded text-center font-bold active:scale-95 transition"
            title="Move Cursor Left"
          >
            ◀
          </button>
          <button
            onClick={onOpenHistory}
            className="px-1 text-[10px] text-amber-400 font-bold hover:text-white transition"
            title="History"
          >
            HIST
          </button>
          <button
            onClick={() => onCursorMove('right')}
            className="flex-1 py-1 hover:bg-neutral-700 text-neutral-300 rounded text-center font-bold active:scale-95 transition"
            title="Move Cursor Right"
          >
            ▶
          </button>
        </div>

        {/* MODE / SETUP */}
        <button
          onClick={onOpenSettings}
          className="key-bevel py-2 sm:py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 rounded-lg font-bold text-xs sm:text-sm tracking-wide transition"
        >
          SETUP
        </button>

        {/* ON / CLEAR */}
        <button
          onClick={onClear}
          className="key-bevel py-2 sm:py-2.5 bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600 rounded-lg font-bold text-xs sm:text-sm tracking-wide transition"
        >
          ON
        </button>
      </div>

      {/* Row 2: Fractions, Roots, Powers, x², x⁻¹ */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* Fraction */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">d/c</span>
          <button
            onClick={() => onKeyPress('/')}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold"
          >
            믐
          </button>
        </div>

        {/* Square Root / Cube Root */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">{isShift ? 'ⁿ√' : '∛'}</span>
          <button
            onClick={() => isShift ? onKeyPress('nthRoot(') : onKeyPress('sqrt(')}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold"
          >
            √
          </button>
        </div>

        {/* x² / x³ */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">x³</span>
          <button
            onClick={() => isShift ? onKeyPress('^3') : onKeyPress('^2')}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold"
          >
            {isShift ? 'x³' : 'x²'}
          </button>
        </div>

        {/* xʸ / 10ˣ */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">10ˣ</span>
          <button
            onClick={() => isShift ? onKeyPress('10^(') : onKeyPress('^(')}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold"
          >
            {isShift ? '10ˣ' : 'xʸ'}
          </button>
        </div>

        {/* x⁻¹ / x! */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">x!</span>
          <button
            onClick={() => isShift ? onKeyPress('!') : onKeyPress('^(-1)')}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold"
          >
            {isShift ? 'x!' : 'x⁻¹'}
          </button>
        </div>
      </div>

      {/* Row 3: sin, cos, tan, ln, log */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* sin */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">sin⁻¹</span>
          <button
            onClick={() => isShift ? onKeyPress('asin(') : onKeyPress('sin(')}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold"
          >
            {isShift ? 'sin⁻¹' : 'sin'}
          </button>
        </div>

        {/* cos */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">cos⁻¹</span>
          <button
            onClick={() => isShift ? onKeyPress('acos(') : onKeyPress('cos(')}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold"
          >
            {isShift ? 'cos⁻¹' : 'cos'}
          </button>
        </div>

        {/* tan */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">tan⁻¹</span>
          <button
            onClick={() => isShift ? onKeyPress('atan(') : onKeyPress('tan(')}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold"
          >
            {isShift ? 'tan⁻¹' : 'tan'}
          </button>
        </div>

        {/* ln / eˣ */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">eˣ</span>
          <button
            onClick={() => isShift ? onKeyPress('e^(') : onKeyPress('ln(')}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold"
          >
            {isShift ? 'eˣ' : 'ln'}
          </button>
        </div>

        {/* log */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">log_b</span>
          <button
            onClick={() => isShift ? onKeyPress('logBase(') : onKeyPress('log10(')}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold"
          >
            log
          </button>
        </div>
      </div>

      {/* Row 4: Parentheses, π, e, nPr / nCr, Memory M+ */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* Left Paren ( */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">%</span>
          <button
            onClick={() => isShift ? onKeyPress('%') : onKeyPress('(')}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold"
          >
            (
          </button>
        </div>

        {/* Right Paren ) */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">,</span>
          <button
            onClick={() => isShift ? onKeyPress(', ') : onKeyPress(')')}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold"
          >
            )
          </button>
        </div>

        {/* Constant π */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">e</span>
          <button
            onClick={() => isShift ? onKeyPress('e') : onKeyPress('π')}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold"
          >
            π
          </button>
        </div>

        {/* nPr / nCr */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">nCr</span>
          <button
            onClick={() => isShift ? onKeyPress('nCr(') : onKeyPress('nPr(')}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg font-mono text-xs sm:text-sm font-semibold"
          >
            {isShift ? 'nCr' : 'nPr'}
          </button>
        </div>

        {/* Memory M+ / M- */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono">M−</span>
          <button
            onClick={() => isShift ? onMemorySubtract() : onMemoryAdd()}
            className="w-full key-bevel py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-emerald-400 rounded-lg font-mono text-xs sm:text-sm font-bold"
          >
            M+
          </button>
        </div>
      </div>

      {/* Row 5: 7, 8, 9, DEL, AC */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1">
        <button
          onClick={() => onKeyPress('7', 'num')}
          className="key-bevel py-3 bg-[#262626] hover:bg-[#333333] border border-neutral-700 text-white rounded-xl font-mono text-lg font-bold"
        >
          7
        </button>
        <button
          onClick={() => onKeyPress('8', 'num')}
          className="key-bevel py-3 bg-[#262626] hover:bg-[#333333] border border-neutral-700 text-white rounded-xl font-mono text-lg font-bold"
        >
          8
        </button>
        <button
          onClick={() => onKeyPress('9', 'num')}
          className="key-bevel py-3 bg-[#262626] hover:bg-[#333333] border border-neutral-700 text-white rounded-xl font-mono text-lg font-bold"
        >
          9
        </button>
        <button
          onClick={onDelete}
          className="key-bevel py-3 bg-amber-600 hover:bg-amber-500 border border-amber-500 text-white rounded-xl font-bold text-sm tracking-wider flex items-center justify-center gap-1 shadow-md"
        >
          <Delete className="w-4 h-4" />
          <span>DEL</span>
        </button>
        <button
          onClick={onClear}
          className="key-bevel py-3 bg-rose-700 hover:bg-rose-600 border border-rose-600 text-white rounded-xl font-bold text-sm tracking-wider shadow-md"
        >
          AC
        </button>
      </div>

      {/* Row 6: 4, 5, 6, ×, ÷ */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button
          onClick={() => onKeyPress('4', 'num')}
          className="key-bevel py-3 bg-[#262626] hover:bg-[#333333] border border-neutral-700 text-white rounded-xl font-mono text-lg font-bold"
        >
          4
        </button>
        <button
          onClick={() => onKeyPress('5', 'num')}
          className="key-bevel py-3 bg-[#262626] hover:bg-[#333333] border border-neutral-700 text-white rounded-xl font-mono text-lg font-bold"
        >
          5
        </button>
        <button
          onClick={() => onKeyPress('6', 'num')}
          className="key-bevel py-3 bg-[#262626] hover:bg-[#333333] border border-neutral-700 text-white rounded-xl font-mono text-lg font-bold"
        >
          6
        </button>
        <button
          onClick={() => onKeyPress('×', 'op')}
          className="key-bevel py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-amber-400 rounded-xl font-mono text-xl font-bold"
        >
          ×
        </button>
        <button
          onClick={() => onKeyPress('÷', 'op')}
          className="key-bevel py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-amber-400 rounded-xl font-mono text-xl font-bold"
        >
          ÷
        </button>
      </div>

      {/* Row 7: 1, 2, 3, +, − */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button
          onClick={() => onKeyPress('1', 'num')}
          className="key-bevel py-3 bg-[#262626] hover:bg-[#333333] border border-neutral-700 text-white rounded-xl font-mono text-lg font-bold"
        >
          1
        </button>
        <button
          onClick={() => onKeyPress('2', 'num')}
          className="key-bevel py-3 bg-[#262626] hover:bg-[#333333] border border-neutral-700 text-white rounded-xl font-mono text-lg font-bold"
        >
          2
        </button>
        <button
          onClick={() => onKeyPress('3', 'num')}
          className="key-bevel py-3 bg-[#262626] hover:bg-[#333333] border border-neutral-700 text-white rounded-xl font-mono text-lg font-bold"
        >
          3
        </button>
        <button
          onClick={() => onKeyPress('+', 'op')}
          className="key-bevel py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-amber-400 rounded-xl font-mono text-xl font-bold"
        >
          +
        </button>
        <button
          onClick={() => onKeyPress('−', 'op')}
          className="key-bevel py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-amber-400 rounded-xl font-mono text-xl font-bold"
        >
          −
        </button>
      </div>

      {/* Row 8: 0, ., Negative (-), Ans, = */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button
          onClick={() => onKeyPress('0', 'num')}
          className="key-bevel py-3 bg-[#262626] hover:bg-[#333333] border border-neutral-700 text-white rounded-xl font-mono text-lg font-bold"
        >
          0
        </button>
        <button
          onClick={() => onKeyPress('.', 'num')}
          className="key-bevel py-3 bg-[#262626] hover:bg-[#333333] border border-neutral-700 text-white rounded-xl font-mono text-lg font-bold"
        >
          .
        </button>
        <button
          onClick={() => onKeyPress('(-)')}
          className="key-bevel py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 rounded-xl font-mono text-sm font-bold"
          title="Negative sign (-)"
        >
          (-)
        </button>
        <button
          onClick={() => onKeyPress('Ans')}
          className="key-bevel py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-wider"
          title="Previous Answer"
        >
          Ans
        </button>
        <button
          onClick={onCalculate}
          className="key-bevel py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 border border-amber-400 text-neutral-950 rounded-xl font-mono text-2xl font-black shadow-lg"
        >
          =
        </button>
      </div>

      {/* Quick Access Function Strip: MC, MR, abs, mod, gcd */}
      <div className="grid grid-cols-5 gap-1 text-[11px] pt-1 border-t border-neutral-800/80">
        <button
          onClick={onMemoryClear}
          className="py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded border border-neutral-800 font-mono transition"
        >
          MC
        </button>
        <button
          onClick={onMemoryRecall}
          className="py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 rounded border border-neutral-800 font-mono transition"
        >
          MR
        </button>
        <button
          onClick={() => onKeyPress('abs(')}
          className="py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded border border-neutral-800 font-mono transition"
        >
          abs
        </button>
        <button
          onClick={() => onKeyPress(' mod ')}
          className="py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded border border-neutral-800 font-mono transition"
        >
          mod
        </button>
        <button
          onClick={() => onKeyPress('gcd(')}
          className="py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded border border-neutral-800 font-mono transition"
        >
          gcd
        </button>
      </div>
    </div>
  );
};
