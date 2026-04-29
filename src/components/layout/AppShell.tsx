import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from '@/components/app-sidebar';
import { PeriodSelector } from './PeriodSelector';
import { useRankingStore } from '@/store/useRankingStore';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex flex-wrap min-h-16 shrink-0 items-center justify-between gap-2 border-b px-4 py-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="my-auto h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden lg:inline-flex">
                  <BreadcrumbLink href="/">
                    E-Sport Ranking
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden lg:inline-flex" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-[150px] truncate sm:max-w-none">
                    {title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block text-right">
              <p className="text-xs text-muted-foreground leading-none tracking-wider">Período ativo</p>
            </div>
            <PeriodSelector />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
