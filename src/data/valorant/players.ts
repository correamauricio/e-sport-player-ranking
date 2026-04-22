import type { Player } from '@/types';
import { calculateOverall } from '@/lib/overall';
import { VALORANT } from '@/data/games';

const statDefs = VALORANT.statDefinitions;

function makePlayer(
  id: string,
  teamId: string,
  nickname: string,
  realName: string,
  role: string,
  country: string,
  countryFlag: string,
  stats: Player['stats'],
): Player {
  const overallBase = calculateOverall(stats, statDefs);
  return {
    id,
    teamId,
    gameId: 'valorant',
    nickname,
    realName,
    role,
    photo: '',
    country,
    countryFlag,
    stats,
    overallBase,
    overallAdjustment: 0,
    adjustmentHistory: [],
  };
}

// ─── LOUD ────────────────────────────────────────────────────────────────────
const loudPlayers: Player[] = [
  makePlayer('loud-aspas', 'loud', 'aspas', 'Erick Oliveira', 'duelist', 'Brazil', '🇧🇷', {
    acs: 272, hsPercent: 28.4, kast: 74.2, kills: 17.8, deaths: 13.5, assists: 4.2,
    fk: 2.8, fb: 1.5, kdRatio: 1.32, rating: 1.24,
  }),
  makePlayer('loud-saadhak', 'loud', 'saadhak', 'Matias Delipetro', 'igl', 'Argentina', '🇦🇷', {
    acs: 214, hsPercent: 22.1, kast: 76.8, kills: 14.2, deaths: 13.8, assists: 6.1,
    fk: 1.4, fb: 1.3, kdRatio: 1.03, rating: 1.08,
  }),
  makePlayer('loud-less', 'loud', 'Less', 'Felipe de Loyola', 'initiator', 'Brazil', '🇧🇷', {
    acs: 236, hsPercent: 32.6, kast: 78.1, kills: 15.6, deaths: 13.0, assists: 5.8,
    fk: 2.1, fb: 1.2, kdRatio: 1.20, rating: 1.17,
  }),
  makePlayer('loud-nzinn', 'loud', 'nzinn', 'Nicolas Doelling', 'sentinel', 'Brazil', '🇧🇷', {
    acs: 198, hsPercent: 24.8, kast: 75.5, kills: 13.1, deaths: 12.9, assists: 4.9,
    fk: 1.1, fb: 1.4, kdRatio: 1.02, rating: 1.04,
  }),
  makePlayer('loud-tuyz', 'loud', 'tuyz', 'Arthur Andrade', 'controller', 'Brazil', '🇧🇷', {
    acs: 208, hsPercent: 20.3, kast: 77.3, kills: 13.8, deaths: 13.2, assists: 5.5,
    fk: 1.3, fb: 1.1, kdRatio: 1.05, rating: 1.07,
  }),
];

// ─── Sentinels ────────────────────────────────────────────────────────────────
const sentinelsPlayers: Player[] = [
  makePlayer('sen-tenz', 'sentinels', 'TenZ', 'Tyson Ngo', 'duelist', 'Canada', '🇨🇦', {
    acs: 258, hsPercent: 38.2, kast: 71.5, kills: 16.9, deaths: 14.2, assists: 3.8,
    fk: 2.5, fb: 1.8, kdRatio: 1.19, rating: 1.19,
  }),
  makePlayer('sen-sacy', 'sentinels', 'sacy', 'Gustavo Rossi', 'initiator', 'Brazil', '🇧🇷', {
    acs: 231, hsPercent: 29.5, kast: 76.2, kills: 15.3, deaths: 13.1, assists: 5.7,
    fk: 2.0, fb: 1.3, kdRatio: 1.17, rating: 1.15,
  }),
  makePlayer('sen-zekken', 'sentinels', 'zekken', 'Zachary Patrone', 'duelist', 'United States', '🇺🇸', {
    acs: 249, hsPercent: 31.1, kast: 73.1, kills: 16.4, deaths: 13.9, assists: 4.1,
    fk: 2.3, fb: 1.6, kdRatio: 1.18, rating: 1.17,
  }),
  makePlayer('sen-johnqt', 'sentinels', 'johnqt', 'John Marku', 'igl', 'United States', '🇺🇸', {
    acs: 195, hsPercent: 21.8, kast: 74.9, kills: 13.0, deaths: 13.5, assists: 5.2,
    fk: 1.2, fb: 1.5, kdRatio: 0.96, rating: 1.01,
  }),
  makePlayer('sen-kannada', 'sentinels', 'Kannada', 'Alex Moula', 'sentinel', 'United States', '🇺🇸', {
    acs: 188, hsPercent: 19.2, kast: 73.6, kills: 12.4, deaths: 13.0, assists: 4.6,
    fk: 0.9, fb: 1.3, kdRatio: 0.95, rating: 0.99,
  }),
];

