import { api } from '../api';
import { gameUrls } from './urls';

export const getGames = async () => {
  const response = await api.get(gameUrls.GAMES).json();
  return response;
};

export const getGameRoom = async ({ gameId } = {}) => {
  const { room } = await api.get(`${gameUrls.GAMES}/${gameId}`).json();
  return room;
};
