import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Adjustment } from '@/types';
import { cn } from '@/lib/utils';
import { Clock, Edit2, Trash2, Trash2Icon } from 'lucide-react';
import { useRankingStore } from '@/store/useRankingStore';

import { Button } from '@/components/ui/button';
import { AdjustmentPanel } from './AdjustmentPanel';
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia } from '@/components/ui/item';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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

  if (history.length === 0) {
    return (
      <div className={cn('bg-card rounded-xl border p-5 text-center', className)}>
        <p className="text-muted-foreground text-sm">Nenhum ajuste manual ainda.</p>
      </div>
    );
  }


  return (
    <div className={cn('bg-card rounded-xl border p-5 space-y-3', className)}>
      <h3 className="text-foreground font-semibold text-sm flex items-center gap-2">
        <Clock size={14} className="text-primary" />
        Histórico de Ajustes ({history.length})
      </h3>

      <ItemGroup>
        {history.map(adj => (
          <Item
            key={adj.id}
            variant="muted"
            role="listitem"
          >
            <ItemMedia
              className={cn(
                'shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm',
                adj.delta > 0
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-red-500/15 text-red-400'
              )}
            >
              {adj.delta > 0 ? '+' : ''}{adj.delta}
            </ItemMedia>

            {/* Content */}
            <ItemContent className="flex-1 min-w-0 pr-16">
              <p className="text-foreground text-xs font-medium leading-snug line-clamp-2">
                {adj.justification}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-muted-foreground text-[10px]">{adj.author}</span>
                <span className="text-muted-foreground text-[10px]">•</span>
                <span className="text-muted-foreground text-[10px]">
                  {format(new Date(adj.createdAt), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            </ItemContent>

            {/* Actions */}
            <ItemActions>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setEditingAdj(adj)}
              >
                <Edit2 />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                  />
                }>
                    <Trash2 />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                      <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Excluir ajuste</AlertDialogTitle>
                    <AlertDialogDescription>
                      Não será possível recuperar esse ajuste, tem certeza que deseja exclui-lo? O overall do jogador será recalculado automaticamente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancelar</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={() => deleteAdjustment(playerId, adj.id)}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>

      {/* Edit Dialog */}
      <AdjustmentPanel
        open={!!editingAdj}
        onOpenChange={(open) => !open && setEditingAdj(null)}
        playerId={playerId}
        currentOverall={currentOverall}
        currentAdjustment={currentAdjustment}
        adjustment={editingAdj ?? undefined}
        onSuccess={() => setEditingAdj(null)}
      />

    </div>
  );
}
