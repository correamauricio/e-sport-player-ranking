import { useActiveGame, useAllPlayersEnriched } from '@/hooks/useGameData';
import { useRankingStore } from '@/store/useRankingStore';
import { OverallBadge } from '@/components/players/OverallBadge';
import { getTierColor } from '@/lib/overall';
import { useThemeObserver } from '@/hooks/useThemeObserver';
import { Link } from 'react-router-dom';
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
        className="relative rounded-2xl bg-card border border-dashed p-6 flex flex-col items-center justify-center gap-3 min-h-48"
        style={{ borderColor: `${roleColor}30` }}
      >
        <span className="text-3xl opacity-30">{roleIcon}</span>
        <p className="text-muted-foreground text-sm">{roleLabel}</p>
        <p className="text-muted-foreground text-xs">Nenhum jogador nesta função</p>
      </div>
    );
  }

  const tierColor = getTierColor(player.tier);

  return (
    <Link
      to={`/teams/${player.teamId}/${player.id}`}
      className="relative rounded-2xl bg-card border overflow-hidden hover:bg-accent/50 transition-all duration-300 block"
      style={{ borderColor: `${tierColor}30` }}
    >
      <div className="relative z-10 p-5">
        {/* Role badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: `${roleColor}20`, color: roleColor, border: `1px solid ${roleColor}30` }}
          >
            <span>{roleIcon}</span>
            <span>{roleLabel}</span>
          </div>
          {team && (
            <span className="text-muted-foreground text-xs">{team.logo} {team.shortName}</span>
          )}
        </div>

        {/* Player avatar */}
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black"
            style={{ background: `${roleColor}15`, border: `1px solid ${roleColor}30` }}
          >
            {player.nickname[0].toUpperCase()}
          </div>
          <div>
            <p className="text-foreground font-bold text-lg leading-tight">{player.nickname}</p>
            <p className="text-muted-foreground text-xs">{player.countryFlag} {player.country}</p>
          </div>
          <OverallBadge overall={player.overall} tier={player.tier} size="lg" />
        </div>

        {/* Key stat */}
        <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-1.5 text-center">
          <div>
            <p className="text-[9px] text-muted-foreground uppercase">ACS</p>
            <p className="text-xs font-bold text-foreground">{player.stats.acs.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-[9px] text-muted-foreground uppercase">K/D</p>
            <p className="text-xs font-bold text-foreground">{player.stats.kdRatio.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[9px] text-muted-foreground uppercase">KAST</p>
            <p className="text-xs font-bold text-foreground">{player.stats.kast.toFixed(0)}%</p>
          </div>
        </div>
      </div>
    </Link>
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
