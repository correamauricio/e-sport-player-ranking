import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  Star,
  ListOrdered,
  Swords,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { GameSelector } from './GameSelector';
import { cn } from '@/lib/utils';
import { useRankingStore } from '@/store/useRankingStore';

const navItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/',
    exact: true,
  },
  {
    label: 'Tier de Times',
    icon: Shield,
    to: '/rankings/teams',
  },
  {
    label: 'Tier de Jogadores',
    icon: Star,
    to: '/rankings/players',
  },
  {
    label: 'Dream Team',
    icon: Swords,
    to: '/rankings/dream-team',
  },
  {
    label: 'Leaderboard',
    icon: ListOrdered,
    to: '/rankings/leaderboard',
  },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const store = useRankingStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePeriod = store.dataPeriods.find(p => p.id === store.activePeriodId);

  const isActive = (to: string, exact = false) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const handleExport = () => {
    if (!activePeriod) return;
    const data = {
      label: activePeriod.label,
      players: activePeriod.players,
      teams: activePeriod.teams,
      activeGameId: activePeriod.gameId,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `e-sport-ranking-${activePeriod.gameId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        if (data.players && Array.isArray(data.players)) {
          const label = data.label || window.prompt('Nome do período:', file.name.replace('.json', ''));
          if (!label) return;

          const teams = Array.isArray(data.teams) ? data.teams : (activePeriod?.teams ?? []);
          store.importData(label, data.players, teams, data.activeGameId);
        } else {
          alert('Formato de arquivo inválido.');
        }
      } catch (err) {
        console.error('Failed to import data:', err);
        alert('Erro ao importar arquivo JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <aside
      className={cn(
        'relative flex flex-col h-full transition-all duration-300 ease-in-out glass-strong border-r border-white/8 z-20',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/8">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-linear-to-br from-brand to-brand-light flex items-center justify-center text-white font-bold text-sm shadow-lg">
          ⚡
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-tight">E-Sport</p>
            <p className="text-brand text-xs font-medium">Player Ranking</p>
          </div>
        )}
      </div>

      {/* Game selector */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-white/8">
          <GameSelector />
        </div>
      )}

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.to, item.exact);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                active
                  ? 'text-brand bg-brand/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              )}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Data management actions */}
      <div className="px-2 py-4 space-y-1 border-t border-white/8">
        <button
          onClick={handleExport}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200"
          title="Exportar Dados"
        >
          <Download size={18} className="shrink-0" />
          {!collapsed && <span>Exportar Dados</span>}
        </button>
        <button
          onClick={handleImportClick}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200"
          title="Importar Dados"
        >
          <Upload size={18} className="shrink-0" />
          {!collapsed && <span>Importar Dados</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-bg-elevated border border-border-strong flex items-center justify-center text-text-secondary hover:text-brand transition-colors duration-200 z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/8">
          <p className="text-text-muted text-xs">v1.0 • Mock Data</p>
        </div>
      )}
    </aside>
  );
}
