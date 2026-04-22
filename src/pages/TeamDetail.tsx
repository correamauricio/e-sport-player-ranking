import { useParams, Link } from 'react-router-dom';
import { useRankingStore } from '@/store/useRankingStore';
import { useTeamsWithStats, useTeamPlayers } from '@/hooks/useGameData';
import { PlayerCard } from '@/components/players/PlayerCard';
import { OverallBadge } from '@/components/players/OverallBadge';
import { getTierColor } from '@/lib/overall';
import { ArrowLeft, Globe, Users, ChevronLeft, ChevronRight } from 'lucide-react';

export function TeamDetail() {
  const { teamId } = useParams<{ teamId: string }>();
  const teams = useRankingStore(s => s.teams);
  const allTeamsWithStats = useTeamsWithStats();
  const sortedTeams = [...allTeamsWithStats].sort((a, b) => b.avgOverall - a.avgOverall);
  const players = useTeamPlayers(teamId ?? '');

  const teamRaw = teams.find(t => t.id === teamId);
  const currentIndex = sortedTeams.findIndex(t => t.id === teamId);
  const teamWithStats = sortedTeams[currentIndex];
  
  const prevTeam = currentIndex > 0 ? sortedTeams[currentIndex - 1] : null;
  const nextTeam = currentIndex < sortedTeams.length - 1 ? sortedTeams[currentIndex + 1] : null;

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
    <div className="space-y-6 animate-fade-in-up mx-auto max-w-6xl">
      {/* Back */}
      <Link
        to="/teams"
        className="flex items-center gap-2 text-text-muted text-sm hover:text-text-primary transition-colors w-fit"
      >
        <ArrowLeft size={14} />
        Voltar para Times
      </Link>

      <div className='flex gap-6'>
        {/* Team header */}
        <div
          className="grid relative overflow-hidden rounded-2xl glass border border-white/8 p-6 flex-1"
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


          <div className="relative z-10 flex flex-col gap-5 items-center">
            {/* Navigation Buttons */}
            <div className="flex gap-2">
              {prevTeam && (
                <Link
                  to={`/teams/${prevTeam.id}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg glass border border-white/8 text-text-muted hover:text-text-primary hover:border-white/20 transition-all"
                  title={`Anterior: ${prevTeam.name}`}
                >
                  <ChevronLeft size={16} />
                </Link>
              )}
              {nextTeam && (
                <Link
                  to={`/teams/${nextTeam.id}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg glass border border-white/8 text-text-muted hover:text-text-primary hover:border-white/20 transition-all"
                  title={`Próximo: ${nextTeam.name}`}
                >
                  <ChevronRight size={16} />
                </Link>
              )}
            </div>

            <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">
              {teamRaw.region}
            </p>
            {/* Logo */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0"
              style={{ background: `${tierColor}15`, border: `1px solid ${tierColor}30` }}
            >
              {teamRaw.logo}
            </div>

            {/* Info */}
            <div className="text-center">
              <h2 className="text-3xl font-black text-white">{teamRaw.name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-text-muted text-sm">
                  <Globe size={12} />
                  {teamRaw.country} {teamRaw.countryFlag}
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
    </div>
  );
}
