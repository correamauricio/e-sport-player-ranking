import { Link } from 'react-router-dom';
import type { TeamWithStats } from '@/types';
import { OverallBadge } from '@/components/players/OverallBadge';
import { getTierColor } from '@/lib/overall';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

interface TeamCardProps {
  team: TeamWithStats;
  className?: string;
  rank?: number;
}

export function TeamCard({ team, rank, className }: TeamCardProps) {
  const tierColor = getTierColor(team.tier);

  return (
    <Link
      to={`/teams/${team.id}`}
      className={cn(
        'group relative flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1',
        'glass border border-white/8 hover:border-white/15',
        className
      )}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${tierColor}25`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Tier accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, ${tierColor}, transparent)` }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {rank && (
              <span className="text-text-muted text-xs font-bold w-5 text-center">#{rank}</span>
            )}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `${tierColor}15`, border: `1px solid ${tierColor}30` }}
            >
              {team.logo}
            </div>
            <div>
              <p className="text-text-primary font-bold text-base leading-tight">{team.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm">{team.countryFlag}</span>
                <span className="text-text-muted text-xs">{team.region}</span>
              </div>
            </div>
          </div>
          <OverallBadge overall={team.avgOverall} tier={team.tier} size="md" />
        </div>

        {/* Players preview */}
        <div className="mt-4 pt-3 border-t border-white/6">
          <div className="flex items-center gap-1.5 mb-2">
            <Users size={11} className="text-text-muted" />
            <span className="text-text-muted text-[10px] font-medium uppercase tracking-wider">
              Elenco
            </span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {team.players.slice(0, 5).map(p => (
              <div
                key={p.id}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/4 border border-white/6"
              >
                <span className="text-text-secondary font-medium text-xs">{p.nickname}</span>
                <span
                  className="text-[9px] font-bold px-1 rounded"
                  style={{
                    color: tierColor,
                    background: `${getTierColor(p.tier)}15`,
                  }}
                >
                  {p.overall}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
