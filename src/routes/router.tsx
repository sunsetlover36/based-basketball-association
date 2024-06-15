import { createBrowserRouter, Outlet } from 'react-router-dom';

import { Root } from './Root';
import { Main } from './Main';
import { Team } from './Team';
import { TeamPlayer } from './Team/TeamPlayer';
import { Leaderboard } from './Leaderboard';
import { CreateTeam } from './CreateTeam';
import { InviteFriends } from './InviteFriends';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Root />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: 'create-team',
        element: <CreateTeam />,
      },
      {
        path: ':address/team',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Team />,
          },
          {
            path: ':playerIndex',
            element: <TeamPlayer />,
          },
        ],
      },
      {
        path: 'leaderboard',
        element: <Leaderboard />,
      },
      {
        path: 'invite',
        element: <InviteFriends />,
      },
    ],
  },
]);