// ─── NaVi ─────────────────────────────────────────────────────────────────────
const naviPlayers: Player[] = [
  makePlayer('navi-chronicle', 'navi', 'Chronicle', 'Timur Khalilov', 'sentinel', 'Russia', '🇷🇺', {
    acs: 225, hsPercent: 26.3, kast: 76.9, kills: 14.9, deaths: 12.8, assists: 5.1,
    fk: 1.7, fb: 1.2, kdRatio: 1.16, rating: 1.13,
  }),
  makePlayer('navi-nAts', 'navi', 'nAts', 'Ayaz Akhmetshin', 'sentinel', 'Russia', '🇷🇺', {
    acs: 217, hsPercent: 31.4, kast: 78.5, kills: 14.3, deaths: 12.5, assists: 4.8,
    fk: 1.5, fb: 1.0, kdRatio: 1.14, rating: 1.12,
  }),
  makePlayer('navi-ANGE1', 'navi', 'ANGE1', 'Kyrylo Karasov', 'igl', 'Ukraine', '🇺🇦', {
    acs: 191, hsPercent: 18.9, kast: 75.1, kills: 12.7, deaths: 13.1, assists: 5.9,
    fk: 1.1, fb: 1.4, kdRatio: 0.97, rating: 1.02,
  }),
  makePlayer('navi-cNed', 'navi', 'cNed', 'Mehmet Yağız İpek', 'duelist', 'Turkey', '🇹🇷', {
    acs: 264, hsPercent: 41.7, kast: 70.8, kills: 17.4, deaths: 14.8, assists: 3.5,
    fk: 2.9, fb: 2.1, kdRatio: 1.18, rating: 1.20,
  }),
  makePlayer('navi-YEKINDAR', 'navi', 'YEKINDAR', 'Mareks Gaļinskis', 'initiator', 'Latvia', '🇱🇻', {
    acs: 248, hsPercent: 33.2, kast: 73.4, kills: 16.3, deaths: 14.1, assists: 4.7,
    fk: 2.6, fb: 1.9, kdRatio: 1.16, rating: 1.18,
  }),
];

// ─── FUT ──────────────────────────────────────────────────────────────────────
const futPlayers: Player[] = [
  makePlayer('fut-qw1', 'fut', 'qw1', 'Doğukan Güneş', 'duelist', 'Turkey', '🇹🇷', {
    acs: 261, hsPercent: 36.5, kast: 72.3, kills: 17.2, deaths: 14.4, assists: 3.9,
    fk: 2.7, fb: 1.8, kdRatio: 1.19, rating: 1.21,
  }),
  makePlayer('fut-muj', 'fut', 'muj', 'Muhammet Kan', 'initiator', 'Turkey', '🇹🇷', {
    acs: 222, hsPercent: 27.1, kast: 75.6, kills: 14.7, deaths: 13.3, assists: 5.4,
    fk: 1.8, fb: 1.3, kdRatio: 1.11, rating: 1.10,
  }),
  makePlayer('fut-benq', 'fut', 'benq', 'Berkay Kaya', 'controller', 'Turkey', '🇹🇷', {
    acs: 204, hsPercent: 21.6, kast: 76.4, kills: 13.5, deaths: 13.0, assists: 5.8,
    fk: 1.2, fb: 1.1, kdRatio: 1.04, rating: 1.06,
  }),
  makePlayer('fut-atlaw7', 'fut', 'atlaw7', 'Muhammed Talha Avcı', 'sentinel', 'Turkey', '🇹🇷', {
    acs: 193, hsPercent: 23.4, kast: 74.2, kills: 12.8, deaths: 13.0, assists: 4.7,
    fk: 1.0, fb: 1.3, kdRatio: 0.98, rating: 1.01,
  }),
  makePlayer('fut-mojj9', 'fut', 'mojj9', 'Mustafa Duman', 'igl', 'Turkey', '🇹🇷', {
    acs: 188, hsPercent: 19.8, kast: 73.5, kills: 12.5, deaths: 13.2, assists: 5.6,
    fk: 1.0, fb: 1.4, kdRatio: 0.95, rating: 1.00,
  }),
];

