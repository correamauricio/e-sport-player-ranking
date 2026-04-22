import { useAllPlayersEnriched, useActiveGame } from '@/hooks/useGameData';
import { useRankingStore } from '@/store/useRankingStore';
import { OverallBadge } from '@/components/players/OverallBadge';
import { getTierColor } from '@/lib/overall';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const ROLE_FILTER = 'Todos';

function getRoleLabel(role: string, roles: { id: string; label: string }[]): string {
  return roles.find(r => r.id === role)?.label ?? role;
}

export function Leaderboard() {
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
                ? 'bg-brand text-white'
                : 'glass border border-white/8 text-text-secondary hover:text-text-primary hover:border-white/15'
            )}
          >
            {role === ROLE_FILTER ? 'Todos' : getRoleLabel(role, activeGame.roles)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-xl border border-white/8 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-white/8 text-text-muted text-xs font-medium uppercase tracking-wider">
          <span className="col-span-1 text-center">#</span>
          <span className="col-span-4">Jogador</span>
          <span className="col-span-2">Time</span>
          <span className="col-span-1 text-center">Função</span>
          <span className="col-span-1 text-right">ACS</span>
          <span className="col-span-1 text-right">K/D</span>
          <span className="col-span-1 text-right">KAST</span>
          <span className="col-span-1 text-right">Overall</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5">
          {pageData.map((player, i) => {
            const globalRank = page * PAGE_SIZE + i + 1;
            const team = teams.find(t => t.id === player.teamId);
            const tierColor = getTierColor(player.tier);

            return (
              <Link
                key={player.id}
                to={`/teams/${player.teamId}/${player.id}`}
                className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-white/4 transition-colors items-center group"
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
                <div className="col-span-4 flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0"
                    style={{ background: `${tierColor}15`, color: tierColor }}
                  >
                    {player.nickname[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-text-primary font-semibold text-sm group-hover:text-white truncate">
                      {player.nickname}
                    </p>
                    <p className="text-text-muted text-xs truncate">{player.countryFlag} {player.realName}</p>
                  </div>
                </div>

                {/* Team */}
                <div className="col-span-2 flex items-center gap-1.5 min-w-0">
                  <span className="text-sm">{team?.logo}</span>
                  <span className="text-text-secondary text-xs truncate">{team?.shortName}</span>
                </div>

                {/* Role */}
                <div className="col-span-1 flex justify-center">
                  <span className="text-text-muted text-xs capitalize">{player.role}</span>
                </div>

                {/* Stats */}
                <span className="col-span-1 text-right text-text-primary text-sm font-medium">
                  {player.stats.acs.toFixed(0)}
                </span>
                <span className="col-span-1 text-right text-text-primary text-sm font-medium">
                  {player.stats.kdRatio.toFixed(2)}
                </span>
                <span className="col-span-1 text-right text-text-primary text-sm font-medium">
                  {player.stats.kast.toFixed(0)}%
                </span>

                {/* Overall */}
                <div className="col-span-1 flex justify-end">
                  <OverallBadge overall={player.overall} tier={player.tier} size="sm" showTier={false} />
                </div>
              </Link>
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
            className="px-3 py-1.5 rounded-lg glass border border-white/8 text-xs text-text-secondary disabled:opacity-40 hover:text-text-primary transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-text-muted text-xs">
            Página {page + 1} de {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1.5 rounded-lg glass border border-white/8 text-xs text-text-secondary disabled:opacity-40 hover:text-text-primary transition-colors"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
