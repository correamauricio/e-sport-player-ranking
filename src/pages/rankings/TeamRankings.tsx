import { useTeamsWithStats } from '@/hooks/useGameData';
import { TierList } from '@/components/rankings/TierList';
import type { TierGroup, Tier, TeamWithStats } from '@/types';
import { TeamCard } from '@/components/teams/TeamCard';

const TIERS: Tier[] = ['S', 'A', 'B', 'C', 'D', 'E'];

export function TeamRankings() {
  const teamsWithStats = useTeamsWithStats();

  const groups: TierGroup<TeamWithStats>[] = TIERS.map(tier => ({
    tier,
    items: teamsWithStats
      .filter(t => t.tier === tier)
      .sort((a, b) => b.avgOverall - a.avgOverall),
  }));

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Times ranqueados por overall médio do elenco.
      </p>
      <TierList
        groups={groups}
        renderItem={(team, i) => <TeamCard key={team.id} team={team} rank={i + 1} />}
        emptyMessage="Nenhum time para exibir."
      />
    </div>
  );
}
