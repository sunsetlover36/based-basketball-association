import { sepolia } from 'thirdweb/chains';
import {
  type VerifyLoginPayloadParams,
  type LoginPayload,
} from 'thirdweb/auth';

import { type Leaderboard, type Team, type User } from '@/types';
import { api } from '../api';
import { userUrls } from './urls';
import { CreateTeamData, CheerPlayerData, TrainPlayerData } from './types';

export const getLoginPayload = async ({
  address,
}: {
  address: string;
}): Promise<LoginPayload> =>
  await api
    .get(userUrls.LOGIN, {
      searchParams: {
        address,
        chainId: sepolia.id.toString(),
      },
    })
    .json();
export const doLogin = async (json: VerifyLoginPayloadParams) => {
  await api.post(userUrls.LOGIN, {
    json,
  });
};
export const isLoggedIn = async (): Promise<boolean> =>
  await api.get(userUrls.IS_LOGGED_IN).json();
export const doLogout = async () => {
  await api.post(userUrls.LOGOUT);
};

export const getUser = async (): Promise<User> => {
  const data = await api.get(userUrls.USER).json<User>();
  return data;
};

export const getTeam = async (
  address: string
): Promise<Team & { points: number }> => {
  const data = await api
    .get(userUrls.TEAM, {
      searchParams: {
        address,
      },
    })
    .json<Team & { points: number }>();
  return data;
};
export const createTeam = async (data: CreateTeamData) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }

  await api.post(userUrls.CREATE_TEAM, {
    body: formData,
  });
};
export const trainPlayer = async (data: TrainPlayerData) => {
  await api.post(userUrls.TRAIN_PLAYER, {
    json: data,
  });
};
export const cheerPlayer = async (data: CheerPlayerData) => {
  await api.post(userUrls.CHEER_PLAYER, {
    json: data,
  });
};

export const getLeaderboard = async (): Promise<Leaderboard> => {
  const data = await api.get(`${userUrls.LEADERBOARD}`).json<Leaderboard>();
  return data;
};