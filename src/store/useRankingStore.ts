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
  editAdjustment: (playerId: string, adjustmentId: string, delta: number, justification: string) => void;
  deleteAdjustment: (playerId: string, adjustmentId: string) => void;
  importData: (players: Player[], activeGameId?: string) => void;
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
            
            const newHistory = [adjustment, ...p.adjustmentHistory];
            const newTotalAdjustment = newHistory.reduce((sum, adj) => sum + adj.delta, 0);
            const clampedAdjustment = Math.max(-50, Math.min(50, newTotalAdjustment));
            
            return {
              ...p,
              overallAdjustment: clampedAdjustment,
              adjustmentHistory: newHistory,
            };
          }),
        }));
      },

      editAdjustment: (playerId: string, adjustmentId: string, delta: number, justification: string) => {
        set(state => ({
          players: state.players.map(p => {
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
          }),
        }));
      },

    deleteAdjustment: (playerId: string, adjustmentId: string) => {
        set(state => ({
          players: state.players.map(p => {
            if (p.id !== playerId) return p;

            const newHistory = p.adjustmentHistory.filter(adj => adj.id !== adjustmentId);
            const newTotalAdjustment = newHistory.reduce((sum, adj) => sum + adj.delta, 0);
            const clampedAdjustment = Math.max(-50, Math.min(50, newTotalAdjustment));

            return {
              ...p,
              overallAdjustment: clampedAdjustment,
              adjustmentHistory: newHistory,
            };
          }),
        }));
      },

      importData: (players, activeGameId) => {
        set(state => ({
          players,
          activeGameId: activeGameId || state.activeGameId,
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
