import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import type { Player, PlayerStats, Team } from '../src/types/index';
import { calculateOverall } from '../src/lib/overall';
import { VALORANT } from '../src/data/games';

const COUNTRY_FLAGS: Record<string, { country: string, flag: string }> = {
  'mod-br': { country: 'brazil', flag: '🇧🇷' },
  'mod-ar': { country: 'argentina', flag: '🇦🇷' },
  'mod-us': { country: 'united-states', flag: '🇺🇸' },
  'mod-ca': { country: 'canada', flag: '🇨🇦' },
  'mod-ru': { country: 'russia', flag: '🇷🇺' },
  'mod-ua': { country: 'ukraine', flag: '🇺🇦' },
  'mod-tr': { country: 'turkey', flag: '🇹🇷' },
  'mod-lv': { country: 'latvia', flag: '🇱🇻' },
  'mod-jp': { country: 'japan', flag: '🇯🇵' },
  'mod-fi': { country: 'finland', flag: '🇫🇮' },
  'mod-gb': { country: 'united-kingdom', flag: '🇬🇧' },
  'mod-se': { country: 'sweden', flag: '🇸🇪' },
  'mod-kr': { country: 'south-korea', flag: '🇰🇷' },
  'mod-cl': { country: 'chile', flag: '🇨🇱' },
};

const AGENT_ROLES: Record<string, string> = {
  jett: 'duelist', raze: 'duelist', phoenix: 'duelist', reyna: 'duelist', yoru: 'duelist', neon: 'duelist', iso: 'duelist',
  sova: 'initiator', breach: 'initiator', skye: 'initiator', kayo: 'initiator', fade: 'initiator', gekko: 'initiator', tejo: 'initiator',
  killjoy: 'sentinel', cypher: 'sentinel', sage: 'sentinel', chamber: 'sentinel', deadlock: 'sentinel', vyse: 'sentinel',
  omen: 'controller', brimstone: 'controller', viper: 'sentinel', astra: 'controller', harbor: 'controller', clove: 'controller',
};

function parseVlrStats(filePath: string): Player[] {
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);
  
  const players: Player[] = [];
  
  $('table.mod-stats tbody tr').each((i, el) => {
    const $row = $(el);
    const $tds = $row.find('td');
    
    // Player / Team
    const $playerTd = $tds.eq(0);
    const nickname = $playerTd.find('.text-of').text().trim();
    const team = $playerTd.find('.stats-player-country').text().trim().toLowerCase();
    
    // Country
    let country = 'Unknown';
    let countryFlag = '🏳️';
    const flagClass = $playerTd.find('i.flag').attr('class') || '';
    const match = flagClass.match(/mod-[a-z]{2}/);
    if (match && COUNTRY_FLAGS[match[0]]) {
      country = COUNTRY_FLAGS[match[0]].country;
      countryFlag = COUNTRY_FLAGS[match[0]].flag;
    }
    
    // Agents & Role
    const $agentsTd = $tds.eq(1);
    const agents: string[] = [];
    $agentsTd.find('img').each((_, img) => {
      const src = $(img).attr('src') || '';
      const parts = src.split('/');
      const agentFile = parts[parts.length - 1];
      if (agentFile) {
        agents.push(agentFile.replace('.png', ''));
      }
    });
    
    let role = 'flex';
    if (agents.length > 0) {
      role = AGENT_ROLES[agents[0]] || 'flex';
    }
    
    // Extract text values safely
    const getText = (index: number) => $tds.eq(index).text().trim().replace(/%/g, '');
    const getFloat = (index: number) => parseFloat(getText(index)) || 0;
    const getInt = (index: number) => parseInt(getText(index), 10) || 0;
    
    const rounds = getInt(2);
    const rating = getFloat(3);
    const acs = getFloat(4);
    const kdRatio = getFloat(5);
    const kast = getFloat(6);
    const hsPercent = getFloat(12);
    
    // Totals
    const killsTotal = getInt(16);
    const deathsTotal = getInt(17);
    const assistsTotal = getInt(18);
    const fkTotal = getInt(19);
    const fbTotal = getInt(20);
    
    const maps = rounds > 0 ? rounds / 21 : 1;
    
    const stats: PlayerStats = {
      acs,
      hsPercent,
      kast,
      kills: Math.round(killsTotal / maps) || 0,
      deaths: Math.round(deathsTotal / maps) || 0,
      assists: Math.round(assistsTotal / maps) || 0,
      fk: Math.round(fkTotal / maps) || 0,
      fb: Math.round(fbTotal / maps) || 0,
      kdRatio,
      rating
    };
    
    players.push({
      id: `${team}-${nickname}`.toLowerCase(),
      teamId: team,
      gameId: 'valorant',
      nickname,
      realName: '',
      role,
      photo: '',
      country,
      countryFlag,
      stats,
      overallBase: 0, // will compute later
      overallAdjustment: 0,
      adjustmentHistory: []
    });
  });
  
  return players;
}

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: npx tsx scripts/parse-vlr.ts <path-to-html> <output-directory> "<dataset-label>"');
  process.exit(1);
}

