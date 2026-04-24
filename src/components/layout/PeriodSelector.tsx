import { useRankingStore } from '@/store/useRankingStore';
import { Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
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
      >
        <Calendar size={13} />
        <span>
          {activePeriod?.label ?? 'Selecionar período...'}
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {dataPeriods.map(period => (
            <SelectItem
              key={period.id}
              value={period.id}
            >
              {period.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
