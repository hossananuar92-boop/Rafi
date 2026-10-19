import * as math from 'mathjs';
import { AngleMode, DisplayNotation } from '../types/calculator';

// Standard scientific constants
export const SCIENTIFIC_CONSTANTS = [
  { symbol: 'π', name: 'Pi', value: Math.PI, unit: '', description: 'Ratio of circle circumference to diameter' },
  { symbol: 'e', name: "Euler's Number", value: Math.E, unit: '', description: 'Base of natural logarithms' },
  { symbol: 'c', name: 'Speed of Light', value: 299792458, unit: 'm/s', description: 'Speed of light in vacuum' },
  { symbol: 'h', name: "Planck's Constant", value: 6.62607015e-34, unit: 'J·s', description: 'Quantum of electromagnetic action' },
  { symbol: 'G', name: 'Gravitational Constant', value: 6.6743e-11, unit: 'N·m²/kg²', description: 'Newtonian constant of gravitation' },
  { symbol: 'k', name: "Boltzmann Constant", value: 1.380649e-23, unit: 'J/K', description: 'Thermal energy per degree Kelvin' },
  { symbol: 'N_A', name: "Avogadro's Number", value: 6.02214076e23, unit: 'mol⁻¹', description: 'Constituent particles per mole' },
  { symbol: 'R', name: 'Molar Gas Constant', value: 8.314462618, unit: 'J/(mol·K)', description: 'Universal gas constant' },
  { symbol: 'e_charge', name: 'Elementary Charge', value: 1.602176634e-19, unit: 'C', description: 'Electric charge carried by a single proton' },
  { symbol: 'm_e', name: 'Electron Mass', value: 9.1093837e-31, unit: 'kg', description: 'Rest mass of an electron' },
  { symbol: 'm_p', name: 'Proton Mass', value: 1.67262192e-27, unit: 'kg', description: 'Rest mass of a proton' },
  { symbol: 'g_0', name: 'Standard Gravity', value: 9.80665, unit: 'm/s²', description: 'Standard gravitational acceleration' }
];

// Helper: Angle conversion utilities
export function toRadians(angle: number, mode: AngleMode): number {
  if (mode === 'DEG') return (angle * Math.PI) / 180;
  if (mode === 'GRAD') return (angle * Math.PI) / 200;
  return angle; // RAD
}

export function fromRadians(rad: number, mode: AngleMode): number {
  if (mode === 'DEG') return (rad * 180) / Math.PI;
  if (mode === 'GRAD') return (rad * 200) / Math.PI;
  return rad; // RAD
}

// Factorial implementations
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Factorial requires non-negative integer');
  }
  if (n > 170) return Infinity;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export function doubleFactorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Double factorial requires non-negative integer');
  }
  let res = 1;
  for (let i = n; i > 0; i -= 2) res *= i;
  return res;
}

export function permutations(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error('Math Error: Invalid nPr arguments');
  }
  let res = 1;
  for (let i = 0; i < r; i++) {
    res *= (n - i);
  }
  return res;
}

export function combinations(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error('Math Error: Invalid nCr arguments');
  }
  if (r === 0 || r === n) return 1;
  if (r > n / 2) r = n - r;
  let res = 1;
  for (let i = 1; i <= r; i++) {
    res = (res * (n - i + 1)) / i;
  }
  return Math.round(res);
}

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round(a * b)) / gcd(a, b);
}

// Convert decimal to exact fraction string (e.g. 0.75 -> 3/4)
export function decimalToFraction(val: number, maxDenominator: number = 10000): string | null {
  if (!Number.isFinite(val) || Math.abs(val) > 1000000) return null;
  if (Number.isInteger(val)) return null;

  const sign = val < 0 ? '-' : '';
  val = Math.abs(val);

  let bestNumerator = 1;
  let bestDenominator = 1;
  let minError = Math.abs(val - bestNumerator / bestDenominator);

  // Continued fraction approximation
  let h1 = 1, h0 = 0, k1 = 0, k0 = 1;
  let b = val;
  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h0;
    h0 = aux;
    aux = k1;
    k1 = a * k1 + k0;
    k0 = aux;
    const error = Math.abs(val - h1 / k1);
    if (error < minError && k1 <= maxDenominator) {
      minError = error;
      bestNumerator = h1;
      bestDenominator = k1;
    }
    b = 1 / (b - a);
  } while (Math.abs(val - h1 / k1) > 1e-9 && k1 <= maxDenominator && Number.isFinite(b));

  if (minError < 1e-7 && bestDenominator > 1) {
    if (bestNumerator > bestDenominator) {
      const whole = Math.floor(bestNumerator / bestDenominator);
      const rem = bestNumerator % bestDenominator;
      return `${sign}${bestNumerator}/${bestDenominator} (${sign}${whole} ${rem}/${bestDenominator})`;
    }
    return `${sign}${bestNumerator}/${bestDenominator}`;
  }

  return null;
}

