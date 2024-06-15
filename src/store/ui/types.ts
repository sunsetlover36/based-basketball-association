import { z } from 'zod';

import { CreateTeamData, type Player, PlayerTrainingMode } from '@/types';
import { createTeamSchema } from '@/routes/CreateTeam';

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
  dialogs: Record<DialogName, Dialog>;
}
