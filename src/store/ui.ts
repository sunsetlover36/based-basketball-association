export const createUIStore = (set) => ({
  gym: [],
  setGym: (gym) => {
    set((store) => {
      store.gym = gym;
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
    playerDialog: {
      isOpen: false,
      selectedPlayer: null,
      toggle: (isOpen) => {
        set((store) => {
          store.dialogs.playerDialog.isOpen = isOpen;
        });
      },
      setSelectedPlayer: (player) => {
        set((store) => {
          store.dialogs.playerDialog.selectedPlayer = player;
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
  },
});
