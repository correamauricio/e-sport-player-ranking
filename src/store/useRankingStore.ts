import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, Team, Game, Adjustment, DataPeriod } from '@/types';
import { VALORANT_PLAYERS } from '@/data/valorant/players';
import { VALORANT_TEAMS } from '@/data/valorant/teams';
import { GAMES } from '@/data/games';

const DEFAULT_PERIOD_ID = 'default-vct-2025';

const DEFAULT_PERIOD: DataPeriod = {
  id: DEFAULT_PERIOD_ID,
  label: 'VCT 2025 — Dados Iniciais',
  gameId: 'valorant',
  createdAt: new Date().toISOString(),
  players: VALORANT_PLAYERS,
  teams: VALORANT_TEAMS,
};

const MASTERS_PERIOD_ID = 'masters-tokyo-2025';

const MASTERS_PERIOD: DataPeriod = {
  id: MASTERS_PERIOD_ID,
  label: 'Masters Tokyo 2025',
  gameId: 'valorant',
  createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 semana atrás
  players: VALORANT_PLAYERS.map(p => {
    // Aplicando variações mais agressivas para diferenciar os períodos
    let multiplier = 0.85 + Math.random() * 0.3; // Variação base
    
    // No mock do Masters, LOUD está em excelente fase
    if (p.teamId === 'loud') multiplier = 1.15 + Math.random() * 0.15;
    
    // Já a Sentinels está em uma fase difícil neste mock
    if (p.teamId === 'sentinels') multiplier = 0.75 + Math.random() * 0.15;

    return {
      ...p,
      stats: {
        ...p.stats,
        acs: Math.round(p.stats.acs * multiplier),
        rating: Number((p.stats.rating * multiplier).toFixed(2)),
        kdRatio: Number((p.stats.kdRatio * multiplier).toFixed(2)),
      }
    };
  }),
  teams: VALORANT_TEAMS,
};



interface RankingStore {
  // Raw state
  games: Game[];
  activeGameId: string;
  dataPeriods: DataPeriod[];
  activePeriodId: string;

  // Backward-compatible derived state (mirrors the active period)
  players: Player[];
  teams: Team[];

  // Actions
  setActiveGame: (gameId: string) => void;
  setActivePeriod: (periodId: string) => void;
  importData: (label: string, players: Player[], teams: Team[], gameId?: string) => void;
  deletePeriod: (periodId: string) => void;
  renamePeriod: (periodId: string, newLabel: string) => void;
  applyAdjustment: (playerId: string, delta: number, justification: string, author?: string) => void;
  editAdjustment: (playerId: string, adjustmentId: string, delta: number, justification: string) => void;
  deleteAdjustment: (playerId: string, adjustmentId: string) => void;
}

/**
 * Helper: given dataPeriods and activePeriodId, returns { players, teams }
 * for the currently active period.
 */
function deriveFromPeriod(dataPeriods: DataPeriod[], activePeriodId: string) {
  const period = dataPeriods.find(p => p.id === activePeriodId) ?? dataPeriods[0];
  return { players: period?.players ?? [], teams: period?.teams ?? [] };
}

/**
 * Helper: applies a player-level updater to the active period's players,
 * returning updated dataPeriods AND the synced top-level players/teams.
 */
function updateActivePeriodPlayers(
  dataPeriods: DataPeriod[],
  activePeriodId: string,
  updater: (players: Player[]) => Player[],
) {
  const newPeriods = dataPeriods.map(period =>
    period.id === activePeriodId
      ? { ...period, players: updater(period.players) }
      : period
  );
  return {
    dataPeriods: newPeriods,
    ...deriveFromPeriod(newPeriods, activePeriodId),
  };
}

