export type AngleMode = 'DEG' | 'RAD' | 'GRAD';

export type DisplayNotation = 'NORMAL' | 'SCI' | 'ENG';

export type CalculatorTheme = 'titanium' | 'cyber' | 'amber' | 'classic';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  angleMode: AngleMode;
  formattedResult?: string;
  exactFraction?: string;
}

export interface CalculatorSettings {
  angleMode: AngleMode;
  precision: number; // 0 to 12
  notation: DisplayNotation;
  theme: CalculatorTheme;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  thousandsSeparator: boolean;
}

export type ActiveTab = 
  | 'calculator' 
  | 'equations' 
  | 'calculus' 
  | 'statistics' 
  | 'matrices' 
  | 'bases' 
  | 'units' 
  | 'engineering' 
  | 'grapher'
  | 'tests';

export interface MemoryVariables {
  M: number;
  A: number;
  B: number;
  C: number;
  D: number;
  X: number;
  Y: number;
  Ans: number;
}
