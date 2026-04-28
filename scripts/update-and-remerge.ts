import * as fs from 'fs';
import * as path from 'path';
import { calculateOverall } from '../src/lib/overall';
import { VALORANT } from '../src/data/games';

const datasetsDir = path.resolve('src/data/valorant/datasets');
const subdirs = fs.readdirSync(datasetsDir).filter(f => fs.statSync(path.join(datasetsDir, f)).isDirectory());

// Re-merge datasets
for (const subdir of subdirs) {
  const dirPath = path.join(datasetsDir, subdir);
  const extractedPath = path.join(dirPath, 'extracted.json');
  const manualInfoPath = path.join(dirPath, 'manual-info.json');
  const teamsManualInfoPath = path.join(dirPath, 'teams-manual-info.json');
  const mergedPath = path.join(dirPath, 'merged-data.json');

  if (!fs.existsSync(extractedPath)) {
    console.log(`Skipping ${subdir}, extracted.json not found.`);
    continue;
  }

  const extractedPlayers = JSON.parse(fs.readFileSync(extractedPath, 'utf-8'));
  let manualInfo: Record<string, any> = {};
  let teamsManualInfo: Record<string, any> = {};

  if (fs.existsSync(manualInfoPath)) {
    manualInfo = JSON.parse(fs.readFileSync(manualInfoPath, 'utf-8'));
  }

  if (fs.existsSync(teamsManualInfoPath)) {
    teamsManualInfo = JSON.parse(fs.readFileSync(teamsManualInfoPath, 'utf-8'));
  }

  const mergedPlayers = extractedPlayers.map((player: any) => {
    const manual = manualInfo[player.id] || {};
    return {
      ...player,
      realName: manual.realName || player.realName,
      photo: manual.photo || player.photo,
      role: manual.role || player.role,
      country: manual.country || player.country,
      countryFlag: manual.countryFlag || player.countryFlag,
      isIgl: manual.isIgl ?? false,
      overallBase: calculateOverall(player.stats, VALORANT.statDefinitions)
    };
  });

  const mergedTeams = Object.values(teamsManualInfo);

  let label = subdir;
  let createdAt = new Date().toISOString();
  if (fs.existsSync(mergedPath)) {
    try {
      const prev = JSON.parse(fs.readFileSync(mergedPath, 'utf-8'));
      if (prev.label) label = prev.label;
      if (prev.createdAt) createdAt = prev.createdAt;
    } catch (_) {}
  }

  const mergedData = {
    id: subdir,
    label,
    gameId: 'valorant',
    createdAt,
    players: mergedPlayers,
    teams: mergedTeams,
    activeGameId: 'valorant',
    exportedAt: new Date().toISOString()
  };

  fs.writeFileSync(mergedPath, JSON.stringify(mergedData, null, 2));
  console.log(`Re-merged dataset for ${subdir} -> ${mergedPath}`);
}
