import { QueryClient, useQuery } from '@tanstack/react-query';
import { getUser, getGames, getGameRoom } from '@/lib/api';

export const queryClient = new QueryClient();

export const USER_QUERY = {
  queryKey: ['user'],
  queryFn: getUser,
};
export const useUser = () => useQuery(USER_QUERY);

export const GAMES_QUERY = {
  queryKey: ['games'],
  queryFn: getGames,
};
export const useGames = () => useQuery(GAMES_QUERY);

export const useGame = (id) =>
  useQuery({
    queryKey: ['games', id],
    queryFn: () => getGameRoom({ gameId: id }),
  });
