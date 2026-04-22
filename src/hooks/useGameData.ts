import { useMemo } from 'react';
import { useRankingStore } from '@/store/useRankingStore';
import { enrichPlayer, getFinalOverall, getTier } from '@/lib/overall';
import type { PlayerWithOverall, TeamWithStats } from '@/types';

/**
 * Returns the active game config.
 * Safe to call anywhere — reads primitive from store.
 */
export function useActiveGame() {
  const games = useRankingStore(s => s.games);
  const activeGameId = useRankingStore(s => s.activeGameId);
  return useMemo(
    () => games.find(g => g.id === activeGameId) ?? games[0],
    [games, activeGameId]
  );
}

/**
 * Returns all players enriched with overall + tier.
 * Memoized so references are stable across renders.
 */
export function useAllPlayersEnriched(): PlayerWithOverall[] {
  const players = useRankingStore(s => s.players);
  const game = useActiveGame();
  return useMemo(
    () => players.map(p => enrichPlayer(p, game.statDefinitions)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [players, game.id]
  );
}

/**
 * Returns players for a specific team, enriched with overall + tier.
 */
export function useTeamPlayers(teamId: string): PlayerWithOverall[] {
  const players = useRankingStore(s => s.players);
  const game = useActiveGame();
  return useMemo(
    () => players
      .filter(p => p.teamId === teamId)
      .map(p => enrichPlayer(p, game.statDefinitions)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [players, teamId, game.id]
  );
}

/**
 * Returns a single player by ID, enriched.
 */
export function usePlayer(playerId: string): PlayerWithOverall | undefined {
  const players = useRankingStore(s => s.players);
  const game = useActiveGame();
  return useMemo(() => {
    const p = players.find(pl => pl.id === playerId);
    if (!p) return undefined;
    return enrichPlayer(p, game.statDefinitions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, playerId, game.id]);
}

/**
 * Returns teams for the active game, each enriched with avg overall + tier + players.
 */
export function useTeamsWithStats(): TeamWithStats[] {
  const teams = useRankingStore(s => s.teams);
  const players = useRankingStore(s => s.players);
  const game = useActiveGame();

  return useMemo(() => {
    const gameTeams = teams.filter(t => t.gameId === game.id);
    return gameTeams.map(team => {
      const teamPlayers = players
        .filter(p => p.teamId === team.id)
        .map(p => enrichPlayer(p, game.statDefinitions));

      const avgOverall = teamPlayers.length > 0
        ? Math.round(teamPlayers.reduce((sum, p) => sum + getFinalOverall(p), 0) / teamPlayers.length)
        : 0;

      return {
        ...team,
        players: teamPlayers,
        avgOverall,
        tier: getTier(avgOverall),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams, players, game.id]);
}
