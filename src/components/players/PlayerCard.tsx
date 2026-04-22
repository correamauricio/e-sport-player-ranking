import { Link } from 'react-router-dom';
import type { PlayerWithOverall, Team } from '@/types';
import { OverallBadge } from './OverallBadge';
import { useActiveGame } from '@/hooks/useGameData';
import { getTierColor } from '@/lib/overall';
import { cn } from '@/lib/utils';
import { StatsGrid } from './StatsGrid';

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

function getTierCardStyle(tier: string) {
  switch (tier) {
    case 'S':
      return {
        background: 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)',
        borderColor: 'rgba(252, 211, 77, 0.8)'
      };
    case 'A':
      return {
        background: 'linear-gradient(135deg, #34d399 0%, #047857 100%)',
        borderColor: 'rgba(110, 231, 183, 0.8)'
      };
    case 'B':
      return {
        background: 'linear-gradient(135deg, #60a5fa 0%, #1d4ed8 100%)',
        borderColor: 'rgba(147, 197, 253, 0.8)'
      };
    case 'C':
      return {
        background: 'linear-gradient(135deg, #a78bfa 0%, #6d28d9 100%)',
        borderColor: 'rgba(196, 181, 253, 0.8)'
      };
    case 'D':
    default:
      return {
        background: 'linear-gradient(135deg, #9ca3af 0%, #374151 100%)',
        borderColor: 'rgba(209, 213, 219, 0.8)'
      };
  }
}

export function PlayerCard({ player, team, compact = false, showTeam = false, className }: PlayerCardProps) {
  const game = useActiveGame();
  const tierColor = getTierColor(player.tier);
  const roleColor = getRoleColor(player.role);
  const roleLabel = getRoleLabel(player.role, game);

  if (compact) {
    return (
      <Link
        to={`/teams/${player.teamId}/${player.id}`}
        className={cn(
          'group relative flex items-center gap-3 p-4 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1',
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
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, ${tierColor}, transparent)` }}
        />

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 font-bold overflow-hidden"
          style={{ background: `${roleColor}20`, border: `1px solid ${roleColor}30` }}
        >
          {player.photo && player.photo.startsWith('http') ? (
            <img src={player.photo} alt="" className="w-full h-full object-cover" />
          ) : (
            player.photo && !player.photo.startsWith('http') ? player.photo : player.nickname[0].toUpperCase()
          )}
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
      </Link>
    );
  }

  // FUT Style Card
  return (
    <Link
      to={`/teams/${player.teamId}/${player.id}`}
      className={cn(
        'group relative flex flex-col rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-2',
        'w-[280px] aspect-2.5/3.5 mx-auto',
        'border-[3px] shadow-xl',
        className
      )}
      style={{
        ...getTierCardStyle(player.tier),
        boxShadow: `0 10px 40px -10px ${tierColor}80`,
      }}
    >
      {/* Background Texture/Waves */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.4) 0%, transparent 50%)'
        }}
      />

      {/* Top Left: Overall & Tier */}
      <div className="absolute top-4 left-4 flex flex-col items-center z-20">
        <span className="text-4xl font-black text-white leading-none drop-shadow-md">
          {player.overall.toFixed(0)}
        </span>
        {/* Adjustment indicator */}
        {player.overallAdjustment !== 0 && (
          <div className="bottom-0 flex items-center my-1">
            <div
              className={cn(
                'text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md backdrop-blur-md border border-white/20',
                player.overallAdjustment > 0
                  ? 'bg-emerald-500/80 text-white'
                  : 'bg-red-500/80 text-white'
              )}
            >
              {player.overallAdjustment > 0 ? '+' : ''}{player.overallAdjustment}
            </div>
          </div>
        )}

        <span className="text-lg font-bold text-white/90 drop-shadow-md mt-0.5">
          {player.tier}
        </span>

        {/* Role Icon/Label */}
        <div
          className="mt-2 px-1.5 py-0.5 rounded bg-black/20 border border-white/20 text-[9px] font-bold text-white uppercase tracking-wider"
          style={{ borderColor: `${roleColor}80` }}
        >
          {roleLabel}
        </div>
      </div>

      {/* Top Right: Team & Country */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
        {team && (
          <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-lg border border-white/10 backdrop-blur-sm">
            <span className="text-xs">{team.logo}</span>
            <span className="text-[10px] font-bold text-white uppercase tracking-tight">{team.shortName}</span>
          </div>
        )}
        <div className="text-base filter drop-shadow-md">
          {player.countryFlag}
        </div>
      </div>

      {/* Player Photo */}
      <div className="absolute top-[10%] inset-x-0 bottom-[30%] flex justify-center items-end z-10 pointer-events-none">
        {player.photo && player.photo.startsWith('http') ? (
          <img
            src={player.photo}
            alt={player.nickname}
            className="w-[120%] h-[120%] object-contain object-bottom drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-32 h-32 rounded-full mb-4 flex items-center justify-center text-6xl font-black bg-black/20 border-2 border-white/20 text-white drop-shadow-lg">
            {player.photo ? player.photo : player.nickname[0].toUpperCase()}
          </div>
        )}
      </div>

      {/* Bottom Gradient overlay */}
      <div className="absolute bottom-0 inset-x-0 h-[55%] bg-linear-to-t from-[#000000] to-transparent z-10 pointer-events-none" />

      {/* Bottom Content */}
      <div className="absolute bottom-0 inset-x-0 p-4 pb-5 flex flex-col items-center z-20">
        {/* Name */}
        <div className="flex flex-col items-center w-full mb-1">
          <h3 className="text-[28px] font-black text-white tracking-wide leading-none uppercase drop-shadow-lg text-center w-full truncate px-2">
            {player.nickname}
          </h3>
        </div>

        {/* Divider */}
        <div className="w-[85%] h-px bg-white/30 my-2" />

        {/* Stats Grid */}
        <StatsGrid
          stats={player.stats}
          statDefs={game.statDefinitions}
          variant="fut"
          className="px-1"
        />
      </div>
    </Link>
  );
}
