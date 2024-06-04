import { createBrowserRouter, Outlet } from 'react-router-dom';

import { Root } from './Root';
import { Main } from './Main';
import { Mint } from './Mint';
import { Burn } from './Burn';
import { Team } from './Team';
import { Games } from './Games';
import { Game } from './Game';
import { Leaderboard } from './Leaderboard';

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
        path: 'mint',
        element: <Mint />,
      },
      {
        path: 'burn',
        element: <Burn />,
      },
      {
        path: 'team',
        element: <Team />,
      },
      {
        path: 'games',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Games />,
          },
          {
            path: ':gameId',
            element: <Game />,
          },
        ],
      },
      {
        path: 'leaderboard',
        element: <Leaderboard />,
      },
    ],
  },
]);
