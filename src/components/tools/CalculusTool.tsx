import React, { useState } from 'react';
import * as math from 'mathjs';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { AngleMode } from '../../types/calculator';
import { createMathScope, sanitizeExpression } from '../../utils/mathEngine';

interface CalculusToolProps {
  angleMode: AngleMode;
}

export const CalculusTool: React.FC<CalculusToolProps> = ({ angleMode }) => {
  const [calcMode, setCalcMode] = useState<'derivative' | 'integral'>('integral');

  // Derivative inputs
  const [diffExpr, setDiffExpr] = useState('x^3 - 4*x^2 + 5');
  const [diffX0, setDiffX0] = useState('2');

  // Integral inputs
  const [intExpr, setIntExpr] = useState('sin(x) + x^2');
  const [intLower, setIntLower] = useState('0');
  const [intUpper, setIntUpper] = useState('3.14159265');
  const [intervals, setIntervals] = useState('1000');

  const [result, setResult] = useState<{
    success: boolean;
    title: string;
    value: string;
    steps: string[];
  } | null>(null);

  // Evaluate f(x) safely
  const evalFunc = (expression: string, xVal: number): number => {
    const sanitized = sanitizeExpression(expression, angleMode);
    const scope = createMathScope(angleMode, { x: xVal });
    const res = math.evaluate(sanitized, scope);
    if (typeof res === 'number') return res;
    if (typeof res === 'object' && res !== null && 're' in res) {
      return (res as { re: number }).re;
    }
    return Number(res);
  };

  const computeDerivative = () => {
    try {
      const x0 = parseFloat(diffX0);
      if (isNaN(x0)) throw new Error('Invalid evaluation point x₀');

      const h = 1e-5;
      // 5-point stencil central difference
      const fm2 = evalFunc(diffExpr, x0 - 2 * h);
      const fm1 = evalFunc(diffExpr, x0 - h);
      const fp1 = evalFunc(diffExpr, x0 + h);
      const fp2 = evalFunc(diffExpr, x0 + 2 * h);
      const f0 = evalFunc(diffExpr, x0);

      const d1 = (-fp2 + 8 * fp1 - 8 * fm1 + fm2) / (12 * h);
      // 2nd derivative
      const d2 = (fp1 - 2 * f0 + fm1) / (h * h);

      setResult({
        success: true,
        title: `Numerical Differentiation at x = ${x0}`,
        value: Number(d1.toFixed(8)).toString(),
        steps: [
          `Function f(x) = ${diffExpr}`,
          `Evaluation point x₀ = ${x0}`,
          `First Derivative f'(x₀) ≈ ${Number(d1.toFixed(8))}`,
          `Second Derivative f''(x₀) ≈ ${Number(d2.toFixed(8))}`,
          `Computed using 5-point symmetric finite difference stencil (h = 10⁻⁵)`
        ]
      });
    } catch (err: unknown) {
      setResult({
        success: false,
        title: 'Differentiation Error',
        value: '',
        steps: [err instanceof Error ? err.message : 'Failed to evaluate derivative']
      });
    }
  };

  const computeIntegral = () => {
    try {
      const a = parseFloat(intLower);
      const b = parseFloat(intUpper);
      let n = parseInt(intervals, 10);
      if (isNaN(a) || isNaN(b)) throw new Error('Invalid integration limits');
      if (isNaN(n) || n <= 0) n = 1000;
      if (n % 2 !== 0) n += 1; // Simpson's rule requires even n

      const h = (b - a) / n;
      let sum = evalFunc(intExpr, a) + evalFunc(intExpr, b);

      for (let i = 1; i < n; i++) {
        const x = a + i * h;
        const fx = evalFunc(intExpr, x);
        if (i % 2 === 0) {
          sum += 2 * fx;
        } else {
          sum += 4 * fx;
        }
      }

      const integralVal = (h / 3) * sum;

      setResult({
        success: true,
        title: `Definite Integral ∫ [${a} to ${b}] f(x) dx`,
        value: Number(integralVal.toFixed(8)).toString(),
        steps: [
          `Function f(x) = ${intExpr}`,
          `Lower limit a = ${a}, Upper limit b = ${b}`,
          `Grid intervals: ${n} subdivisions (step size h = ${h.toExponential(4)})`,
          `Computed using Composite Simpson's 1/3 Rule: ∫ f(x) dx ≈ ${Number(integralVal.toFixed(8))}`
        ]
      });
    } catch (err: unknown) {
      setResult({
        success: false,
        title: 'Integration Error',
        value: '',
        steps: [err instanceof Error ? err.message : 'Failed to evaluate integral']
      });
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl text-neutral-100 max-w-3xl mx-auto">
      {/* Header with mandatory creator credit */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4 gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Calculus & Numerical Methods</span>
          </h2>
          <p className="text-xs text-amber-400 font-medium">
            Created by Rakibul Hasan Rafi (RHR)
          </p>
        </div>
        <div className="text-xs text-neutral-400">
          Derivatives & Definite Integrals
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-sm font-medium">
        <button
          onClick={() => { setCalcMode('integral'); setResult(null); }}
          className={`py-2 px-3 rounded-lg transition-all text-center ${calcMode === 'integral' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          Definite Integral (∫ f(x) dx)
        </button>
        <button
          onClick={() => { setCalcMode('derivative'); setResult(null); }}
          className={`py-2 px-3 rounded-lg transition-all text-center ${calcMode === 'derivative' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          Derivative (d/dx f(x))
        </button>
      </div>

      {/* Mode form */}
      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-4">
        {calcMode === 'integral' ? (
          <>
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Integrand Expression f(x)</label>
              <input
                type="text"
                value={intExpr}
                onChange={e => setIntExpr(e.target.value)}
                placeholder="e.g. sin(x) + x^2"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Lower Limit (a)</label>
                <input
                  type="text"
                  value={intLower}
                  onChange={e => setIntLower(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Upper Limit (b)</label>
                <input
                  type="text"
                  value={intUpper}
                  onChange={e => setIntUpper(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Subdivisions (n)</label>
                <input
                  type="number"
                  value={intervals}
                  onChange={e => setIntervals(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <button
              onClick={computeIntegral}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition shadow-md"
            >
              Calculate Definite Integral
            </button>
          </>
        ) : (
          <>
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Function Expression f(x)</label>
              <input
                type="text"
                value={diffExpr}
                onChange={e => setDiffExpr(e.target.value)}
                placeholder="e.g. x^3 - 4*x^2 + 5"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Point of Differentiation (x₀)</label>
              <input
                type="text"
                value={diffX0}
                onChange={e => setDiffX0(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              onClick={computeDerivative}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition shadow-md"
            >
              Calculate Derivative
            </button>
          </>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className={`p-4 rounded-xl border ${result.success ? 'bg-neutral-950 border-amber-500/30' : 'bg-red-950/20 border-red-500/40'} space-y-3`}>
          <div className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <h3 className="font-semibold text-sm text-neutral-100">{result.title}</h3>
          </div>

          {result.value && (
            <div className="flex items-center justify-between bg-neutral-900/90 px-4 py-3 rounded-lg border border-neutral-800">
              <span className="text-amber-400 font-mono font-bold text-sm">Result =</span>
              <span className="font-mono text-xl font-bold text-white select-all">{result.value}</span>
            </div>
          )}

          <div className="pt-2 border-t border-neutral-800/80 text-xs text-neutral-400 font-mono space-y-1">
            {result.steps.map((s, idx) => (
              <div key={idx} className="leading-relaxed">• {s}</div>
            ))}
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
