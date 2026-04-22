import { useState } from 'react';
import { Minus, Plus, Check, AlertCircle } from 'lucide-react';
import { useRankingStore } from '@/store/useRankingStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Adjustment } from '@/types';

interface AdjustmentPanelProps {
  playerId: string;
  currentOverall: number;
  currentAdjustment: number;
  adjustment?: Adjustment; // If provided, we are editing
  onSuccess?: () => void;
  className?: string;
}

const QUICK_DELTAS = [-5, -3, -1, +1, +3, +5];

export function AdjustmentPanel({
  playerId,
  currentOverall,
  currentAdjustment,
  adjustment,
  onSuccess,
  className,
}: AdjustmentPanelProps) {
  const applyAdjustment = useRankingStore(s => s.applyAdjustment);
  const editAdjustment = useRankingStore(s => s.editAdjustment);

  const [delta, setDelta] = useState<number>(adjustment?.delta ?? 0);
  const [justification, setJustification] = useState(adjustment?.justification ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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
    <div className={cn('glass rounded-xl p-5 space-y-5', className)}>
      <div>
        <h3 className="text-text-primary font-semibold text-sm">Ajuste Manual de Overall</h3>
        <p className="text-text-muted text-xs mt-0.5">
          Ajuste acumulado atual:{' '}
          <span className={cn(
            'font-semibold',
            currentAdjustment > 0 ? 'text-emerald-400' : currentAdjustment < 0 ? 'text-red-400' : 'text-text-muted'
          )}>
            {currentAdjustment > 0 ? '+' : ''}{currentAdjustment}
          </span>
        </p>
      </div>

      {/* Quick select */}
      <div>
        <p className="text-text-muted text-xs mb-2">Selecione o ajuste:</p>
        <div className="flex gap-2 flex-wrap">
          {QUICK_DELTAS.map(d => (
            <button
              key={d}
              onClick={() => setDelta(prev => prev === d ? 0 : d)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 border',
                delta === d
                  ? d > 0
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-red-500/20 border-red-500/50 text-red-400'
                  : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20 hover:text-text-primary'
              )}
            >
              {d > 0 ? '+' : ''}{d}
            </button>
          ))}
        </div>
      </div>

      {/* Custom delta */}
      <div>
        <p className="text-text-muted text-xs mb-2">Ou valor personalizado:</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDelta(d => Math.max(-50, d - 1))}
            className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Minus size={14} />
          </button>
          <div className="flex-1 text-center">
            <span className={cn(
              'text-2xl font-black',
              delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-red-400' : 'text-text-muted'
            )}>
              {delta > 0 ? '+' : ''}{delta}
            </span>
            <p className="text-text-muted text-[10px]">
              Preview: <span className="text-text-primary font-semibold">{previewOverall}</span>
            </p>
          </div>
          <button
            onClick={() => setDelta(d => Math.min(50, d + 1))}
            className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Justification */}
      <div>
        <label className="text-text-muted text-xs mb-2 block">
          Justificativa <span className="text-brand">*</span>
        </label>
        <textarea
          value={justification}
          onChange={e => setJustification(e.target.value)}
          placeholder={`Descreva o motivo do ajuste (mínimo ${MIN_CHARS} caracteres)...`}
          rows={3}
          className={cn(
            'w-full bg-bg-elevated border text-text-primary text-sm rounded-lg p-3 resize-none',
            'placeholder:text-text-muted focus:outline-none focus:ring-1 transition-all duration-200',
            error ? 'border-red-500/50 focus:ring-red-500/30' : 'border-border focus:border-border-strong focus:ring-white/10'
          )}
        />
        <div className="flex items-center justify-between mt-1">
          {error ? (
            <p className="text-red-400 text-xs flex items-center gap-1">
              <AlertCircle size={10} /> {error}
            </p>
          ) : (
            <p className="text-text-muted text-xs">{justification.length}/{MIN_CHARS} caracteres mínimos</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={submitted}
        className={cn(
          'w-full font-semibold transition-all duration-300',
          submitted
            ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
            : 'bg-brand hover:bg-brand-dark text-white'
        )}
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
    </div>
  );
}
