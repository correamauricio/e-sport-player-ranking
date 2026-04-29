import { useAllPlayersEnriched, useActiveGame } from '@/hooks/useGameData';
import { useRankingStore } from '@/store/useRankingStore';
import { OverallBadge } from '@/components/players/OverallBadge';
import { getTierColor } from '@/lib/overall';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn, shouldInvertTeamLogo } from '@/lib/utils';
import { useThemeObserver } from '@/hooks/useThemeObserver';

import type { PlayerWithOverall, Team } from '@/types';

const ROLE_FILTER = 'Todos';

function getRoleLabel(role: string, roles: { id: string; label: string }[]): string {
  return roles.find(r => r.id === role)?.label ?? role;
}

interface LeaderboardRowProps {
  player: PlayerWithOverall;
  globalRank: number;
  team?: Team;
  tierColor: string;
}

function LeaderboardRow({ player, globalRank, team, tierColor }: LeaderboardRowProps) {
  useThemeObserver();
  const [photoError, setPhotoError] = useState(false);
  const [teamLogoError, setTeamLogoError] = useState(false);
  const [flagError, setFlagError] = useState(false);
  const [roleIconError, setRoleIconError] = useState(false);

  const normalizedTeamName = team?.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") ?? "";

  return (
    <Link
      to={`/teams/${player.teamId}/${player.id}`}
      className="grid grid-cols-8 md:grid-cols-12 gap-2 px-4 py-3 hover:bg-accent transition-colors items-center group"
    >
      {/* Rank */}
      <span
        className="col-span-1 text-center font-bold text-sm"
        style={{
          color: globalRank === 1 ? '#f59e0b' : globalRank === 2 ? '#9ca3af' : globalRank === 3 ? '#cd7c2f' : '#5a5a77',
        }}
      >
        {globalRank}
      </span>

      {/* Player */}
      <div className="col-span-3 md:col-span-4 flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 overflow-hidden relative"
          style={{ background: `${tierColor}15`, color: tierColor }}
        >
          {!photoError ? (
            <img
              src={`/assets/players/${player.nickname.toLowerCase()}.png`}
              alt={player.nickname}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setPhotoError(true)}
            />
          ) : player.photo && player.photo.startsWith("http") ? (
            <img
              src={player.photo}
              alt={player.nickname}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <span>{player.nickname[0]}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-foreground font-semibold text-sm truncate">
            {player.nickname}
          </p>
          <p className="text-muted-foreground text-xs truncate flex items-center gap-1.5">
            {!flagError ? (
              <img
                src={`/assets/flags/flag-for-flag-${player.country.toLowerCase()}-svgrepo-com.svg`}
                alt={player.country}
                className="w-3.5 h-auto object-contain shrink-0"
                onError={() => setFlagError(true)}
              />
            ) : (
              <span className="shrink-0">{player.countryFlag}</span>
            )}

            {/* Mobile-only Team Logo */}
            {team && (
              <span className="md:hidden flex items-center shrink-0">
                {!teamLogoError ? (
                  <img
                    src={`/assets/teams/${normalizedTeamName}.svg`}
                    alt={team.shortName}
                    className={cn("w-3.5 h-3.5 object-contain", shouldInvertTeamLogo(team.name) && "dark:brightness-0 dark:invert")}
                    onError={() => setTeamLogoError(true)}
                  />
                ) : (
                  <span className="text-[10px]">{team.logo}</span>
                )}
              </span>
            )}

            {/* Mobile-only Role Icon */}
            <span className="md:hidden flex items-center shrink-0">
              {!roleIconError ? (
                <img
                  src={`/assets/roles/${player.role.toLowerCase()}.png`}
                  alt={player.role}
                  className="w-3.5 h-3.5 object-contain brightness-0 opacity-70 dark:brightness-0 dark:invert"
                  onError={() => setRoleIconError(true)}
                />
              ) : (
                <span className="text-[10px] capitalize">{player.role[0]}</span>
              )}
            </span>

            <span className="truncate">{player.realName}</span>
          </p>
        </div>
      </div>

      {/* Team */}
      <div className="hidden md:flex md:col-span-2 items-center gap-1.5 min-w-0">
        {team && (
          <div>
            {!teamLogoError ? (
              <img
                src={`/assets/teams/${normalizedTeamName}.svg`}
                alt={team.shortName}
                className={cn("w-5 h-5 object-contain", shouldInvertTeamLogo(team.name) && "dark:brightness-0 dark:invert")}
                onError={() => setTeamLogoError(true)}
              />
            ) : (
              <span className="text-sm">{team.logo}</span>
            )}
          </div>
        )}
        <span className="text-muted-foreground text-xs truncate">{team?.shortName}</span>
      </div>

      {/* Role */}
      <div className="hidden md:flex md:col-span-1 justify-center">
        {!roleIconError ? (
          <img
            src={`/assets/roles/${player.role.toLowerCase()}.png`}
            alt={player.role}
            className="w-4 h-4 object-contain brightness-0 opacity-70 group-hover:opacity-100 transition-opacity dark:brightness-0 dark:invert"
            onError={() => setRoleIconError(true)}
          />
        ) : (
          <span className="text-muted-foreground text-xs capitalize">{player.role}</span>
        )}
      </div>

      {/* Stats */}
      <span className="col-span-1 text-right text-foreground text-sm font-medium">
        {player.stats.acs.toFixed(0)}
      </span>
      <span className="col-span-1 text-right text-foreground text-sm font-medium">
        {player.stats.kdRatio.toFixed(2)}
      </span>
      <span className="col-span-1 text-right text-foreground text-sm font-medium">
        {player.stats.kast.toFixed(0)}%
      </span>

      {/* Overall */}
      <div className="col-span-1 flex justify-end">
        <OverallBadge overall={player.overall} tier={player.tier} size="sm" showTier={false} />
      </div>
    </Link>
  );
}


export function Leaderboard() {
  useThemeObserver();
  const allPlayers = useAllPlayersEnriched();
  const activeGame = useActiveGame();
  const teams = useRankingStore(s => s.teams);

  const [roleFilter, setRoleFilter] = useState(ROLE_FILTER);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const filtered = allPlayers
    .filter(p => roleFilter === ROLE_FILTER || p.role === roleFilter)
    .sort((a, b) => b.overall - a.overall);

  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const roles = [ROLE_FILTER, ...activeGame.roles.map(r => r.id)];

  return (
    <div className="space-y-5">
      {/* Role filter */}
      <div className="flex gap-2 flex-wrap">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => { setRoleFilter(role); setPage(0); }}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
              roleFilter === role
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted border text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            {role === ROLE_FILTER ? 'Todos' : getRoleLabel(role, activeGame.roles)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-8 md:grid-cols-12 gap-2 px-4 py-3 border-b text-muted-foreground text-xs font-medium uppercase tracking-wider">
          <span className="col-span-1 text-center">#</span>
          <span className="col-span-3 md:col-span-4">Jogador</span>
          <span className="hidden md:block md:col-span-2">Time</span>
          <span className="hidden md:block md:col-span-1 text-center">Função</span>
          <span className="col-span-1 text-right">ACS</span>
          <span className="col-span-1 text-right">K/D</span>
          <span className="col-span-1 text-right">KAST</span>
          <span className="col-span-1 text-right">Overall</span>
        </div>

        {/* Rows */}
        <div className="divide-y">
          {pageData.map((player, i) => {
            const globalRank = page * PAGE_SIZE + i + 1;
            const team = teams.find(t => t.id === player.teamId);
            const tierColor = getTierColor(player.tier);

            return (
              <LeaderboardRow
                key={player.id}
                player={player}
                globalRank={globalRank}
                team={team}
                tierColor={tierColor}
              />
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 rounded-lg bg-muted border text-xs text-muted-foreground disabled:opacity-40 hover:text-foreground transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-muted-foreground text-xs">
            Página {page + 1} de {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1.5 rounded-lg bg-muted border text-xs text-muted-foreground disabled:opacity-40 hover:text-foreground transition-colors"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
