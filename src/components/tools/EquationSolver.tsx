import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const EquationSolver: React.FC = () => {
  const [solverType, setSolverType] = useState<'linear' | 'quadratic' | 'cubic' | 'system2' | 'system3'>('quadratic');

  // Linear: ax + b = 0
  const [linA, setLinA] = useState('2');
  const [linB, setLinB] = useState('-8');

  // Quadratic: ax² + bx + c = 0
  const [quadA, setQuadA] = useState('1');
  const [quadB, setQuadB] = useState('-5');
  const [quadC, setQuadC] = useState('6');

  // Cubic: ax³ + bx² + cx + d = 0
  const [cubA, setCubA] = useState('1');
  const [cubB, setCubB] = useState('0');
  const [cubC, setCubC] = useState('-4');
  const [cubD, setCubD] = useState('0');

  // System 2x2: a1 x + b1 y = c1, a2 x + b2 y = c2
  const [s2, setS2] = useState({
    a1: '2', b1: '3', c1: '13',
    a2: '5', b2: '-1', c2: '7'
  });

  // System 3x3:
  const [s3, setS3] = useState({
    a1: '1', b1: '1', c1: '1', d1: '6',
    a2: '0', b2: '2', c2: '5', d2: '-4',
    a3: '2', b3: '5', c3: '-1', d3: '27'
  });

  const [result, setResult] = useState<{
    success: boolean;
    title: string;
    steps: string[];
    values: { label: string; value: string }[];
  } | null>(null);

  const solveLinear = () => {
    const a = parseFloat(linA);
    const b = parseFloat(linB);
    if (isNaN(a) || isNaN(b)) {
      setResult({ success: false, title: 'Invalid Input', steps: ['Please enter valid real numbers.'], values: [] });
      return;
    }
    if (a === 0) {
      if (b === 0) {
        setResult({ success: true, title: 'Infinite Solutions', steps: ['0x + 0 = 0 is true for all x ∈ ℝ.'], values: [{ label: 'x', value: 'All real numbers' }] });
      } else {
        setResult({ success: false, title: 'No Solution', steps: [`0x = ${-b} has no valid real solution.`], values: [] });
      }
      return;
    }
    const x = -b / a;
    setResult({
      success: true,
      title: 'Linear Solution (ax + b = 0)',
      steps: [
        `Equation: ${a}x + (${b}) = 0`,
        `Rearrange: ${a}x = ${-b}`,
        `Solve: x = ${-b} / ${a} = ${Number(x.toFixed(8))}`
      ],
      values: [{ label: 'x', value: x.toString() }]
    });
  };

  const solveQuadratic = () => {
    const a = parseFloat(quadA);
    const b = parseFloat(quadB);
    const c = parseFloat(quadC);
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      setResult({ success: false, title: 'Invalid Input', steps: ['Please enter numeric coefficients.'], values: [] });
      return;
    }
    if (a === 0) {
      setResult({ success: false, title: 'Not a Quadratic', steps: ['Coefficient "a" cannot be zero in a quadratic equation.'], values: [] });
      return;
    }

    const delta = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = c - (b * b) / (4 * a);

    if (delta > 0) {
      const x1 = (-b + Math.sqrt(delta)) / (2 * a);
      const x2 = (-b - Math.sqrt(delta)) / (2 * a);
      setResult({
        success: true,
        title: 'Two Distinct Real Roots',
        steps: [
          `Discriminant Δ = b² - 4ac = (${b})² - 4(${a})(${c}) = ${delta}`,
          `Since Δ > 0, there are two distinct real solutions.`,
          `Formula: x = [-b ± √Δ] / 2a`,
          `Vertex: (${Number(vertexX.toFixed(4))}, ${Number(vertexY.toFixed(4))})`
        ],
        values: [
          { label: 'x₁', value: Number(x1.toFixed(8)).toString() },
          { label: 'x₂', value: Number(x2.toFixed(8)).toString() },
          { label: 'Discriminant (Δ)', value: delta.toString() }
        ]
      });
    } else if (delta === 0) {
      const x = -b / (2 * a);
      setResult({
        success: true,
        title: 'One Repeated Real Root',
        steps: [
          `Discriminant Δ = b² - 4ac = 0`,
          `Root occurs at the parabola vertex: x = -b / 2a = ${x}`
        ],
        values: [
          { label: 'x', value: Number(x.toFixed(8)).toString() },
          { label: 'Discriminant (Δ)', value: '0' }
        ]
      });
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-delta) / (2 * a);
      setResult({
        success: true,
        title: 'Two Complex Conjugate Roots',
        steps: [
          `Discriminant Δ = b² - 4ac = ${delta} < 0`,
          `Roots involve imaginary unit i = √(-1):`,
          `x = ${Number(realPart.toFixed(6))} ± ${Number(Math.abs(imagPart).toFixed(6))}i`
        ],
        values: [
          { label: 'x₁', value: `${Number(realPart.toFixed(6))} + ${Number(Math.abs(imagPart).toFixed(6))}i` },
          { label: 'x₂', value: `${Number(realPart.toFixed(6))} - ${Number(Math.abs(imagPart).toFixed(6))}i` },
          { label: 'Discriminant (Δ)', value: delta.toString() }
        ]
      });
    }
  };

  const solveCubic = () => {
    const a = parseFloat(cubA);
    const b = parseFloat(cubB);
    const c = parseFloat(cubC);
    const d = parseFloat(cubD);
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || a === 0) {
      setResult({ success: false, title: 'Invalid Input', steps: ['Enter valid coefficients with a ≠ 0.'], values: [] });
      return;
    }

    // Cardano's method
    const an = b / a;
    const bn = c / a;
    const cn = d / a;
    const p = bn - (an * an) / 3;
    const q = (2 * an * an * an) / 27 - (an * bn) / 3 + cn;
    const delta = (q * q) / 4 + (p * p * p) / 27;

    const shift = an / 3;
    const roots: string[] = [];

    if (Math.abs(delta) < 1e-9) {
      if (Math.abs(p) < 1e-9 && Math.abs(q) < 1e-9) {
        roots.push(Number((-shift).toFixed(6)).toString() + ' (triple root)');
      } else {
        const u = Math.cbrt(-q / 2);
        roots.push(Number((2 * u - shift).toFixed(6)).toString());
        roots.push(Number((-u - shift).toFixed(6)).toString() + ' (double root)');
      }
    } else if (delta > 0) {
      const u = Math.cbrt(-q / 2 + Math.sqrt(delta));
      const v = Math.cbrt(-q / 2 - Math.sqrt(delta));
      const realRoot = u + v - shift;
      const re = -(u + v) / 2 - shift;
      const im = (Math.sqrt(3) / 2) * (u - v);
      roots.push(Number(realRoot.toFixed(6)).toString());
      roots.push(`${Number(re.toFixed(6))} + ${Number(Math.abs(im).toFixed(6))}i`);
      roots.push(`${Number(re.toFixed(6))} - ${Number(Math.abs(im).toFixed(6))}i`);
    } else {
      // 3 real roots
      const r = Math.sqrt(-(p * p * p) / 27);
      const phi = Math.acos(-q / (2 * r));
      const m = 2 * Math.cbrt(r);
      const x1 = m * Math.cos(phi / 3) - shift;
      const x2 = m * Math.cos((phi + 2 * Math.PI) / 3) - shift;
      const x3 = m * Math.cos((phi + 4 * Math.PI) / 3) - shift;
      roots.push(Number(x1.toFixed(6)).toString());
      roots.push(Number(x2.toFixed(6)).toString());
      roots.push(Number(x3.toFixed(6)).toString());
    }

    setResult({
      success: true,
      title: 'Cubic Equation Roots',
      steps: [
        `Equation: ${a}x³ + ${b}x² + ${c}x + ${d} = 0`,
        `Cardano discriminant Δ = (q/2)² + (p/3)³ = ${Number(delta.toFixed(6))}`,
        'Roots evaluated numerically using Cardano-Vieta formulation:'
      ],
      values: roots.map((r, i) => ({ label: `x_${i + 1}`, value: r }))
    });
  };

  const solveSystem2 = () => {
    const a1 = parseFloat(s2.a1), b1 = parseFloat(s2.b1), c1 = parseFloat(s2.c1);
    const a2 = parseFloat(s2.a2), b2 = parseFloat(s2.b2), c2 = parseFloat(s2.c2);

    const D = a1 * b2 - a2 * b1;
    const Dx = c1 * b2 - c2 * b1;
    const Dy = a1 * c2 - a2 * c1;

    if (Math.abs(D) < 1e-12) {
      if (Math.abs(Dx) < 1e-12 && Math.abs(Dy) < 1e-12) {
        setResult({ success: true, title: 'Infinite Solutions', steps: ['The two equations represent identical lines.'], values: [] });
      } else {
        setResult({ success: false, title: 'No Solution', steps: ['The determinant is zero; the lines are parallel.'], values: [] });
      }
      return;
    }

    const x = Dx / D;
    const y = Dy / D;

    setResult({
      success: true,
      title: 'System of 2 Linear Equations (Cramer\'s Rule)',
      steps: [
        `Determinant D = |a₁ b₁; a₂ b₂| = (${a1})(${b2}) - (${a2})(${b1}) = ${D}`,
        `Dx = |c₁ b₁; c₂ b₂| = ${Dx}`,
        `Dy = |a₁ c₁; a₂ c₂| = ${Dy}`,
        `x = Dx / D = ${Number(x.toFixed(8))}`,
        `y = Dy / D = ${Number(y.toFixed(8))}`
      ],
      values: [
        { label: 'x', value: Number(x.toFixed(8)).toString() },
        { label: 'y', value: Number(y.toFixed(8)).toString() }
      ]
    });
  };

  const solveSystem3 = () => {
    const a1 = parseFloat(s3.a1), b1 = parseFloat(s3.b1), c1 = parseFloat(s3.c1), d1 = parseFloat(s3.d1);
    const a2 = parseFloat(s3.a2), b2 = parseFloat(s3.b2), c2 = parseFloat(s3.c2), d2 = parseFloat(s3.d2);
    const a3 = parseFloat(s3.a3), b3 = parseFloat(s3.b3), c3 = parseFloat(s3.c3), d3 = parseFloat(s3.d3);

    const det3 = (
      m11: number, m12: number, m13: number,
      m21: number, m22: number, m23: number,
      m31: number, m32: number, m33: number
    ) => m11 * (m22 * m33 - m23 * m32) - m12 * (m21 * m33 - m23 * m31) + m13 * (m21 * m32 - m22 * m31);

    const D = det3(a1, b1, c1, a2, b2, c2, a3, b3, c3);
    const Dx = det3(d1, b1, c1, d2, b2, c2, d3, b3, c3);
    const Dy = det3(a1, d1, c1, a2, d2, c2, a3, d3, c3);
    const Dz = det3(a1, b1, d1, a2, b2, d2, a3, b3, d3);

    if (Math.abs(D) < 1e-12) {
      setResult({ success: false, title: 'Singular Matrix (Det = 0)', steps: ['System has either zero or infinite solutions.'], values: [] });
      return;
    }

    const x = Dx / D;
    const y = Dy / D;
    const z = Dz / D;

    setResult({
      success: true,
      title: '3x3 Linear System Solution',
      steps: [
        `System Determinant D = ${Number(D.toFixed(4))}`,
        `Dx = ${Number(Dx.toFixed(4))}, Dy = ${Number(Dy.toFixed(4))}, Dz = ${Number(Dz.toFixed(4))}`,
        `x = Dx / D, y = Dy / D, z = Dz / D`
      ],
      values: [
        { label: 'x', value: Number(x.toFixed(8)).toString() },
        { label: 'y', value: Number(y.toFixed(8)).toString() },
        { label: 'z', value: Number(z.toFixed(8)).toString() }
      ]
    });
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl text-neutral-100 max-w-3xl mx-auto">
      {/* Header with mandatory creator credit */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4 gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Equation & System Solver</span>
          </h2>
          <p className="text-xs text-amber-400 font-medium">
            Created by Rakibul Hasan Rafi (RHR)
          </p>
        </div>
        <div className="text-xs text-neutral-400">
          Polynomials & Linear Systems
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs font-medium">
        <button
          onClick={() => { setSolverType('linear'); setResult(null); }}
          className={`py-2 px-2 rounded-lg transition-all text-center ${solverType === 'linear' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          Linear (ax+b)
        </button>
        <button
          onClick={() => { setSolverType('quadratic'); setResult(null); }}
          className={`py-2 px-2 rounded-lg transition-all text-center ${solverType === 'quadratic' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          Quadratic (ax²+bx+c)
        </button>
        <button
          onClick={() => { setSolverType('cubic'); setResult(null); }}
          className={`py-2 px-2 rounded-lg transition-all text-center ${solverType === 'cubic' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          Cubic (ax³)
        </button>
        <button
          onClick={() => { setSolverType('system2'); setResult(null); }}
          className={`py-2 px-2 rounded-lg transition-all text-center ${solverType === 'system2' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          2×2 System
        </button>
        <button
          onClick={() => { setSolverType('system3'); setResult(null); }}
          className={`py-2 px-2 rounded-lg transition-all text-center ${solverType === 'system3' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          3×3 System
        </button>
      </div>

      {/* Input Form based on type */}
      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
        {solverType === 'linear' && (
          <div className="space-y-4">
            <div className="text-sm font-semibold text-neutral-300">Format: ax + b = 0</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Coefficient a</label>
                <input
                  type="number"
                  value={linA}
                  onChange={e => setLinA(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Constant b</label>
                <input
                  type="number"
                  value={linB}
                  onChange={e => setLinB(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <button
              onClick={solveLinear}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition shadow-md"
            >
              Solve Linear Equation
            </button>
          </div>
        )}

        {solverType === 'quadratic' && (
          <div className="space-y-4">
            <div className="text-sm font-semibold text-neutral-300">Format: ax² + bx + c = 0</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">a (x² coeff)</label>
                <input
                  type="number"
                  value={quadA}
                  onChange={e => setQuadA(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">b (x coeff)</label>
                <input
                  type="number"
                  value={quadB}
                  onChange={e => setQuadB(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">c (constant)</label>
                <input
                  type="number"
                  value={quadC}
                  onChange={e => setQuadC(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <button
              onClick={solveQuadratic}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition shadow-md"
            >
              Solve Quadratic Equation
            </button>
          </div>
        )}

        {solverType === 'cubic' && (
          <div className="space-y-4">
            <div className="text-sm font-semibold text-neutral-300">Format: ax³ + bx² + cx + d = 0</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">a (x³)</label>
                <input
                  type="number"
                  value={cubA}
                  onChange={e => setCubA(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">b (x²)</label>
                <input
                  type="number"
                  value={cubB}
                  onChange={e => setCubB(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">c (x)</label>
                <input
                  type="number"
                  value={cubC}
                  onChange={e => setCubC(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">d (const)</label>
                <input
                  type="number"
                  value={cubD}
                  onChange={e => setCubD(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <button
              onClick={solveCubic}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition shadow-md"
            >
              Solve Cubic Equation
            </button>
          </div>
        )}

        {solverType === 'system2' && (
          <div className="space-y-4">
            <div className="text-sm font-semibold text-neutral-300">Format: a x + b y = c</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 w-12">Eq 1:</span>
                <input type="number" placeholder="a1" value={s2.a1} onChange={e => setS2({...s2, a1: e.target.value})} className="w-16 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center text-sm" />
                <span>x +</span>
                <input type="number" placeholder="b1" value={s2.b1} onChange={e => setS2({...s2, b1: e.target.value})} className="w-16 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center text-sm" />
                <span>y =</span>
                <input type="number" placeholder="c1" value={s2.c1} onChange={e => setS2({...s2, c1: e.target.value})} className="w-16 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 w-12">Eq 2:</span>
                <input type="number" placeholder="a2" value={s2.a2} onChange={e => setS2({...s2, a2: e.target.value})} className="w-16 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center text-sm" />
                <span>x +</span>
                <input type="number" placeholder="b2" value={s2.b2} onChange={e => setS2({...s2, b2: e.target.value})} className="w-16 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center text-sm" />
                <span>y =</span>
                <input type="number" placeholder="c2" value={s2.c2} onChange={e => setS2({...s2, c2: e.target.value})} className="w-16 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center text-sm" />
              </div>
            </div>
            <button
              onClick={solveSystem2}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition shadow-md"
            >
              Solve 2×2 Linear System
            </button>
          </div>
        )}

        {solverType === 'system3' && (
          <div className="space-y-4">
            <div className="text-sm font-semibold text-neutral-300">Format: a x + b y + c z = d</div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-1.5">
                <input type="number" value={s3.a1} onChange={e => setS3({...s3, a1: e.target.value})} className="w-14 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center" />
                <span>x +</span>
                <input type="number" value={s3.b1} onChange={e => setS3({...s3, b1: e.target.value})} className="w-14 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center" />
                <span>y +</span>
                <input type="number" value={s3.c1} onChange={e => setS3({...s3, c1: e.target.value})} className="w-14 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center" />
                <span>z =</span>
                <input type="number" value={s3.d1} onChange={e => setS3({...s3, d1: e.target.value})} className="w-14 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center" />
              </div>
              <div className="flex items-center gap-1.5">
                <input type="number" value={s3.a2} onChange={e => setS3({...s3, a2: e.target.value})} className="w-14 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center" />
                <span>x +</span>
                <input type="number" value={s3.b2} onChange={e => setS3({...s3, b2: e.target.value})} className="w-14 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center" />
                <span>y +</span>
                <input type="number" value={s3.c2} onChange={e => setS3({...s3, c2: e.target.value})} className="w-14 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center" />
                <span>z =</span>
                <input type="number" value={s3.d2} onChange={e => setS3({...s3, d2: e.target.value})} className="w-14 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center" />
              </div>
              <div className="flex items-center gap-1.5">
                <input type="number" value={s3.a3} onChange={e => setS3({...s3, a3: e.target.value})} className="w-14 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center" />
                <span>x +</span>
                <input type="number" value={s3.b3} onChange={e => setS3({...s3, b3: e.target.value})} className="w-14 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center" />
                <span>y +</span>
                <input type="number" value={s3.c3} onChange={e => setS3({...s3, c3: e.target.value})} className="w-14 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center" />
                <span>z =</span>
                <input type="number" value={s3.d3} onChange={e => setS3({...s3, d3: e.target.value})} className="w-14 bg-neutral-900 border border-neutral-700 rounded p-1.5 text-center" />
              </div>
            </div>
            <button
              onClick={solveSystem3}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition shadow-md"
            >
              Solve 3×3 Linear System
            </button>
          </div>
        )}
      </div>

      {/* Results Display */}
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

          {result.values.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {result.values.map((v, i) => (
                <div key={i} className="flex items-center justify-between bg-neutral-900/90 px-3 py-2 rounded-lg border border-neutral-800">
                  <span className="text-amber-400 font-mono font-bold text-sm">{v.label} =</span>
                  <span className="font-mono text-white text-base select-all">{v.value}</span>
                </div>
              ))}
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
