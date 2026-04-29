import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shouldInvertTeamLogo(teamName: string | undefined): boolean {
  if (!teamName) return false;
  const normalized = teamName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const darkLogos = ['envy', '100 thieves', 'evil geniuses', 'nrg', 'mibr'];
  return darkLogos.includes(normalized);
}
