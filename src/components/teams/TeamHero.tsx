import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Team, TeamWithStats, PlayerWithOverall, Tier } from '@/types';
import { OverallBadge } from '@/components/players/OverallBadge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getTierColor } from '@/lib/overall';
import { cn, shouldInvertTeamLogo } from '@/lib/utils';
import { useThemeObserver } from '@/hooks/useThemeObserver';

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
  useThemeObserver();
  const [logoError, setLogoError] = useState(false);
  const [flagError, setFlagError] = useState(false);
  const [photoErrors, setPhotoErrors] = useState<Record<string, boolean>>({});
  const tierColor = getTierColor(tier);

  const normalizedTeamName = team.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-card border p-6 w-2xs"
      style={{ borderColor: `${tierColor}30` }}
    >
      <div className="relative z-10 flex flex-col gap-5 items-center">
        {/* Navigation Buttons */}
        <div className="flex gap-2">
          {prevTeam && (
            <Link
              to={`/teams/${prevTeam.id}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
              title={`Anterior: ${prevTeam.name}`}
            >
              <ChevronLeft size={16} />
            </Link>
          )}
          {nextTeam && (
            <Link
              to={`/teams/${nextTeam.id}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
              title={`Próximo: ${nextTeam.name}`}
            >
              <ChevronRight size={16} />
            </Link>
          )}
        </div>

        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">
          {team.region}
        </p>

        {/* Logo */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0 overflow-hidden"
          style={{ background: `${tierColor}15`, border: `1px solid ${tierColor}30` }}
        >
          {!logoError ? (
            <img
              src={`/assets/teams/${normalizedTeamName}.svg`}
              alt={team.name}
              className={cn("w-12 h-12 object-contain", shouldInvertTeamLogo(team.name) && "dark:brightness-0 dark:invert")}
              onError={() => setLogoError(true)}
            />
          ) : (
            <span>{team.logo}</span>
          )}
        </div>

        {/* Info */}
        <div className="text-center">
          <h2 className="text-3xl font-black text-foreground">{team.name}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Globe size={12} />
              <span>{team.country === 'Unknown' ? '' : team.country}</span>
              {!flagError ? (
                <img
                  src={`/assets/flags/flag-for-flag-${team.country.toLowerCase()}-svgrepo-com.svg`}
                  alt={team.country}
                  className="w-4 h-auto object-contain rounded-sm"
                  onError={() => setFlagError(true)}
                />
              ) : (
                <span>{team.countryFlag}</span>
              )}
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
            <div className="flex flex-col gap-3 w-full">
              <div className="h-px bg-border w-full" />
              <div className="flex flex-col gap-2">
                {players.map((player) => {
                  const hasPhotoError = photoErrors[player.id];
                  const photoUrl = !hasPhotoError 
                    ? `/assets/players/${player.nickname.toLowerCase()}.png`
                    : player.photo && player.photo.startsWith('http') 
                      ? player.photo 
                      : undefined;

                  return (
                    <Link 
                      key={player.id} 
                      to={`/teams/${team.id}/${player.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50 border border-transparent hover:border-border hover:bg-muted transition-all group"
                    >
                      <Avatar className="w-9 h-9 border border-border group-hover:scale-110 transition-transform">
                        <AvatarImage 
                          src={photoUrl} 
                          alt={player.nickname} 
                          className="object-cover" 
                          onError={() => setPhotoErrors(prev => ({ ...prev, [player.id]: true }))}
                        />
                        <AvatarFallback className="text-sm font-bold bg-muted">
                          {player.photo && !player.photo.startsWith('http') ? player.photo : player.nickname[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-foreground text-sm font-bold truncate">{player.nickname}</p>
                          {player.isIgl && (
                            <img 
                              src="/assets/roles/igl.svg" 
                              alt="IGL" 
                              className="w-3.5 h-3.5 object-contain brightness-0 shrink-0 dark:brightness-0 dark:invert"
                              title="In-Game Leader"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-muted-foreground text-[10px] uppercase tracking-wider">{player.role}</span>
                          <img 
                            src={`/assets/roles/${player.role.toLowerCase()}.png`} 
                            alt={player.role} 
                            className="w-3 h-3 object-contain brightness-0 shrink-0 dark:brightness-0 dark:invert"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                      <div className="font-mono font-black text-primary text-sm px-2 py-0.5 rounded bg-primary/10">
                        {player.overall}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
