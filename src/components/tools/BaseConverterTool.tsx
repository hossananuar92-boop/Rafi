import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const BaseConverterTool: React.FC = () => {
  const [decVal, setDecVal] = useState('255');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Bitwise inputs
  const [bitOp, setBitOp] = useState<'AND' | 'OR' | 'XOR' | 'NOT' | 'SHL' | 'SHR'>('AND');
  const [operandA, setOperandA] = useState('12');
  const [operandB, setOperandB] = useState('10');

  // Parse decimal safely using BigInt or Number
  let currentBigInt: bigint = 0n;
  let isValid = true;
  try {
    currentBigInt = BigInt(decVal || '0');
  } catch {
    isValid = false;
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleBaseChange = (value: string, radix: number) => {
    if (!value.trim()) {
      setDecVal('');
      return;
    }
    try {
      let parsed: bigint;
      if (radix === 16) {
        parsed = BigInt('0x' + value.replace(/^0x/i, ''));
      } else if (radix === 2) {
        parsed = BigInt('0b' + value.replace(/^0b/i, ''));
      } else if (radix === 8) {
        parsed = BigInt('0o' + value.replace(/^0o/i, ''));
      } else {
        parsed = BigInt(value);
      }
      setDecVal(parsed.toString());
    } catch {
      // Incomplete/invalid syntax while typing
    }
  };

  // Bitwise operation calculation
  let bitResult: { dec: string; hex: string; bin: string } | null = null;
  try {
    const a = BigInt(operandA || '0');
    const b = BigInt(operandB || '0');
    let res = 0n;
    if (bitOp === 'AND') res = a & b;
    else if (bitOp === 'OR') res = a | b;
    else if (bitOp === 'XOR') res = a ^ b;
    else if (bitOp === 'NOT') res = ~a;
    else if (bitOp === 'SHL') res = a << (b > 64n ? 64n : b);
    else if (bitOp === 'SHR') res = a >> (b > 64n ? 64n : b);

    bitResult = {
      dec: res.toString(10),
      hex: '0x' + (res < 0n ? (BigInt.asUintN(32, res)).toString(16).toUpperCase() : res.toString(16).toUpperCase()),
      bin: (res < 0n ? (BigInt.asUintN(32, res)).toString(2) : res.toString(2))
    };
  } catch {
    bitResult = null;
  }

  // Format representations
  const hexString = isValid ? (currentBigInt < 0n ? '-' + (-currentBigInt).toString(16).toUpperCase() : currentBigInt.toString(16).toUpperCase()) : 'Error';
  const binString = isValid ? (currentBigInt < 0n ? '-' + (-currentBigInt).toString(2) : currentBigInt.toString(2)) : 'Error';
  const octString = isValid ? (currentBigInt < 0n ? '-' + (-currentBigInt).toString(8) : currentBigInt.toString(8)) : 'Error';

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl text-neutral-100 max-w-3xl mx-auto">
      {/* Header with mandatory creator credit */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4 gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Base & Programmer Mode</span>
          </h2>
          <p className="text-xs text-amber-400 font-medium">
            Created by Rakibul Hasan Rafi (RHR)
          </p>
        </div>
        <div className="text-xs text-neutral-400">
          HEX · DEC · OCT · BIN & Logic
        </div>
      </div>

      {/* Main Base Conversions */}
      <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
        <div className="text-xs font-semibold text-neutral-300 mb-1">
          Simultaneous Radix Conversion (Type in any field):
        </div>

        {/* DEC */}
        <div className="flex items-center gap-2 bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-800">
          <span className="w-14 text-xs font-bold font-mono text-amber-400">DEC (10)</span>
          <input
            type="text"
            value={decVal}
            onChange={e => setDecVal(e.target.value)}
            className="flex-1 bg-transparent font-mono text-sm text-white focus:outline-none"
            placeholder="0"
          />
          <button
            onClick={() => copyToClipboard(decVal, 'dec')}
            className="text-neutral-400 hover:text-white p-1"
            title="Copy"
          >
            {copiedKey === 'dec' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* HEX */}
        <div className="flex items-center gap-2 bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-800">
          <span className="w-14 text-xs font-bold font-mono text-emerald-400">HEX (16)</span>
          <input
            type="text"
            value={hexString}
            onChange={e => handleBaseChange(e.target.value, 16)}
            className="flex-1 bg-transparent font-mono text-sm text-white focus:outline-none uppercase"
            placeholder="0"
          />
          <button
            onClick={() => copyToClipboard(hexString, 'hex')}
            className="text-neutral-400 hover:text-white p-1"
            title="Copy"
          >
            {copiedKey === 'hex' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* BIN */}
        <div className="flex items-center gap-2 bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-800">
          <span className="w-14 text-xs font-bold font-mono text-sky-400">BIN (2)</span>
          <input
            type="text"
            value={binString}
            onChange={e => handleBaseChange(e.target.value, 2)}
            className="flex-1 bg-transparent font-mono text-sm text-white focus:outline-none"
            placeholder="0"
          />
          <button
            onClick={() => copyToClipboard(binString, 'bin')}
            className="text-neutral-400 hover:text-white p-1"
            title="Copy"
          >
            {copiedKey === 'bin' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* OCT */}
        <div className="flex items-center gap-2 bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-800">
          <span className="w-14 text-xs font-bold font-mono text-purple-400">OCT (8)</span>
          <input
            type="text"
            value={octString}
            onChange={e => handleBaseChange(e.target.value, 8)}
            className="flex-1 bg-transparent font-mono text-sm text-white focus:outline-none"
            placeholder="0"
          />
          <button
            onClick={() => copyToClipboard(octString, 'oct')}
            className="text-neutral-400 hover:text-white p-1"
            title="Copy"
          >
            {copiedKey === 'oct' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bitwise Logic Calculator */}
      <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
        <div className="text-xs font-semibold text-neutral-300">
          Bitwise Operations:
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-xs font-mono font-bold">
          {(['AND', 'OR', 'XOR', 'NOT', 'SHL', 'SHR'] as const).map(op => (
            <button
              key={op}
              onClick={() => setBitOp(op)}
              className={`py-2 rounded-lg border transition ${bitOp === op ? 'bg-amber-500 border-amber-400 text-neutral-950 shadow' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}`}
            >
              {op}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-[11px] text-neutral-400 mb-1 block">Operand A (Dec)</label>
            <input
              type="number"
              value={operandA}
              onChange={e => setOperandA(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          {bitOp !== 'NOT' && (
            <div>
              <label className="text-[11px] text-neutral-400 mb-1 block">
                {bitOp === 'SHL' || bitOp === 'SHR' ? 'Shift Amount (bits)' : 'Operand B (Dec)'}
              </label>
              <input
                type="number"
                value={operandB}
                onChange={e => setOperandB(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          )}
        </div>

        {bitResult && (
          <div className="mt-3 p-3 bg-neutral-900 rounded-lg border border-neutral-800 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-neutral-400">Result (DEC):</span>
              <span className="text-amber-400 font-bold">{bitResult.dec}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Result (HEX):</span>
              <span className="text-emerald-400 font-bold">{bitResult.hex}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Result (BIN):</span>
              <span className="text-sky-400 font-bold break-all text-right max-w-[200px]">{bitResult.bin}</span>
            </div>
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
