import { WithImmer } from '../types';
import { type UIStore } from './types';

export type { UIStore };

export const createUIStore: WithImmer<UIStore> = (set) => ({
  selectedPlayer: null,
  setSelectedPlayer: (player) => {
    set((store) => {
      store.selectedPlayer = player;
    });
  },
  trainingMode: null,
  setTrainingMode: (mode) => {
    set((store) => {
      store.trainingMode = mode;
    });
  },
  teamData: null,
  setTeamData: (teamData) => {
    set((store) => {
      store.teamData = teamData;
    });
  },
  dialogs: {
    teamDialog: {
      isOpen: false,
      toggle: (isOpen) => {
        set((store) => {
          store.dialogs.teamDialog.isOpen = isOpen;
        });
      },
    },
    traitsDialog: {
      isOpen: false,
      toggle: (isOpen) => {
        set((store) => {
          store.dialogs.traitsDialog.isOpen = isOpen;
        });
      },
    },
    newMatchDialog: {
      isOpen: false,
      toggle: (isOpen) => {
        set((store) => {
          store.dialogs.newMatchDialog.isOpen = isOpen;
        });
      },
    },
    confirmTrainingDialog: {
      isOpen: false,
      toggle: (isOpen) => {
        set((store) => {
          store.dialogs.confirmTrainingDialog.isOpen = isOpen;
        });
      },
    },
    confirmTeamDialog: {
      isOpen: false,
      toggle: (isOpen) => {
        set((store) => {
          store.dialogs.confirmTeamDialog.isOpen = isOpen;
        });
      },
    },
  },
});
