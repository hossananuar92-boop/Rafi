import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as math from 'mathjs';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair } from 'lucide-react';
import { AngleMode } from '../../types/calculator';
import { sanitizeExpression, createMathScope } from '../../utils/mathEngine';

interface GraphingToolProps {
  angleMode: AngleMode;
}

export const GraphingTool: React.FC<GraphingToolProps> = ({ angleMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [func1, setFunc1] = useState('x^3 - 3*x');
  const [func2, setFunc2] = useState('2*sin(x)');
  const [showFunc2, setShowFunc2] = useState(false);

  // View bounds
  const [xMin, setXMin] = useState(-6);
  const [xMax, setXMax] = useState(6);
  const [yMin, setYMin] = useState(-4);
  const [yMax, setYMax] = useState(4);

  // Hover coordinate inspection
  const [mouseCoord, setMouseCoord] = useState<{ x: number; y: number } | null>(null);

  // Drag pan state
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Safe evaluation of f(x)
  const evalAt = useCallback((expr: string, xVal: number): number | null => {
    try {
      const sanitized = sanitizeExpression(expr, angleMode);
      const scope = createMathScope(angleMode, { x: xVal });
      const val = math.evaluate(sanitized, scope);
      if (typeof val === 'number' && Number.isFinite(val)) {
        return val;
      }
      return null;
    } catch {
      return null;
    }
  }, [angleMode]);

  // Render loop
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#0f172a'; // Deep Slate Navy
    ctx.fillRect(0, 0, width, height);

    // Coordinate transforms
    const toScreenX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toScreenY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
    const toMathX = (px: number) => xMin + (px / width) * (xMax - xMin);
    const toMathY = (py: number) => yMax - (py / height) * (yMax - yMin);

    // Draw Grid Lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';

    // Choose grid step size based on scale
    const xRange = xMax - xMin;
    let step = 1;
    if (xRange > 50) step = 10;
    else if (xRange > 20) step = 5;
    else if (xRange > 10) step = 2;
    else if (xRange < 2) step = 0.2;
    else if (xRange < 5) step = 0.5;

    // Vertical grid lines
    const startX = Math.floor(xMin / step) * step;
    for (let x = startX; x <= xMax; x += step) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      // Tick label
      if (Math.abs(x) > 1e-6) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.font = '10px monospace';
        const sy = toScreenY(0);
        const textY = Math.max(14, Math.min(height - 6, sy + 14));
        ctx.fillText(Number(x.toFixed(2)).toString(), sx - 8, textY);
      }
    }

    // Horizontal grid lines
    const startY = Math.floor(yMin / step) * step;
    for (let y = startY; y <= yMax; y += step) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();

      // Tick label
      if (Math.abs(y) > 1e-6) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.font = '10px monospace';
        const sx = toScreenX(0);
        const textX = Math.max(6, Math.min(width - 30, sx + 6));
        ctx.fillText(Number(y.toFixed(2)).toString(), textX, sy + 4);
      }
    }

    // Main Axes
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';

    // X Axis
    const axisY = toScreenY(0);
    ctx.beginPath();
    ctx.moveTo(0, axisY);
    ctx.lineTo(width, axisY);
    ctx.stroke();

    // Y Axis
    const axisX = toScreenX(0);
    ctx.beginPath();
    ctx.moveTo(axisX, 0);
    ctx.lineTo(axisX, height);
    ctx.stroke();

    // Plot helper
    const plotCurve = (expr: string, color: string) => {
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = color;
      ctx.beginPath();

      let hasStarted = false;
      const numSamples = width * 1.5;

      for (let px = 0; px <= numSamples; px++) {
        const screenPx = (px / numSamples) * width;
        const mathX = toMathX(screenPx);
        const mathY = evalAt(expr, mathX);

        if (mathY !== null && !isNaN(mathY) && Math.abs(mathY) < 1e5) {
          const screenPy = toScreenY(mathY);
          if (!hasStarted) {
            ctx.moveTo(screenPx, screenPy);
            hasStarted = true;
          } else {
            // Discontinuity threshold (e.g. 1/x asymptote)
            if (screenPy > -100 && screenPy < height + 100) {
              ctx.lineTo(screenPx, screenPy);
            } else {
              hasStarted = false;
            }
          }
        } else {
          hasStarted = false;
        }
      }
      ctx.stroke();
    };

    // Plot function 1 (Amber Gold)
    if (func1.trim()) {
      plotCurve(func1, '#f59e0b');
    }

    // Plot function 2 (Cyan/Teal)
    if (showFunc2 && func2.trim()) {
      plotCurve(func2, '#06b6d4');
    }

    // Crosshair inspection if mouse inside
    if (mouseCoord) {
      const sx = toScreenX(mouseCoord.x);
      const sy = toScreenY(mouseCoord.y);

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      // vertical guide
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      // horizontal guide
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point circle
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [xMin, xMax, yMin, yMax, func1, func2, showFunc2, mouseCoord, evalAt]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  // Zoom handlers
  const handleZoom = (factor: number) => {
    const xMid = (xMin + xMax) / 2;
    const yMid = (yMin + yMax) / 2;
    const xHalf = ((xMax - xMin) * factor) / 2;
    const yHalf = ((yMax - yMin) * factor) / 2;

    setXMin(xMid - xHalf);
    setXMax(xMid + xHalf);
    setYMin(yMid - yHalf);
    setYMax(yMid + yHalf);
  };

  const handleReset = () => {
    setXMin(-6);
    setXMax(6);
    setYMin(-4);
    setYMax(4);
  };

  // Canvas Mouse Interactions
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      const xSpan = xMax - xMin;
      const ySpan = yMax - yMin;
      const shiftX = (dx / canvas.width) * xSpan;
      const shiftY = (dy / canvas.height) * ySpan;

      setXMin(prev => prev - shiftX);
      setXMax(prev => prev - shiftX);
      setYMin(prev => prev + shiftY);
      setYMax(prev => prev + shiftY);
    } else {
      // Calculate curve coordinate
      const mathX = xMin + (px / canvas.width) * (xMax - xMin);
      const mathY = evalAt(func1, mathX);
      if (mathY !== null) {
        setMouseCoord({ x: Number(mathX.toFixed(3)), y: Number(mathY.toFixed(3)) });
      } else {
        setMouseCoord(null);
      }
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const setPreset = (expr: string) => {
    setFunc1(expr);
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl text-neutral-100 max-w-3xl mx-auto">
      {/* Header with mandatory creator credit */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4 gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Interactive 2D Function Grapher</span>
          </h2>
          <p className="text-xs text-amber-400 font-medium">
            Created by Rakibul Hasan Rafi (RHR)
          </p>
        </div>
        <div className="text-xs text-neutral-400">
          Angle mode: <span className="font-bold text-amber-400">{angleMode}</span>
        </div>
      </div>

      {/* Function Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
        <div>
          <label className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            f(x) =
          </label>
          <input
            type="text"
            value={func1}
            onChange={e => setFunc1(e.target.value)}
            placeholder="e.g. x^2 - 4"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
              g(x) =
            </label>
            <label className="text-[11px] text-neutral-400 flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={showFunc2}
                onChange={e => setShowFunc2(e.target.checked)}
                className="accent-amber-500"
              />
              Show g(x)
            </label>
          </div>
          <input
            type="text"
            value={func2}
            onChange={e => setFunc2(e.target.value)}
            disabled={!showFunc2}
            placeholder="e.g. 2*sin(x)"
            className="w-full bg-neutral-900 border border-neutral-700 disabled:opacity-40 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-neutral-400 text-[11px] mr-1">Presets:</span>
        <button onClick={() => setPreset('sin(x)')} className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300">sin(x)</button>
        <button onClick={() => setPreset('cos(x)')} className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300">cos(x)</button>
        <button onClick={() => setPreset('x^2 - 4')} className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300">x² - 4</button>
        <button onClick={() => setPreset('x^3 - 3*x')} className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300">x³ - 3x</button>
        <button onClick={() => setPreset('1/x')} className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300">1/x</button>
        <button onClick={() => setPreset('e^x')} className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300">eˣ</button>
        <button onClick={() => setPreset('sqrt(x)')} className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300">√x</button>
      </div>

      {/* Canvas Area with Toolbar Overlay */}
      <div className="relative rounded-xl overflow-hidden border border-neutral-700/80 shadow-inner bg-slate-900">
        <canvas
          ref={canvasRef}
          width={680}
          height={380}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { isDraggingRef.current = false; setMouseCoord(null); }}
          className="w-full h-[320px] sm:h-[380px] cursor-crosshair block"
        />

        {/* Toolbar Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur p-1 rounded-lg border border-neutral-700 shadow-md">
          <button
            onClick={() => handleZoom(0.7)}
            className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(1.4)}
            className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Coordinates readout bar */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-neutral-950/85 backdrop-blur px-2.5 py-1 rounded-md border border-neutral-800 text-[11px] font-mono">
          <Crosshair className="w-3.5 h-3.5 text-amber-400" />
          {mouseCoord ? (
            <span className="text-neutral-200">
              x: <strong className="text-amber-400">{mouseCoord.x}</strong>, y: <strong className="text-amber-400">{mouseCoord.y}</strong>
            </span>
          ) : (
            <span className="text-neutral-400">Hover canvas to trace coordinates</span>
          )}
        </div>
      </div>

      {/* Creator footer attribution */}
      <div className="text-[11px] text-center text-neutral-400 pt-2 border-t border-neutral-800/60">
        RAFI SCIENTIFIC CALCULATOR — <span className="text-amber-400">Created by Rakibul Hasan Rafi (RHR)</span>
      </div>
    </div>
  );
};
