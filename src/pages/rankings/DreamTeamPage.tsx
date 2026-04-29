import { useActiveGame, useAllPlayersEnriched } from '@/hooks/useGameData';
import { useRankingStore } from '@/store/useRankingStore';
import { useThemeObserver } from '@/hooks/useThemeObserver';
import { PlayerCard } from '@/components/players/PlayerCard';
import type { PlayerWithOverall } from '@/types';

interface DreamTeamSlotCardProps {
  player: PlayerWithOverall | null;
  roleLabel: string;
  roleIcon: string;
  roleColor: string;
}

function DreamTeamSlotCard({ player, roleLabel, roleIcon, roleColor }: DreamTeamSlotCardProps) {
  useThemeObserver();
  const teams = useRankingStore(s => s.teams);
  const team = player ? teams.find(t => t.id === player.teamId) : null;

  if (!player) {
    return (
      <div
        className="relative rounded-2xl bg-card border border-dashed p-6 flex flex-col items-center justify-center gap-3 min-h-[400px]"
        style={{ borderColor: `${roleColor}30` }}
      >
        <span className="text-3xl opacity-30">{roleIcon}</span>
        <p className="text-muted-foreground text-sm font-bold">{roleLabel}</p>
        <p className="text-muted-foreground text-xs">Nenhum jogador nesta função</p>
      </div>
    );
  }

  return (
    <PlayerCard player={player} team={team || undefined} className="mx-auto" />
  );
}

export function DreamTeamPage() {
  useThemeObserver();
  const activeGame = useActiveGame();
  const allPlayers = useAllPlayersEnriched();

  // Pick best player for each role
  const dreamTeam = activeGame.roles.map(role => {
    const best = allPlayers
      .filter(p => p.role === role.id)
      .sort((a, b) => b.overall - a.overall)[0] ?? null;
    return { role, player: best };
  });

  const avgOverall = Math.round(
    dreamTeam.reduce((sum, slot) => sum + (slot.player?.overall ?? 0), 0) / dreamTeam.filter(s => s.player).length
  );

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border p-5">
        <h3 className="text-foreground font-bold mb-1">Dream Team</h3>
        <p className="text-muted-foreground text-sm">
          Os melhores jogadores de cada função, com base no overall final (incluindo ajustes manuais).
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
            Overall Médio: {isNaN(avgOverall) ? 'N/A' : avgOverall}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {dreamTeam.map(slot => (
          <DreamTeamSlotCard
            key={slot.role.id}
            player={slot.player}
            roleLabel={slot.role.label}
            roleIcon={slot.role.icon}
            roleColor={slot.role.color}
          />
        ))}
      </div>
    </div>
  );
}
