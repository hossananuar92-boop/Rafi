import React, { useState } from 'react';
import { Trash2, Copy, Check, Clock, CornerDownLeft } from 'lucide-react';
import { HistoryItem } from '../types/calculator';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectExpression: (expr: string) => void;
  onSelectResult: (res: string) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectExpression,
  onSelectResult,
  onDeleteHistoryItem,
  onClearHistory
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (res: string, id: string) => {
    navigator.clipboard.writeText(res);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Calculation History</h2>
            </div>
            <p className="text-xs text-amber-400 font-medium mt-0.5">
              Created by Rakibul Hasan Rafi (RHR)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-neutral-950/70 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>{history.length} {history.length === 1 ? 'record' : 'records'} stored locally</span>
          {history.length > 0 && (
            showConfirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-rose-400">Clear all?</span>
                <button
                  onClick={() => { onClearHistory(); setShowConfirmClear(false); }}
                  className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-[11px]"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded text-[11px]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )
          )}
        </div>

        {/* History List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-neutral-400 opacity-40" />
              <p className="text-sm">No calculations in history yet.</p>
              <p className="text-xs text-neutral-400">Perform any calculation and press = to save here.</p>
            </div>
          ) : (
            history.map(item => (
              <div
                key={item.id}
                className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 hover:border-neutral-700 transition group relative"
              >
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                  <span>{new Date(item.timestamp).toLocaleTimeString()} · Mode: {item.angleMode}</span>
                  <button
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="opacity-60 group-hover:opacity-100 text-neutral-400 hover:text-rose-400 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Expression */}
                <div
                  onClick={() => { onSelectExpression(item.expression); onClose(); }}
                  className="font-mono text-sm text-neutral-300 hover:text-amber-400 cursor-pointer transition select-all truncate"
                  title="Click to insert expression into calculator"
                >
                  {item.expression} =
                </div>

                {/* Result */}
                <div className="flex items-center justify-between mt-1">
                  <div
                    onClick={() => { onSelectResult(item.result); onClose(); }}
                    className="font-mono text-lg font-bold text-amber-400 hover:text-amber-300 cursor-pointer transition select-all"
                    title="Click to use result in calculator"
                  >
                    {item.formattedResult || item.result}
                    {item.exactFraction && (
                      <span className="text-xs font-normal text-emerald-400 ml-2">
                        [{item.exactFraction}]
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item.result, item.id)}
                      className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 rounded-lg border border-neutral-800 transition"
                      title="Copy result"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => { onSelectResult(item.result); onClose(); }}
                      className="p-1.5 text-neutral-400 hover:text-amber-400 bg-neutral-900 rounded-lg border border-neutral-800 transition"
                      title="Insert as Ans"
                    >
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with mandatory creator credit */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>RAFI SCIENTIFIC CALCULATOR</span>
          <span className="text-amber-400 font-medium">Created by Rakibul Hasan Rafi (RHR)</span>
        </div>
      </div>
    </div>
  );
};
