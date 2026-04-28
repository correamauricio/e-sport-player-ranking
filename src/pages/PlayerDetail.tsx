import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRankingStore } from '@/store/useRankingStore';
import { usePlayer, useTeamsWithStats, useTeamPlayers } from '@/hooks/useGameData';
import { PlayerCard } from '@/components/players/PlayerCard';
import { TeamHero } from '@/components/teams/TeamHero';
import { AdjustmentPanel } from '@/components/players/AdjustmentPanel';
import { AdjustmentHistory } from '@/components/players/AdjustmentHistory';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function PlayerDetail() {
  const { teamId, playerId } = useParams<{ teamId: string; playerId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const teams = useRankingStore(s => s.teams);

  const player = usePlayer(playerId ?? '');
  const team = teams.find(t => t.id === teamId);
  const teamsWithStats = useTeamsWithStats();
  const sortedTeams = [...teamsWithStats].sort((a, b) => b.avgOverall - a.avgOverall);
  const currentIndex = sortedTeams.findIndex(t => t.id === teamId);
  
  const teamStats = sortedTeams[currentIndex];
  const players = useTeamPlayers(teamId ?? '');

  const prevTeam = currentIndex > 0 ? sortedTeams[currentIndex - 1] : null;
  const nextTeam = currentIndex < sortedTeams.length - 1 ? sortedTeams[currentIndex + 1] : null;

  if (!player || !team) {
    return <div className="text-center py-20 text-muted-foreground">Jogador não encontrado.</div>;
  }

  const roleOrder = ['duelist', 'initiator', 'controller', 'sentinel', 'flex'];
  const sortedPlayers = [...players].sort((a, b) => {
    const ai = roleOrder.indexOf(a.role);
    const bi = roleOrder.indexOf(b.role);
    return ai - bi;
  });

  return (
    <div className="space-y-6 mx-auto my-0 w-full max-w-6xl">
      {/* Back */}
      <Link
        to={`/teams/${teamId}`}
        className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft size={14} />
        Voltar para {team.name}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_auto] gap-8 items-start">
        {/* Left: Team context */}
        <div className="w-full">
          <TeamHero
            team={team}
            avgOverall={teamStats?.avgOverall ?? 0}
            tier={teamStats?.tier ?? 'D'}
            prevTeam={prevTeam}
            nextTeam={nextTeam}
            showPlayers={true}
            players={sortedPlayers}
          />
        </div>

        {/* Middle: Adjustment History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-card p-4 rounded-xl border">
            <h2 className="text-lg font-bold text-foreground">Ajustes</h2>
            <AdjustmentPanel
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
              trigger={
                <Button size="sm" variant="default">
                  Novo ajuste
                </Button>
              }
              playerId={player.id}
              currentOverall={player.overall}
              currentAdjustment={player.overallAdjustment}
              onSuccess={() => setIsModalOpen(false)}
            />
          </div>
          <AdjustmentHistory 
            playerId={player.id}
            currentOverall={player.overall}
            currentAdjustment={player.overallAdjustment}
            history={player.adjustmentHistory} 
          />
        </div>

        {/* Right: Player Card */}
        <div className="flex justify-center lg:justify-end w-full lg:w-auto">
          <PlayerCard player={player} team={team} />
        </div>
      </div>
    </div>
  );
}
