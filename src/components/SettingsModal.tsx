import React from 'react';
import { Settings as SettingsIcon, Volume2, VolumeX, Smartphone, Palette, Hash } from 'lucide-react';
import { CalculatorSettings, AngleMode, DisplayNotation, CalculatorTheme } from '../types/calculator';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CalculatorSettings;
  onUpdateSettings: (newSettings: Partial<CalculatorSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header with mandatory creator credit */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Calculator Settings</h2>
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

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-sm">
          {/* Angle Mode */}
          <div className="space-y-2">
            <label className="font-semibold text-neutral-200 flex items-center justify-between">
              <span>Angle Calculation Mode</span>
              <span className="text-xs text-amber-400 font-mono font-bold">{settings.angleMode}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['DEG', 'RAD', 'GRAD'] as AngleMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => onUpdateSettings({ angleMode: mode })}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${settings.angleMode === mode ? 'bg-amber-500 border-amber-400 text-neutral-950 shadow' : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'}`}
                >
                  {mode === 'DEG' ? 'Degrees (DEG)' : mode === 'RAD' ? 'Radians (RAD)' : 'Gradians (GRAD)'}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <label className="font-semibold text-neutral-200 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Calculator Aesthetic Theme</span>
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'titanium', name: 'Titanium Slate (Original)' },
                { id: 'cyber', name: 'Cyber Neon (Blue)' },
                { id: 'amber', name: 'Vintage Amber LCD' },
                { id: 'classic', name: 'Platinum Gray' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => onUpdateSettings({ theme: t.id as CalculatorTheme })}
                  className={`py-2 px-3 rounded-xl border text-left font-medium transition ${settings.theme === t.id ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Display Notation */}
          <div className="space-y-2">
            <label className="font-semibold text-neutral-200 flex items-center gap-2">
              <Hash className="w-4 h-4 text-amber-400" />
              <span>Number Display Notation</span>
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
              {(['NORMAL', 'SCI', 'ENG'] as DisplayNotation[]).map(n => (
                <button
                  key={n}
                  onClick={() => onUpdateSettings({ notation: n })}
                  className={`py-2 rounded-xl border transition ${settings.notation === n ? 'bg-amber-500 border-amber-400 text-neutral-950 shadow' : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'}`}
                >
                  {n === 'NORMAL' ? 'Standard (Norm)' : n === 'SCI' ? 'Scientific (SCI)' : 'Engineering (ENG)'}
                </button>
              ))}
            </div>
          </div>

          {/* Decimal Precision Slider */}
          <div className="space-y-2 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-neutral-300">Decimal Precision</span>
              <span className="text-amber-400 font-mono font-bold">{settings.precision} decimal places</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={settings.precision}
              onChange={e => onUpdateSettings({ precision: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
              <span>0 (Integer)</span>
              <span>6 (Default)</span>
              <span>12 (High Res)</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2.5">
            {/* Thousands separator */}
            <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <div className="space-y-0.5">
                <div className="font-medium text-xs text-neutral-200">Thousands Separator</div>
                <div className="text-[11px] text-neutral-400">Display 1,000,000 instead of 1000000</div>
              </div>
              <input
                type="checkbox"
                checked={settings.thousandsSeparator}
                onChange={e => onUpdateSettings({ thousandsSeparator: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
            </div>

            {/* Sound clicks */}
            <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
                <div className="space-y-0.5">
                  <div className="font-medium text-xs text-neutral-200">Mechanical Key Clicks</div>
                  <div className="text-[11px] text-neutral-400">Tactile Web Audio feedback on key press</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={e => onUpdateSettings({ soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
            </div>

            {/* Haptic feedback */}
            <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <div className="space-y-0.5">
                  <div className="font-medium text-xs text-neutral-200">Haptic Vibration</div>
                  <div className="text-[11px] text-neutral-400">Tactile vibration on mobile Android touch</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.hapticEnabled}
                onChange={e => onUpdateSettings({ hapticEnabled: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
            </div>
          </div>
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
