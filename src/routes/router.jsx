import { createBrowserRouter } from 'react-router-dom';

import { Root } from './Root';
import { Main } from './Main';
import { Mint } from './Mint';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Root />,
    children: [
      {
        path: '/',
        element: <Main />,
      },
      {
        path: '/mint',
        element: <Mint />,
      },
    ],
  },
]);
