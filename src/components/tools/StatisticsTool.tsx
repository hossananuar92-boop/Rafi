import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const StatisticsTool: React.FC = () => {
  const [mode, setMode] = useState<'1var' | 'regression'>('1var');

  // 1-variable input
  const [dataInput, setDataInput] = useState('12, 15, 18, 22, 25, 30, 32, 35, 40, 42');

  // Regression input: comma or space separated pairs x,y per line
  const [regInput, setRegInput] = useState('1, 2.5\n2, 3.8\n3, 6.1\n4, 7.9\n5, 10.2');

  const [statsResult, setStatsResult] = useState<{
    count: number;
    sum: number;
    sumSq: number;
    mean: number;
    median: number;
    mode: string;
    sampleVar: number;
    sampleStd: number;
    popVar: number;
    popStd: number;
    min: number;
    max: number;
    range: number;
    q1: number;
    q3: number;
    iqr: number;
  } | null>(null);

  const [regResult, setRegResult] = useState<{
    n: number;
    slope: number;
    intercept: number;
    r: number;
    r2: number;
    eq: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  const calculate1Var = () => {
    setError(null);
    setStatsResult(null);

    const values = dataInput
      .split(/[\s,;\n]+/)
      .map(v => v.trim())
      .filter(v => v.length > 0)
      .map(v => Number(v));

    if (values.some(v => isNaN(v))) {
      setError('Input contains non-numeric values. Please use comma or space separated numbers.');
      return;
    }

    if (values.length < 2) {
      setError('Please provide at least 2 data points for meaningful statistical analysis.');
      return;
    }

    const n = values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, v) => acc + v, 0);
    const sumSq = values.reduce((acc, v) => acc + v * v, 0);
    const mean = sum / n;

    // Median
    let median: number;
    const mid = Math.floor(n / 2);
    if (n % 2 !== 0) {
      median = sorted[mid];
    } else {
      median = (sorted[mid - 1] + sorted[mid]) / 2;
    }

    // Quartiles
    const q1 = sorted[Math.floor(n / 4)];
    const q3 = sorted[Math.floor((3 * n) / 4)];
    const iqr = q3 - q1;

    // Mode
    const freq: Record<number, number> = {};
    let maxFreq = 0;
    values.forEach(v => {
      freq[v] = (freq[v] || 0) + 1;
      if (freq[v] > maxFreq) maxFreq = freq[v];
    });

    let modeStr = 'None';
    if (maxFreq > 1) {
      const modes = Object.keys(freq).filter(k => freq[Number(k)] === maxFreq);
      if (modes.length === values.length) {
        modeStr = 'None (uniform)';
      } else {
        modeStr = modes.join(', ');
      }
    }

    // Variances
    const popVar = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
    const popStd = Math.sqrt(popVar);
    const sampleVar = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1);
    const sampleStd = Math.sqrt(sampleVar);

    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;

    setStatsResult({
      count: n,
      sum,
      sumSq,
      mean,
      median,
      mode: modeStr,
      sampleVar,
      sampleStd,
      popVar,
      popStd,
      min,
      max,
      range,
      q1,
      q3,
      iqr
    });
  };

  const calculateRegression = () => {
    setError(null);
    setRegResult(null);

    const lines = regInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const pairs: { x: number; y: number }[] = [];

    for (const line of lines) {
      const parts = line.split(/[,\s\t]+/).filter(Boolean);
      if (parts.length >= 2) {
        const x = Number(parts[0]);
        const y = Number(parts[1]);
        if (!isNaN(x) && !isNaN(y)) {
          pairs.push({ x, y });
        }
      }
    }

    if (pairs.length < 2) {
      setError('Please provide at least two (x, y) data pairs (one pair per line).');
      return;
    }

    const n = pairs.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;

    pairs.forEach(p => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x;
      sumYY += p.y * p.y;
    });

    const denom = n * sumXX - sumX * sumX;
    if (Math.abs(denom) < 1e-12) {
      setError('Cannot compute regression: all X coordinates are identical.');
      return;
    }

    const slope = (n * sumXY - sumX * sumY) / denom;
    const intercept = (sumY - slope * sumX) / n;

    const rDenom = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    const r = rDenom === 0 ? 0 : (n * sumXY - sumX * sumY) / rDenom;
    const r2 = r * r;

    const sign = intercept >= 0 ? '+' : '-';
    const eq = `y = ${Number(slope.toFixed(4))}x ${sign} ${Number(Math.abs(intercept).toFixed(4))}`;

    setRegResult({
      n,
      slope,
      intercept,
      r,
      r2,
      eq
    });
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl text-neutral-100 max-w-3xl mx-auto">
      {/* Header with mandatory creator credit */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4 gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Statistics & Linear Regression</span>
          </h2>
          <p className="text-xs text-amber-400 font-medium">
            Created by Rakibul Hasan Rafi (RHR)
          </p>
        </div>
        <div className="text-xs text-neutral-400">
          Summary Statistics & Curve Fitting
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-sm font-medium">
        <button
          onClick={() => { setMode('1var'); setError(null); }}
          className={`py-2 px-3 rounded-lg transition-all text-center ${mode === '1var' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          Single Variable (1-Var Stats)
        </button>
        <button
          onClick={() => { setMode('regression'); setError(null); }}
          className={`py-2 px-3 rounded-lg transition-all text-center ${mode === 'regression' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          Linear Regression (y = mx + c)
        </button>
      </div>

      {/* Input area */}
      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-4">
        {mode === '1var' ? (
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">
              Enter Data Set (comma, space, or newline separated):
            </label>
            <textarea
              rows={3}
              value={dataInput}
              onChange={e => setDataInput(e.target.value)}
              placeholder="e.g. 10, 15, 20, 25, 30"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={calculate1Var}
              className="mt-3 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition shadow-md"
            >
              Compute 1-Variable Statistics
            </button>
          </div>
        ) : (
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">
              Enter (x, y) Coordinate Pairs (one pair per line, separated by comma or space):
            </label>
            <textarea
              rows={5}
              value={regInput}
              onChange={e => setRegInput(e.target.value)}
              placeholder="1, 2.5&#10;2, 3.8&#10;3, 6.1"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={calculateRegression}
              className="mt-3 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition shadow-md"
            >
              Compute Linear Regression
            </button>
          </div>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-950/30 border border-red-500/40 rounded-xl text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1-Var Results */}
      {statsResult && (
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <h3 className="font-semibold text-sm text-neutral-100">Statistical Summary (Sample Size n = {statsResult.count})</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Mean (x̄)</div>
              <div className="text-amber-400 font-mono font-bold text-base mt-0.5">{Number(statsResult.mean.toFixed(6))}</div>
            </div>
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Median</div>
              <div className="text-white font-mono font-bold text-base mt-0.5">{statsResult.median}</div>
            </div>
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Mode</div>
              <div className="text-white font-mono font-bold text-base mt-0.5 truncate">{statsResult.mode}</div>
            </div>
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Sum (Σx)</div>
              <div className="text-white font-mono font-bold text-base mt-0.5">{Number(statsResult.sum.toFixed(4))}</div>
            </div>

            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Sample Std Dev (s)</div>
              <div className="text-emerald-400 font-mono font-bold text-base mt-0.5">{Number(statsResult.sampleStd.toFixed(6))}</div>
            </div>
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Sample Variance (s²)</div>
              <div className="text-white font-mono font-bold text-base mt-0.5">{Number(statsResult.sampleVar.toFixed(6))}</div>
            </div>
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Pop Std Dev (σ)</div>
              <div className="text-white font-mono font-bold text-base mt-0.5">{Number(statsResult.popStd.toFixed(6))}</div>
            </div>
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Pop Variance (σ²)</div>
              <div className="text-white font-mono font-bold text-base mt-0.5">{Number(statsResult.popVar.toFixed(6))}</div>
            </div>

            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Min</div>
              <div className="text-white font-mono font-bold text-base mt-0.5">{statsResult.min}</div>
            </div>
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Max</div>
              <div className="text-white font-mono font-bold text-base mt-0.5">{statsResult.max}</div>
            </div>
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Range</div>
              <div className="text-white font-mono font-bold text-base mt-0.5">{statsResult.range}</div>
            </div>
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Interquartile (IQR)</div>
              <div className="text-white font-mono font-bold text-base mt-0.5">{statsResult.iqr} (Q1: {statsResult.q1}, Q3: {statsResult.q3})</div>
            </div>
          </div>
        </div>
      )}

      {/* Regression Results */}
      {regResult && (
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <h3 className="font-semibold text-sm text-neutral-100">Linear Regression Results (n = {regResult.n})</h3>
          </div>

          <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 text-center">
            <div className="text-xs text-neutral-400">Best-fit Equation</div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">{regResult.eq}</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Slope (m)</div>
              <div className="text-white font-mono font-bold text-sm mt-0.5">{Number(regResult.slope.toFixed(6))}</div>
            </div>
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Intercept (c)</div>
              <div className="text-white font-mono font-bold text-sm mt-0.5">{Number(regResult.intercept.toFixed(6))}</div>
            </div>
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Correlation (r)</div>
              <div className="text-emerald-400 font-mono font-bold text-sm mt-0.5">{Number(regResult.r.toFixed(6))}</div>
            </div>
            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">R² (Variance explained)</div>
              <div className="text-amber-400 font-mono font-bold text-sm mt-0.5">{Number(regResult.r2.toFixed(6))}</div>
            </div>
          </div>
        </div>
      )}

      {/* Creator footer attribution */}
      <div className="text-[11px] text-center text-neutral-400 pt-2 border-t border-neutral-800/60">
        RAFI SCIENTIFIC CALCULATOR — <span className="text-amber-400">Created by Rakibul Hasan Rafi (RHR)</span>
      </div>
    </div>
  );
};
