import { api } from '../api';
import { matchUrls } from './urls';

export const joinMatch = async ({ matchId } = {}) => {
  const data = await api
    .post(matchUrls.MATCH, {
      json: matchId
        ? {
            matchId,
          }
        : {},
    })
    .json();
  return data;
};

export const getMatches = async () => {
  const { matches } = await api.get(matchUrls.MATCH).json();
  return matches;
};

export const getMatch = async ({ matchId } = {}) => {
  const { match } = await api.get(`${matchUrls.MATCH}/${matchId}`).json();
  return match;
};
