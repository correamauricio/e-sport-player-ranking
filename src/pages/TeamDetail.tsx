import { useParams, Link } from 'react-router-dom';
import { useRankingStore } from '@/store/useRankingStore';
import { useTeamsWithStats, useTeamPlayers } from '@/hooks/useGameData';
import { PlayerCard } from '@/components/players/PlayerCard';
import { TeamHero } from '@/components/teams/TeamHero';
import { ArrowLeft, Users } from 'lucide-react';

export function TeamDetail() {
  const { teamId } = useParams<{ teamId: string }>();
  const teams = useRankingStore(s => s.teams);
  const allTeamsWithStats = useTeamsWithStats();
  const sortedTeams = [...allTeamsWithStats].sort((a, b) => b.avgOverall - a.avgOverall);
  const players = useTeamPlayers(teamId ?? '');

  const teamRaw = teams.find(t => t.id === teamId);
  const currentIndex = sortedTeams.findIndex(t => t.id === teamId);
  const teamWithStats = sortedTeams[currentIndex];
  
  const prevTeam = currentIndex > 0 ? sortedTeams[currentIndex - 1] : null;
  const nextTeam = currentIndex < sortedTeams.length - 1 ? sortedTeams[currentIndex + 1] : null;

  if (!teamRaw || !teamWithStats) {
    return (
      <div className="text-center py-20 text-muted-foreground">Time não encontrado.</div>
    );
  }

  const roleOrder = ['duelist', 'initiator', 'controller', 'sentinel', 'flex'];
  const sortedPlayers = [...players].sort((a, b) => {
    const ai = roleOrder.indexOf(a.role);
    const bi = roleOrder.indexOf(b.role);
    return ai - bi;
  });

  return (
    <div className="space-y-6 mx-auto max-w-6xl">
      {/* Back */}
      <Link
        to="/rankings/teams"
        className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft size={14} />
        Voltar para Rankings
      </Link>

      <div className='flex gap-6'>
        {/* Team header */}
        <TeamHero
          team={teamRaw}
          avgOverall={teamWithStats.avgOverall}
          tier={teamWithStats.tier}
          prevTeam={prevTeam}
          nextTeam={nextTeam}
        />


        <div className="flex-1 min-w-0">

          <h3 className="text-foreground font-bold text-sm mb-4 flex items-center gap-2">
            <Users size={14} className="text-primary" />
            Jogadores do Elenco
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPlayers.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
