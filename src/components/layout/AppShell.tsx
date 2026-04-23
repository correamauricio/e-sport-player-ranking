import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { PeriodSelector } from './PeriodSelector';
import { Bell } from 'lucide-react';
import { useRankingStore } from '@/store/useRankingStore';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/rankings/teams': 'Tier List — Times',
  '/rankings/players': 'Tier List — Jogadores',
  '/rankings/dream-team': 'Dream Team',
  '/rankings/leaderboard': 'Leaderboard',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/teams/') && pathname.split('/').length === 3) return 'Detalhe do Time';
  if (pathname.split('/').length === 4) return 'Detalhe do Jogador';
  return 'E-Sport Ranking';
}

export function AppShell() {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  const dataPeriods = useRankingStore(s => s.dataPeriods);
  const activePeriodId = useRankingStore(s => s.activePeriodId);
  const activePeriod = dataPeriods.find(p => p.id === activePeriodId);

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="shrink-0 flex items-center justify-between px-6 py-4 glass-strong border-b border-white/8 z-10">
          <div>
            <h1 className="text-lg font-bold text-text-primary">{title}</h1>
            <p className="text-xs text-text-muted mt-0.5">
              {activePeriod ? activePeriod.label : 'Nenhum período selecionado'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <PeriodSelector />
            <button className="relative w-8 h-8 rounded-lg bg-bg-elevated border border-border flex items-center justify-center text-text-secondary hover:text-brand hover:border-brand/30 transition-all duration-200">
              <Bell size={15} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
