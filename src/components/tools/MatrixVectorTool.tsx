import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const MatrixVectorTool: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'vector'>('matrix');

  // Matrix State
  const [matrixDim, setMatrixDim] = useState<2 | 3>(2);
  const [matA, setMatA] = useState<number[][]>([
    [1, 2, 0],
    [3, 4, 0],
    [0, 0, 1]
  ]);
  const [matB, setMatB] = useState<number[][]>([
    [5, 6, 0],
    [7, 8, 0],
    [0, 0, 1]
  ]);
  const [matrixResult, setMatrixResult] = useState<{
    title: string;
    matrix?: number[][];
    scalar?: number | string;
    details?: string;
  } | null>(null);

  // Vector State
  const [vecDim, setVecDim] = useState<2 | 3>(3);
  const [vecU, setVecU] = useState<number[]>([1, 2, 3]);
  const [vecV, setVecV] = useState<number[]>([4, 5, 6]);
  const [vecResult, setVecResult] = useState<{
    title: string;
    vector?: number[];
    scalar?: number | string;
    details?: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Matrix Helpers
  const det2x2 = (m: number[][]) => m[0][0] * m[1][1] - m[0][1] * m[1][0];

  const det3x3 = (m: number[][]) => {
    return (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    );
  };

  const invert2x2 = (m: number[][]) => {
    const d = det2x2(m);
    if (Math.abs(d) < 1e-12) return null;
    return [
      [m[1][1] / d, -m[0][1] / d],
      [-m[1][0] / d, m[0][0] / d]
    ];
  };

  const invert3x3 = (m: number[][]) => {
    const d = det3x3(m);
    if (Math.abs(d) < 1e-12) return null;
    const inv: number[][] = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    inv[0][0] = (m[1][1] * m[2][2] - m[1][2] * m[2][1]) / d;
    inv[0][1] = (m[0][2] * m[2][1] - m[0][1] * m[2][2]) / d;
    inv[0][2] = (m[0][1] * m[1][2] - m[0][2] * m[1][1]) / d;
    inv[1][0] = (m[1][2] * m[2][0] - m[1][0] * m[2][2]) / d;
    inv[1][1] = (m[0][0] * m[2][2] - m[0][2] * m[2][0]) / d;
    inv[1][2] = (m[0][2] * m[1][0] - m[0][0] * m[1][2]) / d;
    inv[2][0] = (m[1][0] * m[2][1] - m[1][1] * m[2][0]) / d;
    inv[2][1] = (m[0][1] * m[2][0] - m[0][0] * m[2][1]) / d;
    inv[2][2] = (m[0][0] * m[1][1] - m[0][1] * m[1][0]) / d;
    return inv;
  };

  const handleDetA = () => {
    setError(null);
    const d = matrixDim === 2 ? det2x2(matA) : det3x3(matA);
    setMatrixResult({
      title: 'Determinant det(A)',
      scalar: Number(d.toFixed(8)),
      details: matrixDim === 2 ? `Formula: a₁₁a₂₂ - a₁₂a₂₁` : `Computed via Laplace cofactor expansion`
    });
  };

  const handleInvA = () => {
    setError(null);
    const inv = matrixDim === 2 ? invert2x2(matA) : invert3x3(matA);
    if (!inv) {
      setError('Matrix A is singular (determinant is 0), inverse does not exist.');
      setMatrixResult(null);
      return;
    }
    setMatrixResult({
      title: 'Inverse Matrix A⁻¹',
      matrix: inv.map(row => row.slice(0, matrixDim).map(v => Number(v.toFixed(6)))),
      details: 'A × A⁻¹ = I (Identity Matrix)'
    });
  };

  const handleTransposeA = () => {
    setError(null);
    const trans = Array.from({ length: matrixDim }, (_, r) =>
      Array.from({ length: matrixDim }, (_, c) => matA[c][r])
    );
    setMatrixResult({
      title: 'Transpose Matrix Aᵀ',
      matrix: trans
    });
  };

  const handleAdd = () => {
    setError(null);
    const sum = Array.from({ length: matrixDim }, (_, r) =>
      Array.from({ length: matrixDim }, (_, c) => matA[r][c] + matB[r][c])
    );
    setMatrixResult({
      title: 'Matrix Addition (A + B)',
      matrix: sum
    });
  };

  const handleSubtract = () => {
    setError(null);
    const diff = Array.from({ length: matrixDim }, (_, r) =>
      Array.from({ length: matrixDim }, (_, c) => matA[r][c] - matB[r][c])
    );
    setMatrixResult({
      title: 'Matrix Subtraction (A - B)',
      matrix: diff
    });
  };

  const handleMultiply = () => {
    setError(null);
    const prod: number[][] = Array.from({ length: matrixDim }, () =>
      Array(matrixDim).fill(0)
    );
    for (let i = 0; i < matrixDim; i++) {
      for (let j = 0; j < matrixDim; j++) {
        let sum = 0;
        for (let k = 0; k < matrixDim; k++) {
          sum += matA[i][k] * matB[k][j];
        }
        prod[i][j] = Number(sum.toFixed(8));
      }
    }
    setMatrixResult({
      title: 'Matrix Product (A × B)',
      matrix: prod
    });
  };

  // Vector Operations
  const handleDotProduct = () => {
    setError(null);
    let dot = 0;
    for (let i = 0; i < vecDim; i++) dot += vecU[i] * vecV[i];
    setVecResult({
      title: 'Dot Product (u · v)',
      scalar: dot,
      details: `u · v = ${vecU.slice(0, vecDim).map((u, i) => `(${u} × ${vecV[i]})`).join(' + ')} = ${dot}`
    });
  };

  const handleCrossProduct = () => {
    setError(null);
    if (vecDim !== 3) {
      setError('Cross product is defined for 3-dimensional vectors.');
      return;
    }
    const cx = vecU[1] * vecV[2] - vecU[2] * vecV[1];
    const cy = vecU[2] * vecV[0] - vecU[0] * vecV[2];
    const cz = vecU[0] * vecV[1] - vecU[1] * vecV[0];
    setVecResult({
      title: 'Cross Product (u × v)',
      vector: [cx, cy, cz],
      details: `Result is perpendicular to both u and v. Magnitudes: |u × v| = |u||v|sin(θ)`
    });
  };

  const handleMagnitudes = () => {
    setError(null);
    const magU = Math.sqrt(vecU.slice(0, vecDim).reduce((acc, v) => acc + v * v, 0));
    const magV = Math.sqrt(vecV.slice(0, vecDim).reduce((acc, v) => acc + v * v, 0));

    let dot = 0;
    for (let i = 0; i < vecDim; i++) dot += vecU[i] * vecV[i];

    let angleDeg = 0;
    let angleRad = 0;
    if (magU > 0 && magV > 0) {
      const cosTheta = Math.max(-1, Math.min(1, dot / (magU * magV)));
      angleRad = Math.acos(cosTheta);
      angleDeg = (angleRad * 180) / Math.PI;
    }

    setVecResult({
      title: 'Vector Magnitudes & Angle',
      details: `|u| = ${Number(magU.toFixed(6))}\n|v| = ${Number(magV.toFixed(6))}\nAngle θ = ${Number(angleDeg.toFixed(4))}° (${Number(angleRad.toFixed(6))} rad)`
    });
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl text-neutral-100 max-w-3xl mx-auto">
      {/* Header with mandatory creator credit */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4 gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Matrix & Vector Mathematics</span>
          </h2>
          <p className="text-xs text-amber-400 font-medium">
            Created by Rakibul Hasan Rafi (RHR)
          </p>
        </div>
        <div className="text-xs text-neutral-400">
          Linear Algebra Engine
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-sm font-medium">
        <button
          onClick={() => { setActiveSubTab('matrix'); setError(null); }}
          className={`py-2 px-3 rounded-lg transition-all text-center ${activeSubTab === 'matrix' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          Matrix Operations (2×2 / 3×3)
        </button>
        <button
          onClick={() => { setActiveSubTab('vector'); setError(null); }}
          className={`py-2 px-3 rounded-lg transition-all text-center ${activeSubTab === 'vector' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          Vector Operations (2D / 3D)
        </button>
      </div>

      {activeSubTab === 'matrix' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">Select Dimension:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setMatrixDim(2)}
                className={`px-3 py-1 text-xs rounded-lg border ${matrixDim === 2 ? 'bg-amber-500 border-amber-400 text-neutral-950 font-bold' : 'border-neutral-700 text-neutral-400'}`}
              >
                2 × 2
              </button>
              <button
                onClick={() => setMatrixDim(3)}
                className={`px-3 py-1 text-xs rounded-lg border ${matrixDim === 3 ? 'bg-amber-500 border-amber-400 text-neutral-950 font-bold' : 'border-neutral-700 text-neutral-400'}`}
              >
                3 × 3
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matrix A */}
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div className="text-xs font-bold text-amber-400 mb-2">Matrix A</div>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrixDim}, minmax(0, 1fr))` }}>
                {Array.from({ length: matrixDim }).map((_, r) =>
                  Array.from({ length: matrixDim }).map((_, c) => (
                    <input
                      key={`a-${r}-${c}`}
                      type="number"
                      value={matA[r][c]}
                      onChange={e => {
                        const next = matA.map(row => [...row]);
                        next[r][c] = parseFloat(e.target.value) || 0;
                        setMatA(next);
                      }}
                      className="bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-center text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  ))
                )}
              </div>
            </div>

            {/* Matrix B */}
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div className="text-xs font-bold text-amber-400 mb-2">Matrix B</div>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrixDim}, minmax(0, 1fr))` }}>
                {Array.from({ length: matrixDim }).map((_, r) =>
                  Array.from({ length: matrixDim }).map((_, c) => (
                    <input
                      key={`b-${r}-${c}`}
                      type="number"
                      value={matB[r][c]}
                      onChange={e => {
                        const next = matB.map(row => [...row]);
                        next[r][c] = parseFloat(e.target.value) || 0;
                        setMatB(next);
                      }}
                      className="bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-center text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1 text-xs font-semibold">
            <button onClick={handleDetA} className="py-2 px-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition text-white">det(A)</button>
            <button onClick={handleInvA} className="py-2 px-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition text-white">A⁻¹ (Inv)</button>
            <button onClick={handleTransposeA} className="py-2 px-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition text-white">Aᵀ (Trans)</button>
            <button onClick={handleAdd} className="py-2 px-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition text-white">A + B</button>
            <button onClick={handleSubtract} className="py-2 px-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition text-white">A − B</button>
            <button onClick={handleMultiply} className="py-2 px-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition">A × B</button>
          </div>

          {/* Result */}
          {matrixResult && (
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <h3 className="font-semibold text-sm text-neutral-100">{matrixResult.title}</h3>
              </div>

              {matrixResult.scalar !== undefined && (
                <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-800 font-mono text-xl font-bold text-amber-400">
                  {matrixResult.scalar}
                </div>
              )}

              {matrixResult.matrix && (
                <div className="inline-block bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrixResult.matrix[0].length}, minmax(0, 1fr))` }}>
                    {matrixResult.matrix.map((row, r) =>
                      row.map((val, c) => (
                        <div key={`res-${r}-${c}`} className="px-3 py-1.5 bg-neutral-950 rounded border border-neutral-800 text-center font-mono font-bold text-white text-sm">
                          {val}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {matrixResult.details && (
                <div className="text-xs text-neutral-400 font-mono">{matrixResult.details}</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">Vector Dimension:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setVecDim(2)}
                className={`px-3 py-1 text-xs rounded-lg border ${vecDim === 2 ? 'bg-amber-500 border-amber-400 text-neutral-950 font-bold' : 'border-neutral-700 text-neutral-400'}`}
              >
                2D (x, y)
              </button>
              <button
                onClick={() => setVecDim(3)}
                className={`px-3 py-1 text-xs rounded-lg border ${vecDim === 3 ? 'bg-amber-500 border-amber-400 text-neutral-950 font-bold' : 'border-neutral-700 text-neutral-400'}`}
              >
                3D (x, y, z)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vector u */}
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div className="text-xs font-bold text-amber-400 mb-2">Vector u</div>
              <div className="flex gap-2">
                {Array.from({ length: vecDim }).map((_, i) => (
                  <div key={`u-${i}`} className="flex-1">
                    <span className="text-[10px] text-neutral-400 block mb-1">
                      {i === 0 ? 'x' : i === 1 ? 'y' : 'z'}
                    </span>
                    <input
                      type="number"
                      value={vecU[i]}
                      onChange={e => {
                        const next = [...vecU];
                        next[i] = parseFloat(e.target.value) || 0;
                        setVecU(next);
                      }}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-center text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Vector v */}
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div className="text-xs font-bold text-amber-400 mb-2">Vector v</div>
              <div className="flex gap-2">
                {Array.from({ length: vecDim }).map((_, i) => (
                  <div key={`v-${i}`} className="flex-1">
                    <span className="text-[10px] text-neutral-400 block mb-1">
                      {i === 0 ? 'x' : i === 1 ? 'y' : 'z'}
                    </span>
                    <input
                      type="number"
                      value={vecV[i]}
                      onChange={e => {
                        const next = [...vecV];
                        next[i] = parseFloat(e.target.value) || 0;
                        setVecV(next);
                      }}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-center text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs font-semibold">
            <button onClick={handleDotProduct} className="py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition text-white">
              Dot Product (u · v)
            </button>
            <button onClick={handleCrossProduct} className="py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition text-white">
              Cross Product (u × v)
            </button>
            <button onClick={handleMagnitudes} className="py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition">
              Magnitudes & Angle θ
            </button>
          </div>

          {/* Vector Result */}
          {vecResult && (
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <h3 className="font-semibold text-sm text-neutral-100">{vecResult.title}</h3>
              </div>

              {vecResult.scalar !== undefined && (
                <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-800 font-mono text-xl font-bold text-amber-400">
                  {vecResult.scalar}
                </div>
              )}

              {vecResult.vector && (
                <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-800 font-mono text-base font-bold text-white flex gap-3">
                  <span>(</span>
                  {vecResult.vector.map((c, i) => (
                    <span key={i} className="text-amber-400">
                      {c}{i < vecResult.vector!.length - 1 ? ',' : ''}
                    </span>
                  ))}
                  <span>)</span>
                </div>
              )}

              {vecResult.details && (
                <div className="text-xs text-neutral-400 font-mono whitespace-pre-line">{vecResult.details}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-950/30 border border-red-500/40 rounded-xl text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Creator footer attribution */}
      <div className="text-[11px] text-center text-neutral-400 pt-2 border-t border-neutral-800/60">
        RAFI SCIENTIFIC CALCULATOR — <span className="text-amber-400">Created by Rakibul Hasan Rafi (RHR)</span>
      </div>
    </div>
  );
};
