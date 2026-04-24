import { useAllPlayersEnriched } from '@/hooks/useGameData';
import { useRankingStore } from '@/store/useRankingStore';
import { TierList } from '@/components/rankings/TierList';
import { PlayerCard } from '@/components/players/PlayerCard';
import type { TierGroup, Tier, PlayerWithOverall } from '@/types';

const TIERS: Tier[] = ['S', 'A', 'B', 'C', 'D'];

export function PlayerRankings() {
  const allPlayers = useAllPlayersEnriched();
  const teams = useRankingStore(s => s.teams);

  const groups: TierGroup<PlayerWithOverall>[] = TIERS.map(tier => ({
    tier,
    items: allPlayers
      .filter(p => p.tier === tier)
      .sort((a, b) => b.overall - a.overall),
  }));

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Jogadores ranqueados por overall individual.
      </p>
      <TierList
        groups={groups}
        renderItem={(player, _i) => {
          const team = teams.find(t => t.id === player.teamId);
          return <PlayerCard key={player.id} player={player} team={team} showTeam />;
        }}
        emptyMessage="Nenhum jogador para exibir."
      />
    </div>
  );
}
