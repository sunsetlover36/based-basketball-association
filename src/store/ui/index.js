export const createUIStore = (set) => ({
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
  },
});
