import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Adjustment } from '@/types';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface AdjustmentHistoryProps {
  history: Adjustment[];
  className?: string;
}

export function AdjustmentHistory({ history, className }: AdjustmentHistoryProps) {
  if (history.length === 0) {
    return (
      <div className={cn('glass rounded-xl p-5 text-center', className)}>
        <p className="text-text-muted text-sm">Nenhum ajuste manual ainda.</p>
      </div>
    );
  }

  return (
    <div className={cn('glass rounded-xl p-5 space-y-3', className)}>
      <h3 className="text-text-primary font-semibold text-sm flex items-center gap-2">
        <Clock size={14} className="text-brand" />
        Histórico de Ajustes ({history.length})
      </h3>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {history.map(adj => (
          <div
            key={adj.id}
            className="flex gap-3 p-3 rounded-lg bg-bg-elevated border border-white/6 hover:border-white/10 transition-colors"
          >
            {/* Delta badge */}
            <div
              className={cn(
                'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm',
                adj.delta > 0
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-red-500/15 text-red-400'
              )}
            >
              {adj.delta > 0 ? '+' : ''}{adj.delta}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-xs font-medium leading-snug line-clamp-2">
                {adj.justification}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-text-muted text-[10px]">{adj.author}</span>
                <span className="text-text-muted text-[10px]">•</span>
                <span className="text-text-muted text-[10px]">
                  {format(new Date(adj.createdAt), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
