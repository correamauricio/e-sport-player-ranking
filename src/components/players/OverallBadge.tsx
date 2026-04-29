import { cn } from '@/lib/utils';
import { useTierColor } from '@/hooks/useTierColor';
import type { Tier } from '@/types';
import { Badge } from '../ui/badge';

interface OverallBadgeProps {
  overall: number;
  tier: Tier;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTier?: boolean;
  forceLight?: boolean;
}

const sizes = {
  sm: { outer: 'w-10 h-10', text: 'text-sm', tier: 'text-[8px]' },
  md: { outer: 'w-14 h-14', text: 'text-lg', tier: 'text-[9px]' },
  lg: { outer: 'w-20 h-20', text: 'text-2xl', tier: 'text-xs' },
  xl: { outer: 'w-28 h-28', text: 'text-4xl', tier: 'text-sm' },
};

export function OverallBadge({
  overall,
  tier,
  size = 'md',
  className,
  showTier = true,
  forceLight = false,
}: OverallBadgeProps) {
  const color = useTierColor(tier, forceLight);
  const s = sizes[size];

  // SVG ring
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (overall / 100) * circumference;

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      <div className={cn('relative flex items-center justify-center', s.outer)}>
        {/* Background ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-muted/20"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>

        {/* Center content */}
        <div className="relative z-10 text-center leading-none">
          <span
            className={cn('font-bold', s.text)}
            style={{ color }}
          >
            {overall}
          </span>
        </div>
      </div>

      {showTier && (
        <Badge
          className={cn(
            'mt-1 tracking-wider',
            s.tier
          )}
          style={{
            background: `${color}20`,
            color,
          }}
        >
          Tier {tier}
        </Badge>
      )}
    </div>
  );
}
