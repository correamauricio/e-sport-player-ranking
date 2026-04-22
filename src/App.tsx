import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Dashboard } from '@/pages/Dashboard';
import { TeamDetail } from '@/pages/TeamDetail';
import { PlayerDetail } from '@/pages/PlayerDetail';
import { TeamRankings } from '@/pages/rankings/TeamRankings';
import { PlayerRankings } from '@/pages/rankings/PlayerRankings';
import { DreamTeamPage } from '@/pages/rankings/DreamTeamPage';
import { Leaderboard } from '@/pages/rankings/Leaderboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="teams/:teamId" element={<TeamDetail />} />
          <Route path="teams/:teamId/:playerId" element={<PlayerDetail />} />
          <Route path="rankings" element={<Navigate to="/rankings/teams" replace />} />
          <Route path="rankings/teams" element={<TeamRankings />} />
          <Route path="rankings/players" element={<PlayerRankings />} />
          <Route path="rankings/dream-team" element={<DreamTeamPage />} />
          <Route path="rankings/leaderboard" element={<Leaderboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
