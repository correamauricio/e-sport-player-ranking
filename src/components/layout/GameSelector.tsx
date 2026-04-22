import { useRankingStore } from '@/store/useRankingStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function GameSelector() {
  const activeGameId = useRankingStore(s => s.activeGameId);
  const games = useRankingStore(s => s.games);
  const setActiveGame = useRankingStore(s => s.setActiveGame);

  return (
    <Select
      value={activeGameId}
      onValueChange={(val) => {
        if (val !== null) setActiveGame(val);
      }}
    >
      <SelectTrigger className="w-full bg-bg-elevated border-border text-text-primary text-xs h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-bg-card border-border text-text-primary">
        {games.map(game => (
          <SelectItem key={game.id} value={game.id} className="text-xs">
            <span className="flex items-center gap-2">
              <span>{game.logo}</span>
              <span>{game.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