// ─── ZETA ─────────────────────────────────────────────────────────────────────
const zetaPlayers: Player[] = [
  makePlayer('zeta-laz', 'zeta', 'Laz', 'Ushida Koji', 'duelist', 'Japan', '🇯🇵', {
    acs: 252, hsPercent: 29.8, kast: 73.8, kills: 16.6, deaths: 14.0, assists: 4.0,
    fk: 2.4, fb: 1.7, kdRatio: 1.19, rating: 1.16,
  }),
  makePlayer('zeta-crow', 'zeta', 'crow', 'Maruoka Tomoaki', 'initiator', 'Japan', '🇯🇵', {
    acs: 218, hsPercent: 25.7, kast: 75.0, kills: 14.4, deaths: 13.5, assists: 5.2,
    fk: 1.6, fb: 1.2, kdRatio: 1.07, rating: 1.09,
  }),
  makePlayer('zeta-SugarZ3ro', 'zeta', 'SugarZ3ro', 'Watanabe Shota', 'controller', 'Japan', '🇯🇵', {
    acs: 197, hsPercent: 22.3, kast: 76.2, kills: 13.1, deaths: 12.9, assists: 5.9,
    fk: 1.1, fb: 1.0, kdRatio: 1.02, rating: 1.05,
  }),
  makePlayer('zeta-dep', 'zeta', 'dep', 'Yuiga Yuuma', 'sentinel', 'Japan', '🇯🇵', {
    acs: 228, hsPercent: 30.1, kast: 74.5, kills: 15.1, deaths: 13.2, assists: 4.5,
    fk: 1.9, fb: 1.3, kdRatio: 1.14, rating: 1.12,
  }),
  makePlayer('zeta-Mag', 'zeta', 'Mag', 'Kinouchi Tatsuki', 'igl', 'Japan', '🇯🇵', {
    acs: 183, hsPercent: 18.1, kast: 72.9, kills: 12.2, deaths: 13.4, assists: 5.3,
    fk: 0.9, fb: 1.5, kdRatio: 0.91, rating: 0.97,
  }),
];

// ─── Fnatic ──────────────────────────────────────────────────────────────────
const fnaticPlayers: Player[] = [
  makePlayer('fnc-alfajer', 'fnatic', 'Alfajer', 'Emir Ali Beder', 'duelist', 'Turkey', '🇹🇷', {
    acs: 283, hsPercent: 37.9, kast: 73.6, kills: 18.6, deaths: 13.3, assists: 4.3,
    fk: 3.1, fb: 1.5, kdRatio: 1.40, rating: 1.31,
  }),
  makePlayer('fnc-derke', 'fnatic', 'Derke', 'Nikita Sirmitev', 'duelist', 'Finland', '🇫🇮', {
    acs: 270, hsPercent: 35.4, kast: 72.1, kills: 17.8, deaths: 13.9, assists: 3.9,
    fk: 2.8, fb: 1.7, kdRatio: 1.28, rating: 1.26,
  }),
  makePlayer('fnc-boaster', 'fnatic', 'Boaster', 'Jake Howlett', 'igl', 'United Kingdom', '🇬🇧', {
    acs: 196, hsPercent: 20.2, kast: 76.5, kills: 13.0, deaths: 13.1, assists: 6.2,
    fk: 1.2, fb: 1.3, kdRatio: 0.99, rating: 1.06,
  }),
  makePlayer('fnc-Enzo', 'fnatic', 'Enzo', 'Enzo Mestari', 'initiator', 'France', '🇫🇷', {
    acs: 226, hsPercent: 28.6, kast: 77.0, kills: 15.0, deaths: 13.0, assists: 5.5,
    fk: 1.9, fb: 1.2, kdRatio: 1.15, rating: 1.13,
  }),
  makePlayer('fnc-Leo', 'fnatic', 'Leo', 'Leo Jannesson', 'controller', 'Sweden', '🇸🇪', {
    acs: 209, hsPercent: 23.0, kast: 77.8, kills: 13.9, deaths: 12.8, assists: 5.8,
    fk: 1.4, fb: 1.0, kdRatio: 1.09, rating: 1.09,
  }),
];

