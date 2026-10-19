/**
 * RAFI SCIENTIFIC CALCULATOR
 * Created by Rakibul Hasan Rafi (RHR)
 * An original scientific calculator project.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calculator as CalcIcon,
  RotateCcw,
  Settings as SettingsIcon,
  HelpCircle,
  Clock,
  Award,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  LineChart,
  Binary,
  Scale,
  Zap,
  Variable
} from 'lucide-react';

import {
  AngleMode,
  DisplayNotation,
  CalculatorTheme,
  HistoryItem,
  CalculatorSettings,
  ActiveTab,
  MemoryVariables
} from './types/calculator';

import {
  evaluateExpression,
  decimalToFraction
} from './utils/mathEngine';
import { playKeyClick, triggerHaptic } from './utils/audio';

import { CalculatorDisplay } from './components/CalculatorDisplay';
import { CalculatorKeypad } from './components/CalculatorKeypad';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { HelpModal } from './components/HelpModal';

// Advanced Tools
import { EquationSolver } from './components/tools/EquationSolver';
import { CalculusTool } from './components/tools/CalculusTool';
import { StatisticsTool } from './components/tools/StatisticsTool';
import { MatrixVectorTool } from './components/tools/MatrixVectorTool';
import { BaseConverterTool } from './components/tools/BaseConverterTool';
import { UnitConverterTool } from './components/tools/UnitConverterTool';
import { EngineeringTool } from './components/tools/EngineeringTool';
import { GraphingTool } from './components/tools/GraphingTool';
import { TestVerificationModal } from './components/tools/TestVerificationModal';

const SETTINGS_KEY = 'rafi_calc_settings_v1';
const HISTORY_KEY = 'rafi_calc_history_v1';
const MEMORY_KEY = 'rafi_calc_memory_v1';

export default function App() {
  // Calculator settings state
  const [settings, setSettings] = useState<CalculatorSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Use defaults
    }
    return {
      angleMode: 'DEG',
      precision: 6,
      notation: 'NORMAL',
      theme: 'titanium',
      soundEnabled: true,
      hapticEnabled: true,
      thousandsSeparator: false
    };
  });

  // Calculation history
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [];
  });

  // Memory registers
  const [memory, setMemory] = useState<MemoryVariables>(() => {
    try {
      const saved = localStorage.getItem(MEMORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return { M: 0, A: 0, B: 0, C: 0, D: 0, X: 0, Y: 0, Ans: 0 };
  });

  // Active calculator state
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [lastRawResult, setLastRawResult] = useState<number | null>(null);
  const [exactFraction, setExactFraction] = useState<string | null>(null);
  const [showFraction, setShowFraction] = useState(false);
  const [isError, setIsError] = useState(false);

  // Shift & Alpha toggles
  const [isShift, setIsShift] = useState(false);
  const [isAlpha, setIsAlpha] = useState(false);

  // Navigation and active modal state
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // Save settings on update
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage errors
    }
  }, [settings]);

  // Save history on update
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
    } catch {
      // Ignore
    }
  }, [history]);

  // Save memory registers
  useEffect(() => {
    try {
      localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
    } catch {
      // Ignore
    }
  }, [memory]);

  // Tactile feedback helper
  const provideFeedback = useCallback((type: 'normal' | 'operator' | 'function' | 'clear' | 'equals' = 'normal') => {
    if (settings.soundEnabled) {
      playKeyClick(type);
    }
    if (settings.hapticEnabled) {
      triggerHaptic();
    }
  }, [settings.soundEnabled, settings.hapticEnabled]);

  // Live expression preview
  const livePreview = useMemo(() => {
    if (!expression.trim() || isError) return null;
    // Don't preview if ends with operator
    if (/[+\-×÷/*^]$/.test(expression.trim())) return null;

    try {
      const res = evaluateExpression(
        expression,
        settings.angleMode,
        settings.precision,
        settings.notation,
        { Ans: memory.Ans, M: memory.M, A: memory.A, B: memory.B, C: memory.C, D: memory.D, X: memory.X, Y: memory.Y }
      );
      if (!res.isError && res.formatted !== result) {
        return res.formatted;
      }
    } catch {
      // Ignore preview errors
    }
    return null;
  }, [expression, settings.angleMode, settings.precision, settings.notation, memory, isError, result]);

  // Keypress handler
  const handleKeyPress = (val: string, keyType: 'action' | 'func' | 'num' | 'op' = 'normal' as unknown as 'num') => {
    provideFeedback(keyType === 'op' ? 'operator' : keyType === 'func' ? 'function' : 'normal');

    // If an error was showing, clear it first
    if (isError) {
      setIsError(false);
      setExpression(val);
      setIsShift(false);
      setIsAlpha(false);
      return;
    }

    if (val === '(-)') {
      setExpression(prev => prev + '-');
      return;
    }

    if (val === 'Ans') {
      setExpression(prev => prev + (memory.Ans.toString()));
      return;
    }

    setExpression(prev => prev + val);
    setIsShift(false);
    setIsAlpha(false);
  };

  // Perform Calculation (=)
  const handleCalculate = () => {
    provideFeedback('equals');

    if (!expression.trim()) return;

    const res = evaluateExpression(
      expression,
      settings.angleMode,
      settings.precision,
      settings.notation,
      { Ans: memory.Ans, M: memory.M, A: memory.A, B: memory.B, C: memory.C, D: memory.D, X: memory.X, Y: memory.Y }
    );

    if (res.isError) {
      setIsError(true);
      setResult(res.formatted);
      setExactFraction(null);
    } else {
      setIsError(false);
      setResult(res.formatted);
      setLastRawResult(res.numeric);
      setExactFraction(res.exactFraction);
      setShowFraction(false);

      if (res.numeric !== null) {
        setMemory(prev => ({ ...prev, Ans: res.numeric! }));
      }

      // Add to calculation history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        expression,
        result: res.formatted,
        timestamp: Date.now(),
        angleMode: settings.angleMode,
        formattedResult: res.formatted,
        exactFraction: res.exactFraction || undefined
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 99)]);
    }

    setIsShift(false);
    setIsAlpha(false);
  };

  // Clear All (AC)
  const handleClear = () => {
    provideFeedback('clear');
    setExpression('');
    setResult('0');
    setExactFraction(null);
    setShowFraction(false);
    setIsError(false);
    setIsShift(false);
    setIsAlpha(false);
  };

  // Delete Character (DEL)
  const handleDelete = () => {
    provideFeedback('normal');
    if (isError) {
      handleClear();
      return;
    }
    setExpression(prev => prev.slice(0, -1));
  };

  // Toggle Fraction S<=>D
  const handleToggleFraction = () => {
    provideFeedback('function');
    if (exactFraction) {
      setShowFraction(prev => !prev);
    } else if (lastRawResult !== null) {
      const frac = decimalToFraction(lastRawResult);
      if (frac) {
        setExactFraction(frac);
        setShowFraction(true);
      }
    }
  };

  // Memory operations
  const handleMemoryAdd = () => {
    provideFeedback('function');
    if (lastRawResult !== null && !isError) {
      setMemory(prev => ({ ...prev, M: prev.M + lastRawResult }));
    }
  };

  const handleMemorySubtract = () => {
    provideFeedback('function');
    if (lastRawResult !== null && !isError) {
      setMemory(prev => ({ ...prev, M: prev.M - lastRawResult }));
    }
  };

  const handleMemoryRecall = () => {
    provideFeedback('function');
    setExpression(prev => prev + memory.M.toString());
  };

  const handleMemoryClear = () => {
    provideFeedback('clear');
    setMemory(prev => ({ ...prev, M: 0 }));
  };

  // Cycle angle mode: DEG -> RAD -> GRAD
  const handleCycleAngleMode = () => {
    provideFeedback('function');
    const modes: AngleMode[] = ['DEG', 'RAD', 'GRAD'];
    const nextIdx = (modes.indexOf(settings.angleMode) + 1) % modes.length;
    setSettings(prev => ({ ...prev, angleMode: modes[nextIdx] }));
  };

  // Move cursor
  const handleCursorMove = (dir: 'left' | 'right') => {
    provideFeedback('normal');
    // Minimal visual cursor shift indicator
  };

  // Keyboard Event Listeners for desktop input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keyboard inside input fields or textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key, 'num');
      } else if (e.key === '.') {
        handleKeyPress('.', 'num');
      } else if (e.key === '+') {
        handleKeyPress('+', 'op');
      } else if (e.key === '-') {
        handleKeyPress('−', 'op');
      } else if (e.key === '*') {
        handleKeyPress('×', 'op');
      } else if (e.key === '/') {
        e.preventDefault();
        handleKeyPress('÷', 'op');
      } else if (e.key === '^') {
        handleKeyPress('^', 'op');
      } else if (e.key === '%') {
        handleKeyPress('%', 'op');
      } else if (e.key === '(' || e.key === ')') {
        handleKeyPress(e.key, 'func');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCalculate, handleDelete, handleClear]);

  // History reuse
  const handleSelectHistoryExpression = (expr: string) => {
    setExpression(expr);
  };

  const handleSelectHistoryResult = (res: string) => {
    setExpression(prev => prev + res);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${settings.theme === 'cyber' ? 'bg-[#090d16] text-cyan-100' : settings.theme === 'amber' ? 'bg-[#181309] text-amber-100' : settings.theme === 'classic' ? 'bg-[#1e232a] text-slate-100' : 'bg-[#0f1115] text-neutral-100'}`}>
      {/* Top Application Navigation Bar */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur sticky top-0 z-40 px-3 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Creator attribution */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 font-black shadow-lg shadow-amber-500/20">
              <CalcIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-tech text-base sm:text-lg font-bold tracking-wider text-white">
                  RAFI SCIENTIFIC CALCULATOR
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  PRO
                </span>
              </div>
              <p className="text-[11px] font-medium text-amber-400 tracking-wide">
                Created by Rakibul Hasan Rafi (RHR)
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsTestModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              title="Run Automated Test Verification Suite"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Test Suite (24/24)</span>
              <span className="md:hidden">Tests</span>
            </button>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition relative"
              title="Calculation History"
            >
              <Clock className="w-4 h-4" />
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition"
              title="Settings & Precision"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsHelpOpen(true)}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition"
              title="User Guide & Constants"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAboutOpen(true)}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition"
              title="About & Creator Credit"
            >
              <Award className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Feature Tabs Navigation */}
      <div className="border-b border-neutral-800 bg-neutral-950/40 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none text-xs font-medium">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition ${activeTab === 'calculator' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
          >
            <CalcIcon className="w-3.5 h-3.5" />
            <span>Scientific Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('grapher')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition ${activeTab === 'grapher' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>2D Grapher</span>
          </button>

          <button
            onClick={() => setActiveTab('equations')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition ${activeTab === 'equations' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
          >
            <Variable className="w-3.5 h-3.5" />
            <span>Equation Solver</span>
          </button>

          <button
            onClick={() => setActiveTab('calculus')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition ${activeTab === 'calculus' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Calculus (∫ & d/dx)</span>
          </button>

          <button
            onClick={() => setActiveTab('matrices')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition ${activeTab === 'matrices' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Matrices & Vectors</span>
          </button>

          <button
            onClick={() => setActiveTab('statistics')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition ${activeTab === 'statistics' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Statistics</span>
          </button>

          <button
            onClick={() => setActiveTab('bases')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition ${activeTab === 'bases' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Base / Programmer</span>
          </button>

          <button
            onClick={() => setActiveTab('units')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition ${activeTab === 'units' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Unit Converter</span>
          </button>

          <button
            onClick={() => setActiveTab('engineering')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition ${activeTab === 'engineering' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Engineering</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-1 py-4 sm:py-6 px-3 sm:px-6 flex flex-col items-center justify-center">
        {activeTab === 'calculator' && (
          <div className="w-full max-w-[440px] flex flex-col items-center">
            {/* PHYSICAL SCIENTIFIC CALCULATOR CHASSIS */}
            <div className="w-full bg-[#1c1f26] border-2 border-[#2b303c] rounded-[2rem] p-4 sm:p-5 calc-shadow-3d relative">
              {/* Top Branding Plate */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-neutral-800">
                <div>
                  <div className="font-tech text-base sm:text-lg font-bold tracking-wider text-white">
                    RAFI SCIENTIFIC CALCULATOR
                  </div>
                  <div className="text-[10px] text-amber-400 font-medium">
                    Created by Rakibul Hasan Rafi (RHR)
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  <span>CLASSIC-EX</span>
                </div>
              </div>

              {/* LCD Display Component */}
              <div className="my-3">
                <CalculatorDisplay
                  expression={expression}
                  result={result}
                  exactFraction={exactFraction}
                  showFraction={showFraction}
                  onToggleFraction={handleToggleFraction}
                  angleMode={settings.angleMode}
                  onCycleAngleMode={handleCycleAngleMode}
                  isShift={isShift}
                  isAlpha={isAlpha}
                  hasMemory={memory.M !== 0}
                  notation={settings.notation}
                  isError={isError}
                  livePreview={livePreview}
                />
              </div>

              {/* Tactile Keypad */}
              <div className="pt-1">
                <CalculatorKeypad
                  isShift={isShift}
                  isAlpha={isAlpha}
                  onToggleShift={() => { provideFeedback('function'); setIsShift(prev => !prev); }}
                  onToggleAlpha={() => { provideFeedback('function'); setIsAlpha(prev => !prev); }}
                  onKeyPress={handleKeyPress}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                  onMemoryAdd={handleMemoryAdd}
                  onMemorySubtract={handleMemorySubtract}
                  onMemoryRecall={handleMemoryRecall}
                  onMemoryClear={handleMemoryClear}
                  onClear={handleClear}
                  onDelete={handleDelete}
                  onCalculate={handleCalculate}
                  onCursorMove={handleCursorMove}
                />
              </div>

              {/* Bottom Bevel Branding */}
              <div className="pt-3 text-center border-t border-neutral-800/80 mt-2">
                <span className="text-[10px] font-mono tracking-wider text-neutral-400">
                  PRECISION DUAL-POWER · <strong className="text-amber-400/80 font-normal">Created by Rakibul Hasan Rafi (RHR)</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Subviews */}
        {activeTab === 'grapher' && (
          <div className="w-full">
            <GraphingTool angleMode={settings.angleMode} />
          </div>
        )}

        {activeTab === 'equations' && (
          <div className="w-full">
            <EquationSolver />
          </div>
        )}

        {activeTab === 'calculus' && (
          <div className="w-full">
            <CalculusTool angleMode={settings.angleMode} />
          </div>
        )}

        {activeTab === 'matrices' && (
          <div className="w-full">
            <MatrixVectorTool />
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="w-full">
            <StatisticsTool />
          </div>
        )}

        {activeTab === 'bases' && (
          <div className="w-full">
            <BaseConverterTool />
          </div>
        )}

        {activeTab === 'units' && (
          <div className="w-full">
            <UnitConverterTool />
          </div>
        )}

        {activeTab === 'engineering' && (
          <div className="w-full">
            <EngineeringTool />
          </div>
        )}
      </main>

      {/* Mandatory Footer with exact creator attribution */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950/80 py-3 px-4 text-center text-xs text-neutral-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-neutral-300">RAFI SCIENTIFIC CALCULATOR</span> — An original scientific calculator project.
          </div>
          <div className="text-amber-400 font-medium">
            Created by Rakibul Hasan Rafi (RHR)
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectExpression={handleSelectHistoryExpression}
        onSelectResult={handleSelectHistoryResult}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={newS => setSettings(prev => ({ ...prev, ...newS }))}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onInsertConstant={sym => handleKeyPress(sym, 'func')}
      />

      <TestVerificationModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </div>
  );
}