const htmlFilePath = args[0];
const outputDir = path.resolve(args[1]);
const datasetLabel = args[2];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Extract base players
const extractedPlayers = parseVlrStats(htmlFilePath);

// Write raw extracted data
const extractedPath = path.join(outputDir, 'extracted.json');
fs.writeFileSync(extractedPath, JSON.stringify(extractedPlayers, null, 2));

// 2. Read or create manual-info.json for players
const manualInfoPath = path.join(outputDir, 'manual-info.json');
let manualInfo: Record<string, Partial<Player>> = {};

if (fs.existsSync(manualInfoPath)) {
  manualInfo = JSON.parse(fs.readFileSync(manualInfoPath, 'utf-8'));
} else {
  console.log('No manual-info.json found. Creating a template...');
}

let manualUpdated = false;
for (const player of extractedPlayers) {
  if (!manualInfo[player.id]) {
    manualUpdated = true;
    manualInfo[player.id] = {
      realName: '',
      photo: '',
      role: player.role,
      country: player.country,
      countryFlag: player.countryFlag,
    };
  }
}

if (manualUpdated || !fs.existsSync(manualInfoPath)) {
  fs.writeFileSync(manualInfoPath, JSON.stringify(manualInfo, null, 2));
}

// 3. Read or create teams-manual-info.json
const teamsManualInfoPath = path.join(outputDir, 'teams-manual-info.json');
let manualTeams: Record<string, Partial<Team>> = {};

if (fs.existsSync(teamsManualInfoPath)) {
  manualTeams = JSON.parse(fs.readFileSync(teamsManualInfoPath, 'utf-8'));
} else {
  console.log('No teams-manual-info.json found. Creating a template...');
}

const uniqueTeamIds = Array.from(new Set(extractedPlayers.map(p => p.teamId)));
let teamsUpdated = false;

for (const tid of uniqueTeamIds) {
  if (!manualTeams[tid]) {
    teamsUpdated = true;
    manualTeams[tid] = {
      id: tid,
      gameId: 'valorant',
      name: tid.toUpperCase(),
      shortName: tid.toUpperCase(),
      logo: '🛡️',
      region: 'Americas', // Default, can be edited
      country: 'Unknown',
      countryFlag: '🏳️'
    };
  }
}

if (teamsUpdated || !fs.existsSync(teamsManualInfoPath)) {
  fs.writeFileSync(teamsManualInfoPath, JSON.stringify(manualTeams, null, 2));
}


// 4. Merge data and generate merged.json
const mergedPlayers = extractedPlayers.map((player) => {
  const manual = manualInfo[player.id] || {};
  
  const merged: Player = {
    ...player,
    realName: manual.realName ?? player.realName,
    photo: manual.photo ?? player.photo,
    role: manual.role ?? player.role,
    country: manual.country ?? player.country,
    countryFlag: manual.countryFlag ?? player.countryFlag,
  };
  
  merged.overallBase = calculateOverall(merged.stats, VALORANT.statDefinitions);
  return merged;
});

const mergedTeams = Object.values(manualTeams) as Team[];

const mergedData = {
  id: path.basename(outputDir),
  label: datasetLabel,
  gameId: 'valorant',
  createdAt: new Date().toISOString(),
  players: mergedPlayers,
  teams: mergedTeams,
  activeGameId: 'valorant',
  exportedAt: new Date().toISOString()
};

const mergedPath = path.join(outputDir, 'merged-data.json');
fs.writeFileSync(mergedPath, JSON.stringify(mergedData, null, 2));

console.log(`Process complete.`);
console.log(`Extracted: ${extractedPath}`);
console.log(`Player Info Template: ${manualInfoPath}`);
console.log(`Team Info Template: ${teamsManualInfoPath}`);
console.log(`Final Merged Data: ${mergedPath}`);
