import type { StatDefinition, PlayerStats } from '@/types';
import { formatStat } from '@/lib/overall';
import { cn } from '@/lib/utils';

interface StatsGridProps {
  stats: PlayerStats;
  statDefs: StatDefinition[];
  compact?: boolean;
  variant?: 'default' | 'fut';
  className?: string;
}

export function StatsGrid({ stats, statDefs, compact = false, variant = 'default', className }: StatsGridProps) {
  if (variant === 'fut') {
    const extraStats = [
      { label: 'K', value: stats.kills },
      { label: 'D', value: stats.deaths },
      { label: 'A', value: stats.assists },
    ];

    return (
      <div className={cn("grid grid-cols-3 gap-x-[9.14cqw] gap-y-[0.57cqw] w-full max-w-[62.86cqw]", className)}>
        {statDefs.map(def => {
          const rawValue = stats[def.key as keyof PlayerStats] as number;
          const formatted = formatStat(rawValue, def.format);

          return (
            <div key={def.key} className="flex flex-col gap-0 items-center">
              <span className="text-[4cqw] font-regular uppercase tracking-wider text-white/90">
                {def.label}
              </span>
              <span className="text-[6cqw] font-bold text-white">
                {formatted}
              </span>
            </div>
          );
        })}
        {extraStats.map(stat => (
          <div key={stat.label} className="flex flex-col gap-0 items-center">
            <span className="text-[4cqw] font-regular uppercase tracking-wider text-white/90">
              {stat.label}
            </span>
            <span className="text-[6cqw] font-bold text-white">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    );
  }


  return (
    <div
      className={cn(
        'grid gap-2',
        compact ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3',
        className
      )}
    >
      {statDefs.map(def => {
        const rawValue = stats[def.key as keyof PlayerStats] as number;
        const formatted = formatStat(rawValue, def.format);

        return (
          <div
            key={def.key}
            className="bg-muted/50 rounded-lg border p-2.5 flex flex-col gap-0.5 hover:bg-muted transition-all duration-200"
          >
            <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
              {def.label}
            </span>
            <span className="text-foreground font-bold text-base leading-tight">
              {formatted}
            </span>
            <span className="text-muted-foreground text-[9px] transition-all">
              {def.description}
            </span>
          </div>
        );
      })}

      {/* Extra stats not in weighted formula */}
      <div className="bg-muted/50 rounded-lg border p-2.5 flex flex-col gap-0.5">
        <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">K</span>
        <span className="text-foreground font-bold text-base leading-tight">{stats.kills.toFixed(1)}</span>
      </div>
      <div className="bg-muted/50 rounded-lg border p-2.5 flex flex-col gap-0.5">
        <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">D</span>
        <span className="text-red-400 font-bold text-base leading-tight">{stats.deaths.toFixed(1)}</span>
      </div>
      <div className="bg-muted/50 rounded-lg border p-2.5 flex flex-col gap-0.5">
        <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">A</span>
        <span className="text-foreground font-bold text-base leading-tight">{stats.assists.toFixed(1)}</span>
      </div>
    </div>
  );
}
