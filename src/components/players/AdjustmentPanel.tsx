import { useState, useEffect } from 'react';
import { Minus, Plus, Check, AlertCircle } from 'lucide-react';
import { useRankingStore } from '@/store/useRankingStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import type { Adjustment } from '@/types';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  FieldSet,
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

interface AdjustmentPanelProps {
  playerId: string;
  currentOverall: number;
  currentAdjustment: number;
  adjustment?: Adjustment; // If provided, we are editing
  onSuccess?: () => void;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
}

const QUICK_DELTAS = [-5, -3, -1, +1, +3, +5];

export function AdjustmentPanel({
  playerId,
  currentOverall,
  currentAdjustment,
  adjustment,
  onSuccess,
  open,
  onOpenChange,
  trigger,
}: AdjustmentPanelProps) {
  const applyAdjustment = useRankingStore(s => s.applyAdjustment);
  const editAdjustment = useRankingStore(s => s.editAdjustment);

  const [delta, setDelta] = useState<number>(adjustment?.delta ?? 0);
  const [justification, setJustification] = useState(adjustment?.justification ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Reset state when modal opens or adjustment changes
  useEffect(() => {
    if (open) {
      setDelta(adjustment?.delta ?? 0);
      setJustification(adjustment?.justification ?? '');
      setSubmitted(false);
      setError('');
    }
  }, [open, adjustment]);

  // When editing, the base overall is currentOverall minus the current delta of this adjustment
  const baseOverall = adjustment ? currentOverall - adjustment.delta : currentOverall;
  const previewOverall = Math.max(0, Math.min(100, baseOverall + delta));
  
  const MIN_CHARS = 3;
  const isValid = delta !== 0 && justification.trim().length >= MIN_CHARS;

  const handleSubmit = () => {
    if (!isValid) {
      if (delta === 0) setError('Selecione um valor de ajuste.');
      else setError(`A justificativa deve ter ao menos ${MIN_CHARS} caracteres.`);
      return;
    }
    setError('');
    
    if (adjustment) {
      editAdjustment(playerId, adjustment.id, delta, justification.trim());
    } else {
      applyAdjustment(playerId, delta, justification.trim());
    }

    if (!adjustment) {
      setDelta(0);
      setJustification('');
    }
    
    setSubmitted(true);
    onSuccess?.();
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent>
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Ajuste Manual de Overall</DialogTitle>
            <DialogDescription>
              Ajuste acumulado atual:{' '}
              <span className={cn(
                'font-semibold',
                currentAdjustment > 0 ? 'text-emerald-700' : currentAdjustment < 0 ? 'text-red-700' : 'text-muted-foreground'
              )}>
                {currentAdjustment > 0 ? '+' : ''}{currentAdjustment}
              </span>
            </DialogDescription>
          </DialogHeader>

          <FieldSet>
            <FieldGroup>
              {/* Custom delta */}
              <Field className="items-center">
                <FieldLabel className="self-center">Valor do Ajuste</FieldLabel>
                <div className="flex items-center gap-3 w-full">
                  <Button
                    type="button"
                    onClick={() => setDelta(d => Math.max(-50, d - 1))}
                    variant="secondary"
                    size="icon"
                  >
                    <Minus />
                  </Button>
                  <div className="flex-1 text-center">
                    <span className={cn(
                      'text-2xl font-black',
                  delta > 0 ? 'text-emerald-700' : delta < 0 ? 'text-red-700' : 'text-muted-foreground'
                    )}>
                      {delta > 0 ? '+' : ''}{delta}
                    </span>
                    <FieldDescription className="text-center">
                      Preview: <span className="text-foreground font-semibold">{previewOverall}</span>
                    </FieldDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setDelta(d => Math.min(50, d + 1))}
                    variant="secondary"
                    size="icon"
                  >
                    <Plus />
                  </Button>
                </div>
              </Field>

              {/* Quick select */}
              <Field>
                <FieldLabel className="sr-only">Atalhos de Ajuste</FieldLabel>
                <ButtonGroup className="w-full">
                  {QUICK_DELTAS.map(d => (
                    <Button
                      type="button"
                      key={d}
                      variant="outline"
                      onClick={() => setDelta(prev => prev === d ? 0 : d)}
                      className={cn(
                        'flex-1 font-bold transition-all duration-200',
                        delta === d
                          ? d > 0
                            ? 'bg-emerald-500/20 border-emerald-500/20 text-emerald-700 hover:text-emerald-700 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 border-red-500/20 text-red-700 hover:text-red-700 hover:bg-red-500/30'
                          : ''
                      )}
                    >
                      {d > 0 ? '+' : ''}{d}
                    </Button>
                  ))}
                </ButtonGroup>
              </Field>

              {/* Justification */}
              <Field data-invalid={!!error}>
                <FieldLabel>
                  Justificativa <span className="text-primary">*</span>
                </FieldLabel>
                <Textarea
                  value={justification}
                  onChange={e => setJustification(e.target.value)}
                  placeholder={`Descreva o motivo do ajuste (mínimo ${MIN_CHARS} caracteres)...`}
                  rows={3}
                  className="resize-none"
                  aria-invalid={!!error}
                />
                <div className="flex items-center justify-between mt-1">
                  {error ? (
                    <FieldError className="flex items-center gap-2">
                      <AlertCircle size={16} />{error}
                    </FieldError>
                  ) : (
                    <FieldDescription>
                      {justification.length}/{MIN_CHARS} caracteres mínimos
                    </FieldDescription>
                  )}
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter>
            {/* Submit */}
            <DialogClose render={<Button variant="outline">Cancelar</Button>} />
            <Button
              type="submit"
              disabled={submitted}
            >
              {submitted ? (
                <span className="flex items-center gap-2">
                  <Check size={15} />
                  {adjustment ? 'Alterações salvas!' : 'Ajuste aplicado com sucesso!'}
                </span>
              ) : (
                adjustment ? 'Salvar Alterações' : 'Aplicar Ajuste'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
