import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRankingStore } from '@/store/useRankingStore';
import { usePlayer } from '@/hooks/useGameData';
import { PlayerCard } from '@/components/players/PlayerCard';
import { AdjustmentPanel } from '@/components/players/AdjustmentPanel';
import { AdjustmentHistory } from '@/components/players/AdjustmentHistory';
import { ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function PlayerDetail() {
  const { teamId, playerId } = useParams<{ teamId: string; playerId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const teams = useRankingStore(s => s.teams);

  const player = usePlayer(playerId ?? '');
  const team = teams.find(t => t.id === teamId);

  if (!player || !team) {
    return <div className="text-center py-20 text-text-muted">Jogador não encontrado.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Back */}
      <Link
        to={`/teams/${teamId}`}
        className="flex items-center gap-2 text-text-muted text-sm hover:text-text-primary transition-colors w-fit"
      >
        <ArrowLeft size={14} />
        Voltar para {team.name}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
        {/* Left: Adjustment History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between glass p-4 rounded-xl border border-white/8">
            <h2 className="text-lg font-bold text-white">Ajustes</h2>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger render={
                <Button size="sm" className="bg-brand text-white hover:bg-brand-dark">
                  Novo ajuste
                </Button>
              } />
              <DialogContent className="sm:max-w-[425px] p-0 border-none bg-transparent">
                <AdjustmentPanel
                  playerId={player.id}
                  currentOverall={player.overall}
                  currentAdjustment={player.overallAdjustment}
                  onSuccess={() => setIsModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <AdjustmentHistory history={player.adjustmentHistory} />
        </div>

        {/* Right: Player Card */}
        <div className="flex justify-center lg:justify-end w-full lg:w-auto">
          <PlayerCard player={player} team={team} />
        </div>
      </div>
    </div>
  );
}