// Transform user input expression string into mathjs executable string
export function sanitizeExpression(expr: string, angleMode: AngleMode): string {
  let s = expr;

  // Replace visual unicode symbols with standard operators
  s = s.replace(/×/g, '*');
  s = s.replace(/÷/g, '/');
  s = s.replace(/−/g, '-');
  s = s.replace(/–/g, '-');
  s = s.replace(/π/g, 'pi');
  s = s.replace(/√\(/g, 'sqrt(');
  s = s.replace(/∛\(/g, 'cbrt(');
  s = s.replace(/(\d+)²/g, '($1^2)');
  s = s.replace(/(\d+)³/g, '($1^3)');
  s = s.replace(/²/g, '^2');
  s = s.replace(/³/g, '^3');
  s = s.replace(/⁻¹/g, '^(-1)');

  // Handle scientific percentage: 50% -> (50 / 100)
  s = s.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

  // Handle factorial n!
  s = s.replace(/(\d+)!/g, 'fact($1)');

  return s;
}

// Build a custom math scope and evaluation environment
export function createMathScope(angleMode: AngleMode, variables: Record<string, number> = {}) {
  // Trigonometry wrapper according to current angleMode
  const sin = (x: number) => {
    const rad = toRadians(x, angleMode);
    // Handle floating inaccuracies for exact multiples
    const degEquiv = angleMode === 'DEG' ? x : angleMode === 'GRAD' ? (x * 9) / 10 : (x * 180) / Math.PI;
    const normDeg = ((degEquiv % 360) + 360) % 360;
    if (normDeg === 0 || normDeg === 180) return 0;
    if (normDeg === 30 || normDeg === 150) return 0.5;
    if (normDeg === 210 || normDeg === 330) return -0.5;
    if (normDeg === 90) return 1;
    if (normDeg === 270) return -1;
    return Math.sin(rad);
  };

  const cos = (x: number) => {
    const rad = toRadians(x, angleMode);
    const degEquiv = angleMode === 'DEG' ? x : angleMode === 'GRAD' ? (x * 9) / 10 : (x * 180) / Math.PI;
    const normDeg = ((degEquiv % 360) + 360) % 360;
    if (normDeg === 90 || normDeg === 270) return 0;
    if (normDeg === 60 || normDeg === 300) return 0.5;
    if (normDeg === 120 || normDeg === 240) return -0.5;
    if (normDeg === 0) return 1;
    if (normDeg === 180) return -1;
    return Math.cos(rad);
  };

  const tan = (x: number) => {
    const degEquiv = angleMode === 'DEG' ? x : angleMode === 'GRAD' ? (x * 9) / 10 : (x * 180) / Math.PI;
    const normDeg = ((degEquiv % 180) + 180) % 180;
    if (normDeg === 90) throw new Error('Math Error: tan is undefined at 90°');
    if (normDeg === 45) return 1;
    if (normDeg === 135) return -1;
    return Math.tan(toRadians(x, angleMode));
  };

  const asin = (x: number) => {
    if (x < -1 || x > 1) throw new Error('Math Error: Domain error for sin⁻¹ (must be between -1 and 1)');
    const rad = Math.asin(x);
    return fromRadians(rad, angleMode);
  };

  const acos = (x: number) => {
    if (x < -1 || x > 1) throw new Error('Math Error: Domain error for cos⁻¹ (must be between -1 and 1)');
    const rad = Math.acos(x);
    return fromRadians(rad, angleMode);
  };

  const atan = (x: number) => {
    const rad = Math.atan(x);
    return fromRadians(rad, angleMode);
  };

  const log10 = (x: number) => {
    if (x <= 0) throw new Error('Math Error: Domain error for log (must be > 0)');
    return Math.log10(x);
  };

  const ln = (x: number) => {
    if (x <= 0) throw new Error('Math Error: Domain error for ln (must be > 0)');
    return Math.log(x);
  };

  const logBase = (x: number, base: number) => {
    if (x <= 0 || base <= 0 || base === 1) throw new Error('Math Error: Invalid log base');
    return Math.log(x) / Math.log(base);
  };

  const sqrt = (x: number) => {
    if (x < 0) {
      // In complex mode, returns complex root
      return math.complex(0, Math.sqrt(-x));
    }
    return Math.sqrt(x);
  };

  const cbrt = (x: number) => Math.cbrt(x);

  const nthRoot = (x: number, n: number) => {
    if (n === 0) throw new Error('Math Error: Division by zero in nth root');
    if (x < 0 && n % 2 === 0) throw new Error('Math Error: Even root of negative number');
    if (x < 0) return -Math.pow(-x, 1 / n);
    return Math.pow(x, 1 / n);
  };

  // Base scope with math functions and constants
  const scope: Record<string, unknown> = {
    ...variables,
    pi: Math.PI,
    e: Math.E,
    sin,
    cos,
    tan,
    asin,
    acos,
    atan,
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    asinh: Math.asinh,
    acosh: Math.acosh,
    atanh: Math.atanh,
    log10,
    ln,
    log: log10,
    logBase,
    sqrt,
    cbrt,
    nthRoot,
    fact: factorial,
    fact2: doubleFactorial,
    nPr: permutations,
    nCr: combinations,
    gcd,
    lcm,
    abs: Math.abs,
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
    rand: () => Math.random(),
    mod: (a: number, b: number) => ((a % b) + b) % b,
  };

  // Add all scientific constants
  SCIENTIFIC_CONSTANTS.forEach(c => {
    if (!scope[c.symbol]) {
      scope[c.symbol] = c.value;
    }
  });

  return scope;
}

export interface EvaluationResult {
  raw: unknown;
  numeric: number | null;
  formatted: string;
  exactFraction: string | null;
  isError: boolean;
  errorMessage?: string;
}

export function evaluateExpression(
  expr: string, 
  angleMode: AngleMode, 
  precision: number = 8, 
  notation: DisplayNotation = 'NORMAL',
  variables: Record<string, number> = {}
): EvaluationResult {
  const trimmed = expr.trim();
  if (!trimmed) {
    return {
      raw: 0,
      numeric: 0,
      formatted: '0',
      exactFraction: null,
      isError: false
    };
  }

  try {
    const sanitized = sanitizeExpression(trimmed, angleMode);
    const scope = createMathScope(angleMode, variables);

    // Evaluate using mathjs safe parser
    const result = math.evaluate(sanitized, scope);

    // If result is undefined or null
    if (result === undefined || result === null) {
      return {
        raw: null,
        numeric: null,
        formatted: '0',
        exactFraction: null,
        isError: false
      };
    }

    // Check if result is a complex number
    if (math.isComplex(result)) {
      const re = formatNumber(result.re, precision, notation);
      const im = formatNumber(Math.abs(result.im), precision, notation);
      const sign = result.im >= 0 ? '+' : '-';
      return {
        raw: result,
        numeric: null,
        formatted: `${re} ${sign} ${im}i`,
        exactFraction: null,
        isError: false
      };
    }

    // Number result
    if (typeof result === 'number') {
      if (isNaN(result)) {
        return {
          raw: result,
          numeric: null,
          formatted: 'Math Error: Undefined',
          exactFraction: null,
          isError: true,
          errorMessage: 'Undefined result'
        };
      }
      if (!isFinite(result)) {
        return {
          raw: result,
          numeric: null,
          formatted: result > 0 ? 'Math Error: Overflow (∞)' : 'Math Error: Underflow (-∞)',
          exactFraction: null,
          isError: true,
          errorMessage: 'Overflow/Underflow'
        };
      }

      // Clean floating-point artifacts like 0.1 + 0.2 = 0.30000000000000004
      const rounded = Number(result.toPrecision(14));
      const formatted = formatNumber(rounded, precision, notation);
      const exactFraction = decimalToFraction(rounded);

      return {
        raw: rounded,
        numeric: rounded,
        formatted,
        exactFraction,
        isError: false
      };
    }

    // Boolean or other object
    return {
      raw: result,
      numeric: null,
      formatted: String(result),
      exactFraction: null,
      isError: false
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Syntax Error';
    let friendly = msg;
    if (msg.includes('Division by zero')) friendly = 'Math Error: Division by zero';
    else if (msg.includes('Unexpected end of expression')) friendly = 'Syntax Error: Incomplete';
    else if (msg.includes('Undefined symbol')) friendly = msg.replace('Undefined symbol', 'Unknown variable/function');

    return {
      raw: null,
      numeric: null,
      formatted: friendly,
      exactFraction: null,
      isError: true,
      errorMessage: friendly
    };
  }
}

// Formats a number with configurable precision and notation (NORMAL, SCI, ENG)
export function formatNumber(
  val: number, 
  precision: number = 8, 
  notation: DisplayNotation = 'NORMAL',
  thousandsSep: boolean = false
): string {
  if (!Number.isFinite(val)) return String(val);

  if (Math.abs(val) === 0) return '0';

  // Scientific notation: 1.2345 × 10⁶
  if (notation === 'SCI' || (notation === 'NORMAL' && (Math.abs(val) >= 1e11 || (Math.abs(val) < 1e-6 && val !== 0)))) {
    const expStr = val.toExponential(Math.min(precision, 8));
    const [coeff, exp] = expStr.split('e');
    const cleanedCoeff = parseFloat(coeff).toString();
    const expNum = parseInt(exp, 10);
    return `${cleanedCoeff} × 10^(${expNum})`;
  }

  // Engineering notation: power is a multiple of 3
  if (notation === 'ENG') {
    const exp = Math.floor(Math.log10(Math.abs(val)));
    const engExp = Math.floor(exp / 3) * 3;
    const engCoeff = val / Math.pow(10, engExp);
    const cleanedCoeff = parseFloat(engCoeff.toFixed(precision)).toString();
    return `${cleanedCoeff} × 10^(${engExp})`;
  }

  // Standard Normal notation
  // Avoid trailing zeros if precision allows
  const fixed = val.toFixed(precision);
  let cleaned = parseFloat(fixed).toString();

  // If thousand separator enabled
  if (thousandsSep && !cleaned.includes('e')) {
    const parts = cleaned.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    cleaned = parts.join('.');
  }

  return cleaned;
}
