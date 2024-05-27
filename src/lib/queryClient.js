import { QueryClient, useQuery } from '@tanstack/react-query';
import { getUser, getMatches, getMatch } from '@/lib/api';

export const queryClient = new QueryClient();

export const USER_QUERY = {
  queryKey: ['user'],
  queryFn: getUser,
};
export const useUser = () => useQuery(USER_QUERY);

export const MATCHES_QUERY = {
  queryKey: ['matches'],
  queryFn: getMatches,
};
export const useMatches = () => useQuery(MATCHES_QUERY);

export const useMatch = (id) =>
  useQuery({
    queryKey: ['match', id],
    queryFn: () => getMatch({ matchId: id }),
  });
