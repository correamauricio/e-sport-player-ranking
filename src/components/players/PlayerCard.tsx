import { Link } from 'react-router-dom';
import type { PlayerWithOverall, Team } from '@/types';
import { OverallBadge } from './OverallBadge';
import { useActiveGame } from '@/hooks/useGameData';
import { getTierColor } from '@/lib/overall';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  player: PlayerWithOverall;
  team?: Team;
  compact?: boolean;
  showTeam?: boolean;
  className?: string;
}

function getRoleColor(role: string): string {
  const map: Record<string, string> = {
    duelist: '#ef4444',
    initiator: '#8b5cf6',
    controller: '#3b82f6',
    sentinel: '#10b981',
    igl: '#f59e0b',
  };
  return map[role] ?? '#9191ab';
}

function getRoleLabel(role: string, game: { roles: { id: string; label: string }[] }): string {
  return game.roles.find(r => r.id === role)?.label ?? role;
}

export function PlayerCard({ player, team, compact = false, showTeam = false, className }: PlayerCardProps) {
  const game = useActiveGame();
  const tierColor = getTierColor(player.tier);
  const roleColor = getRoleColor(player.role);
  const roleLabel = getRoleLabel(player.role, game);

  return (
    <Link
      to={`/teams/${player.teamId}/${player.id}`}
      className={cn(
        'group relative flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1',
        'glass border border-white/8 hover:border-white/15',
        className
      )}
      style={{
        boxShadow: `0 0 0 0 ${tierColor}`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${tierColor}30`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 transparent';
      }}
    >
      {/* Tier accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, ${tierColor}, transparent)` }}
      />

      {/* Card content */}
      <div className={cn('p-4 flex gap-3', compact ? 'items-center' : 'flex-col')}>
        {compact ? (
          <>
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 font-bold"
              style={{ background: `${roleColor}20`, border: `1px solid ${roleColor}30` }}
            >
              {player.nickname[0].toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-text-primary font-semibold text-sm truncate">{player.nickname}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style={{ background: `${roleColor}20`, color: roleColor }}
                >
                  {roleLabel}
                </span>
                {showTeam && team && (
                  <span className="text-text-muted text-[10px]">{team.shortName}</span>
                )}
              </div>
            </div>

            {/* Overall */}
            <OverallBadge overall={player.overall} tier={player.tier} size="sm" />
          </>
        ) : (
          <>
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black"
                  style={{ background: `${roleColor}20`, border: `1px solid ${roleColor}30` }}
                >
                  {player.nickname[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-text-primary font-bold text-base leading-tight">{player.nickname}</p>
                  <p className="text-text-muted text-xs mt-0.5">{player.realName}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide"
                      style={{ background: `${roleColor}20`, color: roleColor }}
                    >
                      {roleLabel}
                    </span>
                    <span className="text-text-muted text-[10px]">{player.countryFlag}</span>
                    {showTeam && team && (
                      <span className="text-text-muted text-[10px] font-medium">{team.shortName}</span>
                    )}
                  </div>
                </div>
              </div>
              <OverallBadge overall={player.overall} tier={player.tier} size="md" />
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-3 gap-1.5 mt-1">
              {[
                { label: 'ACS', value: player.stats.acs.toFixed(0) },
                { label: 'K/D', value: player.stats.kdRatio.toFixed(2) },
                { label: 'KAST', value: `${player.stats.kast.toFixed(0)}%` },
              ].map(stat => (
                <div key={stat.label} className="text-center py-1.5 rounded-lg bg-white/4">
                  <p className="text-text-muted text-[9px] font-medium uppercase">{stat.label}</p>
                  <p className="text-text-primary font-bold text-sm">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Adjustment indicator */}
            {player.overallAdjustment !== 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <div
                  className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                    player.overallAdjustment > 0
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-red-500/15 text-red-400'
                  )}
                >
                  {player.overallAdjustment > 0 ? '+' : ''}{player.overallAdjustment} ajuste manual
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
