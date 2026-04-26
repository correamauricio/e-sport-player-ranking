import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Shield,
  Star,
  ListOrdered,
  Swords,
  Download,
  Upload,
} from "lucide-react"

import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useRankingStore } from "@/store/useRankingStore"

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/",
    exact: true,
  },
  {
    title: "Tier de Times",
    icon: Shield,
    url: "/rankings/teams",
  },
  {
    title: "Tier de Jogadores",
    icon: Star,
    url: "/rankings/players",
  },
  {
    title: "Dream Team",
    icon: Swords,
    url: "/rankings/dream-team",
  },
  {
    title: "Leaderboard",
    icon: ListOrdered,
    url: "/rankings/leaderboard",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const store = useRankingStore()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const activePeriod = store.dataPeriods.find(p => p.id === store.activePeriodId)

  const isActive = (url: string, exact = false) => {
    if (exact) return location.pathname === url
    return location.pathname.startsWith(url)
  }

  const handleExport = () => {
    if (!activePeriod) return
    const data = {
      label: activePeriod.label,
      players: activePeriod.players,
      teams: activePeriod.teams,
      activeGameId: activePeriod.gameId,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `e-sport-ranking-${activePeriod.gameId}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const data = JSON.parse(content)
        if (data.players && Array.isArray(data.players)) {
          const label = data.label || window.prompt('Nome do período:', file.name.replace('.json', ''))
          if (!label) return

          const teams = Array.isArray(data.teams) ? data.teams : (activePeriod?.teams ?? [])
          store.importData(label, data.players, teams, data.activeGameId)
        } else {
          alert('Formato de arquivo inválido.')
        }
      } catch (err) {
        console.error('Failed to import data:', err)
        alert('Erro ao importar arquivo JSON.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <Sidebar {...props}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <SidebarHeader>
        <VersionSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.url, item.exact)}
                    tooltip={item.title}
                    render={<Link to={item.url} />}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleExport} tooltip="Exportar Dados" render={<span />}>
              <Download className="size-4" />
              <span>Exportar Dados</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleImportClick} tooltip="Importar Dados" render={<span />}>
              <Upload className="size-4" />
              <span>Importar Dados</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-4 py-3 border-t mt-2">
          <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-medium">v1.0 • Mock Data</p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
