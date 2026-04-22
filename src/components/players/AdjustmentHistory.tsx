import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Adjustment } from '@/types';
import { cn } from '@/lib/utils';
import { Clock, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useRankingStore } from '@/store/useRankingStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AdjustmentPanel } from './AdjustmentPanel';

interface AdjustmentHistoryProps {
  playerId: string;
  currentOverall: number;
  currentAdjustment: number;
  history: Adjustment[];
  className?: string;
}

export function AdjustmentHistory({ 
  playerId, 
  currentOverall, 
  currentAdjustment, 
  history, 
  className 
}: AdjustmentHistoryProps) {
  const deleteAdjustment = useRankingStore(s => s.deleteAdjustment);
  
  const [editingAdj, setEditingAdj] = useState<Adjustment | null>(null);
  const [deletingAdj, setDeletingAdj] = useState<Adjustment | null>(null);

  if (history.length === 0) {
    return (
      <div className={cn('glass rounded-xl p-5 text-center', className)}>
        <p className="text-text-muted text-sm">Nenhum ajuste manual ainda.</p>
      </div>
    );
  }

  const handleDelete = () => {
    if (deletingAdj) {
      deleteAdjustment(playerId, deletingAdj.id);
      setDeletingAdj(null);
    }
  };

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
            className="group flex gap-3 p-3 rounded-lg bg-bg-elevated border border-white/6 hover:border-white/10 transition-colors relative"
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
            <div className="flex-1 min-w-0 pr-16">
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

            {/* Actions */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 text-text-muted hover:text-white hover:bg-white/10"
                onClick={() => setEditingAdj(adj)}
              >
                <Edit2 size={12} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 text-text-muted hover:text-red-400 hover:bg-red-400/10"
                onClick={() => setDeletingAdj(adj)}
              >
                <Trash2 size={12} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingAdj} onOpenChange={(open) => !open && setEditingAdj(null)}>
        <DialogContent className="sm:max-w-[425px] p-0 border-none bg-transparent">
          {editingAdj && (
            <AdjustmentPanel
              playerId={playerId}
              currentOverall={currentOverall}
              currentAdjustment={currentAdjustment}
              adjustment={editingAdj}
              onSuccess={() => setEditingAdj(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingAdj} onOpenChange={(open) => !open && setDeletingAdj(null)}>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle size={18} />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="text-text-muted pt-2">
              Tem certeza que deseja excluir este ajuste? O overall do jogador será recalculado automaticamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="ghost"
              onClick={() => setDeletingAdj(null)}
              className="text-text-muted hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white border-none"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
