// ─── Game ────────────────────────────────────────────────────────────────────
export interface StatDefinition {
  key: string;
  label: string;
  description: string;
  format: 'number' | 'percent' | 'decimal';
  weight: number; // 0-1, weight in overall calculation
  higherIsBetter: boolean;
  min: number;
  max: number;
}

export interface Role {
  id: string;
  label: string;
  icon: string; // emoji or icon name
  color: string;
}

export interface Game {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  accentColor: string;
  roles: Role[];
  statDefinitions: StatDefinition[];
}

// ─── Team ────────────────────────────────────────────────────────────────────
export interface Team {
  id: string;
  gameId: string;
  name: string;
  shortName: string;
  logo: string;
  region: string;
  country: string;
  countryFlag: string;
}

// ─── Player ──────────────────────────────────────────────────────────────────
export interface PlayerStats {
  acs: number;         // Average Combat Score
  hsPercent: number;   // Headshot %
  kast: number;        // Kill/Assist/Survive/Trade %
  kills: number;       // Avg kills per map
  deaths: number;      // Avg deaths per map
  assists: number;     // Avg assists per map
  fk: number;          // Avg first kills per map
  fb: number;          // Avg first deaths per map
  kdRatio: number;     // Kill/Death ratio
  rating: number;      // VLR Rating (normalized)
}

export interface Adjustment {
  id: string;
  playerId: string;
  delta: number;           // positive or negative
  justification: string;
  createdAt: string;       // ISO date string
  author: string;
}

export interface Player {
  id: string;
  teamId: string;
  gameId: string;
  nickname: string;
  realName: string;
  role: string;
  photo: string;       // URL or emoji placeholder
  country: string;
  countryFlag: string;
  stats: PlayerStats;
  overallBase: number;        // calculated from stats
  overallAdjustment: number;  // sum of all manual adjustments
  adjustmentHistory: Adjustment[];
}

// ─── Derived / computed ───────────────────────────────────────────────────────
export type Tier = 'S' | 'A' | 'B' | 'C' | 'D';

export interface PlayerWithOverall extends Player {
  overall: number;  // overallBase + overallAdjustment (clamped 0-100)
  tier: Tier;
}

export interface TeamWithStats extends Team {
  players: PlayerWithOverall[];
  avgOverall: number;
  tier: Tier;
}

// ─── Rankings ────────────────────────────────────────────────────────────────
export interface TierGroup<T> {
  tier: Tier;
  items: T[];
}

export interface DreamTeamSlot {
  role: Role;
  player: PlayerWithOverall | null;
}
