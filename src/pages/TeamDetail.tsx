import { useParams, Link } from 'react-router-dom';
import { useRankingStore } from '@/store/useRankingStore';
import { useTeamsWithStats, useTeamPlayers } from '@/hooks/useGameData';
import { PlayerCard } from '@/components/players/PlayerCard';
import { OverallBadge } from '@/components/players/OverallBadge';
import { getTierColor } from '@/lib/overall';
import { ArrowLeft, Globe, Users } from 'lucide-react';

export function TeamDetail() {
  const { teamId } = useParams<{ teamId: string }>();
  const teams = useRankingStore(s => s.teams);
  const teamsWithStats = useTeamsWithStats();
  const players = useTeamPlayers(teamId ?? '');

  const teamRaw = teams.find(t => t.id === teamId);
  const teamWithStats = teamsWithStats.find(t => t.id === teamId);

  if (!teamRaw || !teamWithStats) {
    return (
      <div className="text-center py-20 text-text-muted">Time não encontrado.</div>
    );
  }

  const tierColor = getTierColor(teamWithStats.tier);

  const roleOrder = ['duelist', 'initiator', 'controller', 'sentinel', 'igl'];
  const sortedPlayers = [...players].sort((a, b) => {
    const ai = roleOrder.indexOf(a.role);
    const bi = roleOrder.indexOf(b.role);
    return ai - bi;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Back */}
      <Link
        to="/teams"
        className="flex items-center gap-2 text-text-muted text-sm hover:text-text-primary transition-colors w-fit"
      >
        <ArrowLeft size={14} />
        Voltar para Times
      </Link>

      {/* Team header */}
      <div
        className="relative overflow-hidden rounded-2xl glass border border-white/8 p-6"
        style={{ borderColor: `${tierColor}30` }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ background: `radial-gradient(ellipse at 10% 50%, ${tierColor} 0%, transparent 60%)` }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, ${tierColor}, transparent)` }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Logo */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0"
            style={{ background: `${tierColor}15`, border: `1px solid ${tierColor}30` }}
          >
            {teamRaw.logo}
          </div>

          {/* Info */}
          <div className="flex-1">
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">
              {teamRaw.region}
            </p>
            <h2 className="text-3xl font-black text-white">{teamRaw.name}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1.5 text-text-muted text-sm">
                <Globe size={12} />
                {teamRaw.countryFlag} {teamRaw.country}
              </span>
              <span className="flex items-center gap-1.5 text-text-muted text-sm">
                <Users size={12} />
                {players.length} jogadores
              </span>
            </div>
          </div>

          {/* Overall */}
          <OverallBadge
            overall={teamWithStats.avgOverall}
            tier={teamWithStats.tier}
            size="xl"
          />
        </div>
      </div>

      {/* Players */}
      <div>
        <h3 className="text-text-primary font-bold text-sm mb-4 flex items-center gap-2">
          <Users size={14} className="text-brand" />
          Jogadores do Elenco
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {sortedPlayers.map(player => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
}
