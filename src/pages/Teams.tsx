import { useTeamsWithStats } from '@/hooks/useGameData';
import { TeamCard } from '@/components/teams/TeamCard';
import { useState } from 'react';

const REGIONS = ['Todos', 'Americas', 'EMEA', 'Pacific'];

export function Teams() {
  const teamsWithStats = useTeamsWithStats();
  const [region, setRegion] = useState('Todos');

  const filtered = region === 'Todos'
    ? teamsWithStats
    : teamsWithStats.filter(t => t.region === region);

  const sorted = [...filtered].sort((a, b) => b.avgOverall - a.avgOverall);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {REGIONS.map(r => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              region === r
                ? 'bg-brand text-white'
                : 'glass border border-white/8 text-text-secondary hover:text-text-primary hover:border-white/15'
            }`}
          >
            {r}
          </button>
        ))}
        <span className="text-text-muted text-xs ml-2">{sorted.length} time(s)</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
        {sorted.map((team, i) => (
          <TeamCard key={team.id} team={team} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
