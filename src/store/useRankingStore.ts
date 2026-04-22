import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, Team, Game, Adjustment } from '@/types';
import { VALORANT_PLAYERS } from '@/data/valorant/players';
import { VALORANT_TEAMS } from '@/data/valorant/teams';
import { GAMES } from '@/data/games';

interface RankingStore {
  // Raw state
  games: Game[];
  activeGameId: string;
  teams: Team[];
  players: Player[];

  // Actions
  setActiveGame: (gameId: string) => void;
  applyAdjustment: (playerId: string, delta: number, justification: string, author?: string) => void;
}

export const useRankingStore = create<RankingStore>()(
  persist(
    (set) => ({
      games: GAMES,
      activeGameId: 'valorant',
      teams: VALORANT_TEAMS,
      players: VALORANT_PLAYERS,

      setActiveGame: (gameId: string) => {
        set({ activeGameId: gameId });
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

        set(state => ({
          players: state.players.map(p => {
            if (p.id !== playerId) return p;
            const newAdjustment = p.overallAdjustment + delta;
            const clampedAdjustment = Math.max(-50, Math.min(50, newAdjustment));
            return {
              ...p,
              overallAdjustment: clampedAdjustment,
              adjustmentHistory: [adjustment, ...p.adjustmentHistory],
            };
          }),
        }));
      },
    }),
    {
      name: 'e-sport-ranking-store',
      partialize: (state) => ({
        activeGameId: state.activeGameId,
        players: state.players,
      }),
    }
  )
);
