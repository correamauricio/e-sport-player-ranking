import { useTeamsWithStats, useAllPlayersEnriched, useActiveGame } from '@/hooks/useGameData';
import { getTierColor } from '@/lib/overall';
import { Link } from 'react-router-dom';
import { Trophy, Users, Star, TrendingUp, Shield } from 'lucide-react';
import { OverallBadge } from '@/components/players/OverallBadge';

export function Dashboard() {
  const teamsWithStats = useTeamsWithStats();
  const allPlayers = useAllPlayersEnriched();
  const activeGame = useActiveGame();

  const sortedPlayers = [...allPlayers].sort((a, b) => b.overall - a.overall);
  const topPlayers = sortedPlayers.slice(0, 5);
  const topTeam = [...teamsWithStats].sort((a, b) => b.avgOverall - a.avgOverall)[0];

  const tierCounts = allPlayers.reduce<Record<string, number>>((acc, p) => {
    acc[p.tier] = (acc[p.tier] ?? 0) + 1;
    return acc;
  }, {});

  const avgOverall = allPlayers.length > 0
    ? Math.round(allPlayers.reduce((s, p) => s + p.overall, 0) / allPlayers.length)
    : 0;

  const stats = [
    { label: 'Times', value: teamsWithStats.length, icon: Shield, color: '#3b82f6' },
    { label: 'Jogadores', value: allPlayers.length, icon: Users, color: '#8b5cf6' },
    { label: 'Overall Médio', value: avgOverall, icon: TrendingUp, color: '#10b981' },
    { label: 'Tier S', value: tierCounts['S'] ?? 0, icon: Star, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-card border p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-2">
            <span>{activeGame.logo}</span>
            <span>{activeGame.name} VCT 2025</span>
          </div>
          <h2 className="text-3xl font-black text-foreground mb-2">
            E-Sport Player Ranking
          </h2>
          <p className="text-muted-foreground text-sm max-w-md">
            Analise e ajuste manualmente o overall dos jogadores com base nas suas estatísticas. Compare times e monte o dream team perfeito.
          </p>
          <div className="flex gap-3 mt-5">
            <Link
              to="/rankings/teams"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-all duration-200 hover:bg-primary/90"
            >
              Ranking de Times
            </Link>
            <Link
              to="/rankings/leaderboard"
              className="px-4 py-2 rounded-lg bg-muted border text-foreground text-sm font-semibold hover:bg-accent transition-all duration-200"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card rounded-xl p-4 border">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted"
                >
                  <Icon size={16} className="text-foreground" />
                </div>
              </div>
              <p className="text-3xl font-black text-foreground">{stat.value}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 players */}
        <div className="lg:col-span-2 bg-card rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground font-bold text-sm flex items-center gap-2">
              <Trophy size={15} className="text-amber-400" />
              Top 5 Jogadores
            </h3>
            <Link to="/rankings/leaderboard" className="text-primary text-xs hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-2">
            {topPlayers.map((player, i) => {
              const tierColor = getTierColor(player.tier);
              return (
                <Link
                  key={player.id}
                  to={`/teams/${player.teamId}/${player.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                >
                  <span
                    className="w-6 text-center font-bold text-sm"
                    style={{ color: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#cd7c2f' : '#5a5a77' }}
                  >
                    {i + 1}
                  </span>
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-base"
                    style={{ background: `${tierColor}15`, color: tierColor }}
                  >
                    {player.nickname[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-semibold text-sm truncate">{player.nickname}</p>
                    <p className="text-muted-foreground text-xs">{player.countryFlag} {player.role}</p>
                  </div>
                  <OverallBadge overall={player.overall} tier={player.tier} size="sm" showTier={false} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Best team */}
        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground font-bold text-sm flex items-center gap-2">
              <Shield size={15} className="text-blue-400" />
              Melhor Time
            </h3>
            <Link to="/rankings/teams" className="text-primary text-xs hover:underline">
              Ver ranking →
            </Link>
          </div>

          {topTeam && (
            <Link to={`/teams/${topTeam.id}`} className="block">
              <div className="text-center py-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3"
                  style={{
                    background: `${getTierColor(topTeam.tier)}15`,
                    border: `1px solid ${getTierColor(topTeam.tier)}30`,
                  }}
                >
                  {topTeam.logo}
                </div>
                <p className="text-foreground font-bold text-lg">{topTeam.name}</p>
                <p className="text-muted-foreground text-xs">{topTeam.countryFlag} {topTeam.region}</p>
                <OverallBadge
                  overall={topTeam.avgOverall}
                  tier={topTeam.tier}
                  size="lg"
                  className="mt-4 mx-auto"
                />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
