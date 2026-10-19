import React, { useState } from 'react';
import { Zap, CheckCircle2 } from 'lucide-react';

export const EngineeringTool: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'ohms' | 'resistors' | 'energy' | 'gravity'>('ohms');

  // Ohm's law state: V, I, R, P
  const [volts, setVolts] = useState('12');
  const [current, setCurrent] = useState('2');
  const [resistance, setResistance] = useState('');
  const [power, setPower] = useState('');
  const [ohmsSolved, setOhmsSolved] = useState<string | null>(null);

  // Resistors state
  const [resList, setResList] = useState('10, 22, 47, 100');
  const [resResult, setResResult] = useState<{ series: number; parallel: number } | null>(null);

  // Kinetic / Potential energy
  const [mass, setMass] = useState('10'); // kg
  const [velocity, setVelocity] = useState('15'); // m/s
  const [height, setHeight] = useState('20'); // m
  const [energyResult, setEnergyResult] = useState<{ ke: number; pe: number; total: number } | null>(null);

  // Gravitation
  const [m1, setM1] = useState('5.972e24'); // Earth mass
  const [m2, setM2] = useState('70'); // Person mass
  const [radius, setRadius] = useState('6371000'); // Earth radius in meters
  const [gravForce, setGravForce] = useState<number | null>(null);

  // Calculate Ohm's Law
  const solveOhmsLaw = () => {
    const v = parseFloat(volts);
    const i = parseFloat(current);
    const r = parseFloat(resistance);
    const p = parseFloat(power);

    let calcV = v, calcI = i, calcR = r, calcP = p;

    if (!isNaN(v) && !isNaN(i)) {
      calcR = v / i;
      calcP = v * i;
    } else if (!isNaN(v) && !isNaN(r)) {
      calcI = v / r;
      calcP = (v * v) / r;
    } else if (!isNaN(i) && !isNaN(r)) {
      calcV = i * r;
      calcP = i * i * r;
    } else if (!isNaN(p) && !isNaN(v)) {
      calcI = p / v;
      calcR = (v * v) / p;
    } else if (!isNaN(p) && !isNaN(i)) {
      calcV = p / i;
      calcR = p / (i * i);
    } else if (!isNaN(p) && !isNaN(r)) {
      calcI = Math.sqrt(p / r);
      calcV = calcI * r;
    }

    setVolts(Number(calcV.toFixed(6)).toString());
    setCurrent(Number(calcI.toFixed(6)).toString());
    setResistance(Number(calcR.toFixed(6)).toString());
    setPower(Number(calcP.toFixed(6)).toString());
    setOhmsSolved(`Voltage: ${calcV.toFixed(4)} V | Current: ${calcI.toFixed(4)} A | Resistance: ${calcR.toFixed(4)} Ω | Power: ${calcP.toFixed(4)} W`);
  };

  const solveResistors = () => {
    const list = resList.split(/[\s,]+/).map(v => parseFloat(v)).filter(v => !isNaN(v) && v > 0);
    if (list.length === 0) return;
    const series = list.reduce((a, b) => a + b, 0);
    const invSum = list.reduce((a, b) => a + 1 / b, 0);
    const parallel = 1 / invSum;
    setResResult({
      series: Number(series.toFixed(6)),
      parallel: Number(parallel.toFixed(6))
    });
  };

  const solveEnergy = () => {
    const m = parseFloat(mass);
    const v = parseFloat(velocity);
    const h = parseFloat(height);
    const g = 9.80665;
    if (isNaN(m)) return;
    const ke = !isNaN(v) ? 0.5 * m * v * v : 0;
    const pe = !isNaN(h) ? m * g * h : 0;
    setEnergyResult({
      ke: Number(ke.toFixed(4)),
      pe: Number(pe.toFixed(4)),
      total: Number((ke + pe).toFixed(4))
    });
  };

  const solveGravity = () => {
    const mass1 = parseFloat(m1);
    const mass2 = parseFloat(m2);
    const r = parseFloat(radius);
    const G = 6.6743e-11;
    if (isNaN(mass1) || isNaN(mass2) || isNaN(r) || r === 0) return;
    const f = (G * mass1 * mass2) / (r * r);
    setGravForce(f);
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl text-neutral-100 max-w-3xl mx-auto">
      {/* Header with mandatory creator credit */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4 gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Engineering & Physics Calculations</span>
          </h2>
          <p className="text-xs text-amber-400 font-medium">
            Created by Rakibul Hasan Rafi (RHR)
          </p>
        </div>
        <div className="text-xs text-neutral-400">
          Circuits, Power & Dynamics
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs font-semibold">
        <button
          onClick={() => setActiveModule('ohms')}
          className={`py-2 px-2 rounded-lg transition ${activeModule === 'ohms' ? 'bg-amber-500 font-bold text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          Ohm's Law & Power
        </button>
        <button
          onClick={() => setActiveModule('resistors')}
          className={`py-2 px-2 rounded-lg transition ${activeModule === 'resistors' ? 'bg-amber-500 font-bold text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          Resistor Networks
        </button>
        <button
          onClick={() => setActiveModule('energy')}
          className={`py-2 px-2 rounded-lg transition ${activeModule === 'energy' ? 'bg-amber-500 font-bold text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          Kinetic & Potential
        </button>
        <button
          onClick={() => setActiveModule('gravity')}
          className={`py-2 px-2 rounded-lg transition ${activeModule === 'gravity' ? 'bg-amber-500 font-bold text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'}`}
        >
          Gravitational Force
        </button>
      </div>

      {/* Sub Module Content */}
      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-4">
        {activeModule === 'ohms' && (
          <div className="space-y-4">
            <div className="text-xs text-neutral-400">
              Provide any two known values to compute the remaining electrical quantities:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Voltage (V, Volts)</label>
                <input
                  type="number"
                  value={volts}
                  onChange={e => setVolts(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Current (I, Amperes)</label>
                <input
                  type="number"
                  value={current}
                  onChange={e => setCurrent(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Resistance (R, Ohms Ω)</label>
                <input
                  type="number"
                  value={resistance}
                  onChange={e => setResistance(e.target.value)}
                  placeholder="calc"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Power (P, Watts)</label>
                <input
                  type="number"
                  value={power}
                  onChange={e => setPower(e.target.value)}
                  placeholder="calc"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <button
              onClick={solveOhmsLaw}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition shadow-md text-sm"
            >
              Solve Circuit Parameters
            </button>
            {ohmsSolved && (
              <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 text-xs font-mono text-emerald-400">
                {ohmsSolved}
              </div>
            )}
          </div>
        )}

        {activeModule === 'resistors' && (
          <div className="space-y-4">
            <div className="text-xs text-neutral-400">
              Enter resistor values in ohms (separated by comma or space):
            </div>
            <input
              type="text"
              value={resList}
              onChange={e => setResList(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={solveResistors}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition shadow-md text-sm"
            >
              Calculate Equivalent Resistance
            </button>
            {resResult && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                  <div className="text-xs text-neutral-400">Series Equivalent (R_eq)</div>
                  <div className="text-xl font-bold font-mono text-amber-400 mt-1">{resResult.series} Ω</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">R_total = R₁ + R₂ + ... + Rₙ</div>
                </div>
                <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                  <div className="text-xs text-neutral-400">Parallel Equivalent (R_eq)</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{resResult.parallel} Ω</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">1/R_total = 1/R₁ + 1/R₂ + ...</div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeModule === 'energy' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Mass (m, kg)</label>
                <input
                  type="number"
                  value={mass}
                  onChange={e => setMass(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-mono text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Velocity (v, m/s)</label>
                <input
                  type="number"
                  value={velocity}
                  onChange={e => setVelocity(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-mono text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Height (h, m)</label>
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-mono text-sm focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={solveEnergy}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition shadow-md text-sm"
            >
              Compute Mechanical Energy
            </button>
            {energyResult && (
              <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-2">
                <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                  <span className="text-neutral-400 block text-[10px]">Kinetic (KE)</span>
                  <span className="text-amber-400 font-bold text-base">{energyResult.ke} J</span>
                </div>
                <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                  <span className="text-neutral-400 block text-[10px]">Potential (PE)</span>
                  <span className="text-emerald-400 font-bold text-base">{energyResult.pe} J</span>
                </div>
                <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                  <span className="text-neutral-400 block text-[10px]">Total Mechanical</span>
                  <span className="text-white font-bold text-base">{energyResult.total} J</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeModule === 'gravity' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Mass 1 (m₁, kg)</label>
                <input
                  type="text"
                  value={m1}
                  onChange={e => setM1(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-mono text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Mass 2 (m₂, kg)</label>
                <input
                  type="text"
                  value={m2}
                  onChange={e => setM2(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-mono text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Distance (r, meters)</label>
                <input
                  type="text"
                  value={radius}
                  onChange={e => setRadius(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-mono text-sm focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={solveGravity}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition shadow-md text-sm"
            >
              Calculate Gravitational Force
            </button>
            {gravForce !== null && (
              <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center font-mono">
                <span className="text-xs text-neutral-400 block">Gravitational Force F = G(m₁m₂)/r²</span>
                <span className="text-2xl font-bold text-amber-400 mt-1 block">
                  {gravForce.toExponential(6)} Newtons (N)
                </span>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  ≈ {Number(gravForce.toFixed(4))} N
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Creator footer attribution */}
      <div className="text-[11px] text-center text-neutral-400 pt-2 border-t border-neutral-800/60">
        RAFI SCIENTIFIC CALCULATOR — <span className="text-amber-400">Created by Rakibul Hasan Rafi (RHR)</span>
      </div>
    </div>
  );
};
