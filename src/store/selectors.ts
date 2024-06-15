import { useStore } from '.';
import { DialogName } from './ui/types';

export const useDialog = (dialogName: DialogName) => {
  const { dialogs } = useStore();
  return dialogs[dialogName];
};
