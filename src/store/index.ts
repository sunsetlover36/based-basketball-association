import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export { type WithImmer } from './types';

import { type Store } from './types';
import { createUIStore } from './ui';

export const useStore = create(
  immer<Store>((...args) =>
    [createUIStore].reduce(
      (store, creator) => ({
        ...store,
        ...creator(...args),
      }),
      {} as Store
    )
  )
);

export * from './selectors';
