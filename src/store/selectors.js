import { useStore } from '.';

export const useDialog = (dialogName) => {
  const { dialogs } = useStore();
  return dialogs[dialogName];
};
