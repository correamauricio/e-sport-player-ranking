import type { Player, PlayerStats, PlayerWithOverall, StatDefinition, Tier } from '@/types';

/** Normalize a raw stat value to 0-100 scale */
function normalizeStat(value: number, min: number, max: number, higherIsBetter: boolean): number {
  const clamped = Math.max(min, Math.min(max, value));
  const normalized = ((clamped - min) / (max - min)) * 100;
  return higherIsBetter ? normalized : 100 - normalized;
}

/** Calculate the overall score (0-100) from raw stats using weighted formula */
export function calculateOverall(stats: PlayerStats, statDefs: StatDefinition[]): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const def of statDefs) {
    const rawValue = stats[def.key as keyof PlayerStats] as number;
    if (rawValue === undefined) continue;
    const normalized = normalizeStat(rawValue, def.min, def.max, def.higherIsBetter);
    weightedSum += normalized * def.weight;
    totalWeight += def.weight;
  }

  if (totalWeight === 0) return 0;
  return Math.round(weightedSum / totalWeight);
}

/** Get the final overall (base + adjustments, clamped 0-100) */
export function getFinalOverall(player: Player): number {
  return Math.max(0, Math.min(100, player.overallBase + player.overallAdjustment));
}

/** Get tier from overall score */
export function getTier(overall: number): Tier {
  if (overall >= 80) return 'S';
  if (overall >= 65) return 'A';
  if (overall >= 50) return 'B';
  if (overall >= 35) return 'C';
  if (overall >= 20) return 'D';
  return 'E';
}

/** Get tier color class (Tailwind) */
export function getTierColor(tier: Tier): string {
  switch (tier) {
    case 'S': return '#f59e0b';
    case 'A': return '#10b981';
    case 'B': return '#3b82f6';
    case 'C': return '#8b5cf6';
    case 'D': return '#6b7280';
    case 'E': return '#ef4444';
  }
}

/** Get tier background gradient */
export function getTierGradient(tier: Tier): string {
  switch (tier) {
    case 'S': return 'from-amber-500/20 to-amber-500/5';
    case 'A': return 'from-emerald-500/20 to-emerald-500/5';
    case 'B': return 'from-blue-500/20 to-blue-500/5';
    case 'C': return 'from-purple-500/20 to-purple-500/5';
    case 'D': return 'from-gray-500/20 to-gray-500/5';
    case 'E': return 'from-red-500/20 to-red-500/5';
  }
}

/** Enrich a player with computed overall and tier */
export function enrichPlayer(player: Player, _statDefs: StatDefinition[]): PlayerWithOverall {
  const overall = getFinalOverall(player);
  return {
    ...player,
    overall,
    tier: getTier(overall),
  };
}

/** Format a stat value based on its type */
export function formatStat(value: number, format: StatDefinition['format']): string {
  switch (format) {
    case 'percent': return `${value.toFixed(1)}%`;
    case 'decimal': return value.toFixed(2);
    case 'number': return value.toFixed(1);
    case 'integer': return Math.round(value).toString();
  }
}
