import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  ratio: number; // Ratio relative to base unit
  toBase?: (val: number) => number;
  fromBase?: (baseVal: number) => number;
}

const CATEGORIES: Record<string, { name: string; units: UnitDef[] }> = {
  length: {
    name: 'Length',
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', ratio: 1 },
      { id: 'km', name: 'Kilometer', symbol: 'km', ratio: 1000 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', ratio: 0.01 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', ratio: 0.001 },
      { id: 'in', name: 'Inch', symbol: 'in', ratio: 0.0254 },
      { id: 'ft', name: 'Foot', symbol: 'ft', ratio: 0.3048 },
      { id: 'yd', name: 'Yard', symbol: 'yd', ratio: 0.9144 },
      { id: 'mi', name: 'Mile', symbol: 'mi', ratio: 1609.344 },
      { id: 'nm', name: 'Nautical Mile', symbol: 'nmi', ratio: 1852 }
    ]
  },
  mass: {
    name: 'Mass & Weight',
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', ratio: 1 },
      { id: 'g', name: 'Gram', symbol: 'g', ratio: 0.001 },
      { id: 'mg', name: 'Milligram', symbol: 'mg', ratio: 0.000001 },
      { id: 'lb', name: 'Pound', symbol: 'lb', ratio: 0.45359237 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', ratio: 0.028349523125 },
      { id: 't', name: 'Metric Ton', symbol: 't', ratio: 1000 },
      { id: 'stone', name: 'Stone', symbol: 'st', ratio: 6.35029 }
    ]
  },
  temperature: {
    name: 'Temperature',
    units: [
      {
        id: 'c', name: 'Celsius', symbol: '°C', ratio: 1,
        toBase: (c) => c,
        fromBase: (c) => c
      },
      {
        id: 'f', name: 'Fahrenheit', symbol: '°F', ratio: 1,
        toBase: (f) => (f - 32) * (5 / 9),
        fromBase: (c) => c * (9 / 5) + 32
      },
      {
        id: 'k', name: 'Kelvin', symbol: 'K', ratio: 1,
        toBase: (k) => k - 273.15,
        fromBase: (c) => c + 273.15
      },
      {
        id: 'r', name: 'Rankine', symbol: '°R', ratio: 1,
        toBase: (r) => (r - 491.67) * (5 / 9),
        fromBase: (c) => (c + 273.15) * 1.8
      }
    ]
  },
  speed: {
    name: 'Speed',
    units: [
      { id: 'mps', name: 'Meters / sec', symbol: 'm/s', ratio: 1 },
      { id: 'kph', name: 'Kilometers / hour', symbol: 'km/h', ratio: 1 / 3.6 },
      { id: 'mph', name: 'Miles / hour', symbol: 'mph', ratio: 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', ratio: 0.514444 },
      { id: 'fps', name: 'Feet / sec', symbol: 'ft/s', ratio: 0.3048 }
    ]
  },
  area: {
    name: 'Area',
    units: [
      { id: 'sqm', name: 'Square Meter', symbol: 'm²', ratio: 1 },
      { id: 'sqkm', name: 'Square Kilometer', symbol: 'km²', ratio: 1e6 },
      { id: 'sqft', name: 'Square Foot', symbol: 'ft²', ratio: 0.092903 },
      { id: 'sqin', name: 'Square Inch', symbol: 'in²', ratio: 0.00064516 },
      { id: 'acre', name: 'Acre', symbol: 'ac', ratio: 4046.856 },
      { id: 'ha', name: 'Hectare', symbol: 'ha', ratio: 10000 }
    ]
  },
  volume: {
    name: 'Volume',
    units: [
      { id: 'l', name: 'Liter', symbol: 'L', ratio: 1 },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', ratio: 0.001 },
      { id: 'cum', name: 'Cubic Meter', symbol: 'm³', ratio: 1000 },
      { id: 'gal', name: 'Gallon (US)', symbol: 'gal', ratio: 3.78541 },
      { id: 'qt', name: 'Quart (US)', symbol: 'qt', ratio: 0.946353 },
      { id: 'floz', name: 'Fluid Ounce (US)', symbol: 'fl oz', ratio: 0.0295735 },
      { id: 'cup', name: 'Cup (US)', symbol: 'cup', ratio: 0.236588 }
    ]
  },
  pressure: {
    name: 'Pressure',
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', ratio: 1 },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', ratio: 1000 },
      { id: 'bar', name: 'Bar', symbol: 'bar', ratio: 100000 },
      { id: 'psi', name: 'Pound / sq inch', symbol: 'psi', ratio: 6894.757 },
      { id: 'atm', name: 'Standard Atmosphere', symbol: 'atm', ratio: 101325 },
      { id: 'mmhg', name: 'Millimeter of Mercury', symbol: 'mmHg', ratio: 133.322 }
    ]
  },
  energy: {
    name: 'Energy',
    units: [
      { id: 'j', name: 'Joule', symbol: 'J', ratio: 1 },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', ratio: 1000 },
      { id: 'cal', name: 'Calorie', symbol: 'cal', ratio: 4.184 },
      { id: 'kcal', name: 'Kilocalorie', symbol: 'kcal', ratio: 4184 },
      { id: 'wh', name: 'Watt-hour', symbol: 'Wh', ratio: 3600 },
      { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', ratio: 3.6e6 },
      { id: 'btu', name: 'BTU', symbol: 'BTU', ratio: 1055.06 },
      { id: 'ev', name: 'Electronvolt', symbol: 'eV', ratio: 1.602176634e-19 }
    ]
  },
  power: {
    name: 'Power',
    units: [
      { id: 'w', name: 'Watt', symbol: 'W', ratio: 1 },
      { id: 'kw', name: 'Kilowatt', symbol: 'kW', ratio: 1000 },
      { id: 'mw', name: 'Megawatt', symbol: 'MW', ratio: 1e6 },
      { id: 'hp', name: 'Horsepower (mechanical)', symbol: 'hp', ratio: 745.69987 }
    ]
  },
  time: {
    name: 'Time',
    units: [
      { id: 's', name: 'Second', symbol: 's', ratio: 1 },
      { id: 'ms', name: 'Millisecond', symbol: 'ms', ratio: 0.001 },
      { id: 'min', name: 'Minute', symbol: 'min', ratio: 60 },
      { id: 'h', name: 'Hour', symbol: 'h', ratio: 3600 },
      { id: 'd', name: 'Day', symbol: 'd', ratio: 86400 },
      { id: 'w', name: 'Week', symbol: 'wk', ratio: 604800 },
      { id: 'yr', name: 'Year (365 days)', symbol: 'yr', ratio: 31536000 }
    ]
  }
};

