import { useParams, Link } from 'react-router-dom';
import { useRankingStore } from '@/store/useRankingStore';
import { usePlayer, useActiveGame } from '@/hooks/useGameData';
import { OverallBadge } from '@/components/players/OverallBadge';
import { StatsGrid } from '@/components/players/StatsGrid';
import { AdjustmentPanel } from '@/components/players/AdjustmentPanel';
import { AdjustmentHistory } from '@/components/players/AdjustmentHistory';
import { getTierColor } from '@/lib/overall';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function getRoleLabel(role: string, roles: { id: string; label: string }[]): string {
  return roles.find(r => r.id === role)?.label ?? role;
}

function getRoleColor(role: string): string {
  const map: Record<string, string> = {
    duelist: '#ef4444',
    initiator: '#8b5cf6',
    controller: '#3b82f6',
    sentinel: '#10b981',
    igl: '#f59e0b',
  };
  return map[role] ?? '#9191ab';
}

export function PlayerDetail() {
  const { teamId, playerId } = useParams<{ teamId: string; playerId: string }>();
  const teams = useRankingStore(s => s.teams);
  const activeGame = useActiveGame();

  const player = usePlayer(playerId ?? '');
  const team = teams.find(t => t.id === teamId);

  if (!player || !team) {
    return <div className="text-center py-20 text-text-muted">Jogador não encontrado.</div>;
  }

  const tierColor = getTierColor(player.tier);
  const roleColor = getRoleColor(player.role);
  const roleLabel = getRoleLabel(player.role, activeGame.roles);

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

      {/* Player header */}
      <div
        className="relative overflow-hidden rounded-2xl glass border p-6"
        style={{ borderColor: `${tierColor}30` }}
      >
        <div
          className="absolute inset-0 opacity-8"
          style={{
            background: `radial-gradient(ellipse at 10% 50%, ${tierColor} 0%, transparent 50%), radial-gradient(ellipse at 90% 50%, ${roleColor} 0%, transparent 50%)`,
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, ${tierColor}, ${roleColor}, transparent)` }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl font-black shrink-0"
            style={{ background: `${roleColor}20`, border: `1px solid ${roleColor}40` }}
          >
            {player.nickname[0].toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wider"
                style={{ background: `${roleColor}20`, color: roleColor, border: `1px solid ${roleColor}30` }}
              >
                {roleLabel}
              </span>
              <span className="text-text-muted text-sm">{player.countryFlag} {player.country}</span>
              <span className="text-text-muted text-sm">•</span>
              <Link to={`/teams/${team.id}`} className="text-text-muted text-sm hover:text-brand transition-colors">
                {team.logo} {team.name}
              </Link>
            </div>
            <h2 className="text-4xl font-black text-white">{player.nickname}</h2>
            <p className="text-text-secondary text-sm mt-1">{player.realName}</p>

            {player.overallAdjustment !== 0 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-text-muted text-xs">Base: {player.overallBase}</span>
                <span className="text-text-muted text-xs">→</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    player.overallAdjustment > 0
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-red-500/15 text-red-400'
                  }`}
                >
                  {player.overallAdjustment > 0 ? '+' : ''}{player.overallAdjustment} ajuste
                </span>
              </div>
            )}
          </div>

          {/* Overall */}
          <OverallBadge overall={player.overall} tier={player.tier} size="xl" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="stats">
        <TabsList className="glass border border-white/8 bg-transparent">
          <TabsTrigger value="stats" className="data-[state=active]:bg-brand data-[state=active]:text-white text-text-secondary">
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="adjust" className="data-[state=active]:bg-brand data-[state=active]:text-white text-text-secondary">
            Ajustar Overall
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-brand data-[state=active]:text-white text-text-secondary">
            Histórico{player.adjustmentHistory.length > 0 ? ` (${player.adjustmentHistory.length})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-4">
          <StatsGrid
            stats={player.stats}
            statDefs={activeGame.statDefinitions}
          />
        </TabsContent>

        <TabsContent value="adjust" className="mt-4">
          <AdjustmentPanel
            playerId={player.id}
            currentOverall={player.overall}
            currentAdjustment={player.overallAdjustment}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <AdjustmentHistory history={player.adjustmentHistory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
