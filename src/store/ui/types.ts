import { CreateTeamData, type Player, PlayerTrainingMode } from '@/types';

export enum DialogName {
  TEAM_DIALOG = 'teamDialog',
  TRAITS_DIALOG = 'traitsDialog',
  NEW_MATCH_DIALOG = 'newMatchDialog',
  CONFIRM_TRAINING_DIALOG = 'confirmTrainingDialog',
  CONFIRM_TEAM_DIALOG = 'confirmTeamDialog',
}

interface Dialog {
  isOpen: boolean;
  toggle: (isOpen: boolean) => void;
}

export interface UIStore {
  trainingMode: PlayerTrainingMode | null;
  setTrainingMode: (trainingMode: PlayerTrainingMode | null) => void;
  selectedPlayer: Player | null;
  setSelectedPlayer: (selectedPlayer: Player | null) => void;
  teamData: CreateTeamData | null;
  setTeamData: (teamData: CreateTeamData | null) => void;
  isConfettiVisible: boolean;
  toggleConfetti: (isConfettiVisible: boolean) => void;
  dialogs: Record<DialogName, Dialog>;
}
