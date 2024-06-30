export enum PlayerTrainingMode {
  ATTACK,
  DEFENSE,
  MEDITATION,
  CARDIO,
  STRENGTH,
}
export interface PlayerTraining {
  mode: PlayerTrainingMode;
  startDate: string;
  endDate: string;
  traitsGained?: PlayerTraits;
  traitsApplied?: boolean;
  fans: string[];
}
export enum PlayerSpecialTrait {
  CLUTCH_PLAYER,
  PLAYMAKER,
  ENERGIZER,
  SHARPSHOOTER,
  GLADIATOR,
  CRITIC,
  CRUMBLER,
  FRAGILE,
  HOTHEAD,
  LONE_WOLF,
  SELFISH,
}
export interface PlayerTraits {
  shooting: number;
  dribbling: number;
  passing: number;
  blocking: number;
  stealing: number;
  speed: number;
  strength: number;
  stamina: number;
  injury: number;
  determination: number;
  reactionTime: number;
  specialTraits: PlayerSpecialTrait[];
}
export interface Player {
  _id: string;
  fullName: string;
  nickname?: string;
  number?: string;
  country: string;
  traits: PlayerTraits;
  trainings: PlayerTraining[];
}
export interface Team {
  _id: string;
  createdAt: Date;
  name: string;
  logo: string;
  players: Player[];
}
export interface UserBoost {
  boostType: 'og' | 'coach';
  claimed: boolean;
}
export interface User {
  joinedAt: Date;
  address: string;
  smartAccountAddress: string;
  team: Team;
  points: number;
  referralCode: string;
  hasReceivedPointsForShare?: boolean;
  boosts: UserBoost[];
  inviteCode?: string;
}

export type Leaderboard = Array<{ address: string; points: number }>;

export enum CreateTeamPhase {
  FCFS,
  INVITE,
  CONTEST,
}
export interface CreateTeamData {
  teamLogo: File;
  playerCountry: string;
  teamName: string;
  playerFullName: string;
  playerNumber: string;
  playerNickname: string;
}
