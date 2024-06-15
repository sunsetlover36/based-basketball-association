import { StateCreator } from 'zustand';

import { type UIStore } from './ui';

export type Store = UIStore;

// Slice of global store with immer
export type WithImmer<T> = StateCreator<
  Store,
  [['zustand/immer', never]],
  [],
  T
>;
