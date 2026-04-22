import { Link } from 'react-router-dom';
import { Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Team, TeamWithStats, PlayerWithOverall, Tier } from '@/types';
import { OverallBadge } from '@/components/players/OverallBadge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getTierColor } from '@/lib/overall';

interface TeamHeroProps {
  team: Team;
  avgOverall: number;
  tier: Tier;
  prevTeam?: Team | TeamWithStats | null;
  nextTeam?: Team | TeamWithStats | null;
  showPlayers?: boolean;
  players?: PlayerWithOverall[];
}

export function TeamHero({
  team,
  avgOverall,
  tier,
  prevTeam,
  nextTeam,
  showPlayers = false,
  players = []
}: TeamHeroProps) {
  const tierColor = getTierColor(tier);

  return (
    <div
      className="grid relative overflow-hidden rounded-2xl glass border border-white/8 p-6 flex-1"
      style={{ borderColor: `${tierColor}30` }}
    >
      {/* Visual Accents */}
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
          {team.region}
        </p>

        {/* Logo */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0"
          style={{ background: `${tierColor}15`, border: `1px solid ${tierColor}30` }}
        >
          {team.logo}
        </div>

        {/* Info */}
        <div className="text-center">
          <h2 className="text-3xl font-black text-white">{team.name}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 text-text-muted text-sm">
              <Globe size={12} />
              {team.country} {team.countryFlag}
            </span>
          </div>
        </div>

        {/* Overall & Players List */}
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <OverallBadge
            overall={avgOverall}
            tier={tier}
            size="xl"
          />

          {showPlayers && players.length > 0 && (
            <div className="flex flex-col gap-3 w-full animate-fade-in-up">
              <div className="h-px bg-white/10 w-full" />
              <div className="flex flex-col gap-2 stagger">
                {players.map((player) => (
                  <Link 
                    key={player.id} 
                    to={`/teams/${team.id}/${player.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                  >
                    <Avatar className="w-9 h-9 border border-white/10 group-hover:scale-110 transition-transform">
                      <AvatarImage src={player.photo} alt={player.nickname} className="object-cover" />
                      <AvatarFallback className="text-sm font-bold bg-white/5">
                        {player.photo && !player.photo.startsWith('http') ? player.photo : player.nickname[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{player.nickname}</p>
                      <p className="text-text-muted text-[10px] uppercase tracking-wider">{player.role}</p>
                    </div>
                    <div className="font-mono font-black text-brand text-sm px-2 py-0.5 rounded bg-brand/10">
                      {player.overall}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