// ─── DRX ─────────────────────────────────────────────────────────────────────
const drxPlayers: Player[] = [
  makePlayer('drx-stax', 'drx', 'stax', 'Kim Gu-taek', 'igl', 'South Korea', '🇰🇷', {
    acs: 192, hsPercent: 22.5, kast: 76.1, kills: 12.8, deaths: 13.0, assists: 6.1,
    fk: 1.1, fb: 1.4, kdRatio: 0.98, rating: 1.03,
  }),
  makePlayer('drx-Rb', 'drx', 'Rb', 'Goo Sang-min', 'duelist', 'South Korea', '🇰🇷', {
    acs: 245, hsPercent: 33.7, kast: 72.4, kills: 16.2, deaths: 13.8, assists: 3.7,
    fk: 2.3, fb: 1.6, kdRatio: 1.17, rating: 1.15,
  }),
  makePlayer('drx-Zest', 'drx', 'Zest', 'Kim Ki-jung', 'initiator', 'South Korea', '🇰🇷', {
    acs: 234, hsPercent: 30.2, kast: 75.8, kills: 15.5, deaths: 13.2, assists: 5.3,
    fk: 2.0, fb: 1.3, kdRatio: 1.17, rating: 1.14,
  }),
  makePlayer('drx-MaKo', 'drx', 'MaKo', 'Kim Myeong-gwan', 'controller', 'South Korea', '🇰🇷', {
    acs: 206, hsPercent: 24.1, kast: 77.2, kills: 13.7, deaths: 12.9, assists: 5.7,
    fk: 1.3, fb: 1.1, kdRatio: 1.06, rating: 1.08,
  }),
  makePlayer('drx-foxy9', 'drx', 'foxy9', 'Jung Jae-sung', 'sentinel', 'South Korea', '🇰🇷', {
    acs: 199, hsPercent: 26.8, kast: 74.8, kills: 13.2, deaths: 13.1, assists: 4.4,
    fk: 1.2, fb: 1.2, kdRatio: 1.01, rating: 1.04,
  }),
];

// ─── Evil Geniuses ───────────────────────────────────────────────────────────
const egPlayers: Player[] = [
  makePlayer('eg-Demon1', 'evil-geniuses', 'Demon1', 'Max Mazanov', 'duelist', 'United States', '🇺🇸', {
    acs: 279, hsPercent: 39.4, kast: 71.8, kills: 18.3, deaths: 14.6, assists: 3.7,
    fk: 3.0, fb: 2.0, kdRatio: 1.25, rating: 1.27,
  }),
  makePlayer('eg-jawgemo', 'evil-geniuses', 'jawgemo', 'Alexander Mor', 'initiator', 'United States', '🇺🇸', {
    acs: 216, hsPercent: 25.6, kast: 74.2, kills: 14.3, deaths: 13.5, assists: 5.0,
    fk: 1.7, fb: 1.4, kdRatio: 1.06, rating: 1.08,
  }),
  makePlayer('eg-C0M', 'evil-geniuses', 'C0M', 'Corbin Lee', 'controller', 'United States', '🇺🇸', {
    acs: 203, hsPercent: 22.9, kast: 75.9, kills: 13.4, deaths: 13.1, assists: 5.6,
    fk: 1.2, fb: 1.2, kdRatio: 1.02, rating: 1.05,
  }),
  makePlayer('eg-Boostio', 'evil-geniuses', 'Boostio', 'Kelden Pupello', 'sentinel', 'United States', '🇺🇸', {
    acs: 220, hsPercent: 28.3, kast: 73.7, kills: 14.5, deaths: 13.4, assists: 4.6,
    fk: 1.8, fb: 1.4, kdRatio: 1.08, rating: 1.10,
  }),
  makePlayer('eg-Reformed', 'evil-geniuses', 'Reformed', 'Timothy Wesley', 'igl', 'United States', '🇺🇸', {
    acs: 186, hsPercent: 19.5, kast: 73.0, kills: 12.4, deaths: 13.5, assists: 5.4,
    fk: 0.9, fb: 1.5, kdRatio: 0.92, rating: 0.98,
  }),
];

export const VALORANT_PLAYERS: Player[] = [
  ...loudPlayers,
  ...sentinelsPlayers,
  ...naviPlayers,
  ...futPlayers,
  ...zetaPlayers,
  ...fnaticPlayers,
  ...drxPlayers,
  ...egPlayers,
];
