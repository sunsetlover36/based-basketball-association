import { PlayerTrainingMode } from '@/types';

export interface CreateTeamData {
  teamName: string;
  teamLogo: File;
  playerFullName: string;
  playerNumber: string;
  playerCountry: string;
  playerNickname: string;
}

export interface TrainPlayerData {
  playerId: string;
  trainingMode: PlayerTrainingMode;
}

export interface CheerPlayerData {
  playerId: string;
  address: string;
}

export interface EditTeamLogoData {
  teamLogo: File;
}
