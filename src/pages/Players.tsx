import { useAllPlayersEnriched, useActiveGame } from '@/hooks/useGameData';
import { useRankingStore } from '@/store/useRankingStore';
import { PlayerCard } from '@/components/players/PlayerCard';
import { useState } from 'react';

const ALL_ROLES = 'Todos';

export function Players() {
  const allPlayers = useAllPlayersEnriched();
  const activeGame = useActiveGame();
  const teams = useRankingStore(s => s.teams);

  const [selectedRole, setSelectedRole] = useState(ALL_ROLES);
  const [search, setSearch] = useState('');

  const roles = [ALL_ROLES, ...activeGame.roles.map(r => r.id)];
  const roleLabels: Record<string, string> = {
    [ALL_ROLES]: 'Todos',
    ...Object.fromEntries(activeGame.roles.map(r => [r.id, r.label])),
  };

  const filtered = allPlayers
    .filter(p => {
      if (selectedRole !== ALL_ROLES && p.role !== selectedRole) return false;
      if (search && !p.nickname.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => b.overall - a.overall);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar jogador..."
          className="flex-1 bg-bg-elevated border border-border text-text-primary text-sm rounded-lg px-3 py-2 placeholder:text-text-muted focus:outline-none focus:border-border-strong"
        />
        <div className="flex gap-2 flex-wrap">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedRole === role
                  ? 'bg-brand text-white'
                  : 'glass border border-white/8 text-text-secondary hover:text-text-primary hover:border-white/15'
              }`}
            >
              {roleLabels[role]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-text-muted text-xs">{filtered.length} jogador(es)</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger">
        {filtered.map(player => {
          const team = teams.find(t => t.id === player.teamId);
          return (
            <PlayerCard key={player.id} player={player} team={team} showTeam />
          );
        })}
      </div>
    </div>
  );
}
