"use client"


import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRankingStore } from "@/store/useRankingStore"

export function VersionSwitcher() {
  const activeGameId = useRankingStore((s) => s.activeGameId)
  const games = useRankingStore((s) => s.games)
  const setActiveGame = useRankingStore((s) => s.setActiveGame)

  const activeGame = games.find((g) => g.id === activeGameId) || games[0]

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                render={<span />}
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg">{activeGame?.logo}</span>
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold text-foreground">E-Sport Ranking</span>
              <span className="text-xs text-muted-foreground">{activeGame?.name}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
            {games.map((game) => (
              <DropdownMenuItem
                key={game.id}
                onSelect={() => setActiveGame(game.id)}
                className="gap-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm bg-muted text-xs">
                  {game.logo}
                </div>
                {game.name}
                {game.id === activeGameId && (
                  <CheckIcon className="ml-auto size-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
