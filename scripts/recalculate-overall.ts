import * as fs from 'fs';
import * as path from 'path';
import { calculateOverall } from '../src/lib/overall';
import { VALORANT } from '../src/data/games';

function processFile(filePath: string) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    if (!data.players || !Array.isArray(data.players)) {
      console.error(`[Error] Invalid JSON structure in ${filePath}: missing players array`);
      return;
    }

    console.log(`Recalculating overallBase for ${data.players.length} players in: ${path.basename(path.dirname(filePath))}`);

    data.players = data.players.map((player: any) => {
      player.overallBase = calculateOverall(player.stats, VALORANT.statDefinitions);
      return player;
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`[Success] Updated ${filePath}\n`);
  } catch (error) {
    console.error(`[Error] Processing file ${filePath}:`, error);
  }
}

const args = process.argv.slice(2);

if (args.length > 0) {
  // Process specific file
  const filePath = path.resolve(args[0]);
  if (fs.existsSync(filePath)) {
    processFile(filePath);
  } else {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
} else {
  // Process all datasets
  const datasetsDir = path.resolve('src/data/valorant/datasets');
  if (fs.existsSync(datasetsDir)) {
    const folders = fs.readdirSync(datasetsDir);
    let found = false;

    for (const folder of folders) {
      const filePath = path.join(datasetsDir, folder, 'merged-data.json');
      if (fs.existsSync(filePath)) {
        found = true;
        processFile(filePath);
      }
    }

    if (!found) {
      console.log('No merged-data.json files found in datasets directory.');
    }
  } else {
    console.error(`Datasets directory not found: ${datasetsDir}`);
    process.exit(1);
  }
}
