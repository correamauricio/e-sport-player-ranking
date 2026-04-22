import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  Users,
  Trophy,
  Star,
  ListOrdered,
  Swords,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { GameSelector } from './GameSelector';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/',
    exact: true,
  },
  {
    label: 'Times',
    icon: Shield,
    to: '/teams',
  },
  {
    label: 'Jogadores',
    icon: Users,
    to: '/players',
  },
  {
    label: 'Rankings',
    icon: Trophy,
    to: '/rankings',
    children: [
      { label: 'Tier de Times', icon: Shield, to: '/rankings/teams' },
      { label: 'Tier de Jogadores', icon: Star, to: '/rankings/players' },
      { label: 'Dream Team', icon: Swords, to: '/rankings/dream-team' },
      { label: 'Leaderboard', icon: ListOrdered, to: '/rankings/leaderboard' },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [rankingsOpen, setRankingsOpen] = useState(
    location.pathname.startsWith('/rankings')
  );

  const isActive = (to: string, exact = false) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <aside
      className={cn(
        'relative flex flex-col h-full transition-all duration-300 ease-in-out glass-strong border-r border-white/8 z-20',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
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

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.to, item.exact);

          if (item.children) {
            const anyChildActive = item.children.some(c => isActive(c.to));
            const open = rankingsOpen || anyChildActive;

            return (
              <div key={item.to}>
                <button
                  onClick={() => setRankingsOpen(o => !o)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                    anyChildActive
                      ? 'text-brand bg-brand/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronRight
                        size={14}
                        className={cn('transition-transform duration-200', open && 'rotate-90')}
                      />
                    </>
                  )}
                </button>

                {open && !collapsed && (
                  <div className="mt-1 ml-4 pl-3 border-l border-white/10 space-y-1">
                    {item.children.map(child => {
                      const ChildIcon = child.icon;
                      const childActive = isActive(child.to);
                      return (
                        <Link
                          key={child.to}
                          to={child.to}
                          className={cn(
                            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                            childActive
                              ? 'text-brand bg-brand/10'
                              : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                          )}
                        >
                          <ChildIcon size={14} className="shrink-0" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

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
