import { useRankingStore } from '@/store/useRankingStore';
import { Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

export function PeriodSelector() {
  const dataPeriods = useRankingStore(s => s.dataPeriods);
  const activePeriodId = useRankingStore(s => s.activePeriodId);
  const setActivePeriod = useRankingStore(s => s.setActivePeriod);

  if (dataPeriods.length === 0) return null;

  const activePeriod = dataPeriods.find(p => p.id === activePeriodId);

  return (
    <Select value={activePeriodId} onValueChange={setActivePeriod}>
      <SelectTrigger
        id="period-selector"
        className="w-[280px] bg-bg-elevated border-border text-text-primary text-xs h-8 gap-2"
      >
        <Calendar size={13} className="shrink-0 text-brand" />
        <span className="flex flex-1 text-left truncate">
          {activePeriod?.label ?? 'Selecionar período...'}
        </span>
      </SelectTrigger>
      <SelectContent className="bg-bg-card border-border text-text-primary">
        {dataPeriods.map(period => (
          <SelectItem
            key={period.id}
            value={period.id}
            className="text-xs"
          >
            <span className="flex items-center gap-2">
              <span className="font-medium">{period.label}</span>
              <span className="text-text-muted text-[10px]">
                ({period.players.length})
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
