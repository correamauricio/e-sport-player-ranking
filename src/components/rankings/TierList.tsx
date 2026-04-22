import type { TierGroup, Tier } from '@/types';
import { getTierColor } from '@/lib/overall';
import { cn } from '@/lib/utils';

interface TierListProps<T> {
  groups: TierGroup<T>[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

const TIER_LABELS: Record<Tier, string> = {
  S: 'S Tier — Elite',
  A: 'A Tier — Excelente',
  B: 'B Tier — Bom',
  C: 'C Tier — Mediano',
  D: 'D Tier — Baixo',
};

export function TierList<T>({ groups, renderItem, emptyMessage, className }: TierListProps<T>) {
  return (
    <div className={cn('space-y-6', className)}>
      {groups.map(group => {
        if (group.items.length === 0) return null;
        const color = getTierColor(group.tier);

        return (
          <div key={group.tier} className="animate-fade-in-up">
            {/* Tier header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0"
                style={{
                  background: `${color}20`,
                  border: `2px solid ${color}50`,
                  color,
                  boxShadow: `0 0 12px ${color}25`,
                }}
              >
                {group.tier}
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-text-primary font-bold text-base">{TIER_LABELS[group.tier]}</h3>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${color}20`, color }}
                >
                  {group.items.length}
                </span>
              </div>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}30, transparent)` }} />
            </div>

            {/* Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 stagger">
              {group.items.map((item, i) => renderItem(item, i))}
            </div>
          </div>
        );
      })}

      {groups.every(g => g.items.length === 0) && (
        <div className="text-center py-16 text-text-muted">
          {emptyMessage ?? 'Nenhum item para exibir.'}
        </div>
      )}
    </div>
  );
}