export const UnitConverterTool: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('temperature');
  const [inputValue, setInputValue] = useState<string>('100');
  const [fromUnitId, setFromUnitId] = useState<string>('c');
  const [toUnitId, setToUnitId] = useState<string>('f');

  const currentCat = CATEGORIES[selectedCat];

  // Convert
  const convertUnits = (): string => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '0';

    const fromU = currentCat.units.find(u => u.id === fromUnitId) || currentCat.units[0];
    const toU = currentCat.units.find(u => u.id === toUnitId) || currentCat.units[1];

    if (fromU.id === toU.id) return val.toString();

    let baseVal: number;
    if (fromU.toBase) {
      baseVal = fromU.toBase(val);
    } else {
      baseVal = val * fromU.ratio;
    }

    let resultVal: number;
    if (toU.fromBase) {
      resultVal = toU.fromBase(baseVal);
    } else {
      resultVal = baseVal / toU.ratio;
    }

    return Number(resultVal.toFixed(8)).toString();
  };

  const swapUnits = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const handleCategorySelect = (catKey: string) => {
    setSelectedCat(catKey);
    const units = CATEGORIES[catKey].units;
    setFromUnitId(units[0].id);
    setToUnitId(units[1]?.id || units[0].id);
  };

  const outputVal = convertUnits();

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl text-neutral-100 max-w-3xl mx-auto">
      {/* Header with mandatory creator credit */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4 gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>High-Precision Unit Converter</span>
          </h2>
          <p className="text-xs text-amber-400 font-medium">
            Created by Rakibul Hasan Rafi (RHR)
          </p>
        </div>
        <div className="text-xs text-neutral-400">
          10 Scientific Categories
        </div>
      </div>

      {/* Categories Horizontal Carousel / Buttons */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => handleCategorySelect(key)}
            className={`py-1.5 px-3 rounded-lg transition ${selectedCat === key ? 'bg-amber-500 font-bold text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Converter Card */}
      <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-4">
          {/* FROM */}
          <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-2">
            <div className="flex justify-between items-center text-xs text-neutral-400">
              <span>From:</span>
              <select
                value={fromUnitId}
                onChange={e => setFromUnitId(e.target.value)}
                className="bg-neutral-950 border border-neutral-700 text-amber-400 font-semibold rounded px-2 py-1 text-xs focus:outline-none"
              >
                {currentCat.units.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                ))}
              </select>
            </div>
            <input
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="w-full bg-transparent font-mono text-2xl font-bold text-white focus:outline-none"
              placeholder="0"
            />
          </div>

          {/* SWAP */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="p-3 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-amber-400 rounded-full border border-neutral-700 transition"
              title="Swap Units"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* TO */}
          <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-2">
            <div className="flex justify-between items-center text-xs text-neutral-400">
              <span>To:</span>
              <select
                value={toUnitId}
                onChange={e => setToUnitId(e.target.value)}
                className="bg-neutral-950 border border-neutral-700 text-amber-400 font-semibold rounded px-2 py-1 text-xs focus:outline-none"
              >
                {currentCat.units.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                ))}
              </select>
            </div>
            <div className="font-mono text-2xl font-bold text-amber-400 break-all select-all py-0.5">
              {outputVal}
            </div>
          </div>
        </div>

        {/* Quick summary line */}
        <div className="text-center font-mono text-xs text-neutral-400 pt-2 border-t border-neutral-800">
          {inputValue} {currentCat.units.find(u => u.id === fromUnitId)?.symbol} = <span className="text-amber-400 font-bold">{outputVal} {currentCat.units.find(u => u.id === toUnitId)?.symbol}</span>
        </div>
      </div>

      {/* Creator footer attribution */}
      <div className="text-[11px] text-center text-neutral-400 pt-2 border-t border-neutral-800/60">
        RAFI SCIENTIFIC CALCULATOR — <span className="text-amber-400">Created by Rakibul Hasan Rafi (RHR)</span>
      </div>
    </div>
  );
};