export const useRankingStore = create<RankingStore>()(
  persist(
    (set, get) => ({
      games: GAMES,
      activeGameId: 'valorant',
      dataPeriods: [DEFAULT_PERIOD, MASTERS_PERIOD],
      activePeriodId: DEFAULT_PERIOD_ID,

      // Derived (kept in sync with active period)
      players: DEFAULT_PERIOD.players,
      teams: DEFAULT_PERIOD.teams,

      setActiveGame: (gameId: string) => {
        set({ activeGameId: gameId });
      },

      setActivePeriod: (periodId: string) => {
        const state = get();
        const period = state.dataPeriods.find(p => p.id === periodId);
        if (period) {
          set({
            activePeriodId: periodId,
            activeGameId: period.gameId,
            players: period.players,
            teams: period.teams,
          });
        }
      },

      importData: (label: string, players: Player[], teams: Team[], gameId?: string) => {
        const state = get();
        const resolvedGameId = gameId || state.activeGameId;
        const newPeriod: DataPeriod = {
          id: `period-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          label,
          gameId: resolvedGameId,
          createdAt: new Date().toISOString(),
          players,
          teams,
        };

        set({
          dataPeriods: [...state.dataPeriods, newPeriod],
          activePeriodId: newPeriod.id,
          activeGameId: resolvedGameId,
          players,
          teams,
        });
      },

      deletePeriod: (periodId: string) => {
        const state = get();
        if (state.dataPeriods.length <= 1) return;
        const remaining = state.dataPeriods.filter(p => p.id !== periodId);
        const newActiveId = state.activePeriodId === periodId
          ? remaining[0].id
          : state.activePeriodId;
        set({
          dataPeriods: remaining,
          activePeriodId: newActiveId,
          ...deriveFromPeriod(remaining, newActiveId),
        });
      },

      renamePeriod: (periodId: string, newLabel: string) => {
        set(state => ({
          dataPeriods: state.dataPeriods.map(p =>
            p.id === periodId ? { ...p, label: newLabel } : p
          ),
        }));
      },

      applyAdjustment: (playerId: string, delta: number, justification: string, author = 'Analyst') => {
        const adjustment: Adjustment = {
          id: `adj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          playerId,
          delta,
          justification,
          createdAt: new Date().toISOString(),
          author,
        };

        set(state => updateActivePeriodPlayers(state.dataPeriods, state.activePeriodId, players =>
          players.map(p => {
            if (p.id !== playerId) return p;

            const newHistory = [adjustment, ...p.adjustmentHistory];
            const newTotalAdjustment = newHistory.reduce((sum, adj) => sum + adj.delta, 0);
            const clampedAdjustment = Math.max(-50, Math.min(50, newTotalAdjustment));

            return {
              ...p,
              overallAdjustment: clampedAdjustment,
              adjustmentHistory: newHistory,
            };
          })
        ));
      },

      editAdjustment: (playerId: string, adjustmentId: string, delta: number, justification: string) => {
        set(state => updateActivePeriodPlayers(state.dataPeriods, state.activePeriodId, players =>
          players.map(p => {
            if (p.id !== playerId) return p;

            const newHistory = p.adjustmentHistory.map(adj =>
              adj.id === adjustmentId
                ? { ...adj, delta, justification, updatedAt: new Date().toISOString() }
                : adj
            );

            const newTotalAdjustment = newHistory.reduce((sum, adj) => sum + adj.delta, 0);
            const clampedAdjustment = Math.max(-50, Math.min(50, newTotalAdjustment));

            return {
              ...p,
              overallAdjustment: clampedAdjustment,
              adjustmentHistory: newHistory,
            };
          })
        ));
      },

      deleteAdjustment: (playerId: string, adjustmentId: string) => {
        set(state => updateActivePeriodPlayers(state.dataPeriods, state.activePeriodId, players =>
          players.map(p => {
            if (p.id !== playerId) return p;

            const newHistory = p.adjustmentHistory.filter(adj => adj.id !== adjustmentId);
            const newTotalAdjustment = newHistory.reduce((sum, adj) => sum + adj.delta, 0);
            const clampedAdjustment = Math.max(-50, Math.min(50, newTotalAdjustment));

            return {
              ...p,
              overallAdjustment: clampedAdjustment,
              adjustmentHistory: newHistory,
            };
          })
        ));
      },
    }),
    {
      name: 'e-sport-ranking-store',
      partialize: (state) => ({
        activeGameId: state.activeGameId,
        dataPeriods: state.dataPeriods,
        activePeriodId: state.activePeriodId,
      }),
      // On rehydration, sync the derived players/teams from the active period
      onRehydrateStorage: () => (state) => {
        if (state) {
          const { players, teams } = deriveFromPeriod(state.dataPeriods, state.activePeriodId);
          state.players = players;
          state.teams = teams;
        }
      },
    }
  )
);
