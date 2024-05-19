import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createUIStore } from './ui';

export const useStore = create()(
  immer((...args) =>
    [createUIStore].reduce(
      (store, creator) => ({
        ...store,
        ...creator(...args),
      }),
      {}
    )
  )
);

export * from './selectors';
